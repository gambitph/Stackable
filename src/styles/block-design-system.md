# Block Design System

Block Design System is the default CSS styling for Stackable blocks.

## Compilation Process

1. Everytime the file `src/styles/block-design-system.json'` is modified, a PHP and SCSS file will be generated. This is done via Gulp.
2. The generated PHP file is located at `src/styles/index.php`, while the SCSS file is `src/styles/block-design-system.scss`

## Structure

The `block-design-system.json` has the following structure:
- The first level keys are the Section Titles (e.g., "Block", "Column", "Containers", "Block Backgrounds", etc.)
- The second level keys are the CSS Custom Properties ( e.g., `block-margin-bottom`, `container-padding`, etc.)
- The third level keys can be any of the following:
	- `desktop` - contains the desktop value ( This is required. )
	- `tablet` - contains the tablet value
	- `mobile` - contains the mobile value
	- `hoverStates` - an object that specifies if custom properties for `hover` and `parent-hover` should be created
- If the third level key is `hoverStates`, its value should be an object that contains the following:
	- `hover: boolean`
	- `parent-hover: boolean`
	
	Given the example below:
	```
	"Containers": {
		"container-border-width": {
			"desktop: 1,
			"hoverStates": {
				"hover": true,
				"parent-hover": true
			}
		}
	}
	```
	Then the following `cssvar` will also be added to the `block-design-system.scss`:
	- `container-border-width-hover`
	- `container-border-width-parent-hover`

