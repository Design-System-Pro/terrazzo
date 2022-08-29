---
title: Sass Plugin for Cobalt
layout: ../../../layouts/docs.astro
---

# @cobalt-ui/plugin-sass

Generate Sass output for [Cobalt](https://cobalt-ui.pages.dev) from design tokens.

# Setup

```
npm i -D @cobalt-ui/plugin-sass
```

```js
// tokens.config.mjs
import pluginSass from '@cobalt-ui/plugin-sass';

/** @type import('@cobalt-ui/core').Config */
export default {
  plugins: [
    pluginSass({
      /** set the filename inside outDir */
      filename: './index.scss',
      /** use indented syntax? (.sass format) */
      indentedSyntax: false,
      /** embed file tokens? */
      embedFiles: false,
      /** handle specific token types */
      transform: {
        color: (value) => {
          return value;
        },
      },
    }),
  ],
};
```

## Usage

### Single Tokens

Use the provided `token()` function to get a token by its ID (separated by dots):

```scss
@use '../tokens' as *; // update '../tokens' to match your location of tokens/index.scss

.heading {
  color: token('color.blue');
  font-size: token('typography.size.xxl');
}
```

Note that a function has a few advantages over plain Sass variables:

- ✅ The name perfectly matches your schema (no guessing!)
- ✅ You can dynamically pull values (which you can’t do with Sass variables)
- ✅ Use the same function to access [modes](#modes)

### Typography

As `$type: "typography"` tokens contain multiple values, you’ll need to use the `typography()` mixin instead:

```scss
@use '../tokens' as *;

.heading {
  @include typography('typography');

  font-size: token('typography.size.xxl');
}
```

Note that you can override any individual property so long as it comes _after_ the mixin.

### Modes

If you take advantage of [modes](../guides/modes) in your tokens, you can pass a 2nd param into `tokens()` with a mode name:

```scss
@use '../tokens' as *;

.heading {
  color: token('color.blue');

  body[color-mode='dark'] & {
    color: token('color.blue', 'dark');
  }
}
```

⚠️ Note that modes are designed to gracefully fall back. So if a certain value isn’t defined on a mode, it will fall back to the default, rather than throwing an error.

#### List modes

To see which modes a token has defined, use the `getModes()` function which returns a list. This can be used to generate styles for specific modes:

```scss
@use '../tokens' as *;

@for $mode in listModes('color.blue') {
  [data-color-mode='#{$mode}'] {
    color: token('color.blue', $mode);
  }
}
```

## Config

### Embed Files

Say you have `link` tokens in your `tokens.json`:

```json
{
  "icon": {
    "alert": {
      "$type": "link",
      "$value": "/icon/alert.svg"
    }
  }
}
```

By default, consuming those will print values as-is:

```scss
.icon-alert {
  background-image: token('icon.alert');
}

// Becomes …
.icon-alert {
  background-image: url('./icon/alert.svg');
}
```

In some scenarios this is preferable, but in others, this may result in too many requests and may result in degraded performance. You can set `embedFiles: true` to generate the following instead:

```scss
.icon-alert {
  background-image: token('icon.alert');
}

// Becomes …
.icon-alert {
  background-image: url('image/svg+xml;utf8,<svg …></svg>');
}
```

[Read more](https://css-tricks.com/data-uris/)

### Transform

Inside plugin options, you can specify transforms [per-type](../reference/schema):

```js
/** @type import('@cobalt-ui/core').Config */
export default {
  plugins: [
    pluginSass({
      transform: {
        color: (value, token) => {
          return value;
        },
        dimension: (value, token) => {
          return value;
        },
        font: (value, token) => {
          return value;
        },
        duration: (value, token) => {
          return value;
        },
        cubicBezier: (value, token) => {
          return value;
        },
        link: (value, token) => {
          return value;
        },
        transition: (value, token) => {
          return value;
        },
        shadow: (value, token) => {
          return value;
        },
        gradient: (value, token) => {
          return value;
        },
        typography: (value, token) => {
          return value;
        },
      },
    }),
  ],
};
```

⚠️ Whenever you override a transformer for a token type, it’s now up to you to handle everything! You may also need the help of utilities like [better-color-tools](https://github.com/drwpow/better-color-tools)

#### Custom tokens

If you have your own custom token type, e.g. `my-custom-type`, you can add more keys to `transform` to handle it, like so:

```js
/** @type import('@cobalt-ui/core').Config */
export default {
  plugins: [
    pluginSass({
      transform: {
        'my-custom-type': (value, token) => {
          return String(value);
        },
      },
    }),
  ],
};
```

## Features

- `type: file`: base64 encodes the file
- `type: url`: converts to a plain `url()`
