import { SetMetadata } from '@nestjs/common';
import { authConstants } from '../../constants';

const { PUBLIC_KEY } = authConstants;

export const PublicApi = () => SetMetadata(PUBLIC_KEY, true);
