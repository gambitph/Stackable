/**
 * This file contains saved block HTML from older versions.
 * These will be tested if they pass migration.
 * This will be built into the dist folder as `deprecation-tests.json`
 */

module.exports = [
	{
		block: 'Expand',
		version: '1.17.3',
		description: 'Default block',
		html: `<!-- wp:ugb/expand -->
		<div class="wp-block-ugb-expand ugb-expand" aria-expanded="false"><div class="ugb-expand__less-text"></div><div class="ugb-expand__more-text" style="display:none"></div><a class="ugb-expand__toggle" href="#"><span class="ugb-expand__more-toggle-text">Show more</span><span class="ugb-expand__less-toggle-text" style="display:none">Show less</span></a></div>
		<!-- /wp:ugb/expand -->`,
	},
	{
		block: 'Expand',
		version: '1.17.3',
		description: 'Modified block',
		html: `<!-- wp:ugb/expand -->
		<div class="wp-block-ugb-expand ugb-expand" aria-expanded="false"><div class="ugb-expand__less-text"><p>11111</p><p>22222</p><p>33333</p></div><div class="ugb-expand__more-text" style="display:none"><p>ewqewq</p><p>ewqdwqd</p><p>dwqdwq</p><p></p></div><a class="ugb-expand__toggle" href="#"><span class="ugb-expand__more-toggle-text">Show more</span><span class="ugb-expand__less-toggle-text" style="display:none">Show less</span></a></div>
		<!-- /wp:ugb/expand -->`,
	},
	{
		block: 'Expand',
		version: '1.17.3',
		description: 'Modified block',
		html: `<!-- wp:ugb/expand -->
		<div class="wp-block-ugb-expand ugb-expand" aria-expanded="false"><div class="ugb-expand__less-text"><p>less text</p></div><div class="ugb-expand__more-text" style="display:none"><p>more text</p></div><a class="ugb-expand__toggle" href="#"><span class="ugb-expand__more-toggle-text">more button</span><span class="ugb-expand__less-toggle-text" style="display:none">less button</span></a></div>
		<!-- /wp:ugb/expand -->`,
	},
	{
		block: 'Expand',
		version: '1.17.3',
		description: 'Custom CSS',
		plan: 'Premium',
		html: `<!-- wp:ugb/expand {"customCSSUniqueID":"ugb-8d3848f","customCSS":"/* Expand container */\n.ugb-expand {\n\t\n}\n\n/* Unexpanded text */\n.ugb-expand .ugb-expand__less-text p {\n\tcolor: red;\n}\n\n/* Expanded text */\n.ugb-expand .ugb-expand__more-text p {\n\t\n}\n\n/* Toggle text */\n.ugb-expand .ugb-expand__toggle,\n.ugb-expand .ugb-expand__more-toggle-text,\n.ugb-expand .ugb-expand__less-toggle-text {\n\t\n}","customCSSCompiled":".ugb-8d3848f.ugb-expand .ugb-expand__less-text p{color:red !important}"} -->
		<div class="wp-block-ugb-expand ugb-expand ugb-8d3848f" aria-expanded="false"><style>.ugb-8d3848f.ugb-expand .ugb-expand__less-text p{color:red !important}</style><div class="ugb-expand__less-text"><p>test red</p></div><div class="ugb-expand__more-text" style="display:none"><p>test not red</p></div><a class="ugb-expand__toggle" href="#"><span class="ugb-expand__more-toggle-text">Show more</span><span class="ugb-expand__less-toggle-text" style="display:none">Show less</span></a></div>
		<!-- /wp:ugb/expand -->`,
	},
]
