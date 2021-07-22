# Block Background Module

Adds the ability for a block to have a background for the entire thing.

# Developer Notes

This module performs some tweaks on how a block works internally.

1. `support -> align` is overridden and is set to `null`. This does a few things:

- Removes the default `AlignmentToolbar` (our main purpose for doing this)
- Removes the automatically added `align` attribute (side-effect)
- `align*` classes are no longer added (side-effect)
- `data-align` attribute in editor is no longer added (side-effect)

2. To bring back the unfortunate side-effects by removing `align`, the typical align behavior is instead mimicked
- Adds the automatically added `align` attribute (`index.js`)
- `align*` classes are no longer added (`align.js`)
- `data-align` attribute in editor is no longer added (`align.js`)

3. Automatically makes your block have `support` for `center`, `wide` and `full`.

4. It's required for the block to use the `withTabbedInspector` HOC for displaying options.
