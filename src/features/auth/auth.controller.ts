import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { routesConstants } from '../../coreUtils';
import { PublicApi } from '../../decorators';
import { MeEntity } from './entity/me.entity';
import { RequestWithJwt } from '../../types';

const { AUTH, LOGIN, ME } = routesConstants;

@Controller(`${AUTH}`)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicApi()
  @Post(`${LOGIN}`)
  @HttpCode(HttpStatus.OK)
  create(@Body() createAuthDto: CreateAuthDto): Promise<{ accessToken: string }> {
    return this.authService.create(createAuthDto);
  }

  @Get(`/${ME}`)
  findMe(@Req() request: RequestWithJwt): Promise<MeEntity> {
    const userId = request?.user?.sub ?? '';
    return this.authService.findMe(userId);
  }
}
