import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import {
  BasicAuthGuard,
  ObjectIdValidationPipe,
  PaginatedResponse,
  PublicApi,
  ResultNotification,
  routesConstants,
} from '../../common';
import { BlogEntity } from './entities/blog.entity';
import { FindAllBlogsQueryDto } from './dto/find-all-blogs-query.dto';
import {
  CreateBlogUseCase,
  DeleteBlogUseCase,
  FindAllBlogsUseCase,
  FindBlogUseCase,
  UpdateBlogUseCase,
} from './use-cases';

const { BLOGS } = routesConstants;

@Controller(BLOGS)
export class BlogsController {
  constructor(
    private readonly createBlogUseCase: CreateBlogUseCase,
    private readonly findAllBlogsUseCase: FindAllBlogsUseCase,
    private readonly findBlogUseCase: FindBlogUseCase,
    private readonly updateBlogUseCase: UpdateBlogUseCase,
    private readonly deleteBlogUseCase: DeleteBlogUseCase,
  ) {}

  @PublicApi()
  @UseGuards(BasicAuthGuard)
  @UsePipes(new ValidationPipe({ exceptionFactory: ResultNotification.validate }))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBlogDto: CreateBlogDto): Promise<BlogEntity | void> {
    return this.createBlogUseCase.execute(createBlogDto);
  }

  @PublicApi()
  @Get()
  findAll(@Query() queryParams: FindAllBlogsQueryDto): Promise<PaginatedResponse<BlogEntity>> {
    return this.findAllBlogsUseCase.execute(queryParams);
  }

  @PublicApi()
  @Get(':id')
  findOne(@Param('id', ObjectIdValidationPipe) id: string): Promise<BlogEntity> {
    return this.findBlogUseCase.execute(id);
  }

  @PublicApi()
  @UseGuards(BasicAuthGuard)
  @UsePipes(new ValidationPipe({ exceptionFactory: ResultNotification.validate }))
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param('id', ObjectIdValidationPipe) id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.updateBlogUseCase.execute(id, updateBlogDto);
  }

  @PublicApi()
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.deleteBlogUseCase.execute(id);
  }
}
