import { UnauthorizedException } from "@nestjs/common";
import { NotFoundException } from "@nestjs/common";
export class UserDisabledException extends UnauthorizedException {
  constructor() {
    super(`user_disabled`);
  }
}

export class InvalidPasswordException extends UnauthorizedException {
  constructor() {
    super(`invalid_password`);
  }
}

export class UserDeletedException extends UnauthorizedException {
  constructor() {
    super(`user_deleted`);
  }
}

export class EntityNotFoundException extends NotFoundException {
  constructor(entity: string) {
    super({
      entity: entity,
      is_route_not_found: false,
    });
  }
}
