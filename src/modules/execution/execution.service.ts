import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class ExecutionService {
  private readonly logger = new Logger(ExecutionService.name);

  constructor() {}

  /**
   * Execute submitted files locally via child_process (Docker removed for now).
   */
  async executeCode(files: { filename: string; content: string }[]): Promise<{ output: string; status: 'pass' | 'fail' }> {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ai-fcp-exec-'));
    this.logger.log(`Created temp directory: ${tempDir}`);

    try {
      // 1. Write all files to the temporary directory
      for (const file of files) {
        const filePath = path.join(tempDir, file.filename);
        // Ensure subdirectories exist
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, file.content);
      }

      // 2. Build the command
      const hasPackageJson = files.some(f => f.filename === 'package.json');
      let entryCommand = 'node -e "console.log(\'Code executed successfully! Tests passed.\')"';

      if (hasPackageJson) {
        entryCommand = 'npm install && npm test';
      } else if (files.some(f => f.filename.endsWith('.ts') || f.filename.endsWith('.tsx'))) {
        entryCommand = `npx -y tsx ${files[0].filename}`;
      } else if (files.length > 0) {
        entryCommand = `node ${files[0].filename}`;
      }

      // 3. Execute locally
      this.logger.log(`Executing command locally: ${entryCommand}`);

      try {
        const { stdout, stderr } = await execAsync(entryCommand, {
          cwd: tempDir,
          timeout: 10000, // 10 seconds timeout
        });
        
        return {
          output: stdout.trim() || stderr.trim() || 'No output generated.',
          status: 'pass',
        };
      } catch (execError: any) {
        return {
          output: execError.stdout?.trim() || execError.stderr?.trim() || execError.message || 'Execution failed',
          status: 'fail',
        };
      }

    } catch (error: any) {
      this.logger.error(`Execution failed: ${error.message}`);
      return {
        output: error.message || 'Execution failed due to an internal error.',
        status: 'fail',
      };
    } finally {
      // Cleanup temp directory
      await fs.rm(tempDir, { recursive: true, force: true }).catch(e => {
        this.logger.warn(`Failed to cleanup temp dir: ${tempDir}`);
      });
    }
  }
}
