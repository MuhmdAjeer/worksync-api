import { Type } from '@nestjs/common';
import { Param, ParseUUIDPipe, PipeTransform } from '@nestjs/common';

export const UuidParam = (
  param: string,
  ...pipes: (PipeTransform | Type<PipeTransform>)[]
): ParameterDecorator => Param(param, ParseUUIDPipe, ...pipes);
