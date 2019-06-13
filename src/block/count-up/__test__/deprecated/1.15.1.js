/**
 * This file contains saved block HTML from older versions.
 * These will be tested if they pass migration.
 * This will be built into the dist folder as `deprecation-tests.json`
 */

module.exports = [
	{
		block: 'Count Up',
		version: '1.15.4',
		description: 'Default block',
		html: `<!-- wp:ugb/count-up -->
		<div class="wp-block-ugb-count-up ugb-countup ugb-countup--v3 ugb-countup--columns-4 ugb--background-opacity-5"><div class="ugb-content-wrapper"><div class="ugb-countup__item"><h4 class="ugb-countup__title">Title</h4><div class="ugb-countup__counter" style="font-size:40px;font-weight:400" data-duration="1000" data-delay="16">$99.99</div><p class="ugb-countup__description">Description</p></div><div class="ugb-countup__item"><h4 class="ugb-countup__title">Title</h4><div class="ugb-countup__counter" style="font-size:40px;font-weight:400" data-duration="1000" data-delay="16">1,234</div><p class="ugb-countup__description">Description</p></div><div class="ugb-countup__item"><h4 class="ugb-countup__title">Title</h4><div class="ugb-countup__counter" style="font-size:40px;font-weight:400" data-duration="1000" data-delay="16">1,234.56</div><p class="ugb-countup__description">Description</p></div><div class="ugb-countup__item"><h4 class="ugb-countup__title">Title</h4><div class="ugb-countup__counter" style="font-size:40px;font-weight:400" data-duration="1000" data-delay="16">£99.99</div><p class="ugb-countup__description">Description</p></div></div></div>
		<!-- /wp:ugb/count-up -->`,
	},
	{
		block: 'Count Up',
		version: '1.15.4',
		description: 'Basic design',
		html: `<!-- wp:ugb/count-up {"columns":1,"design":"basic"} -->
		<div class="wp-block-ugb-count-up ugb-countup ugb-countup--v3 ugb-countup--columns-1 ugb--background-opacity-5 ugb-countup--design-basic"><div class="ugb-content-wrapper"><div class="ugb-countup__item"><h4 class="ugb-countup__title">Title</h4><div class="ugb-countup__counter" style="font-size:40px;font-weight:400" data-duration="1000" data-delay="16">$99.99</div><p class="ugb-countup__description">Description</p></div></div></div>
		<!-- /wp:ugb/count-up -->`,
	},
	{
		block: 'Count Up',
		version: '1.15.4',
		description: 'Modified Basic design',
		html: `<!-- wp:ugb/count-up {"columns":2,"textColor":"#fcb900","countColor":"#313131","countSize":88,"countFontWeight":"100","borderRadius":35,"shadow":6} -->
		<div class="wp-block-ugb-count-up ugb-countup ugb-countup--v3 ugb-countup--columns-2 ugb--background-opacity-5"><div class="ugb-content-wrapper"><div class="ugb-countup__item"><h4 class="ugb-countup__title" style="color:#fcb900">Title</h4><div class="ugb-countup__counter" style="color:#313131;font-size:88px;font-weight:100" data-duration="1000" data-delay="16">$99.99</div><p class="ugb-countup__description" style="color:#fcb900">Description</p></div><div class="ugb-countup__item"><h4 class="ugb-countup__title" style="color:#fcb900">Title</h4><div class="ugb-countup__counter" style="color:#313131;font-size:88px;font-weight:100" data-duration="1000" data-delay="16">1,234</div><p class="ugb-countup__description" style="color:#fcb900">Description</p></div></div></div>
		<!-- /wp:ugb/count-up -->`,
	},
	{
		block: 'Count Up',
		version: '1.15.4',
		description: 'Modified block',
		plan: 'premium',
		html: `<!-- wp:ugb/count-up {"columns":3,"backgroundColor":"#f65d60","textColor":"#725151","countColor":"#fcae5c","countSize":46,"countFont":"sans-serif","countFontWeight":"100","design":"boxed","shadow":7} -->
		<div class="wp-block-ugb-count-up ugb-countup ugb-countup--v3 ugb-countup--columns-3 ugb--background-opacity-5 ugb-countup--design-boxed"><div class="ugb-content-wrapper"><div class="ugb-countup__item ugb--shadow-7" style="border-radius:12px;background-color:#f65d60"><h4 class="ugb-countup__title" style="color:#725151">Title</h4><div class="ugb-countup__counter" style="color:#fcae5c;font-size:46px;font-weight:100;font-family:-apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;" data-duration="1000" data-delay="16">$99</div><p class="ugb-countup__description" style="color:#725151">Description</p></div><div class="ugb-countup__item ugb--shadow-7" style="border-radius:12px;background-color:#f65d60"><h4 class="ugb-countup__title" style="color:#725151">Title</h4><div class="ugb-countup__counter" style="color:#fcae5c;font-size:46px;font-weight:100;font-family:-apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;" data-duration="1000" data-delay="16">1,234</div><p class="ugb-countup__description" style="color:#725151">Description</p></div><div class="ugb-countup__item ugb--shadow-7" style="border-radius:12px;background-color:#f65d60"><h4 class="ugb-countup__title" style="color:#725151">Title</h4><div class="ugb-countup__counter" style="color:#fcae5c;font-size:46px;font-weight:100;font-family:-apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;" data-duration="1000" data-delay="16">123.99</div><p class="ugb-countup__description" style="color:#725151">Description</p></div></div></div>
		<!-- /wp:ugb/count-up -->`,
	},
	{
		block: 'Count Up',
		version: '1.15.4',
		description: 'Modified block',
		plan: 'premium',
		html: `<!-- wp:ugb/count-up {"columns":1,"backgroundColor":"#000000","backgroundImageID":2871,"backgroundImageURL":"https://wpstackable.com/wp-content/uploads/2019/04/Currency-Count-Up.jpg","backgroundOpacity":6,"fixedBackground":true,"textColor":"#0063cb","countColor":"#313131","countSize":52,"countFont":"sans-serif","countFontWeight":"100","design":"side","shadow":6,"align":"center","fontSize":60} -->
		<div class="wp-block-ugb-count-up aligncenter ugb-countup ugb-countup--v3 ugb-countup--columns-1 ugb--background-opacity-6 ugb--has-background-image ugb-countup--design-side" style="background-attachment:fixed"><div class="ugb-content-wrapper"><div class="ugb-countup__item"><div class="ugb-countup__counter" style="color:#313131;font-size:52px;font-weight:100;font-family:-apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;" data-duration="1000" data-delay="16">$1,234.00</div><div class="ugb-countup__side"><h4 class="ugb-countup__title" style="color:#0063cb">US</h4><p class="ugb-countup__description" style="color:#0063cb">/year</p></div></div></div></div>
		<!-- /wp:ugb/count-up -->`,
	},
	{
		block: 'Count Up',
		version: '1.15.4',
		description: 'Modified block',
		plan: 'premium',
		html: `<!-- wp:ugb/count-up {"columns":1,"backgroundColor":"#000000","backgroundImageID":2871,"backgroundImageURL":"https://wpstackable.com/wp-content/uploads/2019/04/Currency-Count-Up.jpg","backgroundOpacity":6,"fixedBackground":true,"textColor":"#0063cb","countColor":"#313131","countSize":52,"countFont":"sans-serif","countFontWeight":"100","design":"side","shadow":6,"align":"center","fontSize":60} -->
		<div class="wp-block-ugb-count-up aligncenter ugb-countup ugb-countup--v3 ugb-countup--columns-1 ugb--background-opacity-6 ugb--has-background-image ugb-countup--design-side" style="background-attachment:fixed"><div class="ugb-content-wrapper"><div class="ugb-countup__item"><div class="ugb-countup__counter" style="color:#313131;font-size:52px;font-weight:100;font-family:-apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;" data-duration="1000" data-delay="16">€1,234.00</div><div class="ugb-countup__side"><h4 class="ugb-countup__title" style="color:#0063cb">EURO</h4><p class="ugb-countup__description" style="color:#0063cb">/year</p></div></div></div></div>
		<!-- /wp:ugb/count-up -->`,
	},
	{
		block: 'Count Up',
		version: '1.15.4',
		description: 'Modified block',
		plan: 'premium',
		html: `<!-- wp:ugb/count-up {"columns":1,"backgroundColor":"#313131","textColor":"#fcb900","countColor":"#ffffff","countSize":60,"countFont":"sans-serif","countFontWeight":"800","design":"abstract","borderRadius":0,"shadow":5,"align":"center","fontSize":60} -->
		<div class="wp-block-ugb-count-up aligncenter ugb-countup ugb-countup--v3 ugb-countup--columns-1 ugb--background-opacity-5 ugb-countup--design-abstract"><div class="ugb-content-wrapper"><div class="ugb-countup__item"><div class="ugb-countup__counter" style="color:#ffffff;font-size:60px;font-weight:800;font-family:-apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;" data-duration="1000" data-delay="16">20</div><div class="ugb-countup__side"><p class="ugb-countup__description" style="color:#fcb900">Cities</p></div></div></div></div>
		<!-- /wp:ugb/count-up -->`,
	},
	{
		block: 'Count Up',
		version: '1.15.4',
		description: 'Side design',
		plan: 'premium',
		html: `<!-- wp:ugb/count-up {"columns":2,"textColor":"#cf2e2e","countSize":88,"countFont":"sans-serif","countFontWeight":"100","design":"side"} -->
		<div class="wp-block-ugb-count-up ugb-countup ugb-countup--v3 ugb-countup--columns-2 ugb--background-opacity-5 ugb-countup--design-side"><div class="ugb-content-wrapper"><div class="ugb-countup__item"><div class="ugb-countup__counter" style="font-size:88px;font-weight:100;font-family:-apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;" data-duration="1000" data-delay="16">$99.99</div><div class="ugb-countup__side"><h4 class="ugb-countup__title" style="color:#cf2e2e">Title</h4><p class="ugb-countup__description" style="color:#cf2e2e">Description</p></div></div><div class="ugb-countup__item"><div class="ugb-countup__counter" style="font-size:88px;font-weight:100;font-family:-apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Helvetica, Arial, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;" data-duration="1000" data-delay="16">1,234</div><div class="ugb-countup__side"><h4 class="ugb-countup__title" style="color:#cf2e2e">Title</h4><p class="ugb-countup__description" style="color:#cf2e2e">Description</p></div></div></div></div>
		<!-- /wp:ugb/count-up -->`,
	},
	{
		block: 'Count Up',
		version: '1.15.4',
		description: 'Boxed design',
		plan: 'premium',
		html: `<!-- wp:ugb/count-up {"columns":2,"textColor":"#fcb900","countColor":"#313131","countSize":88,"countFontWeight":"100","design":"boxed","borderRadius":35,"shadow":6} -->
		<div class="wp-block-ugb-count-up ugb-countup ugb-countup--v3 ugb-countup--columns-2 ugb--background-opacity-5 ugb-countup--design-boxed"><div class="ugb-content-wrapper"><div class="ugb-countup__item ugb--shadow-6" style="border-radius:35px"><h4 class="ugb-countup__title" style="color:#fcb900">Title</h4><div class="ugb-countup__counter" style="color:#313131;font-size:88px;font-weight:100" data-duration="1000" data-delay="16">$99.99</div><p class="ugb-countup__description" style="color:#fcb900">Description</p></div><div class="ugb-countup__item ugb--shadow-6" style="border-radius:35px"><h4 class="ugb-countup__title" style="color:#fcb900">Title</h4><div class="ugb-countup__counter" style="color:#313131;font-size:88px;font-weight:100" data-duration="1000" data-delay="16">1,234</div><p class="ugb-countup__description" style="color:#fcb900">Description</p></div></div></div>
		<!-- /wp:ugb/count-up -->`,
	},
	{
		block: 'Count Up',
		version: '1.15.4',
		description: 'Custom CSS',
		plan: 'premium',
		html: `<!-- wp:ugb/count-up {"customCSSUniqueID":"ugb-736adcc","customCSS":"/* Count up container */\n.ugb-countup {\n\tbackground: red;\n}\n\n/* Count up item */\n.ugb-countup .ugb-countup__item {\n\t\n}\n\n/* Count up title */\n.ugb-countup .ugb-countup__title {\n\t\n}\n\n/* Count up number counter */\n.ugb-countup .ugb-countup__counter {\n\t\n}\n\n/* Count up description */\n.ugb-countup .ugb-countup__description {\n\t\n}","customCSSCompiled":".ugb-736adcc.ugb-countup{background:red !important}"} -->
		<div class="wp-block-ugb-count-up ugb-countup ugb-countup--v3 ugb-countup--columns-4 ugb--background-opacity-5 ugb-736adcc"><style>.ugb-736adcc.ugb-countup{background:red !important}</style><div class="ugb-content-wrapper"><div class="ugb-countup__item"><h4 class="ugb-countup__title">Title</h4><div class="ugb-countup__counter" style="font-size:40px;font-weight:400" data-duration="1000" data-delay="16">$99.99</div><p class="ugb-countup__description">Description</p></div><div class="ugb-countup__item"><h4 class="ugb-countup__title">Title</h4><div class="ugb-countup__counter" style="font-size:40px;font-weight:400" data-duration="1000" data-delay="16">1,234</div><p class="ugb-countup__description">Description</p></div><div class="ugb-countup__item"><h4 class="ugb-countup__title">Title</h4><div class="ugb-countup__counter" style="font-size:40px;font-weight:400" data-duration="1000" data-delay="16">1,234.56</div><p class="ugb-countup__description">Description</p></div><div class="ugb-countup__item"><h4 class="ugb-countup__title">Title</h4><div class="ugb-countup__counter" style="font-size:40px;font-weight:400" data-duration="1000" data-delay="16">£99.99</div><p class="ugb-countup__description">Description</p></div></div></div>
		<!-- /wp:ugb/count-up -->`,
	},
]
