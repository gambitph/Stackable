/**
 * This file contains saved block HTML from older versions.
 * These will be tested if they pass migration.
 * This will be built into the dist folder as `deprecation-tests.json`
 */

module.exports = [
	{
		block: 'Button',
		version: '1.15.5',
		description: 'Default block',
		html: `<!-- wp:ugb/button -->
		<div class="wp-block-ugb-button ugb-button-wrapper ugb-button--align-center"><div><a class="ugb-button ugb-button--align-center ugb-button--size-normal" href="" style="border-radius:4px"><span class="ugb-button--inner">Button text</span></a></div></div>
		<!-- /wp:ugb/button -->`,
	},
	{
		block: 'Button',
		version: '1.15.5',
		description: 'Button url',
		html: `<!-- wp:ugb/button {"design":"plain"} -->
		<div class="wp-block-ugb-button ugb-button-wrapper ugb-button--align-center"><div><a class="ugb-button ugb-button--align-center ugb-button--size-normal ugb-button--design-plain" href="https://google.com" target="_blank" rel="noopener noreferrer"><span class="ugb-button--inner">Button text</span></a></div></div>
		<!-- /wp:ugb/button -->`,
	},
	{
		block: 'Button',
		version: '1.15.5',
		description: 'Link design',
		html: `<!-- wp:ugb/button {"design":"link"} -->
		<div class="wp-block-ugb-button ugb-button-wrapper ugb-button--align-center"><div><a class="ugb-button ugb-button--align-center ugb-button--size-normal ugb-button--design-link" href="https://google.com"><span class="">Button text</span></a></div></div>
		<!-- /wp:ugb/button -->`,
	},
	{
		block: 'Button',
		version: '1.15.5',
		description: 'Multiple buttons',
		html: `<!-- wp:ugb/button {"buttons":3,"align":"left"} -->
		<div class="wp-block-ugb-button ugb-button-wrapper ugb-button--align-left"><div><a class="ugb-button ugb-button--align-left ugb-button--size-normal" href="" style="border-radius:4px"><span class="ugb-button--inner">Left 1</span></a></div><div><a class="ugb-button ugb-button--align-left ugb-button--size-normal" href="" style="border-radius:4px;color:#ffffff"><span class="ugb-button--inner" style="color:#ffffff">Left 2</span></a></div><div><a class="ugb-button ugb-button--align-left ugb-button--size-normal" href="" style="border-radius:4px;color:#ffffff"><span class="ugb-button--inner" style="color:#ffffff">Left 3</span></a></div></div>
		<!-- /wp:ugb/button -->`,
	},
	{
		block: 'Button',
		version: '1.15.5',
		description: 'Fully modified block',
		html: `<!-- wp:ugb/button {"color":"#cf2e2e","textColor":"#fcb900","size":"large","cornerButtonRadius":32,"icon":"fab-apple"} -->
		<div class="wp-block-ugb-button ugb-button-wrapper ugb-button--align-center"><div><a class="ugb-button ugb-button--align-center ugb-button--size-large ugb-button--has-icon" href="" style="border-radius:32px;background-color:#cf2e2e;color:#fcb900"><svg aria-hidden="true" data-icon="apple" class="svg-inline--fa ugbfa-apple fa-w-12 " role="img" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 376 512" style="color:#fcb900" value="fab-apple"><path fill="currentColor" d="M314.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C59.3 141.2 0 184.8 0 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path></svg><span class="ugb-button--inner" style="color:#fcb900">Custom Text</span></a></div></div>
		<!-- /wp:ugb/button -->`,
	},
	{
		block: 'Button',
		version: '1.15.5',
		description: 'Fullwidth',
		html: `<!-- wp:ugb/button {"buttons":2,"align":"full","color":"#cf2e2e","textColor":"#eeeeee","size":"tiny","cornerButtonRadius":32,"design":"ghost","icon":"","color2":"#ff6900"} -->
		<div class="wp-block-ugb-button ugb-button-wrapper ugb-button--align-full"><div><a class="ugb-button ugb-button--align-full ugb-button--size-tiny ugb-button--design-ghost" href="" style="border-radius:32px;border-color:#cf2e2e;color:#cf2e2e"><span class="ugb-button--inner" style="color:#cf2e2e">Custom Text</span></a></div><div><a class="ugb-button ugb-button--align-full ugb-button--size-normal" href="" style="border-radius:32px;background-color:#ff6900;color:#ffffff"><span class="ugb-button--inner" style="color:#ffffff">Button text</span></a></div></div>
		<!-- /wp:ugb/button -->`,
	},
	{
		block: 'Button',
		version: '1.15.5',
		description: 'Custom CSS',
		plan: 'Premium',
		html: `<!-- wp:ugb/button {"customCSSUniqueID":"ugb-5eac00c","customCSS":"/* Button container */\n.ugb-button-wrapper {\n\t\n}\n\n/* 1st Button */\n.ugb-button-wrapper \u003e *:nth-child(1) .ugb-button {\n\tbackground: red;\n}\n\n/* 1st Button text */\n.ugb-button-wrapper \u003e *:nth-child(1) .ugb-button\u002d\u002dinner {\n\t\n}\n\n/* 1st Button hovered */\n.ugb-button-wrapper \u003e *:nth-child(1) .ugb-button:hover {\n\t\n}\n\n/* 1st Button hovered text */\n.ugb-button-wrapper \u003e *:nth-child(1) .ugb-button:hover .ugb-button\u002d\u002dinner {\n\t\n}\n\n/* 2nd Button */\n.ugb-button-wrapper \u003e *:nth-child(2) .ugb-button {\n\t\n}\n\n/* 2nd Button text */\n.ugb-button-wrapper \u003e *:nth-child(2) .ugb-button\u002d\u002dinner {\n\t\n}\n\n/* 2nd Button hovered */\n.ugb-button-wrapper \u003e *:nth-child(2) .ugb-button:hover {\n\t\n}\n\n/* 2nd Button hovered text */\n.ugb-button-wrapper \u003e *:nth-child(2) .ugb-button:hover .ugb-button\u002d\u002dinner {\n\t\n}\n\n/* 3rd Button */\n.ugb-button-wrapper \u003e *:nth-child(3) .ugb-button {\n\t\n}\n\n/* 3rd Button text */\n.ugb-button-wrapper \u003e *:nth-child(3) .ugb-button\u002d\u002dinner {\n\t\n}\n\n/* 3rd Button hovered */\n.ugb-button-wrapper \u003e *:nth-child(3) .ugb-button:hover {\n\t\n}\n\n/* 3rd Button hovered text */\n.ugb-button-wrapper \u003e *:nth-child(3) .ugb-button:hover .ugb-button\u002d\u002dinner {\n\t\n}","customCSSCompiled":".ugb-5eac00c.ugb-button-wrapper \u003e *:nth-child(1) .ugb-button{background:red !important}"} -->
		<div class="wp-block-ugb-button ugb-button-wrapper ugb-button--align-center ugb-5eac00c"><div><a class="ugb-button ugb-button--align-center ugb-button--size-normal" href="" style="border-radius:4px"><span class="ugb-button--inner">Custom CSS</span></a></div><style>.ugb-5eac00c.ugb-button-wrapper > *:nth-child(1) .ugb-button{background:red !important}</style></div>
		<!-- /wp:ugb/button -->`,
	},
]
