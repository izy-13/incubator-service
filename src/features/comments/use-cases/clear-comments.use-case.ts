import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../repositories';

@Injectable()
export class ClearCommentsUseCase {
  constructor(private readonly repository: CommentsRepository) {}

  async execute() {
    await this.repository.deleteAllComments();
  }
}
