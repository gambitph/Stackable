# Global Typography Developer Notes

The settings for Global typography are split into 2 locations:
1. Stackable settings in Gutenberg
   - The actual typography settings
2. Stackable admin settings
   - Settings for theme compatibility

## How Global Typography Works in the Frontend

In order for the typography to take effect across the entire website, a set of
CSS rules are added into the frontend that target specific blocks:

- Stackable blocks `.ugb-main-block`
- Native blocks `[data-block-type="core"]`
- Other blocks `[class*="wp-block-"]`

Native blocks do not normally have any identifiers on them. For example the
native paragraph block just outputs a `<p>` tag, or the native heading block
just outputs an `<h2>`. We change the block's rendering to add a new attribute
`data-block-type="core"` on them so we can identify the blocks.

A very specific CSS selector is used to we can be assured that our typography
will be used in the frontend. This is not a sure thing though, so if doesn't
work, we added in a "force typography styles" setting that adds an `!important`
in the styles.

The CSS styles are generated using PHP, but the logic is copied over from our JS
utility function `createTypographyStyles`

## How Global Typography works in the Editor

Similar to the frontend, we generate a `<style>` using `createTypographyStyles`
that targets blocks in the editor.
