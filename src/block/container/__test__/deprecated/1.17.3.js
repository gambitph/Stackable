/**
 * This file contains saved block HTML from older versions.
 * These will be tested if they pass migration.
 * This will be built into the dist folder as `deprecation-tests.json`
 */

module.exports = [
	{
		block: 'Container',
		version: '1.17.3',
		description: 'Default block',
		html: `<!-- wp:ugb/container -->
		<div class="wp-block-ugb-container ugb-container ugb--background-opacity-5 ugb--has-background ugb-container--height-normal ugb-container--align-horizontal-full" style="background-color:#f1f1f1"><div class="ugb-container__wrapper"><div class="ugb-container__content-wrapper"><!-- wp:heading -->
		<h2>Title for This Block</h2>
		<!-- /wp:heading -->

		<!-- wp:paragraph -->
		<p>Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p>
		<!-- /wp:paragraph --></div></div></div>
		<!-- /wp:ugb/container -->`,
	},
	{
		block: 'Container',
		version: '1.17.3',
		description: 'Empty block',
		html: `<!-- wp:ugb/container -->
		<div class="wp-block-ugb-container ugb-container ugb--background-opacity-5 ugb--has-background ugb-container--height-normal ugb-container--align-horizontal-full" style="background-color:#f1f1f1"><div class="ugb-container__wrapper"><div class="ugb-container__content-wrapper"></div></div></div>
		<!-- /wp:ugb/container -->`,
	},
	{
		block: 'Container',
		version: '1.17.3',
		description: 'Modified block',
		html: `<!-- wp:ugb/container {"textColor":"#cf2e2e","backgroundColorType":"gradient","backgroundColor":"#ffffff","backgroundColor2":"#fcb900","backgroundColorDirection":80,"borderRadius":42,"shadow":6} -->
		<div class="wp-block-ugb-container ugb-container ugb--background-opacity-5 ugb--has-background ugb-container--height-normal ugb-container--align-horizontal-full ugb--shadow-6 ugb--has-background-gradient" style="--ugb-text-color:#cf2e2e;background-color:#ffffff;--ugb-background-color:#ffffff;--ugb-background-color2:#fcb900;--ugb-background-direction:80deg;border-radius:42px"><div class="ugb-container__wrapper"><div class="ugb-container__content-wrapper"><!-- wp:heading -->
		<h2>Title for This Block</h2>
		<!-- /wp:heading -->

		<!-- wp:paragraph -->
		<p>Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p>
		<!-- /wp:paragraph --></div></div></div>
		<!-- /wp:ugb/container -->`,
	},
	{
		block: 'Container',
		version: '1.17.3',
		description: 'Modified block',
		html: `<!-- wp:ugb/container {"textColor":"#313131","backgroundImageID":17,"backgroundImageURL":"http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg","height":"half","contentLocation":"right","verticalAlign":"flex-end"} -->
		<div class="wp-block-ugb-container ugb-container ugb--background-opacity-5 ugb--has-background ugb--has-background-image ugb-container--height-half ugb-container--align-horizontal-right" style="--ugb-text-color:#313131;background-color:#f1f1f1;background-image:url(http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg);--ugb-background-color:#f1f1f1;justify-content:flex-end"><div class="ugb-container__wrapper"><div class="ugb-container__content-wrapper"><!-- wp:heading -->
		<h2>Title for This Block</h2>
		<!-- /wp:heading -->

		<!-- wp:paragraph -->
		<p>Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p>
		<!-- /wp:paragraph --></div></div></div>
		<!-- /wp:ugb/container -->`,
	},
	{
		block: 'Container',
		version: '1.17.3',
		description: 'Full-width half left',
		html: `<!-- wp:ugb/container {"contentLocation":"left","align":"full"} -->
		<div class="wp-block-ugb-container alignfull ugb-container ugb--background-opacity-5 ugb--has-background ugb-container--height-normal ugb-container--align-horizontal-left" style="background-color:#f1f1f1"><div class="ugb-container__wrapper"><div class="ugb-container__content-wrapper"><!-- wp:heading -->
		<h2>Title for This Block</h2>
		<!-- /wp:heading -->

		<!-- wp:paragraph -->
		<p>Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p>
		<!-- /wp:paragraph --></div></div></div>
		<!-- /wp:ugb/container -->`,
	},
	{
		block: 'Container',
		version: '1.17.3',
		description: 'Full-width restrict',
		html: `<!-- wp:ugb/container {"contentWidth":true,"align":"full"} -->
		<div class="wp-block-ugb-container alignfull ugb-container ugb--background-opacity-5 ugb--has-background ugb-container--height-normal ugb-container--align-horizontal-full ugb--content-width" style="background-color:#f1f1f1"><div class="ugb-container__wrapper"><div class="ugb-container__content-wrapper"><!-- wp:heading -->
		<h2>Title for This Block</h2>
		<!-- /wp:heading -->

		<!-- wp:paragraph -->
		<p>Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p>
		<!-- /wp:paragraph --></div></div></div>
		<!-- /wp:ugb/container -->`,
	},
	{
		block: 'Container',
		version: '1.17.3',
		description: 'Custom CSS',
		plan: 'Premium',
		html: `<!-- wp:ugb/container {"customCSSUniqueID":"ugb-1fd86d8","customCSS":"/* Container */\n.ugb-container {\n\tbackground: green;\n}\n\n/* Container content wrapper */\n.ugb-container .ugb-container__content-wrapper {\n\tbackground: red;\n}\n\n/* All content */\n.ugb-container .ugb-container__content-wrapper * {\n\tcolor: yellow\n}","customCSSCompiled":".ugb-1fd86d8.ugb-container{background:green !important}.ugb-1fd86d8.ugb-container .ugb-container__content-wrapper{background:red !important}.ugb-1fd86d8.ugb-container .ugb-container__content-wrapper *{color:yellow !important}"} -->
		<div class="wp-block-ugb-container ugb-container ugb--background-opacity-5 ugb--has-background ugb-container--height-normal ugb-container--align-horizontal-full ugb-1fd86d8" style="background-color:#f1f1f1"><style>.ugb-1fd86d8.ugb-container{background:green !important}.ugb-1fd86d8.ugb-container .ugb-container__content-wrapper{background:red !important}.ugb-1fd86d8.ugb-container .ugb-container__content-wrapper *{color:yellow !important}</style><div class="ugb-container__wrapper"><div class="ugb-container__content-wrapper"><!-- wp:heading -->
		<h2>Title for This Block</h2>
		<!-- /wp:heading -->

		<!-- wp:paragraph -->
		<p>Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p>
		<!-- /wp:paragraph --></div></div></div>
		<!-- /wp:ugb/container -->`,
	},
]
