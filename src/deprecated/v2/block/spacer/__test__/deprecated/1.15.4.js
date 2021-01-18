/**
 * This file contains saved block HTML from older versions.
 * These will be tested if they pass migration.
 * This will be built into the dist folder as `deprecation-tests.json`
 */

module.exports = [
	{
		block: 'Spacer',
		version: '1.15.4',
		description: 'Default block',
		html: `<!-- wp:ugb/spacer -->
		<div class="wp-block-ugb-spacer ugb-spacer" style="height:50px"></div>
		<!-- /wp:ugb/spacer -->`,
	},
	{
		block: 'Spacer',
		version: '1.15.4',
		description: 'Modified block',
		html: `<!-- wp:ugb/spacer {"height":141} -->
		<div class="wp-block-ugb-spacer ugb-spacer" style="height:141px"></div>
		<!-- /wp:ugb/spacer -->`,
	},
	{
		block: 'Spacer',
		version: '1.15.4',
		description: 'Custom class',
		html: `<!-- wp:ugb/spacer {"height":141,"className":"custom-class"} -->
		<div class="wp-block-ugb-spacer ugb-spacer custom-class" style="height:141px"></div>
		<!-- /wp:ugb/spacer -->`,
	},
	{
		block: 'Spacer',
		version: '1.15.4',
		description: 'Custom CSS',
		plan: 'Premium',
		html: `<!-- wp:ugb/spacer {"height":141,"customCSSUniqueID":"ugb-b06476b","customCSS":"/* Spacer container */\n.ugb-spacer {\n\tbackground: red;\n}","customCSSCompiled":".ugb-b06476b.ugb-spacer{background:red !important}"} -->
		<div class="wp-block-ugb-spacer ugb-spacer ugb-b06476b" style="height:141px"><style>.ugb-b06476b.ugb-spacer{background:red !important}</style></div>
		<!-- /wp:ugb/spacer -->`,
	},
]
