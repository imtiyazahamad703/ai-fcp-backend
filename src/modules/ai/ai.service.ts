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
  private readonly model = 'gemini-2.5-flash';

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
  async generateQuestion(topic: string, type: 'react' | 'nestjs') {
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
                filename: { type: Type.STRING, description: 'e.g., src/App.tsx or src/main.ts' },
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

      const systemInstruction = `You are an expert ${type === 'react' ? 'React.js Frontend' : 'NestJS Backend'} instructor.
Create a practical, real-world coding exercise for the topic: "${topic}".
The output must strictly adhere to the requested JSON schema.`;

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
