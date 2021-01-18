/**
 * This file contains saved block HTML from older versions.
 * These will be tested if they pass migration.
 * This will be built into the dist folder as `deprecation-tests.json`
 */

module.exports = [
	{
		block: 'Call to Action',
		version: '1.15.5',
		description: 'Default block',
		html: `<!-- wp:ugb/cta -->
		<div class="wp-block-ugb-cta ugb-cta ugb--background-opacity-5"><div class="ugb-content-wrapper"><h3 class="ugb-cta__title">Title for This Block</h3><p class="ugb-cta__description">Description for this block. Use this space for describing your block. Any text will do.</p><div><a class="ugb-button ugb-button--align-center ugb-button--size-normal" href="" style="border-radius:4px"><span class="ugb-button--inner">Button text</span></a></div></div></div>
		<!-- /wp:ugb/cta -->`,
	},
	{
		block: 'Call to Action',
		version: '1.15.5',
		description: 'Modified block',
		html: `<!-- wp:ugb/cta {"titleColor":"#ff6900","bodyTextColor":"#0693e3","backgroundColor":"#7bdcb5","borderRadius":41,"shadow":7} -->
		<div class="wp-block-ugb-cta ugb-cta ugb--background-opacity-5 ugb--shadow-7 ugb--has-background" style="background-color:#7bdcb5;border-radius:41px"><div class="ugb-content-wrapper"><h3 class="ugb-cta__title" style="color:#ff6900">Title for This Block</h3><p class="ugb-cta__description" style="color:#0693e3">Description for this block. Use this space for describing your block. Any text will do.</p><div><a class="ugb-button ugb-button--align-center ugb-button--size-normal" href="" style="border-radius:4px"><span class="ugb-button--inner">Button text</span></a></div></div></div>
		<!-- /wp:ugb/cta -->`,
	},
	{
		block: 'Call to Action',
		version: '1.15.5',
		description: 'Modified text',
		html: `<!-- wp:ugb/cta -->
		<div class="wp-block-ugb-cta ugb-cta ugb--background-opacity-5"><div class="ugb-content-wrapper"><h3 class="ugb-cta__title">Title for Tewq ehis Block</h3><p class="ugb-cta__description">Modified description</p><div><a class="ugb-button ugb-button--align-center ugb-button--size-normal" href="http://google.com" style="border-radius:4px" target="_blank" rel="noopener noreferrer"><span class="ugb-button--inner">Download now</span></a></div></div></div>
		<!-- /wp:ugb/cta -->`,
	},
	{
		block: 'Call to Action',
		version: '1.15.5',
		description: 'Modified button & background block',
		html: `<!-- wp:ugb/cta {"buttonDesign":"ghost","color":"#eeeeee","size":"medium","borderButtonRadius":29,"backgroundColorType":"gradient","backgroundColor":"#ff6900","backgroundColor2":"#fcb900","backgroundColorDirection":90,"backgroundImageID":746,"backgroundImageURL":"https://demo.wpstackable.com/wp-content/uploads/2019/02/Elephant-02-Image-Box.jpg","backgroundOpacity":9,"buttonIcon":"fab-behance-square","hoverEffect":"lift-shadow"} -->
		<div class="wp-block-ugb-cta ugb-cta ugb--background-opacity-9 ugb--has-background ugb--has-background-image ugb--has-background-gradient ugb--hover-lift-shadow" style="background-color:#ff6900;background-image:url(https://demo.wpstackable.com/wp-content/uploads/2019/02/Elephant-02-Image-Box.jpg);--ugb-background-color:#ff6900;--ugb-background-color2:#fcb900;--ugb-background-direction:90deg"><div class="ugb-content-wrapper"><h3 class="ugb-cta__title">Title for This Block</h3><p class="ugb-cta__description">Description for this block. Use this space for describing your block. Any text will do.</p><div><a class="ugb-button ugb-button--align-center ugb-button--size-medium ugb-button--design-ghost ugb-button--has-icon" href="" style="border-radius:29px;border-color:#eeeeee;color:#eeeeee"><svg aria-hidden="true" data-icon="behance-square" class="svg-inline--fa ugbfa-behance-square fa-w-14 " role="img" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 448 512" style="color:#eeeeee" value="fab-behance-square"><path fill="currentColor" d="M186.5 293c0 19.3-14 25.4-31.2 25.4h-45.1v-52.9h46c18.6.1 30.3 7.8 30.3 27.5zm-7.7-82.3c0-17.7-13.7-21.9-28.9-21.9h-39.6v44.8H153c15.1 0 25.8-6.6 25.8-22.9zm132.3 23.2c-18.3 0-30.5 11.4-31.7 29.7h62.2c-1.7-18.5-11.3-29.7-30.5-29.7zM448 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48zM271.7 185h77.8v-18.9h-77.8V185zm-43 110.3c0-24.1-11.4-44.9-35-51.6 17.2-8.2 26.2-17.7 26.2-37 0-38.2-28.5-47.5-61.4-47.5H68v192h93.1c34.9-.2 67.6-16.9 67.6-55.9zM380 280.5c0-41.1-24.1-75.4-67.6-75.4-42.4 0-71.1 31.8-71.1 73.6 0 43.3 27.3 73 71.1 73 33.2 0 54.7-14.9 65.1-46.8h-33.7c-3.7 11.9-18.6 18.1-30.2 18.1-22.4 0-34.1-13.1-34.1-35.3h100.2c.1-2.3.3-4.8.3-7.2z"></path></svg><span class="ugb-button--inner" style="color:#eeeeee">Button text</span></a></div></div></div>
		<!-- /wp:ugb/cta -->`,
	},
	{
		block: 'Call to Action',
		version: '1.15.5',
		description: 'From Demo',
		plan: 'premium',
		html: `<!-- wp:ugb/cta {"buttonDesign":"ghost","color":"#d1e05a","titleColor":"#d1e05a","bodyTextColor":"#a3a3a3","borderButtonRadius":50,"backgroundColorType":"gradient","backgroundColor":"#260737","backgroundImageID":373,"backgroundImageURL":"https://demo.wpstackable.com/wp-content/uploads/2019/02/Street-Night-2.jpg","backgroundOpacity":7,"fixedBackground":true,"contentWidth":true,"design":"split-centered","shadow":5,"align":"wide","hoverEffect":"scale"} -->
		<div class="wp-block-ugb-cta alignwide ugb-cta ugb--background-opacity-7 ugb-cta--design-split-centered ugb--shadow-5 ugb--has-background ugb--has-background-image ugb--has-background-gradient ugb--hover-scale" style="background-attachment:fixed;background-color:#260737;background-image:url(https://demo.wpstackable.com/wp-content/uploads/2019/02/Street-Night-2.jpg);--ugb-background-color:#260737;--ugb-background-direction:0deg"><div class="ugb-content-wrapper"><h3 class="ugb-cta__title" style="color:#d1e05a">Call to Action Block</h3><p class="ugb-cta__description" style="color:#a3a3a3">Persuade your visitors to perform an action. </p><div><a class="ugb-button ugb-button--align-center ugb-button--size-normal ugb-button--design-ghost" href="" style="border-radius:50px;border-color:#d1e05a;color:#d1e05a"><span class="ugb-button--inner" style="color:#d1e05a">Get now</span></a></div></div></div>
		<!-- /wp:ugb/cta -->`,
	},
	{
		block: 'Call to Action',
		version: '1.15.5',
		description: 'From Demo',
		plan: 'premium',
		html: `<!-- wp:ugb/cta {"color":"#8b3aca","titleColor":"#ffffff","bodyTextColor":"#ffffff","backgroundColor":"#ff6900","backgroundImageID":672,"backgroundImageURL":"https://demo.wpstackable.com/wp-content/uploads/2019/02/Gradient-CTA.jpg","backgroundOpacity":0,"design":"horizontal-2","borderRadius":46,"shadow":9,"align":"wide","hoverEffect":"lift"} -->
		<div class="wp-block-ugb-cta alignwide ugb-cta ugb--background-opacity-0 ugb-cta--design-horizontal-2 ugb--shadow-9 ugb--has-background ugb--has-background-image ugb--hover-lift" style="background-color:#ff6900;background-image:url(https://demo.wpstackable.com/wp-content/uploads/2019/02/Gradient-CTA.jpg);--ugb-background-color:#ff6900;border-radius:46px"><div class="ugb-content-wrapper"><h3 class="ugb-cta__title" style="color:#ffffff">Escape to our Paradise</h3><p class="ugb-cta__description" style="color:#ffffff">This is your next dream destination</p><div><a class="ugb-button ugb-button--align-center ugb-button--size-normal" href="" style="border-radius:4px;background-color:#8b3aca"><span class="ugb-button--inner">Book now</span></a></div></div></div>
		<!-- /wp:ugb/cta -->`,
	},
	{
		block: 'Call to Action',
		version: '1.15.5',
		description: 'From Demo',
		plan: 'premium',
		html: `<!-- wp:ugb/cta {"color":"#7bdcb5","textColor":"#313131","titleColor":"#7bdcb5","bodyTextColor":"#ffffff","borderButtonRadius":1,"backgroundType":"video","backgroundImageID":678,"backgroundImageURL":"https://demo.wpstackable.com/wp-content/uploads/2019/02/Fireworks-CTA.mp4","design":"horizontal-3","hoverEffect":"lower"} -->
		<div class="wp-block-ugb-cta ugb-cta ugb--background-opacity-5 ugb-cta--design-horizontal-3 ugb--has-background ugb--has-background-image ugb--has-background-video ugb--hover-lower" style="background-image:url(https://demo.wpstackable.com/wp-content/uploads/2019/02/Fireworks-CTA.mp4)"><video class="ugb-video-background" autoplay muted loop src="https://demo.wpstackable.com/wp-content/uploads/2019/02/Fireworks-CTA.mp4"></video><div class="ugb-content-wrapper"><h3 class="ugb-cta__title" style="color:#7bdcb5">Celebrate a New Chapter with Us</h3><p class="ugb-cta__description" style="color:#ffffff">We can give you the best fireworks.</p><div><a class="ugb-button ugb-button--align-center ugb-button--size-normal" href="" style="border-radius:1px;background-color:#7bdcb5;color:#313131"><span class="ugb-button--inner" style="color:#313131">Contact Us</span></a></div></div></div>
		<!-- /wp:ugb/cta -->`,
	},
	{
		block: 'Call to Action',
		version: '1.15.5',
		description: 'From Demo',
		plan: 'premium',
		html: `<!-- wp:ugb/cta {"color":"#219a6e","borderButtonRadius":50,"backgroundColor":"#ffffff","backgroundImageID":690,"backgroundImageURL":"https://demo.wpstackable.com/wp-content/uploads/2019/02/Plant-CTA-02.jpg","backgroundOpacity":6,"buttonIcon":"fab-wordpress-simple","design":"horizontal","shadow":5,"hoverEffect":"shadow"} -->
		<div class="wp-block-ugb-cta ugb-cta ugb--background-opacity-6 ugb-cta--design-horizontal ugb--shadow-5 ugb--has-background ugb--has-background-image ugb--hover-shadow" style="background-color:#ffffff;background-image:url(https://demo.wpstackable.com/wp-content/uploads/2019/02/Plant-CTA-02.jpg);--ugb-background-color:#ffffff"><div class="ugb-content-wrapper"><h3 class="ugb-cta__title">Make Your Living Space More Alive</h3><p class="ugb-cta__description">Go green with these beauties</p><div><a class="ugb-button ugb-button--align-center ugb-button--size-normal ugb-button--has-icon" href="" style="border-radius:50px;background-color:#219a6e"><svg aria-hidden="true" data-icon="wordpress-simple" class="svg-inline--fa ugbfa-wordpress-simple fa-w-16 " role="img" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 512 512" value="fab-wordpress-simple"><path fill="currentColor" d="M256 8C119.3 8 8 119.2 8 256c0 136.7 111.3 248 248 248s248-111.3 248-248C504 119.2 392.7 8 256 8zM33 256c0-32.3 6.9-63 19.3-90.7l106.4 291.4C84.3 420.5 33 344.2 33 256zm223 223c-21.9 0-43-3.2-63-9.1l66.9-194.4 68.5 187.8c.5 1.1 1 2.1 1.6 3.1-23.1 8.1-48 12.6-74 12.6zm30.7-327.5c13.4-.7 25.5-2.1 25.5-2.1 12-1.4 10.6-19.1-1.4-18.4 0 0-36.1 2.8-59.4 2.8-21.9 0-58.7-2.8-58.7-2.8-12-.7-13.4 17.7-1.4 18.4 0 0 11.4 1.4 23.4 2.1l34.7 95.2L200.6 393l-81.2-241.5c13.4-.7 25.5-2.1 25.5-2.1 12-1.4 10.6-19.1-1.4-18.4 0 0-36.1 2.8-59.4 2.8-4.2 0-9.1-.1-14.4-.3C109.6 73 178.1 33 256 33c58 0 110.9 22.2 150.6 58.5-1-.1-1.9-.2-2.9-.2-21.9 0-37.4 19.1-37.4 39.6 0 18.4 10.6 33.9 21.9 52.3 8.5 14.8 18.4 33.9 18.4 61.5 0 19.1-7.3 41.2-17 72.1l-22.2 74.3-80.7-239.6zm81.4 297.2l68.1-196.9c12.7-31.8 17-57.2 17-79.9 0-8.2-.5-15.8-1.5-22.9 17.4 31.8 27.3 68.2 27.3 107 0 82.3-44.6 154.1-110.9 192.7z"></path></svg><span class="ugb-button--inner">Request for quote</span></a></div></div></div>
		<!-- /wp:ugb/cta -->`,
	},
	{
		block: 'Call to Action',
		version: '1.15.5',
		description: 'Custom CSS',
		plan: 'premium',
		html: `<!-- wp:ugb/cta {"customCSSUniqueID":"ugb-9344fd3","customCSS":"/* Call to action container */\n.ugb-cta {\n\tbackground: red;\n}\n\n/* Call to action content wrapper */\n.ugb-cta .ugb-content-wrapper {\n}\n\n/* Call to action title */\n.ugb-cta .ugb-cta__title {\n\t\n}\n\n/* Call to action description */\n.ugb-cta .ugb-cta__description {\n\t\n}\n\n/* Call to action button */\n.ugb-cta .ugb-button {\n\t\n}\n\n/* Call to action button text */\n.ugb-cta .ugb-button\u002d\u002dinner {\n\t\n}","customCSSCompiled":".ugb-9344fd3.ugb-cta{background:red !important}"} -->
		<div class="wp-block-ugb-cta ugb-cta ugb--background-opacity-5 ugb-9344fd3"><style>.ugb-9344fd3.ugb-cta{background:red !important}</style><div class="ugb-content-wrapper"><h3 class="ugb-cta__title">Title for This Block</h3><p class="ugb-cta__description">Description for this block. Use this space for describing your block. Any text will do.</p><div><a class="ugb-button ugb-button--align-center ugb-button--size-normal" href="" style="border-radius:4px"><span class="ugb-button--inner">Button text</span></a></div></div></div>
		<!-- /wp:ugb/cta -->`,
	},
]
