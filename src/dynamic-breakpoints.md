# Dynamic Breakpoints

Dynamic breakpoints work by separating all media queries from the main frontend stylesheet, and then filtering them replacing their width values at run time.

## Compilation Process

1. Every time the file `dist/frontend_blocks.css` is created, all `@media` queries are moved to a new file `dist/frontend_blocks_responsive.css`. This is done via Gulp.
2. Afterwards, all the contents of `dist/frontend_blocks_responsive.css` are also placed inside the `stackable_get_responsive_css` function in `src/dynamic-breakpoints.php`. This is also done via Gulp.

## How it works

- We ensure that all our breakpoints are defined in `@media` queries and only use the following breakpoints:
    - tablet: `1024px`
	- mobile: `768px`
	- The above is done so that we can simply do a search for `@media` queries that target the above widths and replace them with the user's selected breakpoints.
- On normal behavior (no custom breakpoints), `dist/frontend_blocks_responsive.css` is loaded in the frontend alongside the normal frontend stylesheet.
- When custom breakpoints are provided:
	- `dist/frontend_blocks_responsive.css` is dequeued.
	- The CSS instead in `src/dynamic-breakpoints.php` is loaded - the CSS is ran through a filter that changes all breakpoints to the custom set ones.
	- All block output is also ran through the css filter
	- All other CSS which are loaded inline are also ran through the filter (e.g. global typography)
