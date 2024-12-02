import { UserEntity } from '../../../database/entities/user.entity';
import { IJwtPayload } from '../../auth/models/interfaces/jwt-payload.interface';
import { UserResDto } from '../models/dto/res/user.res.dto';

export class UserMapper {
  public static toResDto(user: UserEntity): UserResDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
      accountType: user.accountType.name,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  public static toIUserData(user: UserEntity, jwtPayload: IJwtPayload): any {
    return {
      userId: user.id,
      deviceId: jwtPayload.deviceId,
      email: user.email,
      roleId: user.role.id,
      accountType: user.accountType.id,
    };
  }
}
