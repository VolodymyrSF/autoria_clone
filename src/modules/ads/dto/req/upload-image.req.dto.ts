import { ApiProperty } from '@nestjs/swagger';

export class UploadImageReqDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}
