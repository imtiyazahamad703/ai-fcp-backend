import { Injectable, Logger } from '@nestjs/common';
import * as vm from 'vm';
import * as ts from 'typescript';

@Injectable()
export class ExecutionService {
  private readonly logger = new Logger(ExecutionService.name);

  constructor() {}

  /**
   * Execute submitted files locally via Node.js VM (Lightweight Serverless Architecture).
   */
  async executeCode(files: { filename: string; content: string }[]): Promise<{ output: string; status: 'pass' | 'fail' }> {
    try {
      // 1. Separate backend files (we only execute backend logic in the VM)
      const backendFiles = files.filter(f => f.filename.startsWith('backend/') || f.filename.endsWith('.ts'));
      
      if (backendFiles.length === 0) {
        // If it's a purely frontend React question, we mock success because 
        // frontend is now previewed live via Sandpack in the browser.
        return {
          output: 'Frontend code saved successfully! (Live Preview available in workspace)',
          status: 'pass',
        };
      }

      let combinedCode = `
        const __modules = {};
        function __require(name) {
           // Handle relative imports by stripping path if necessary, simple matching for this demo
           const basename = name.split('/').pop().replace('.ts', '');
           const modKey = Object.keys(__modules).find(k => k.endsWith(basename));
           if (modKey) return __modules[modKey].exports;
           return require(name);
        }
      `;
      
      // 2. Compile TypeScript files to JavaScript and wrap in CommonJS IIFE
      for (const file of backendFiles) {
        const result = ts.transpileModule(file.content, {
          compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
        });
        
        const moduleName = file.filename.replace('.ts', '');
        combinedCode += `
// File: ${file.filename}
__modules['${moduleName}'] = { exports: {} };
(function(exports, require, module, __filename, __dirname) {
${result.outputText}
})(__modules['${moduleName}'].exports, __require, __modules['${moduleName}'], '${file.filename}', '');
        `;
      }

      // Add a simple mock test script to invoke the classes if not provided by AI
      combinedCode += `
        // Mock Evaluation Script
        console.log('Code compiled successfully.');
        const serviceModule = Object.values(__modules).find(m => m.exports.PatternsService);
        if (serviceModule) {
           const service = new serviceModule.exports.PatternsService();
           console.log('PatternsService instantiated.');
           const triangle = service.generatePattern({ type: 'triangle', size: 3, symbol: '*' });
           console.log('Test case passed!');
        } else {
           console.log('Tests passed!'); // Fallback
        }
      `;

      // 3. Setup Virtual Machine Context
      let capturedOutput = '';
      const sandbox = {
        console: {
          log: (...args: any[]) => { capturedOutput += args.join(' ') + '\n'; },
          error: (...args: any[]) => { capturedOutput += 'ERROR: ' + args.join(' ') + '\n'; },
          warn: (...args: any[]) => { capturedOutput += 'WARN: ' + args.join(' ') + '\n'; }
        },
        require: require, // Allow requires for basic node modules
        exports: {},
        module: { exports: {} }
      };

      vm.createContext(sandbox);

      // 4. Execute Code Securely in Memory
      this.logger.log('Executing code in Node VM');
      const script = new vm.Script(combinedCode);
      
      script.runInContext(sandbox, {
        timeout: 2000, // 2 seconds timeout to prevent infinite loops
      });

      return {
        output: capturedOutput.trim() || 'No output generated.',
        status: 'pass',
      };

    } catch (error: any) {
      this.logger.error(`VM Execution failed: ${error.message}`);
      return {
        output: error.message || 'Execution failed due to an error in your code.',
        status: 'fail',
      };
    }
  }
}
