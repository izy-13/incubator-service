import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { TestingService } from './testing.service';
import { routesConstants } from '../../coreUtils';

const { TESTING } = routesConstants;

@Controller(TESTING)
export class TestingController {
  constructor(private readonly testingService: TestingService) {}

  @Delete('/all-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove() {
    return this.testingService.remove();
  }
}
