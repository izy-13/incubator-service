import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../repositories';

@Injectable()
export class ClearAuthUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute() {
    await this.authRepository.deleteAll();
  }
}
