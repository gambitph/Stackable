# Frontend CSS loading

Since v3.21.0, a page only gets the Stackable CSS it can use.
Before, every page with a Stackable block loaded one big stylesheet (`dist/frontend_blocks.css`) with the styles of every block.

The code starts in `src/frontend-css.php`, and each step has its own class in `src/frontend-css/`.

## Build

`gulp style-split` (in `gulpfile.js`) builds the same styles as the big stylesheet, split into:

- `dist/frontend_core.css` - the shared styles every block needs.
- `dist/frontend_core_responsive.css` - the shared media queries.
- `dist/frontend_color_schemes.css`, `dist/frontend_design_system.css` - only used when color schemes or the design system are set.
- `dist/frontend_theme_{theme}.css` - theme compatibility styles, only for that theme.
- `dist/blocks/{block}.css` - one file per block.
- `dist/frontend_css_manifest.php` - the blocks and themes that have a file, in the order of the big stylesheet.
- A `.rules` file next to each stylesheet, with the classes each CSS rule needs (see `.config/frontend-css-rules.js`).

Premium does the same in `gulp premium-style-split` (`dist/blocks/{block}__premium_only.css`, `dist/frontend_css_manifest__premium_only.php`).

The color scheme selector list is replaced by one marker class, `stk-has-scheme`.
PHP adds that class to every element the old selector list matched (`Stackable_Frontend_CSS_Color_Schemes`).
The injected-block loader does the same for markup that scripts add after the page loaded.

## How a page gets its CSS

1. Detect: while the page renders, `Stackable_Frontend_CSS_Page_Content` notes the Stackable blocks and the Stackable classes in the HTML.
   For the post content, this happens before the `<head>` is printed, so its CSS can go in the `<head>`.
2. Pick stylesheets: the shared styles, plus the stylesheet of each block on the page (`Stackable_Frontend_CSS_Stylesheets`, `Stackable_Frontend_CSS_Block_Styles`).
3. Trim: from those stylesheets, only the rules whose classes are on the page are kept (`Stackable_Frontend_CSS_Rules`).
4. Print: everything is printed as one inline `<style id="stk-frontend-css-inline-css">`, in the same order as the big stylesheet, so the CSS cascade stays the same (`Stackable_Frontend_CSS_Printer`).
   Blocks rendered after the `<head>` (widgets, footers) print the rules they still need in a later `<style>`.
   When the page is done, those rules are moved into the first `<style>`.
5. Content added after the page loads:
   - Content rendered over AJAX or the REST API brings its own CSS, limited to that content so it doesn't restyle the page (`Stackable_Frontend_CSS_Injected_Content`).
     Its `:root` custom properties go on the outermost injected elements, so the elements inside inherit them like they would from `:root`.
   - A small script, the injected-block loader, loads the stylesheets of Stackable blocks that scripts add to the page, e.g. HTML copied from another page (`src/frontend-css/injected-loader.js`, printed by `Stackable_Frontend_CSS_Injected_Loader`).

Custom breakpoints are applied to the free stylesheets when they are printed (`Stackable_Frontend_CSS_Breakpoints`).
The Premium stylesheets keep the default breakpoints, like before.

## The legacy setting

Sites that upgrade from v3.20 or older keep the old loading: the `stackable_use_legacy_frontend_css` option is turned on during the upgrade.
New installs get the new loading.
The setting is in Settings > Miscellaneous ("Use Legacy Frontend CSS Loading").

All the old behavior is in `src/deprecated/legacy-frontend-css.php`, which `plugin.php` only loads when the setting is on.
It turns the new loading off through hooks:

- It removes `Stackable_Frontend_CSS::start()`, so none of the classes above are connected to WordPress.
- It turns on `stackable_frontend_css_use_big_stylesheet`, so the blocks (and Premium blocks) use the big stylesheets again.
- It applies custom breakpoints the old way.

The new loading starts on `init` (priority 2), after the upgrade check (priority 1) that can turn the setting on.

The block editor always uses the big stylesheets.

## Filters

- `stackable_force_css_load` - return true to load the styles of all the blocks, for pages where Stackable blocks can't be detected.
- `stackable_frontend_css_injected_loader` - return false to not print the injected-block loader.
- `stackable_frontend_css_finalize_in_buffer` - return false to not move the late CSS into the first `<style>`, e.g. if this conflicts with another plugin that buffers the page.
- `stackable_frontend_css_block_style_triggers` - classes that need a block's stylesheet even without the block, e.g. the button styles used by other blocks.
- `stackable_frontend_css_dependencies` - the dependencies of the shared stylesheet.
- `stackable_frontend_css` - filters the CSS of stylesheets with media queries, used for custom breakpoints.

Hooks between the files (not meant for other plugins):

- `stackable_frontend_head_content_checked` (action, `src/init.php`) - the post content was checked for Stackable blocks, so their stylesheets can be loaded in the `<head>`.
- `stackable_color_scheme_body_classes` (`src/plugins/global-settings/color-schemes/index.php`) - adds the `stk-has-scheme` marker to the `<body>`.
- `stackable_frontend_css_use_big_stylesheet` - turned on by the legacy file.
