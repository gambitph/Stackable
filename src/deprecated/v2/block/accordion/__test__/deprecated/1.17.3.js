/**
 * This file contains saved block HTML from older versions.
 * These will be tested if they pass migration.
 * This will be built into the dist folder as `deprecation-tests.json`
 */

module.exports = [
	{
		block: 'Accordion',
		version: '1.17.3',
		description: 'Default block',
		html: `<!-- wp:ugb/accordion -->
		<div class="wp-block-ugb-accordion ugb-accordion" role="presentation"><div class="ugb-accordion__heading" role="button" tabindex="0" aria-expanded="false"><h4 role="heading" aria-level="3">Title for This Block</h4><svg viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M16.7 3.3L10 10 3.3 3.4 0 6.7l10 10v-.1l10-9.9z"></path></svg></div><p class="ugb-accordion__text" role="region">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p></div>
		<!-- /wp:ugb/accordion -->`,
	},
	{
		block: 'Accordion',
		version: '1.17.3',
		description: 'Modified block',
		html: `<!-- wp:ugb/accordion {"headingColor":"#313131","headingBackgroundColor":"#cf2e2e","borderRadius":31,"shadow":7} -->
		<div class="wp-block-ugb-accordion ugb-accordion" role="presentation"><div class="ugb-accordion__heading ugb--shadow-7" role="button" tabindex="0" aria-expanded="false" style="border-radius:31px;background-color:#cf2e2e"><h4 role="heading" aria-level="3" style="color:#313131">Title for This Block</h4><svg viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#313131"><path d="M16.7 3.3L10 10 3.3 3.4 0 6.7l10 10v-.1l10-9.9z"></path></svg></div><p class="ugb-accordion__text" role="region">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p></div>
		<!-- /wp:ugb/accordion -->`,
	},
	{
		block: 'Accordion',
		version: '1.17.3',
		description: 'Modified block',
		html: `<!-- wp:ugb/accordion {"headingColor":"#ff6900","openStart":true,"design":"plain","borderRadius":0,"shadow":7} -->
		<div class="wp-block-ugb-accordion ugb-accordion ugb-accordion--design-plain ugb-accordion--open" role="presentation"><div class="ugb-accordion__heading" role="button" tabindex="0" aria-expanded="true"><h4 role="heading" aria-level="3" style="color:#ff6900">Title for This Block</h4><svg viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ff6900"><path d="M16.7 3.3L10 10 3.3 3.4 0 6.7l10 10v-.1l10-9.9z"></path></svg></div><p class="ugb-accordion__text" role="region">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p></div>
		<!-- /wp:ugb/accordion -->`,
	},
	{
		block: 'Accordion',
		version: '1.17.3',
		description: 'From demo',
		html: `<!-- wp:ugb/accordion {"headingColor":"#0693e3"} -->
		<div class="wp-block-ugb-accordion ugb-accordion" role="presentation"><div class="ugb-accordion__heading" role="button" tabindex="0" aria-expanded="false"><h4 role="heading" aria-level="3" style="color:#0693e3">Vinyasa</h4><svg viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#0693e3"><path d="M16.7 3.3L10 10 3.3 3.4 0 6.7l10 10v-.1l10-9.9z"></path></svg></div><p class="ugb-accordion__text" role="region">Monday - 7:00 am to 8:00 am<br>Tuesday - 9:00 am to 10:00 am<br>Thursday - 9:30 am to 10:30 am<br><br></p></div>
		<!-- /wp:ugb/accordion -->`,
	},
	{
		block: 'Accordion',
		version: '1.17.3',
		description: 'From demo',
		html: `<!-- wp:ugb/accordion {"headingColor":"#343756","headingBackgroundColor":"#e89e83","openStart":true,"borderRadius":0} -->
		<div class="wp-block-ugb-accordion ugb-accordion ugb-accordion--open" role="presentation"><div class="ugb-accordion__heading" role="button" tabindex="0" aria-expanded="true" style="border-radius:0;background-color:#e89e83"><h4 role="heading" aria-level="3" style="color:#343756">How do I learn about the products?</h4><svg viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#343756"><path d="M16.7 3.3L10 10 3.3 3.4 0 6.7l10 10v-.1l10-9.9z"></path></svg></div><p class="ugb-accordion__text" role="region">You can choose a product by visiting our website. Learn more about the details about each of our featured items.<br><br></p></div>
		<!-- /wp:ugb/accordion -->`,
	},
	{
		block: 'Accordion',
		version: '1.17.3',
		description: 'From demo',
		html: `<!-- wp:ugb/accordion {"headingColor":"#ffffff","headingBackgroundColor":"#f75e5e","borderRadius":6} -->
		<div class="wp-block-ugb-accordion ugb-accordion" role="presentation"><div class="ugb-accordion__heading" role="button" tabindex="0" aria-expanded="false" style="border-radius:6px;background-color:#f75e5e"><h4 role="heading" aria-level="3" style="color:#ffffff">Brunch Set 1</h4><svg viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ffffff"><path d="M16.7 3.3L10 10 3.3 3.4 0 6.7l10 10v-.1l10-9.9z"></path></svg></div><p class="ugb-accordion__text" role="region">Blueberry Pancakes<br>Classic Benedicts<br>Lobster Rolls<br>Cheddar Biscuits<br></p></div>
		<!-- /wp:ugb/accordion -->`,
	},
	{
		block: 'Accordion',
		version: '1.17.3',
		description: 'Line-colored layout',
		plan: 'Premium',
		html: `<!-- wp:ugb/accordion {"design":"line-colored"} -->
		<div class="wp-block-ugb-accordion ugb-accordion ugb-accordion--design-line-colored" role="presentation"><div class="ugb-accordion__heading" role="button" tabindex="0" aria-expanded="false"><h4 role="heading" aria-level="3">Title for This Block</h4><svg viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M16.7 3.3L10 10 3.3 3.4 0 6.7l10 10v-.1l10-9.9z"></path></svg></div><p class="ugb-accordion__text" role="region">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p></div>
		<!-- /wp:ugb/accordion -->`,
	},
	{
		block: 'Accordion',
		version: '1.17.3',
		description: 'Modified Line-colored layout',
		plan: 'Premium',
		html: `<!-- wp:ugb/accordion {"headingColor":"#fcb900","headingBackgroundColor":"#cf2e2e","design":"line-colored","borderRadius":50,"shadow":6} -->
		<div class="wp-block-ugb-accordion ugb-accordion ugb-accordion--design-line-colored ugb-accordion--is-dark ugb--shadow-6" style="background-color:#cf2e2e;--ugb-arrow-fill:#cf2e2e;border-radius:50px" role="presentation"><div class="ugb-accordion__heading" role="button" tabindex="0" aria-expanded="false"><h4 role="heading" aria-level="3" style="color:#fcb900">Title for This Block</h4><svg viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fcb900"><path d="M16.7 3.3L10 10 3.3 3.4 0 6.7l10 10v-.1l10-9.9z"></path></svg></div><p class="ugb-accordion__text" role="region">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p></div>
		<!-- /wp:ugb/accordion -->`,
	},
	{
		block: 'Accordion',
		version: '1.17.3',
		description: 'Colored layout',
		plan: 'Premium',
		html: `<!-- wp:ugb/accordion {"design":"colored"} -->
		<div class="wp-block-ugb-accordion ugb-accordion ugb-accordion--design-colored" role="presentation"><div class="ugb-accordion__heading" role="button" tabindex="0" aria-expanded="false"><h4 role="heading" aria-level="3">Title for This Block</h4><svg viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M16.7 3.3L10 10 3.3 3.4 0 6.7l10 10v-.1l10-9.9z"></path></svg></div><p class="ugb-accordion__text" role="region">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p></div>
		<!-- /wp:ugb/accordion -->`,
	},
	{
		block: 'Accordion',
		version: '1.17.3',
		description: ' Modified Colored layout',
		plan: 'Premium',
		html: `<!-- wp:ugb/accordion {"headingBackgroundColor":"#cf2e2e","design":"colored","borderRadius":33} -->
		<div class="wp-block-ugb-accordion ugb-accordion ugb-accordion--design-colored ugb-accordion--is-dark" style="background-color:#cf2e2e;--ugb-arrow-fill:#cf2e2e;border-radius:33px" role="presentation"><div class="ugb-accordion__heading" role="button" tabindex="0" aria-expanded="false"><h4 role="heading" aria-level="3">Title for This Block</h4><svg viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M16.7 3.3L10 10 3.3 3.4 0 6.7l10 10v-.1l10-9.9z"></path></svg></div><p class="ugb-accordion__text" role="region">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p></div>
		<!-- /wp:ugb/accordion -->`,
	},
	{
		block: 'Accordion',
		version: '1.17.3',
		description: ' Modified Colored layout',
		plan: 'Premium',
		html: `<!-- wp:ugb/accordion {"headingColor":"#fcb900","headingBackgroundColor":"#cf2e2e","design":"colored","borderRadius":33} -->
		<div class="wp-block-ugb-accordion ugb-accordion ugb-accordion--design-colored ugb-accordion--is-dark" style="background-color:#cf2e2e;--ugb-arrow-fill:#cf2e2e;border-radius:33px" role="presentation"><div class="ugb-accordion__heading" role="button" tabindex="0" aria-expanded="false"><h4 role="heading" aria-level="3" style="color:#fcb900">Title for This Block</h4><svg viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fcb900"><path d="M16.7 3.3L10 10 3.3 3.4 0 6.7l10 10v-.1l10-9.9z"></path></svg></div><p class="ugb-accordion__text" role="region">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p></div>
		<!-- /wp:ugb/accordion -->`,
	},
	{
		block: 'Accordion',
		version: '1.17.3',
		description: 'From Demo',
		plan: 'Premium',
		html: `<!-- wp:ugb/accordion {"headingColor":"#f65f5f","headingBackgroundColor":"#f9c6c5","openStart":true,"design":"colored"} -->
		<div class="wp-block-ugb-accordion ugb-accordion ugb-accordion--design-colored ugb-accordion--open" style="background-color:#f9c6c5;--ugb-arrow-fill:#f9c6c5" role="presentation"><div class="ugb-accordion__heading" role="button" tabindex="0" aria-expanded="true"><h4 role="heading" aria-level="3" style="color:#f65f5f">Accordion 1</h4><svg viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#f65f5f"><path d="M16.7 3.3L10 10 3.3 3.4 0 6.7l10 10v-.1l10-9.9z"></path></svg></div><p class="ugb-accordion__text" role="region">Use the Accordion block to display text heavy content. With the Accordion, you give website visitors the option to hide the text that they do not need to view. This will make the content in your site easier to digest.</p></div>
		<!-- /wp:ugb/accordion -->`,
	},
	{
		block: 'Accordion',
		version: '1.17.3',
		description: 'From Demo',
		plan: 'Premium',
		html: `<!-- wp:ugb/accordion {"headingColor":"#539fba","headingBackgroundColor":"#a4d0e2","openStart":true,"design":"line-colored","borderRadius":0,"shadow":0} -->
		<div class="wp-block-ugb-accordion ugb-accordion ugb-accordion--design-line-colored ugb-accordion--open ugb--shadow-0" style="background-color:#a4d0e2;--ugb-arrow-fill:#a4d0e2;border-radius:0" role="presentation"><div class="ugb-accordion__heading" role="button" tabindex="0" aria-expanded="true"><h4 role="heading" aria-level="3" style="color:#539fba">How do I learn about the <br>product?</h4><svg viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#539fba"><path d="M16.7 3.3L10 10 3.3 3.4 0 6.7l10 10v-.1l10-9.9z"></path></svg></div><p class="ugb-accordion__text" role="region">You can choose a product by visiting our website. Learn more about the details about each of our featured items.<br><br></p></div>
		<!-- /wp:ugb/accordion -->`,
	},
	{
		block: 'Accordion',
		version: '1.17.3',
		description: 'Custom CSS',
		plan: 'Premium',
		html: `<!-- wp:ugb/accordion {"customCSSUniqueID":"ugb-abb0274","customCSS":"/* Accordion container */\n.ugb-accordion {\n\t\n}\n\n/* Accordion heading */\n.ugb-accordion__heading {\n\tbackground: red;\n}\n\n/* Accordion heading text */\n.ugb-accordion__heading h4 {\n\tcolor: yellow;\n}\n\n/* Accordion arrow */\n.ugb-accordion__heading svg {\n\tfill: lime;\n}\n\n/* Body */\n.ugb-accordion__text {\n\tcolor: blue;\n}","customCSSCompiled":".ugb-abb0274 .ugb-accordion__heading{background:red !important}.ugb-abb0274 .ugb-accordion__heading h4{color:yellow !important}.ugb-abb0274 .ugb-accordion__heading svg{fill:lime !important}.ugb-abb0274 .ugb-accordion__text{color:blue !important}"} -->
		<div class="wp-block-ugb-accordion ugb-accordion ugb-abb0274" role="presentation"><style>.ugb-abb0274 .ugb-accordion__heading{background:red !important}.ugb-abb0274 .ugb-accordion__heading h4{color:yellow !important}.ugb-abb0274 .ugb-accordion__heading svg{fill:lime !important}.ugb-abb0274 .ugb-accordion__text{color:blue !important}</style><div class="ugb-accordion__heading" role="button" tabindex="0" aria-expanded="false"><h4 role="heading" aria-level="3">Title for This Block</h4><svg viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M16.7 3.3L10 10 3.3 3.4 0 6.7l10 10v-.1l10-9.9z"></path></svg></div><p class="ugb-accordion__text" role="region">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p></div>
		<!-- /wp:ugb/accordion -->`,
	},
]
