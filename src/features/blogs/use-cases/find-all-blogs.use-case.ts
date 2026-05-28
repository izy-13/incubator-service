import { Injectable } from '@nestjs/common';
import { PaginatedResponse } from '../../../common';
import { FindAllBlogsQueryDto } from '../dto/find-all-blogs-query.dto';
import { BlogEntity } from '../entities/blog.entity';
import { BlogsQueryRepository } from '../repositories';

@Injectable()
export class FindAllBlogsUseCase {
  constructor(private readonly queryRepository: BlogsQueryRepository) {}

  execute(queryParams: FindAllBlogsQueryDto): Promise<PaginatedResponse<BlogEntity>> {
    const defaultParams = new FindAllBlogsQueryDto();
    const {
      pageNumber = defaultParams.pageNumber,
      sortDirection = defaultParams.sortDirection,
      sortBy = defaultParams.sortBy,
      searchNameTerm,
      pageSize = defaultParams.pageSize,
    } = queryParams;

    return this.queryRepository.findAllBlogs({
      pageNumber,
      sortDirection,
      sortBy,
      searchNameTerm,
      pageSize,
    });
  }
}
