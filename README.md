# Frontend

Pulled together by Curtis Wist and Craig Coles and is actively maintained by the front end team at [True Digital](http://www.truedigital.co.uk).

## Contents

1. [Info](#info)
2. [Quick Start](#quick-start)
3. [Structure](#structure)
    1. [Sass](#sass)
    2. [Javascript](#javascript)
4. [Contributing](#contributing)
5. [Changelog](#changelog)


## Info

- Adopts a mobile first approach
- Uses Sass for stylesheet pre-processing (scss syntax)
- Follows OOCSS principles
- Uses Gulp to concat / compile / uglify / build etc.

## Quick start

1. Clone the repo (or fork it)

        git clone https://github.com/truedigital/frontend.git

2. Install:

        npm install

3. At the command prompt:

        gulp watch

   or if you are building templates

        gulp watch-templates

## Structure

```
├── assets/
│   ├── css/
│   ├── fonts/
│   ├── html/
│   ├── images/
│   ├── js/
│   ├── scss/
│   ├── svg/
│   └── templates/
├── gulp/
│   ├── settings/
│       ├── config.js
│       ├── error-handler.js
│       └── paths.js
│   ├── tasks/
│       ├── browser-sync.js
│       ├── modernizr.js
│       ├── scripts.js
│       ├── sprites.js
│       ├── styles.js
│       └── templates.js
├── gulpfile.js
└── package.json
```

Heres a quick breakdown of what the heck everything does:

#### Sass

Note: All files should be saved as partials:  `_module-style.scss`

```
├── scss/
│   ├── base/
│       ├── dev/
│       ├── functions/
│       ├── mixins/
│       ├── normalize/
│       └── susy/
│   ├── elements/
│   ├── modules/
│       └── addons/
│   ├── vendor/
│   └── style.scss
```

- `base` : Defaults for your project and styling for top-level, unclassed elements and typography

  - `dev` : Front end debugging tools. These are included through the `$environment` flag in `styles.scss`

  - `functions` : Helpful functions that are used throughout the project. (e.g. Color map, pixels to rem, etc).

  - `mixins`

    - `anchor-arrow` - Adds a small triangle/arrow before or after the an element
    - `attr`
    - `circle`
    - `clearfix`
    - `font-face` - Writing @font-face rules in SASS
    - `font-size` - Sets font size and line-height using Rems with a pixel fallback. E.g. `@include font-size(14)` and `@include line-height(34)` or `@include font-size(14,34)`
    - `html5-input-types` - Generate a variable (`$all-text-inputs`) with a list of all html5 input types that have a text-based input, excluding textarea.
    - `lists` - A few mixins containing some simple list styles - `list-unstyled`, `list-inline`, `list-float`, `list-divided`
    - `modernizr` - `yep` and `nope` mixins to apply rules to support capabilities of the browser
    - `mq` - [Sass MQ](https://github.com/sass-mq/sass-mq) Helps you compose media queries in an elegant way
    - `placeholder` - Apply styles for HTML5 form element placeholders
    - `ratio-box` - Responsive box that maintains an aspect ratio.
    - `shade` - A mixin to mix a color with black
    - `tint` - A mixin to mix a color with white.
    - `triangle`

  - `normalize` : Does exactly what it says on the tin. This contains all of the files needed to normalize the browser. The `_normalize.scss` in the base folder is the manifest file.
  - `susy` : Susy is our choice of grid structure, and here lays the files needed.

- `elements` : These are generic elements that can be reused throughout the project. (e.g. Buttons, forms, headings)

- `modules` : Starts empty, and is populated with project specific modules.

- `vendor` : Should contain any styling from third party plug-ins.

The best place to start is styles.scss. You can see what files are included, the order that they are included (the order is important) and what purpose they serve. We highly recommend that you familarise yourself with this structure.

#### Javascript

```
├── js/
│   ├── partials/
│   ├── scripts/
│   └── vendor/
```
- `partials` : You should populate this folder with all of your site specific custom scripts. If you have a plugin that is needed across multiple pages, then its recommended that you put it here and let it get compiled. Files are compiled alphabetically, so its quite simple to change the order if you need to.

  **Note**: All files should saved in as partials. *E.g. `_script-name.js`*

- `scripts` : Starts empty, and is populated with any scripts that are needed as standalone scripts, instead of being compiled. *E.g. Plugins, Polyfills, etc*

- `vendor` : Only contains two files, with an extra file being added on build:

  - `jquery-1.11.2.js` : This is a fall-back in case the CDN fails to load.

  - `modernizr.js` : This is a development version of Modernizr

  - `modernizr-custom.js` : Generated using the build command. Contents of this file is dependant on the code that you write for your project.

## Contributing

If you wish to contribute to True Digtial's Frontend, please ensure that you are posting things in the proper areas, and that you are following our coding standards/style. Check out our [contributing guidelines](https://github.com/truedigital/frontend/blob/develop/CONTRIBUTING.md) for a more detailed overview on how to contribute.

## Changelog

You can keep up-to-date with the changes that we have made via our [releases page](https://github.com/truedigital/frontend/releases).

## License

Code released under the [MIT license](https://github.com/truedigital/frontend/blob/develop/LICENSE). Documentation released under [Creative Commons](http://creativecommons.org/licenses/by-sa/4.0/).