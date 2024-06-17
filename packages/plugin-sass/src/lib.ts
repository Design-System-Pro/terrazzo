import type { CSSPluginOptions } from '@terrazzo/plugin-css';

export interface SassPluginOptions {
  /** Where to output CSS */
  filename?: CSSPluginOptions['filename'];
  /** Glob patterns to exclude tokens from output */
  exclude?: CSSPluginOptions['exclude'];
}

export const FILE_HEADER = `////
/// Autogenerated by ⛋ Terrazzo. DO NOT EDIT!
////

@use "sass:list";
@use "sass:map";`;

export const MIXIN_TOKEN = `@function token($tokenName) {
  @if map.has-key($__token-values, $tokenName) == false {
    @error 'No token named "#{$tokenName}"';
  }
  $_token: map.get($__token-values, $tokenName);
  @if map.has-key($_token, "__tz-error") {
    @error map.get($_token, "__tz-error");
  }
  @return map.get($_token);
}`;

export const MIXIN_TYPOGRAPHY = `@mixin typography($tokenName, $modeName: ".") {
  @if map.has-key($__token-typography-mixins, $tokenName) == false {
    @error 'No typography mixin named "#{$tokenName}"';
  }
  $_mixin: map.get($__token-typography-mixins, $tokenName);
  $_properties: map.get($_mixin, ".");
  @if map.has-key($_mixin) {
    $_properties: map.get($_mixin);
  }
  @each $_property, $_value in $_properties {
    #{$_property}: #{$_value};
  }
}`;