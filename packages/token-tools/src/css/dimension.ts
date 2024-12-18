import type { AliasValue, DimensionValue } from '../types.js';
import { type IDGenerator, defaultAliasTransform } from './lib.js';

/** Convert dimension value to CSS */
export function transformDimensionValue(
  value: DimensionValue | AliasValue,
  { aliasOf, transformAlias = defaultAliasTransform }: { aliasOf?: string; transformAlias?: IDGenerator } = {},
): string {
  if (aliasOf) {
    return transformAlias(aliasOf);
  } else if (typeof value === 'string') {
    throw new Error(`Could not resolve alias ${value}`);
  }
  return value.value === 0 ? '0' : `${value.value}${value.unit}`;
}
