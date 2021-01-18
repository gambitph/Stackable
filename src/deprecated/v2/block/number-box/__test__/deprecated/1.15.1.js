/**
 * This file contains saved block HTML from older versions.
 * These will be tested if they pass migration.
 * This will be built into the dist folder as `deprecation-tests.json`
 */

module.exports = [
	{
		block: 'Number Box',
		version: '1.15.1',
		description: 'Default block',
		html: `<!-- wp:ugb/number-box -->
		<div class="wp-block-ugb-number-box ugb-number-box ugb-number-box--v2 ugb-number-box--columns-3"><div class="ugb-number-box__item"><span class="ugb-number-box__number">01</span><div class="ugb-number-box__content"><h4 class="ugb-number-box__title">Title</h4><p class="ugb-number-box__description">Description for this block. Use this space for describing your block. Any text will do.</p></div></div><div class="ugb-number-box__item"><span class="ugb-number-box__number">02</span><div class="ugb-number-box__content"><h4 class="ugb-number-box__title">Title</h4><p class="ugb-number-box__description">Description for this block. Use this space for describing your block. Any text will do.</p></div></div><div class="ugb-number-box__item"><span class="ugb-number-box__number">03</span><div class="ugb-number-box__content"><h4 class="ugb-number-box__title">Title</h4><p class="ugb-number-box__description">Description for this block. Use this space for describing your block. Any text will do.</p></div></div></div>
		<!-- /wp:ugb/number-box -->`,
	},
	{
		block: 'Number Box',
		version: '1.15.1',
		description: 'Modified block',
		html: `<!-- wp:ugb/number-box {"columns":2,"backgroundColor":"#eeeeee"} -->
		<div class="wp-block-ugb-number-box ugb-number-box ugb-number-box--v2 ugb-number-box--columns-2"><div class="ugb-number-box__item" style="background-color:#eeeeee"><span class="ugb-number-box__number">321</span><div class="ugb-number-box__content"><p class="ugb-number-box__description" style="color:#222222">Description for this block. Use this space for describing your block. Any text will do.</p></div></div><div class="ugb-number-box__item" style="background-color:#eeeeee"><span class="ugb-number-box__number">02</span><div class="ugb-number-box__content"><h4 class="ugb-number-box__title" style="color:#222222">Ti321tle</h4><p class="ugb-number-box__description" style="color:#222222">Description for this block. Use this space for describing your block. Any text will do.</p></div></div></div>
		<!-- /wp:ugb/number-box -->`,
	},
	{
		block: 'Number Box',
		version: '1.15.1',
		description: 'Modified block',
		html: `<!-- wp:ugb/number-box {"numberColor":"#fcb900","numberBGColor":"#cf2e2e","titleColor":"#ff6900","descriptionColor":"#cf2e2e","columns":2,"design":"plain","backgroundColor":"#eeeeee"} -->
		<div class="wp-block-ugb-number-box ugb-number-box ugb-number-box--v2 ugb-number-box--columns-2 ugb-number-box--design-plain"><div class="ugb-number-box__item"><span class="ugb-number-box__number" style="background-color:#cf2e2e;color:#fcb900">321</span><div class="ugb-number-box__content"><p class="ugb-number-box__description" style="color:#cf2e2e">Description for this block. Use this space for describing your block. Any text will do.</p></div></div><div class="ugb-number-box__item"><span class="ugb-number-box__number" style="background-color:#cf2e2e;color:#fcb900">02</span><div class="ugb-number-box__content"><h4 class="ugb-number-box__title" style="color:#ff6900">Ti321tle</h4><p class="ugb-number-box__description" style="color:#cf2e2e">Description for this block. Use this space for describing your block. Any text will do.</p></div></div></div>
		<!-- /wp:ugb/number-box -->`,
	},
	{
		block: 'Number Box',
		version: '1.15.1',
		description: 'Modified block',
		html: `<!-- wp:ugb/number-box {"titleColor":"#ff6900","columns":1,"design":"plain","backgroundColor":"#eeeeee"} -->
		<div class="wp-block-ugb-number-box ugb-number-box ugb-number-box--v2 ugb-number-box--columns-1 ugb-number-box--design-plain"><div class="ugb-number-box__item"></div></div>
		<!-- /wp:ugb/number-box -->`,
	},
	{
		block: 'Number Box',
		version: '1.15.1',
		plan: 'premium',
		description: 'Default block',
		html: `<!-- wp:ugb/number-box -->
		<div class="wp-block-ugb-number-box ugb-number-box ugb-number-box--v2 ugb-number-box--columns-3"><div class="ugb-number-box__item"><span class="ugb-number-box__number">01</span><div class="ugb-number-box__content"><h4 class="ugb-number-box__title">Title</h4><p class="ugb-number-box__description">Description for this block. Use this space for describing your block. Any text will do.</p></div></div><div class="ugb-number-box__item"><span class="ugb-number-box__number">02</span><div class="ugb-number-box__content"><h4 class="ugb-number-box__title">Title</h4><p class="ugb-number-box__description">Description for this block. Use this space for describing your block. Any text will do.</p></div></div><div class="ugb-number-box__item"><span class="ugb-number-box__number">03</span><div class="ugb-number-box__content"><h4 class="ugb-number-box__title">Title</h4><p class="ugb-number-box__description">Description for this block. Use this space for describing your block. Any text will do.</p></div></div></div>
		<!-- /wp:ugb/number-box -->`,
	},
	{
		block: 'Number Box',
		version: '1.15.1',
		plan: 'premium',
		description: 'Modified block',
		html: `<!-- wp:ugb/number-box {"design":"background","borderRadius":33,"shadow":1,"backgroundColor":"#cf2e2e"} -->
		<div class="wp-block-ugb-number-box ugb-number-box ugb-number-box--v2 ugb-number-box--columns-3 ugb-number-box--design-background"><div class="ugb-number-box__item ugb--shadow-1" style="border-radius:33px;background-color:#cf2e2e"><span class="ugb-number-box__number">01</span><div class="ugb-number-box__content"><h4 class="ugb-number-box__title" style="color:#ffffff">Title</h4><p class="ugb-number-box__description" style="color:#ffffff">Description for this block. Use this space for describing your block. Any text will do.</p></div></div><div class="ugb-number-box__item ugb--shadow-1" style="border-radius:33px;background-color:#cf2e2e"><span class="ugb-number-box__number">02</span><div class="ugb-number-box__content"><h4 class="ugb-number-box__title" style="color:#ffffff">Title</h4><p class="ugb-number-box__description" style="color:#ffffff">Description for this block. Use this space for describing your block. Any text will do.</p></div></div><div class="ugb-number-box__item ugb--shadow-1" style="border-radius:33px;background-color:#cf2e2e"><span class="ugb-number-box__number">03</span><div class="ugb-number-box__content"><h4 class="ugb-number-box__title" style="color:#ffffff">Title</h4><p class="ugb-number-box__description" style="color:#ffffff">Description for this block. Use this space for describing your block. Any text will do.</p></div></div></div>
		<!-- /wp:ugb/number-box -->`,
	},
	{
		block: 'Number Box',
		version: '1.15.1',
		plan: 'premium',
		description: 'Modified block',
		html: `<!-- wp:ugb/number-box {"numberColor":"#fcb900","titleColor":"#cf2e2e","descriptionColor":"#abb8c3","columns":2,"design":"heading2","borderRadius":33,"shadow":1,"backgroundColor":"#eeeeee"} -->
		<div class="wp-block-ugb-number-box ugb-number-box ugb-number-box--v2 ugb-number-box--columns-2 ugb-number-box--design-heading2"><div class="ugb-number-box__item ugb--shadow-1" style="border-radius:33px;background-color:#eeeeee"><span class="ugb-number-box__number" style="color:#fcb900">01</span><div class="ugb-number-box__content"><h4 class="ugb-number-box__title" style="color:#cf2e2e">Title</h4><p class="ugb-number-box__description" style="color:#abb8c3">Description for this block. Use this space for describing your block. Any text will do.</p></div></div><div class="ugb-number-box__item ugb--shadow-1" style="border-radius:33px;background-color:#eeeeee"><span class="ugb-number-box__number" style="color:#fcb900">02</span><div class="ugb-number-box__content"><h4 class="ugb-number-box__title" style="color:#cf2e2e">Title</h4><p class="ugb-number-box__description" style="color:#abb8c3">Description for this block. Use this space for describing your block. Any text will do.</p></div></div></div>
		<!-- /wp:ugb/number-box -->`,
	},
	{
		block: 'Number Box',
		version: '1.15.1',
		plan: 'premium',
		description: 'Custom CSS',
		html: `<!-- wp:ugb/number-box {"customCSSUniqueID":"ugb-8f4f21b","customCSS":"/* Number box container */\n.ugb-number-box {\n\tbackground: red;\n}\n\n/* Number box item */\n.ugb-number-box .ugb-number-box__item {\n\t\n}\n\n/* Number box number */\n.ugb-number-box .ugb-number-box__number {\n\t\n}\n\n/* Number box content wrapper */\n.ugb-number-box .ugb-number-box__content {\n\t\n}\n\n/* Number box title */\n.ugb-number-box .ugb-number-box__title {\n\t\n}\n\n/* Number box description */\n.ugb-number-box .ugb-number-box__description {\n\t\n}","customCSSCompiled":".ugb-8f4f21b.ugb-number-box{background:red !important}"} -->
		<div class="wp-block-ugb-number-box ugb-number-box ugb-number-box--v2 ugb-number-box--columns-3 ugb-8f4f21b"><style>.ugb-8f4f21b.ugb-number-box{background:red !important}</style><div class="ugb-number-box__item"><span class="ugb-number-box__number">01</span><div class="ugb-number-box__content"><h4 class="ugb-number-box__title">Title</h4><p class="ugb-number-box__description">Description for this block. Use this space for describing your block. Any text will do.</p></div></div><div class="ugb-number-box__item"><span class="ugb-number-box__number">02</span><div class="ugb-number-box__content"><h4 class="ugb-number-box__title">Title</h4><p class="ugb-number-box__description">Description for this block. Use this space for describing your block. Any text will do.</p></div></div><div class="ugb-number-box__item"><span class="ugb-number-box__number">03</span><div class="ugb-number-box__content"><h4 class="ugb-number-box__title">Title</h4><p class="ugb-number-box__description">Description for this block. Use this space for describing your block. Any text will do.</p></div></div></div>
		<!-- /wp:ugb/number-box -->`,
		// skip: 'Known problem',
	},
]
