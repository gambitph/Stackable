/**
 * This file contains saved block HTML from older versions.
 * These will be tested if they pass migration.
 * This will be built into the dist folder as `deprecation-tests.json`
 */

module.exports = [
	{
		block: 'Divider',
		version: '1.17.3',
		description: 'Default block',
		html: `<!-- wp:ugb/divider -->
		<div class="wp-block-ugb-divider ugb-divider"><hr align="center" style="background-color:#dddddd;width:50%;height:1px"/></div>
		<!-- /wp:ugb/divider -->`,
	},
	{
		block: 'Divider',
		version: '1.17.3',
		description: 'Modified block',
		html: `<!-- wp:ugb/divider {"height":4,"width":70.6,"color":"#ff6900"} -->
		<div class="wp-block-ugb-divider ugb-divider"><hr align="center" style="background-color:#ff6900;width:70.6%;height:4px"/></div>
		<!-- /wp:ugb/divider -->`,
	},
	{
		block: 'Divider',
		version: '1.17.3',
		description: 'No alignment test',
		html: `<!-- wp:ugb/divider -->
		<div class="wp-block-ugb-divider ugb-divider"><hr style="background-color:#dddddd;width:50%;height:1px"/></div>
		<!-- /wp:ugb/divider -->`,
	},
	{
		block: 'Divider',
		version: '1.17.3',
		description: 'Custom CSS',
		plan: 'Premium',
		html: `<!-- wp:ugb/divider {"customCSSUniqueID":"ugb-4b3708f","customCSS":"/* Divider */\n.ugb-divider hr {\nbackground: red;\n}","customCSSCompiled":".ugb-4b3708f.ugb-divider hr{background:red !important}"} -->
		<div class="wp-block-ugb-divider ugb-divider ugb-4b3708f"><style>.ugb-4b3708f.ugb-divider hr{background:red !important}</style><hr align="center" style="background-color:#dddddd;width:50%;height:1px"/></div>
		<!-- /wp:ugb/divider -->`,
	},
]
