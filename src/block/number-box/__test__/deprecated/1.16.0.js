/**
 * This file contains saved block HTML from older versions.
 * These will be tested if they pass migration.
 * This will be built into the dist folder as `deprecation-tests.json`
 */

module.exports = [
	{
		block: 'Number Box',
		version: '1.16.0',
		plan: 'premium',
		description: 'Custom CSS',
		html: `<!-- wp:ugb/number-box {"uniqueClass":"ugb-6d2cfd8","customCSS":"/* Number box container */\n.ugb-number-box {\n\tbackground: red;\n\topacity: 0.7;\n}\n\n/* Number box item */\n.ugb-number-box .ugb-number-box__item {\n\t\n}\n\n/* Number box number */\n.ugb-number-box .ugb-number-box__number {\n\t\n}\n\n/* Number box content wrapper */\n.ugb-number-box .ugb-number-box__content {\n\t\n}\n\n/* Number box title */\n.ugb-number-box .ugb-number-box__title {\n\t\n}\n\n/* Number box description */\n.ugb-number-box .ugb-number-box__description {\n\t\n}"} -->
		<div class="wp-block-ugb-number-box ugb-number-box ugb-6d2cfd8 ugb-number-box ugb-number-box--v2 ugb-number-box--columns-2"><style>.ugb-6d2cfd8.ugb-number-box{background:red !important;opacity:0.7 !important}</style><div class="ugb-number-box__item ugb-number-box__item1"><span class="ugb-number-box__number">01</span><div class="ugb-number-box__content"><h4 class="ugb-number-box__title">Title</h4><p class="ugb-number-box__description">Description for this block. Use this space for describing your block. Any text will do.</p></div></div><div class="ugb-number-box__item ugb-number-box__item2"><span class="ugb-number-box__number">02</span><div class="ugb-number-box__content"><h4 class="ugb-number-box__title">Title</h4><p class="ugb-number-box__description">Description for this block. Use this space for describing your block. Any text will do.</p></div></div></div>
		<!-- /wp:ugb/number-box -->`,
	},
]
