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
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ExtractCookies,
  formResponse,
  PublicApi,
  RequestWithJwt,
  routesConstants,
} from '../../common';
import { CreateAuthDto } from './dto';
import { MeEntity } from './entity/me.entity';
import { RefreshTokenGuard } from './guards';
import { FindMeUseCase, LoginUseCase, LogoutUseCase, RefreshTokenUseCase } from './use-cases';

const { AUTH, LOGIN, ME, LOGOUT, REFRESH_TOKEN } = routesConstants;

@Controller(`${AUTH}`)
export class AuthSessionController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly findMeUseCase: FindMeUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  @PublicApi()
  @Post(LOGIN)
  @HttpCode(HttpStatus.OK)
  async create(@Body() createAuthDto: CreateAuthDto, @Res() res: Response, @Req() req: Request) {
    const metadata = {
      ip: req.socket.remoteAddress || req.headers['x-forwarded-for'] || req.ip,
      title: req.headers['user-agent'],
    };
    const { refreshToken, accessToken } = await this.loginUseCase.execute(createAuthDto, metadata);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return res.json({ accessToken });
  }

  @Get(`/${ME}`)
  findMe(@Req() request: RequestWithJwt): Promise<MeEntity> {
    const userId = request?.user?.sub ?? '';
    return this.findMeUseCase.execute(userId);
  }

  @PublicApi()
  @UseGuards(RefreshTokenGuard)
  @Post(REFRESH_TOKEN)
  @HttpCode(HttpStatus.OK)
  async refreshToken(@ExtractCookies('refreshToken') refreshToken: string, @Res() res: Response) {
    const result = await this.refreshTokenUseCase.execute(refreshToken);

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
    const result = await this.logoutUseCase.execute(refreshToken);
    return formResponse(result);
  }
}
