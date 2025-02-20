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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { routesConstants, transformValidationFactory } from '../../coreUtils';
import { BlogEntity } from './entities/blog.entity';
import { ObjectIdValidationPipe } from '../../pipes';

const { BLOGS } = routesConstants;

@Controller(BLOGS)
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @UsePipes(new ValidationPipe({ exceptionFactory: transformValidationFactory }))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBlogDto: CreateBlogDto): Promise<BlogEntity | void> {
    return this.blogsService.create(createBlogDto);
  }

  @Get()
  findAll(): Promise<BlogEntity[]> {
    return this.blogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ObjectIdValidationPipe) id: string): Promise<BlogEntity> {
    return this.blogsService.findOne(id);
  }

  @UsePipes(new ValidationPipe({ exceptionFactory: transformValidationFactory }))
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param('id', ObjectIdValidationPipe) id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.update(id, updateBlogDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ObjectIdValidationPipe) id: string) {
    return this.blogsService.remove(id);
  }
}
