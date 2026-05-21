import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { TestingService } from './testing.service';
import { routesConstants } from '../../common';
import { PublicApi } from '../../common';

const { TESTING, ALL_DATA } = routesConstants;

@Controller(TESTING)
export class TestingController {
  constructor(private readonly testingService: TestingService) {}

  @PublicApi()
  @Delete(`/${ALL_DATA}`)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove() {
    return this.testingService.remove();
  }
}
