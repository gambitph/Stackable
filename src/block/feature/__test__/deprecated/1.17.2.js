/**
 * This file contains saved block HTML from older versions.
 * These will be tested if they pass migration.
 * This will be built into the dist folder as `deprecation-tests.json`
 */

module.exports = [
	{
		block: 'Feature',
		version: '1.17.2',
		description: 'Default block',
		html: `<!-- wp:ugb/feature -->
		<div class="wp-block-ugb-feature ugb-feature ugb--background-opacity-5 ugb-feature--design-plain ugb-feature--content-left" style="--image-size:400px"><div class="ugb-content-wrapper"><div class="ugb-feature__content"><h2 class="ugb-feature__title">Title for This Block</h2><p class="ugb-feature__description">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p><div><a class="ugb-button ugb-button--align-left ugb-button--size-normal" href="" style="border-radius:4px"><span class="ugb-button--inner">Button text</span></a></div></div><div class="ugb-feature__image-side"></div></div></div>
		<!-- /wp:ugb/feature -->`,
	},
	{
		block: 'Feature',
		version: '1.17.2',
		description: 'Basic w/ Image',
		html: `<!-- wp:ugb/feature {"imageID":17,"imageUrl":"http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg","imageAlt":"","design":"basic"} -->
		<div class="wp-block-ugb-feature ugb-feature ugb--background-opacity-5 ugb-feature--design-basic ugb-feature--content-left" style="--image-size:400px"><div class="ugb-content-wrapper"><div class="ugb-feature__content"><h2 class="ugb-feature__title">Title for This Block</h2><p class="ugb-feature__description">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p><div><a class="ugb-button ugb-button--align-left ugb-button--size-normal" href="" style="border-radius:4px"><span class="ugb-button--inner">Button text</span></a></div></div><div class="ugb-feature__image-side"><img class="ugb-feature__image" src="http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg" alt="Title for This Block"/></div></div></div>
		<!-- /wp:ugb/feature -->`,
	},
	{
		block: 'Feature',
		version: '1.17.2',
		description: 'Text and Colors',
		html: `<!-- wp:ugb/feature {"textColor":"#cf2e2e","imageSize":534,"imageID":17,"imageUrl":"http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg","imageAlt":"","design":"half","borderRadius":31,"shadow":5} -->
		<div class="wp-block-ugb-feature ugb-feature ugb--background-opacity-5 ugb-feature--design-half ugb-feature--content-left ugb--shadow-5" style="--image-size:534px;border-radius:31px"><div class="ugb-content-wrapper"><div class="ugb-feature__content"><h2 class="ugb-feature__title" style="color:#cf2e2e">Title for This Block</h2><p class="ugb-feature__description" style="color:#cf2e2e">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p><div><a class="ugb-button ugb-button--align-left ugb-button--size-normal" href="" style="border-radius:4px"><span class="ugb-button--inner">Button text</span></a></div></div><div class="ugb-feature__image" style="background-image:url(http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg);min-height:534px"></div></div></div>
		<!-- /wp:ugb/feature -->`,
	},
	{
		block: 'Feature',
		version: '1.17.2',
		description: 'Fully Modified',
		html: `<!-- wp:ugb/feature {"textColor":"#cf2e2e","invert":true,"contentAlign":"right","imageSize":534,"imageID":17,"imageUrl":"http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg","imageAlt":"","buttonColor":"#eeeeee","buttonSize":"large","buttonDesign":"ghost","buttonIcon":"fab-amazon","backgroundColorType":"gradient","backgroundColor":"#313131","backgroundColor2":"#abb8c3","backgroundColorDirection":50,"design":"half","borderRadius":31,"shadow":5,"align":"wide"} -->
		<div class="wp-block-ugb-feature alignwide ugb-feature ugb--background-opacity-5 ugb-feature--design-half ugb-feature--content-right ugb-feature--invert ugb--has-background ugb--shadow-5 ugb--has-background-gradient" style="--image-size:534px;background-color:#313131;--ugb-background-color:#313131;--ugb-background-color2:#abb8c3;--ugb-background-direction:50deg;border-radius:31px"><div class="ugb-content-wrapper"><div class="ugb-feature__content ugb--has-background-gradient" style="background-color:#313131;--ugb-background-color:#313131;--ugb-background-color2:#abb8c3;--ugb-background-direction:50deg"><h2 class="ugb-feature__title" style="color:#cf2e2e">Title for This Block</h2><p class="ugb-feature__description" style="color:#cf2e2e">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p><div><a class="ugb-button ugb-button--align-right ugb-button--size-large ugb-button--design-ghost ugb-button--has-icon" href="" style="border-radius:4px;border-color:#eeeeee;color:#eeeeee"><svg aria-hidden="true" data-icon="amazon" class="svg-inline--fa ugbfa-amazon fa-w-14 " role="img" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 448 512" style="color:#eeeeee" value="fab-amazon"><path fill="currentColor" d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z"></path></svg><span class="ugb-button--inner" style="color:#eeeeee">Button text</span></a></div></div><div class="ugb-feature__image" style="background-image:url(http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg);min-height:534px"></div></div></div>
		<!-- /wp:ugb/feature -->`,
	},
	{
		block: 'Feature',
		version: '1.17.2',
		description: 'From Demo 1',
		plan: 'Premium',
		html: `<!-- wp:ugb/feature {"textColor":"#76664e","invert":true,"imageID":99,"imageUrl":"https://demo.wpstackable.com/wp-content/uploads/2019/02/Sea.jpg","imageAlt":"","buttonColor":"#24856a","buttonBorderRadius":50,"backgroundColor":"#f0efec","design":"overlap","shadow":9} -->
		<div class="wp-block-ugb-feature ugb-feature ugb--background-opacity-5 ugb-feature--design-overlap ugb-feature--content-left ugb-feature--invert" style="--image-size:400px"><div class="ugb-content-wrapper"><div class="ugb-feature__content ugb--shadow-9" style="border-radius:12px;background-color:#f0efec"><h2 class="ugb-feature__title" style="color:#76664e">Feature Block</h2><p class="ugb-feature__description" style="color:#76664e">Highlight notable posts with this awesome block</p><div><a class="ugb-button ugb-button--align-left ugb-button--size-normal" href="" style="border-radius:50px;background-color:#24856a"><span class="ugb-button--inner">Try it now</span></a></div></div><div class="ugb-feature__image" style="background-image:url(https://demo.wpstackable.com/wp-content/uploads/2019/02/Sea.jpg);min-height:400px;border-radius:12px"></div></div></div>
		<!-- /wp:ugb/feature -->`,
	},
	{
		block: 'Feature',
		version: '1.17.2',
		description: 'From Demo 2',
		plan: 'Premium',
		html: `<!-- wp:ugb/feature {"textColor":"#ffffff","imageSize":540,"imageID":709,"imageUrl":"https://demo.wpstackable.com/wp-content/uploads/2019/02/Office-Feature.jpg","imageAlt":"","buttonColor":"#ffffff","buttonDesign":"ghost","backgroundColorType":"gradient","backgroundColor":"#bf69d8","backgroundColor2":"#41188c","backgroundColorDirection":180,"backgroundImageID":0,"backgroundImageURL":"","contentWidth":true,"design":"half","shadow":0,"align":"wide"} -->
		<div class="wp-block-ugb-feature alignwide ugb-feature ugb--background-opacity-5 ugb-feature--design-half ugb-feature--content-left ugb--has-background ugb--shadow-0 ugb--has-background-gradient" style="--image-size:540px;background-color:#bf69d8;--ugb-background-color:#bf69d8;--ugb-background-color2:#41188c;--ugb-background-direction:180deg"><div class="ugb-content-wrapper"><div class="ugb-feature__content ugb--has-background-gradient" style="background-color:#bf69d8;--ugb-background-color:#bf69d8;--ugb-background-color2:#41188c;--ugb-background-direction:180deg"><h2 class="ugb-feature__title" style="color:#ffffff">Corporate Office</h2><p class="ugb-feature__description" style="color:#ffffff">Our Corporate Office caters to companies of different sizes, be it large-scale conglomerates to small and medium enterprises. <br><br>Get your own office space at the busy city center now. Visit us at Tower 1 Plaza Central Building East Road<br><br></p><div><a class="ugb-button ugb-button--align-left ugb-button--size-normal ugb-button--design-ghost" href="" style="border-radius:4px;border-color:#ffffff;color:#ffffff"><span class="ugb-button--inner" style="color:#ffffff">Learn more</span></a></div></div><div class="ugb-feature__image" style="background-image:url(https://demo.wpstackable.com/wp-content/uploads/2019/02/Office-Feature.jpg);min-height:540px"></div></div></div>
		<!-- /wp:ugb/feature -->`,
	},
	{
		block: 'Feature',
		version: '1.17.2',
		description: 'From Demo 3',
		plan: 'Premium',
		html: `<!-- wp:ugb/feature {"textColor":"#ffffff","invert":true,"imageID":717,"imageUrl":"https://demo.wpstackable.com/wp-content/uploads/2019/02/Steak-Feature-02.png","imageAlt":"","buttonColor":"#ffcd44","buttonTextColor":"#cf2e2e","buttonBorderRadius":50,"shadow":0,"align":"full"} -->
		<div class="wp-block-ugb-feature alignfull ugb-feature ugb--background-opacity-5 ugb-feature--design-plain ugb-feature--content-left ugb-feature--invert" style="--image-size:400px"><div class="ugb-content-wrapper"><div class="ugb-feature__content"><h2 class="ugb-feature__title" style="color:#ffffff">Our Signature Bowl</h2><p class="ugb-feature__description" style="color:#ffffff">This is the healthiest and most delicious bowl you will ever have. It comes with 12 different fruits and super foods to give you the most balanced meal, leading to overall health and providing the energy that you need everyday.<br><br></p><div><a class="ugb-button ugb-button--align-left ugb-button--size-normal" href="" style="border-radius:50px;background-color:#ffcd44;color:#cf2e2e"><span class="ugb-button--inner" style="color:#cf2e2e">Order Now</span></a></div></div><div class="ugb-feature__image-side"><img class="ugb-feature__image ugb--shadow-0" style="border-radius:12px" src="https://demo.wpstackable.com/wp-content/uploads/2019/02/Steak-Feature-02.png" alt="Our Signature Bowl"/></div></div></div>
		<!-- /wp:ugb/feature -->`,
	},
	{
		block: 'Feature',
		version: '1.17.2',
		description: 'From Demo 4',
		plan: 'Premium',
		html: `<!-- wp:ugb/feature {"textColor":"#ffffff","invert":true,"contentAlign":"center","imageSize":313,"imageID":718,"imageUrl":"https://demo.wpstackable.com/wp-content/uploads/2019/02/Mountain-Feature.jpg","imageAlt":"","buttonColor":"#ffa985","buttonBorderRadius":1,"buttonIcon":"fas-share-alt","backgroundColorType":"gradient","backgroundColor":"#37b2ff","backgroundColor2":"#06cae5","backgroundImageID":2898,"backgroundImageURL":"https://wpstackable.com/wp-content/uploads/2019/04/BG-Feature.jpg","backgroundOpacity":0,"design":"overlap3","borderRadius":10,"shadow":0,"align":"wide"} -->
		<div class="wp-block-ugb-feature alignwide ugb-feature ugb--background-opacity-0 ugb-feature--design-overlap3 ugb-feature--content-center ugb-feature--invert" style="--image-size:313px"><div class="ugb-content-wrapper"><div class="ugb-feature__content ugb--has-background-gradient" style="border-radius:10px;background-color:#37b2ff;--ugb-background-color:#37b2ff;--ugb-background-color2:#06cae5;--ugb-background-direction:0deg"><h2 class="ugb-feature__title" style="color:#ffffff">Capture Every Important Moment<br></h2><div><a class="ugb-button ugb-button--align-center ugb-button--size-normal ugb-button--has-icon" href="" style="border-radius:1px;background-color:#ffa985"><svg aria-hidden="true" data-icon="share-alt" class="svg-inline--fa ugbfa-share-alt fa-w-14 " role="img" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 448 512" value="fas-share-alt"><path fill="currentColor" d="M352 320c-22.608 0-43.387 7.819-59.79 20.895l-102.486-64.054a96.551 96.551 0 0 0 0-41.683l102.486-64.054C308.613 184.181 329.392 192 352 192c53.019 0 96-42.981 96-96S405.019 0 352 0s-96 42.981-96 96c0 7.158.79 14.13 2.276 20.841L155.79 180.895C139.387 167.819 118.608 160 96 160c-53.019 0-96 42.981-96 96s42.981 96 96 96c22.608 0 43.387-7.819 59.79-20.895l102.486 64.054A96.301 96.301 0 0 0 256 416c0 53.019 42.981 96 96 96s96-42.981 96-96-42.981-96-96-96z"></path></svg><span class="ugb-button--inner">Learn More</span></a></div></div><div class="ugb-feature__image" style="background-image:url(https://demo.wpstackable.com/wp-content/uploads/2019/02/Mountain-Feature.jpg);min-height:313px;border-radius:10px"></div></div></div>
		<!-- /wp:ugb/feature -->`,
	},
	{
		block: 'Feature',
		version: '1.17.2',
		description: 'With Effect',
		plan: 'Premium',
		html: `<!-- wp:ugb/feature {"imageID":17,"imageUrl":"http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg","imageAlt":"","design":"basic","hoverEffect":"lift-shadow"} -->
		<div class="wp-block-ugb-feature ugb-feature ugb--background-opacity-5 ugb-feature--design-basic ugb-feature--content-left ugb--hover-lift-shadow" style="--image-size:400px"><div class="ugb-content-wrapper"><div class="ugb-feature__content"><h2 class="ugb-feature__title">Title for This Block</h2><p class="ugb-feature__description">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p><div><a class="ugb-button ugb-button--align-left ugb-button--size-normal" href="" style="border-radius:4px"><span class="ugb-button--inner">Button text</span></a></div></div><div class="ugb-feature__image-side"><img class="ugb-feature__image" src="http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg" alt="Title for This Block"/></div></div></div>
		<!-- /wp:ugb/feature -->`,
	},
	{
		block: 'Feature',
		version: '1.17.2',
		description: 'Custom CSS',
		plan: 'Premium',
		html: `<!-- wp:ugb/feature {"imageID":17,"imageUrl":"http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg","imageAlt":"","design":"basic","customCSSUniqueID":"ugb-ec2c58c","customCSS":"/* Feature container */\n.ugb-feature {\n\tbackground: red;\n}\n\n/* Feature image */\n.ugb-feature .ugb-feature__image {\n\t\n}\n\n/* Feature content wrapper */\n.ugb-feature .ugb-feature__content {\n\t\n}\n\n/* Feature title */\n.ugb-feature .ugb-feature__title {\n\t\n}\n\n/* Feature description */\n.ugb-feature .ugb-feature__description {\n\t\n}\n\n/* Feature button */\n.ugb-feature .ugb-button {\n\t\n}\n\n/* Feature button text */\n.ugb-feature .ugb-button\u002d\u002dinner {\n\t\n}","customCSSCompiled":".ugb-ec2c58c.ugb-feature{background:red !important}"} -->
		<div class="wp-block-ugb-feature ugb-feature ugb--background-opacity-5 ugb-feature--design-basic ugb-feature--content-left ugb-ec2c58c" style="--image-size:400px"><style>.ugb-ec2c58c.ugb-feature{background:red !important}</style><div class="ugb-content-wrapper"><div class="ugb-feature__content"><h2 class="ugb-feature__title">Title for This Block</h2><p class="ugb-feature__description">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p><div><a class="ugb-button ugb-button--align-left ugb-button--size-normal" href="" style="border-radius:4px"><span class="ugb-button--inner">Button text</span></a></div></div><div class="ugb-feature__image-side"><img class="ugb-feature__image" src="http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg" alt="Title for This Block"/></div></div></div>
		<!-- /wp:ugb/feature -->`,
	},
]
