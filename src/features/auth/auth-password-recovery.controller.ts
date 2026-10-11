import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { NewPasswordUseCase, PasswordRecoveryUseCase } from './use-cases';
import { formResponse, PublicApi, ResultNotification, routesConstants } from '../../common';
import { NewPasswordDto, PasswordRecoveryDto } from './dto';
import { ThrottlerGuard } from '@nestjs/throttler';

const { AUTH, PASSWORD_RECOVERY, PASSWORD_NEW } = routesConstants;

@Controller(`${AUTH}`)
export class AuthPasswordRecoveryController {
  constructor(
    private readonly passwordRecoveryUseCase: PasswordRecoveryUseCase,
    private readonly newPasswordUseCase: NewPasswordUseCase,
  ) {}

  @PublicApi()
  @Post(PASSWORD_RECOVERY)
  @UseGuards(ThrottlerGuard)
  @UsePipes(new ValidationPipe({ exceptionFactory: ResultNotification.validate }))
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Req() req: any, @Body() passwordRecoveryDto: PasswordRecoveryDto) {
    const result = await this.passwordRecoveryUseCase.execute(passwordRecoveryDto);
    return formResponse(result);
  }

  @PublicApi()
  @Post(PASSWORD_NEW)
  @UseGuards(ThrottlerGuard)
  @UsePipes(new ValidationPipe({ exceptionFactory: ResultNotification.validate }))
  @HttpCode(HttpStatus.NO_CONTENT)
  async ewPassword(@Req() req: any, @Body() passwordNewDto: NewPasswordDto) {
    const result = await this.newPasswordUseCase.execute(passwordNewDto);
    return formResponse(result);
  }
}
