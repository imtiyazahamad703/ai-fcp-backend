import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class GenerateQuestionDto {
  @IsString()
  @IsNotEmpty()
  topic: string;

  @IsString()
  @IsEnum(['react', 'nestjs'])
  type: 'react' | 'nestjs';
}
