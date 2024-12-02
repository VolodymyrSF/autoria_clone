import { IsArray, IsString } from 'class-validator';

export class RoleResDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  permissions: string[];
}
