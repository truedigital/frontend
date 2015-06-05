# [< Name >](#)

< Name > is a starting point for many web projects at True Digital. It has been pulled together by Curtis Wist and Craig Coles and is actively maintained by the front end team at [True Digital](http://www.trudigital.co.uk).

## Info

- Adopts a mobile first appraoch
- Uses Sass for stylesheet pre-processing (scss syntax)
- Follows OOCSS principles
- Uses Gulp to concat / compile / uglify / build etc.

## Road Map

- Use Bower to handle front end dependencies

## Quick start

1. Install:

        npm install

2. At the command prompt:

        gulp watch

   or if you are building templates

        gulp watch-templates

## Structure

```
XXXXX/
â”œâ”€â”€ assets/
â”‚   â”œâ”€â”€ css/
â”‚   â”œâ”€â”€ fonts/
â”‚   â”œâ”€â”€ html/
â”‚   â”œâ”€â”€ images/
â”‚   â”œâ”€â”€ js/
â”‚   â”œâ”€â”€ scss/
â”‚   â”œâ”€â”€ svg/
â”‚   â””â”€â”€ templates/
â”œâ”€â”€ gulp/
â”‚   â”œâ”€â”€ settings/
â”‚       â”œâ”€â”€ config.js
â”‚       â”œâ”€â”€ error-handler.js
â”‚       â””â”€â”€ paths.js
â”‚   â”œâ”€â”€ tasks/
â”‚       â”œâ”€â”€ browser-sync.js
â”‚       â”œâ”€â”€ modernizr.js
â”‚       â”œâ”€â”€ sprites.js
â”‚       â”œâ”€â”€ styles.js
â”‚       â””â”€â”€ templates.js
â”œâ”€â”€ gulpfile.js
â””â”€â”€ package.json
```

Heres a quick breakdown of what the heck everything does:

#### SASS

Note: All files should be saved as partials:  `_module-style.scss`

```
â”œâ”€â”€ scss/
â”‚   â”œâ”€â”€ base/
â”‚       â”œâ”€â”€ dev/
â”‚       â”œâ”€â”€ functions/
â”‚       â”œâ”€â”€ mixins/
â”‚       â”œâ”€â”€ normalize/
â”‚       â””â”€â”€ susy/
â”‚   â”œâ”€â”€ elements/
â”‚   â”œâ”€â”€ modules/
â”‚       â””â”€â”€ addons/
â”‚   â”œâ”€â”€ vendor/
â”‚   â””â”€â”€ style.scss
```

- `base` : Defaults for your project and styling for top-level, unclassed elements and typography

  - `dev` : Front end debugging tools. These are included through the `$environment` flag in `styles.scss`

  - `functions` : Helpful functions that are used throughout the project. (e.g. Color map, pixels to rem, etc).

  - `mixins`

    - `anchor-arrow`
    - `attr`
    - `circle`
    - `clear-list`
    - `clearfix`
    - `font-face`
    - `font-size`
    - `html5-input-types`
    - `lists`
    - `modernizr`
    - `mq`
    - `placeholder`
    - `ratio-box`
    - `shade`
    - `tint`
    - `triangle`

  - `normalize` : Does exactly what it says on the tin. This contains all of the files needed to normalize the browser. The `_normalize.scss` in the base folder is the manifest file.
  - `susy` : Susy is our choice of grid structure, and here lays the files needed.

- `elements` : These are generic elements that can be reused throughtout the project. (e.g. Buttons, forms, headings)

- `modules` : Starts empty, and is populated with project specific modules.

- `vendor` : Should contain any styling from third party plug-ins.

The best place to start is styles.scss. You can see what files are included, the order that they are included (the order is important) and what purpose they serve. We highly recommend that you familarise yourself with this structure.

#### Javascript

```
â”œâ”€â”€ js/
â”‚   â”œâ”€â”€ partials/
â”‚   â”œâ”€â”€ scripts/
â”‚   â””â”€â”€ vendor/
```
- `partials` : You should populate this folder with all of your site specific custom scripts. If you have a plugin that is needed across multiple pages, then its recommended that you put it here and let it get compiled. Files are compiled alphabetically, so its quite simple to change the order if you need to.

  **Note**: All files should saved in as partials. *E.g. `_script-name.js`*

- `scripts` : Starts empty, and is populated with any scripts that are needed as standalone scripts, instead of being compiled. *E.g. Plugins, Polyfills, etc*

- `vendor` : Only contains two files, with an extra file being added on build:

  - `jquery-1.11.2.js` : This is a fall-back in case the CDN fails to load.

  - `modernizr.js` : This is a development version of Modernizr

  - `modernizr-custom.js` : Generated using the build command. Contents of this file is dependant on the code that you write for your project.

## Documentation

## Contributing

If you wish to contribute to XXX, please read through our [contributing guidelines](#) first. This will ensure that you are posting things in the proper areas, and that you are following our coding standards.

If you **find a bug**, **have an idea** or just simply **want to ask a question**, then please use the [Issues](#) tab.

## License

Code released under the [MIT license](https://github.com/XXX/XXX/blob/master/LICENSE). Documentation released under [Creative Commons](http://creativecommons.org/licenses/by-sa/4.0/).