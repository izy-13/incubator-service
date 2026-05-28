import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../dto';

@Injectable()
export class UpdateUserUseCase {
  execute(id: number, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return `This action updates a #${id} user`;
  }
}
