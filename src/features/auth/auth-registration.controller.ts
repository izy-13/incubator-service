import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { formResponse, PublicApi, ResultNotification, routesConstants } from '../../common';
import { ConfirmCodeDto, RegistrationAuthDto, ResendEmailDto } from './dto';
import { ConfirmCodeUseCase, RegisterUseCase, ResendEmailUseCase } from './use-cases';

const { AUTH, REGISTRATION_CONFIRM, REGISTRATION, REGISTRATION_EMAIL_RESEND } = routesConstants;

@Controller(`${AUTH}`)
export class AuthRegistrationController {
  constructor(
    private readonly confirmCodeUseCase: ConfirmCodeUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly resendEmailUseCase: ResendEmailUseCase,
  ) {}

  @PublicApi()
  @Post(REGISTRATION_CONFIRM)
  @UsePipes(new ValidationPipe({ exceptionFactory: ResultNotification.validate }))
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmCode(@Body() confirmCodeDto: ConfirmCodeDto) {
    const result = await this.confirmCodeUseCase.execute(confirmCodeDto);
    return formResponse(result);
  }

  @PublicApi()
  @Post(REGISTRATION)
  @UsePipes(new ValidationPipe({ exceptionFactory: ResultNotification.validate }))
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() registrationDto: RegistrationAuthDto) {
    const result = await this.registerUseCase.execute(registrationDto);
    return formResponse(result);
  }

  @PublicApi()
  @Post(REGISTRATION_EMAIL_RESEND)
  @UsePipes(new ValidationPipe({ exceptionFactory: ResultNotification.validate }))
  @HttpCode(HttpStatus.NO_CONTENT)
  async resendEmail(@Body() resendEmailDto: ResendEmailDto) {
    const result = await this.resendEmailUseCase.execute(resendEmailDto);
    return formResponse(result);
  }
}
