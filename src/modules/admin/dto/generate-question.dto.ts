import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class GenerateQuestionDto {
  @IsString()
  @IsNotEmpty()
  userPrompt: string;

  @IsString()
  @IsEnum(['react', 'nestjs', 'fullstack'])
  type: 'react' | 'nestjs' | 'fullstack';
}
