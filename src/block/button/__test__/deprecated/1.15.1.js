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
		html: `<!-- wp:ugb/button {"color":"#e91c84","textColor":"#111","size":"medium","cornerButtonRadius":32,"icon":"fab-creative-commons-by"} -->
		<div class="wp-block-ugb-button ugb-button-wrapper ugb-button--align-center"><div><a class="ugb-button ugb-button--align-center ugb-button--size-medium ugb-button--has-icon" href="" style="border-radius:32px;background-color:#e91c84;color:#111"><svg aria-hidden="true" data-icon="creative-commons-by" class="svg-inline--fa ugbfa-creative-commons-by fa-w-16 " role="img" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 496 512" style="color:#111" value="fab-creative-commons-by"><path fill="currentColor" d="M314.9 194.4v101.4h-28.3v120.5h-77.1V295.9h-28.3V194.4c0-4.4 1.6-8.2 4.6-11.3 3.1-3.1 6.9-4.7 11.3-4.7H299c4.1 0 7.8 1.6 11.1 4.7 3.1 3.2 4.8 6.9 4.8 11.3zm-101.5-63.7c0-23.3 11.5-35 34.5-35s34.5 11.7 34.5 35c0 23-11.5 34.5-34.5 34.5s-34.5-11.5-34.5-34.5zM247.6 8C389.4 8 496 118.1 496 256c0 147.1-118.5 248-248.4 248C113.6 504 0 394.5 0 256 0 123.1 104.7 8 247.6 8zm.8 44.7C130.2 52.7 44.7 150.6 44.7 256c0 109.8 91.2 202.8 203.7 202.8 103.2 0 202.8-81.1 202.8-202.8.1-113.8-90.2-203.3-202.8-203.3z"></path></svg><span class="ugb-button--inner" style="color:#111">Button text</span></a></div></div>
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
