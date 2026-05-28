import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  formResponse,
  ObjectIdValidationPipe,
  RequestWithJwt,
  ResultNotification,
  routesConstants,
} from '../../common';
import { UpdateCommentDto } from './dto';
import { DeleteCommentUseCase, UpdateCommentUseCase } from './use-cases';

const { COMMENTS } = routesConstants;

@Controller(COMMENTS)
export class CommentsCommandController {
  constructor(
    private readonly updateCommentUseCase: UpdateCommentUseCase,
    private readonly deleteCommentUseCase: DeleteCommentUseCase,
  ) {}

  @Put(':id')
  @UsePipes(new ValidationPipe({ exceptionFactory: ResultNotification.validate }))
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Req() request: RequestWithJwt,
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const result = await this.updateCommentUseCase.execute(id, updateCommentDto, request?.user);
    return formResponse(result);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Req() request: RequestWithJwt, @Param('id', ObjectIdValidationPipe) id: string) {
    const result = await this.deleteCommentUseCase.execute(id, request?.user);
    return formResponse(result);
  }
}
