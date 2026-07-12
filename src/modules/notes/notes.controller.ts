import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotesService } from './notes.service';

@Controller('notes')
@UseGuards(AuthGuard('jwt'))
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  async getMyNotes(@Req() req: any) {
    return this.notesService.findAllForUser(req.user._id);
  }

  @Get(':questionId')
  async getNoteByQuestion(@Req() req: any, @Param('questionId') questionId: string) {
    const note = await this.notesService.findOne(req.user._id, questionId);
    return note || { content: '' };
  }

  @Post(':questionId')
  async saveNote(
    @Req() req: any,
    @Param('questionId') questionId: string,
    @Body('content') content: string,
  ) {
    return this.notesService.saveNote(req.user._id, questionId, content);
  }
}
