import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfirmCodeDto, CreateAuthDto, RegistrationAuthDto, ResendEmailDto } from './dto';
import { formResponse, routesConstants, transformValidationFactory } from '../../coreUtils';
import { ExtractCookies, PublicApi } from '../../decorators';
import { MeEntity } from './entity/me.entity';
import { RequestWithJwt } from '../../types';
import { Response } from 'express';
import { RefreshTokenGuard } from './guards';

const { AUTH, LOGIN, ME, REGISTRATION_CONFIRM, REGISTRATION, REGISTRATION_EMAIL_RESEND, LOGOUT, REFRESH_TOKEN } =
  routesConstants;

@Controller(`${AUTH}`)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicApi()
  @Post(LOGIN)
  @HttpCode(HttpStatus.OK)
  async create(@Body() createAuthDto: CreateAuthDto, @Res() res: Response) {
    const { refreshToken, accessToken } = await this.authService.create(createAuthDto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return res.json({ accessToken });
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

  @PublicApi()
  @UseGuards(RefreshTokenGuard)
  @Post(REFRESH_TOKEN)
  @HttpCode(HttpStatus.OK)
  async refreshToken(@ExtractCookies('refreshToken') refreshToken: string, @Res() res: Response) {
    const result = await this.authService.refreshToken(refreshToken);

    if (result.data) {
      const { data } = result;
      res.cookie('refreshToken', data.refreshToken, {
        httpOnly: true,
        secure: true,
      });

      return res.json({ accessToken: data.accessToken });
    }
    return formResponse(result);
  }

  @PublicApi()
  @UseGuards(RefreshTokenGuard)
  @Post(LOGOUT)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@ExtractCookies('refreshToken') refreshToken: string) {
    const result = await this.authService.logout(refreshToken);
    return formResponse(result);
  }
}
