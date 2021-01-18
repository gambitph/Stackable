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
		html: `<!-- wp:ugb/feature {"textColor":"#cd2653","imageSize":537,"imageID":17,"imageUrl":"http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg","imageAlt":"","design":"basic","borderRadius":21,"shadow":5} -->
		<div class="wp-block-ugb-feature ugb-feature ugb--background-opacity-5 ugb-feature--design-basic ugb-feature--content-left ugb--shadow-5" style="--image-size:537px;border-radius:21px"><div class="ugb-content-wrapper"><div class="ugb-feature__content"><h2 class="ugb-feature__title" style="color:#cd2653">Title for This Block</h2><p class="ugb-feature__description" style="color:#cd2653">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p><div><a class="ugb-button ugb-button--align-left ugb-button--size-normal" href="" style="border-radius:4px"><span class="ugb-button--inner">Button text</span></a></div></div><div class="ugb-feature__image-side"><img class="ugb-feature__image" src="http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg" alt="Title for This Block"/></div></div></div>
		<!-- /wp:ugb/feature -->`,
	},
	{
		block: 'Feature',
		version: '1.17.2',
		description: 'Fully Modified',
		html: `<!-- wp:ugb/feature {"textColor":"#cd2653","invert":true,"imageSize":100,"imageID":17,"imageUrl":"http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg","imageAlt":"","buttonColor":"#000000","buttonSize":"large","buttonBorderRadius":25,"buttonDesign":"ghost","buttonIcon":"fab-accessible-icon","backgroundColorType":"gradient","backgroundColor":"#000000","backgroundColor2":"#6d6d6d","backgroundColorDirection":170,"design":"basic","borderRadius":0,"shadow":0} -->
		<div class="wp-block-ugb-feature ugb-feature ugb--background-opacity-5 ugb-feature--design-basic ugb-feature--content-left ugb-feature--invert ugb--has-background ugb--shadow-0 ugb--has-background-gradient" style="--image-size:100px;background-color:#000000;--ugb-background-color:#000000;--ugb-background-color2:#6d6d6d;--ugb-background-direction:170deg;border-radius:0"><div class="ugb-content-wrapper"><div class="ugb-feature__content"><h2 class="ugb-feature__title" style="color:#cd2653">Title for This Block</h2><p class="ugb-feature__description" style="color:#cd2653">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p><div><a class="ugb-button ugb-button--align-left ugb-button--size-large ugb-button--design-ghost ugb-button--has-icon" href="" style="border-radius:25px;border-color:#000000;color:#000000"><svg aria-hidden="true" data-icon="accessible-icon" class="svg-inline--fa ugbfa-accessible-icon fa-w-14 " role="img" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 448 512" style="color:#000000" value="fab-accessible-icon"><path fill="currentColor" d="M423.9 255.8L411 413.1c-3.3 40.7-63.9 35.1-60.6-4.9l10-122.5-41.1 2.3c10.1 20.7 15.8 43.9 15.8 68.5 0 41.2-16.1 78.7-42.3 106.5l-39.3-39.3c57.9-63.7 13.1-167.2-74-167.2-25.9 0-49.5 9.9-67.2 26L73 243.2c22-20.7 50.1-35.1 81.4-40.2l75.3-85.7-42.6-24.8-51.6 46c-30 26.8-70.6-18.5-40.5-45.4l68-60.7c9.8-8.8 24.1-10.2 35.5-3.6 0 0 139.3 80.9 139.5 81.1 16.2 10.1 20.7 36 6.1 52.6L285.7 229l106.1-5.9c18.5-1.1 33.6 14.4 32.1 32.7zm-64.9-154c28.1 0 50.9-22.8 50.9-50.9C409.9 22.8 387.1 0 359 0c-28.1 0-50.9 22.8-50.9 50.9 0 28.1 22.8 50.9 50.9 50.9zM179.6 456.5c-80.6 0-127.4-90.6-82.7-156.1l-39.7-39.7C36.4 287 24 320.3 24 356.4c0 130.7 150.7 201.4 251.4 122.5l-39.7-39.7c-16 10.9-35.3 17.3-56.1 17.3z"></path></svg><span class="ugb-button--inner" style="color:#000000">Button text</span></a></div></div><div class="ugb-feature__image-side"><img class="ugb-feature__image" src="http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg" alt="Title for This Block"/></div></div></div>
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
