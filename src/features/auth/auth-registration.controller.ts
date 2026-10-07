import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { formResponse, PublicApi, ResultNotification, routesConstants } from '../../common';
import { ConfirmCodeDto, RegistrationAuthDto, ResendEmailDto } from './dto';
import { ConfirmCodeUseCase, RegisterUseCase, ResendEmailUseCase } from './use-cases';
import { ThrottlerGuard } from '@nestjs/throttler';

const { AUTH, REGISTRATION_CONFIRM, REGISTRATION, REGISTRATION_EMAIL_RESEND } = routesConstants;

@Controller(`${AUTH}`)
export class AuthRegistrationController {
  constructor(
    private readonly confirmCodeUseCase: ConfirmCodeUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly resendEmailUseCase: ResendEmailUseCase,
  ) {}

  @PublicApi()
  @UseGuards(ThrottlerGuard)
  @Post(REGISTRATION_CONFIRM)
  @UsePipes(new ValidationPipe({ exceptionFactory: ResultNotification.validate }))
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmCode(@Body() confirmCodeDto: ConfirmCodeDto) {
    const result = await this.confirmCodeUseCase.execute(confirmCodeDto);
    return formResponse(result);
  }

  @PublicApi()
  @UseGuards(ThrottlerGuard)
  @Post(REGISTRATION)
  @UsePipes(new ValidationPipe({ exceptionFactory: ResultNotification.validate }))
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() registrationDto: RegistrationAuthDto) {
    const result = await this.registerUseCase.execute(registrationDto);
    return formResponse(result);
  }

  private readonly resendRequests = new Map<string, number[]>();

  @PublicApi()
  @Post(REGISTRATION_EMAIL_RESEND)
  @UsePipes(new ValidationPipe({ exceptionFactory: ResultNotification.validate }))
  @HttpCode(HttpStatus.NO_CONTENT)
  async resendEmail(@Req() req: any, @Body() resendEmailDto: ResendEmailDto) {
    const ip = req?.ip;
    const now = Date.now();
    const window = 15_000;

    const requests = this.resendRequests.get(ip) ?? [];

    const recentRequests = requests.filter((timestamp) => now - timestamp < window);

    if (recentRequests.length >= 5) {
      throw new HttpException('Too Many Requests', HttpStatus.TOO_MANY_REQUESTS);
    }

    recentRequests.push(now);
    this.resendRequests.set(ip, recentRequests);

    const result = await this.resendEmailUseCase.execute(resendEmailDto);
    return formResponse(result);
  }
}
