import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI, Type, Schema } from '@google/genai';

// ============================
// AI Service
// ============================

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private ai: GoogleGenAI;
  private readonly model = 'gemini-flash-latest';

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('ai.gemini.apiKey');
    
    if (!apiKey) {
      this.logger.warn('GEMINI_API_KEY is not configured. AI generation will fail.');
    }
    
    this.ai = new GoogleGenAI({ apiKey });
  }

  /**
   * Generate a coding question based on a topic
   */
  async generateQuestion(topic: string, type: 'react' | 'nestjs' | 'fullstack') {
    this.logger.log(`Generating ${type} question for topic: ${topic}`);

    try {
      const responseSchema: Schema = {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: 'A catchy title for the question' },
          description: { type: Type.STRING, description: 'Markdown formatted problem description' },
          difficulty: { type: Type.STRING, enum: ['easy', 'medium', 'hard'] },
          starterCode: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                filename: { type: Type.STRING, description: 'e.g., src/App.tsx, backend/main.ts' },
                content: { type: Type.STRING, description: 'The initial code' },
                language: { type: Type.STRING, description: 'e.g., typescript, tsx' },
                editable: { type: Type.BOOLEAN, description: 'Whether the learner can edit this file' },
              },
              required: ['filename', 'content', 'language', 'editable']
            }
          },
          testCases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                description: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['visible', 'hidden'] },
              },
              required: ['description', 'type']
            }
          }
        },
        required: ['title', 'description', 'difficulty', 'starterCode', 'testCases'],
      };

      const baseInstruction = `You are an Expert Senior Software Engineer and Technical Interviewer. Your task is to generate a production-ready coding exercise for an advanced AI-Powered Full-Stack Practice Platform.
The topic is: "${topic}".

PLATFORM MECHANICS:
- The platform evaluates learners not just on algorithms, but on actual feature development.
- Learners do not write projects from scratch. We provide a background template. You must provide the "starterCode" files.
- Files marked with 'editable: true' MUST contain 'TODO' comments clearly indicating where the learner needs to write their logic. 
- Files marked with 'editable: false' are supporting files (like interfaces, DTOs, or mock data) needed to make the code runnable.

ENGINEERING STANDARDS:
- Strictly use TypeScript. Avoid using 'any'.
- Follow clean architecture, modular design, and industry best practices.
- The problem description must be clear, engaging, and formatted in Markdown.

CATEGORY SPECIFICS:`;

      let categoryInstruction = '';
      if (type === 'react') {
        categoryInstruction = `- Focus on React.js, functional components, hooks, state management, and UI logic.
- Typical editable file should be 'src/App.tsx' or a specific component.
- Ensure the problem tests real-world frontend skills (e.g., form handling, data rendering, or Axios API simulation).`;
      } else if (type === 'nestjs') {
        categoryInstruction = `- Focus on NestJS, REST APIs, Services, and DTO validation.
- Enforce the rule of Thin Controllers and logic inside Services.
- Typical editable files should be 'src/feature/feature.controller.ts' and 'src/feature/feature.service.ts'.`;
      } else if (type === 'fullstack') {
        categoryInstruction = `- Focus on Full-Stack integration.
- Provide at least one editable frontend file (e.g., React component making an Axios call) and one editable backend file (e.g., NestJS Service processing that specific request).
- Ensure the frontend API call perfectly matches the backend route.
- STRICT RULE: The backend starter code MUST be written strictly using the NestJS framework (using @Controller(), @Injectable(), modules, etc.). DO NOT use plain Express.js.`;
      }

      const systemInstruction = `${baseInstruction}\n${categoryInstruction}\n\nEnsure test case descriptions clearly explain the expected behavior. Return STRICTLY valid JSON matching the provided schema without any markdown wrapping the JSON.`;

      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: `Create a ${type} coding question about ${topic}`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      if (!response.text) {
        throw new Error('AI returned empty response');
      }

      const generatedData = JSON.parse(response.text);
      return generatedData;
      
    } catch (error) {
      this.logger.error(`AI Generation failed: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to generate question from AI');
    }
  }
}
