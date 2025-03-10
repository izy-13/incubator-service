import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfirmCodeDto, CreateAuthDto, RegistrationAuthDto, ResendEmailDto } from './dto';
import { formResponse, routesConstants, transformValidationFactory } from '../../coreUtils';
import { PublicApi } from '../../decorators';
import { MeEntity } from './entity/me.entity';
import { RequestWithJwt } from '../../types';

const { AUTH, LOGIN, ME, REGISTRATION_CONFIRM, REGISTRATION, REGISTRATION_EMAIL_RESEND } = routesConstants;

@Controller(`${AUTH}`)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicApi()
  @Post(LOGIN)
  @HttpCode(HttpStatus.OK)
  create(@Body() createAuthDto: CreateAuthDto): Promise<{ accessToken: string }> {
    return this.authService.create(createAuthDto);
  }

  @Get(`/${ME}`)
  findMe(@Req() request: RequestWithJwt): Promise<MeEntity> {
    const userId = request?.user?.sub ?? '';
    return this.authService.findMe(userId);
  }

  @PublicApi()
  @Post(REGISTRATION_CONFIRM)
  @UsePipes(new ValidationPipe({ exceptionFactory: transformValidationFactory }))
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmCode(@Body() confirmCodeDto: ConfirmCodeDto) {
    const result = await this.authService.confirmCode(confirmCodeDto);
    return formResponse(result);
  }

  @PublicApi()
  @Post(REGISTRATION)
  @UsePipes(new ValidationPipe({ exceptionFactory: transformValidationFactory }))
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() registrationDto: RegistrationAuthDto) {
    const result = await this.authService.registration(registrationDto);
    return formResponse(result);
  }

  @PublicApi()
  @Post(REGISTRATION_EMAIL_RESEND)
  @UsePipes(new ValidationPipe({ exceptionFactory: transformValidationFactory }))
  @HttpCode(HttpStatus.NO_CONTENT)
  async resendEmail(@Body() resendEmailDto: ResendEmailDto) {
    const result = await this.authService.resendEmail(resendEmailDto);
    return formResponse(result);
  }
}
