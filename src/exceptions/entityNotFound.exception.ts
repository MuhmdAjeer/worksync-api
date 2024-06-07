import { NotFoundException } from '@nestjs/common';

export class EntityNotFoundException extends NotFoundException {
  constructor(entity: string) {
    super({
      entity: entity,
      is_route_not_found: false,
    });
  }
}
