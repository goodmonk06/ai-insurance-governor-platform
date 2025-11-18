import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const tenantId = request.params.tenantId || request.body?.tenantId;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Adminは全テナントアクセス可能
    if (user.role === 'admin' && !tenantId) {
      return true;
    }

    // テナントIDが指定されている場合、ユーザーのテナントと一致するか確認
    if (tenantId && user.tenantId !== tenantId) {
      throw new ForbiddenException('Access to this tenant is forbidden');
    }

    return true;
  }
}
