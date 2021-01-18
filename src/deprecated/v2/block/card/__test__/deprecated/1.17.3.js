/**
 * This file contains saved block HTML from older versions.
 * These will be tested if they pass migration.
 * This will be built into the dist folder as `deprecation-tests.json`
 */

module.exports = [
	{
		block: 'Card',
		version: '1.17.3',
		description: 'Default block',
		html: `<!-- wp:ugb/card -->
		<div class="wp-block-ugb-card ugb-card" style="border-radius:12px"><h4 class="ugb-card__title" style="text-align:left">Title for This Block</h4><p class="ugb-card__tagline" style="text-align:left">Subtitle for this block</p><p class="ugb-card__description" style="text-align:left">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p><div><a class="ugb-button ugb-button--align-left ugb-button--size-normal" href="" style="border-radius:4px;color:#ffffff"><span class="ugb-button--inner" style="color:#ffffff">Button text</span></a></div></div>
		<!-- /wp:ugb/card -->`,
	},
	{
		block: 'Card',
		version: '1.17.3',
		description: 'Modified block',
		html: `<!-- wp:ugb/card {"mediaID":17,"headingColor":"#ff6900","taglineColor":"#cf2e2e","desColor":"#fcb900","buttonColor":"#0693e3","buttonIcon":"fab-adversal","size":"large","cornerButtonRadius":50,"buttonDesign":"ghost","design":"plain","borderRadius":39,"shadow":6} -->
		<div class="wp-block-ugb-card ugb-card ugb-card--design-plain"><div class="ugb-card__image-container ugb--shadow-6" style="border-radius:39px;background-image:url(http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg);text-align:left" data-src="http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg"></div><h4 class="ugb-card__title" style="color:#ff6900;text-align:left">Title for This Block</h4><p class="ugb-card__tagline" style="color:#cf2e2e;text-align:left">Subtitle for this block</p><p class="ugb-card__description" style="color:#fcb900;text-align:left">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p><div><a class="ugb-button ugb-button--align-left ugb-button--size-large ugb-button--design-ghost ugb-button--has-icon" href="" style="border-radius:50px;border-color:#0693e3;color:#0693e3"><svg aria-hidden="true" data-icon="adversal" class="svg-inline--fa ugbfa-adversal fa-w-16 " role="img" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 512 512" style="color:#0693e3" value="fab-adversal"><path fill="currentColor" d="M482.1 32H28.7C5.8 32 0 37.9 0 60.9v390.2C0 474.4 5.8 480 28.7 480h453.4c24.4 0 29.9-5.2 29.9-29.7V62.2c0-24.6-5.4-30.2-29.9-30.2zM178.4 220.3c-27.5-20.2-72.1-8.7-84.2 23.4-4.3 11.1-9.3 9.5-17.5 8.3-9.7-1.5-17.2-3.2-22.5-5.5-28.8-11.4 8.6-55.3 24.9-64.3 41.1-21.4 83.4-22.2 125.3-4.8 40.9 16.8 34.5 59.2 34.5 128.5 2.7 25.8-4.3 58.3 9.3 88.8 1.9 4.4.4 7.9-2.7 10.7-8.4 6.7-39.3 2.2-46.6-7.4-1.9-2.2-1.8-3.6-3.9-6.2-3.6-3.9-7.3-2.2-11.9 1-57.4 36.4-140.3 21.4-147-43.3-3.1-29.3 12.4-57.1 39.6-71 38.2-19.5 112.2-11.8 114-30.9 1.1-10.2-1.9-20.1-11.3-27.3zm286.7 222c0 15.1-11.1 9.9-17.8 9.9H52.4c-7.4 0-18.2 4.8-17.8-10.7.4-13.9 10.5-9.1 17.1-9.1 132.3-.4 264.5-.4 396.8 0 6.8 0 16.6-4.4 16.6 9.9zm3.8-340.5v291c0 5.7-.7 13.9-8.1 13.9-12.4-.4-27.5 7.1-36.1-5.6-5.8-8.7-7.8-4-12.4-1.2-53.4 29.7-128.1 7.1-144.4-85.2-6.1-33.4-.7-67.1 15.7-100 11.8-23.9 56.9-76.1 136.1-30.5v-71c0-26.2-.1-26.2 26-26.2 3.1 0 6.6.4 9.7 0 10.1-.8 13.6 4.4 13.6 14.3-.1.2-.1.3-.1.5zm-51.5 232.3c-19.5 47.6-72.9 43.3-90 5.2-15.1-33.3-15.5-68.2.4-101.5 16.3-34.1 59.7-35.7 81.5-4.8 20.6 28.8 14.9 84.6 8.1 101.1zm-294.8 35.3c-7.5-1.3-33-3.3-33.7-27.8-.4-13.9 7.8-23 19.8-25.8 24.4-5.9 49.3-9.9 73.7-14.7 8.9-2 7.4 4.4 7.8 9.5 1.4 33-26.1 59.2-67.6 58.8z"></path></svg><span class="ugb-button--inner" style="color:#0693e3">Button text</span></a></div></div>
		<!-- /wp:ugb/card -->`,
	},
	{
		block: 'Card',
		version: '1.17.3',
		description: 'Modified block',
		html: `<!-- wp:ugb/card {"mediaID":17} -->
		<div class="wp-block-ugb-card ugb-card" style="border-radius:12px"><div class="ugb-card__image-container" style="background-image:url(http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg);text-align:left" data-src="http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg"></div><h4 class="ugb-card__title" style="text-align:left">111111</h4><p class="ugb-card__tagline" style="text-align:left">22222</p><p class="ugb-card__description" style="text-align:left">333333</p><div><a class="ugb-button ugb-button--align-left ugb-button--size-normal" href="#test" style="border-radius:4px;color:#ffffff" target="_blank" rel="noopener noreferrer"><span class="ugb-button--inner" style="color:#ffffff">444444</span></a></div></div>
		<!-- /wp:ugb/card -->`,
	},
	{
		block: 'Card',
		version: '1.17.3',
		description: 'From free demo',
		html: `<!-- wp:ugb/card {"mediaID":2844,"taglineColor":"#f35e5e","buttonColor":"#f35e5e","buttonDesign":"ghost","contentAlign":"center","borderRadius":0,"shadow":1} -->
		<div class="wp-block-ugb-card ugb-card ugb--shadow-1" style="border-radius:0"><div class="ugb-card__image-container" style="background-image:url(https://wpstackable.com/wp-content/uploads/2019/04/Amsterdam-Card.jpg);text-align:center" data-src="https://wpstackable.com/wp-content/uploads/2019/04/Amsterdam-Card.jpg"></div><h4 class="ugb-card__title" style="text-align:center">Amsterdam</h4><p class="ugb-card__tagline" style="color:#f35e5e;text-align:center">Capital City of the Netherlands</p><p class="ugb-card__description" style="text-align:center">Amsterdam is one of the greatest small cities in the world. From canals to world-famous museums and historical sights, it is one of the most romantic and beautiful cities in Europe.</p><div><a class="ugb-button ugb-button--align-center ugb-button--size-normal ugb-button--design-ghost" href="" style="border-radius:4px;border-color:#f35e5e;color:#f35e5e"><span class="ugb-button--inner" style="color:#f35e5e">Book the City Tour</span></a></div></div>
		<!-- /wp:ugb/card -->`,
	},
	{
		block: 'Card',
		version: '1.17.3',
		description: 'From free demo',
		html: `<!-- wp:ugb/card {"mediaID":494,"buttonIcon":"fas-link","buttonTextColor":"#eeeeee","size":"small","cornerButtonRadius":50,"shadow":6} -->
		<div class="wp-block-ugb-card ugb-card ugb--shadow-6" style="border-radius:12px"><div class="ugb-card__image-container" style="background-image:url(https://wpstackable.com/wp-content/uploads/2018/10/pexels-photo-1164675.jpeg);text-align:left" data-src="https://wpstackable.com/wp-content/uploads/2018/10/pexels-photo-1164675.jpeg"></div><h4 class="ugb-card__title" style="text-align:left">Hotel Beat Wave</h4><p class="ugb-card__tagline" style="text-align:left">Party Like It's the Last Night</p><p class="ugb-card__description" style="text-align:left">You will have the greatest time of your life. Every night feels different with a roster of cool musicians, succulent food and drinks, and the best live entertainment you'll ever see.</p><div><a class="ugb-button ugb-button--align-left ugb-button--size-small ugb-button--has-icon" href="" style="border-radius:50px;color:#eeeeee"><svg aria-hidden="true" data-icon="link" class="svg-inline--fa ugbfa-link fa-w-16 " role="img" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 512 512" style="color:#eeeeee" value="fas-link"><path fill="currentColor" d="M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z"></path></svg><span class="ugb-button--inner" style="color:#eeeeee">Join the fun</span></a></div></div>
		<!-- /wp:ugb/card -->`,
	},
	{
		block: 'Card',
		version: '1.17.3',
		description: 'From free demo',
		html: `<!-- wp:ugb/card {"mediaID":2846,"buttonColor":"#00d084","buttonIcon":"fas-arrow-alt-circle-right","size":"tiny","cornerButtonRadius":5,"buttonDesign":"link","design":"plain","borderRadius":30,"shadow":5} -->
		<div class="wp-block-ugb-card ugb-card ugb-card--design-plain"><div class="ugb-card__image-container ugb--shadow-5" style="border-radius:30px;background-image:url(https://wpstackable.com/wp-content/uploads/2019/04/Beauty-Card.jpg);text-align:left" data-src="https://wpstackable.com/wp-content/uploads/2019/04/Beauty-Card.jpg"></div><h4 class="ugb-card__title" style="text-align:left">Beauty</h4><div><a class="ugb-button ugb-button--align-left ugb-button--size-tiny ugb-button--design-link ugb-button--has-icon" href=""><span class="">Learn more</span></a></div></div>
		<!-- /wp:ugb/card -->`,
	},
	{
		block: 'Card',
		version: '1.17.3',
		description: 'Premium demo',
		plan: 'Premium',
		html: `<!-- wp:ugb/card {"mediaID":193,"headingColor":"#fcb900","taglineColor":"#abb8c3","buttonColor":"#fcb900","buttonIcon":"fas-star","buttonTextColor":"#313131","cornerButtonRadius":50,"design":"full","hoverEffect":"lower"} -->
		<div class="wp-block-ugb-card ugb-card ugb-card--design-full ugb--hover-lower" style="border-radius:12px"><div class="ugb-card__image-container" style="background-image:url(https://demo.wpstackable.com/wp-content/uploads/2019/02/Friends-Marshmallow.jpg);text-align:left" data-src="https://demo.wpstackable.com/wp-content/uploads/2019/02/Friends-Marshmallow.jpg"></div><h4 class="ugb-card__title" style="color:#fcb900;text-align:left">Card Block</h4><p class="ugb-card__tagline" style="color:#abb8c3;text-align:left">THE VERSATILE BLOCK</p><p class="ugb-card__description" style="text-align:left">Catch your visitor's attention by elegantly displaying your content with this block.   <br></p><div><a class="ugb-button ugb-button--align-left ugb-button--size-normal ugb-button--has-icon" href="" style="border-radius:50px;background-color:#fcb900;color:#313131"><svg aria-hidden="true" data-icon="star" class="svg-inline--fa ugbfa-star fa-w-18 " role="img" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 576 512" style="color:#313131" value="fas-star"><path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path></svg><span class="ugb-button--inner" style="color:#313131">Try it now</span></a></div></div>
		<!-- /wp:ugb/card -->`,
	},
	{
		block: 'Card',
		version: '1.17.3',
		description: 'Premium demo',
		plan: 'Premium',
		html: `<!-- wp:ugb/card {"mediaID":2844,"headingColor":"#ffffff","taglineColor":"#5ce6bd","desColor":"#ffffff","buttonColor":"#5ce6bd","contentAlign":"center","design":"faded","backgroundColor":"#1d5575","borderRadius":5,"shadow":1,"hoverEffect":"scale"} -->
		<div class="wp-block-ugb-card ugb-card ugb-card--design-faded ugb--shadow-1 ugb--hover-scale" style="border-radius:5px;background-color:#1d5575"><div class="ugb-card__image-container" style="background-image:url(https://wpstackable.com/wp-content/uploads/2019/04/Amsterdam-Card.jpg);text-align:center" data-src="https://wpstackable.com/wp-content/uploads/2019/04/Amsterdam-Card.jpg"></div><h4 class="ugb-card__title" style="color:#ffffff;text-align:center">Amsterdam</h4><p class="ugb-card__tagline" style="color:#5ce6bd;text-align:center">Capital City of the Netherlands</p><p class="ugb-card__description" style="color:#ffffff;text-align:center">Amsterdam is one of the best small cities in the world. From canals to world-famous museums and historical sights, it is one of the romantic and beautiful cities in Europe.</p><div><a class="ugb-button ugb-button--align-center ugb-button--size-normal" href="" style="border-radius:4px;background-color:#5ce6bd;color:#ffffff"><span class="ugb-button--inner" style="color:#ffffff">Book the City Tour</span></a></div></div>
		<!-- /wp:ugb/card -->`,
	},
	{
		block: 'Card',
		version: '1.17.3',
		description: 'Premium demo',
		plan: 'Premium',
		html: `<!-- wp:ugb/card {"mediaID":494,"headingColor":"#eeeeee","buttonIcon":"fas-link","buttonTextColor":"#eeeeee","size":"small","cornerButtonRadius":50,"contentAlign":"center","design":"full","borderRadius":0,"shadow":6,"hoverEffect":"lower"} -->
		<div class="wp-block-ugb-card ugb-card ugb-card--design-full ugb--shadow-6 ugb--hover-lower" style="border-radius:0"><div class="ugb-card__image-container" style="background-image:url(https://wpstackable.com/wp-content/uploads/2018/10/pexels-photo-1164675.jpeg);text-align:center" data-src="https://wpstackable.com/wp-content/uploads/2018/10/pexels-photo-1164675.jpeg"></div><h4 class="ugb-card__title" style="color:#eeeeee;text-align:center">Hotel Beat Wave</h4><p class="ugb-card__tagline" style="text-align:center">Party Like It's the Last Night</p><p class="ugb-card__description" style="text-align:center">You will have the greatest time of your life. Every night feels different with a roster of cool musicians, succulent food and drinks, and the best live entertainment you'll ever see.</p><div><a class="ugb-button ugb-button--align-center ugb-button--size-small ugb-button--has-icon" href="" style="border-radius:50px;color:#eeeeee"><svg aria-hidden="true" data-icon="link" class="svg-inline--fa ugbfa-link fa-w-16 " role="img" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 512 512" style="color:#eeeeee" value="fas-link"><path fill="currentColor" d="M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z"></path></svg><span class="ugb-button--inner" style="color:#eeeeee">Join the fun</span></a></div></div>
		<!-- /wp:ugb/card -->`,
	},
	{
		block: 'Card',
		version: '1.17.3',
		description: 'Premium demo',
		plan: 'Premium',
		html: `<!-- wp:ugb/card {"mediaID":2846,"buttonColor":"#00d084","buttonIcon":"fas-arrow-alt-circle-right","size":"tiny","cornerButtonRadius":5,"buttonDesign":"link","design":"horizontal","borderRadius":30,"shadow":4,"hoverEffect":"shadow"} -->
		<div class="wp-block-ugb-card ugb-card ugb-card--design-horizontal ugb--shadow-4 ugb--hover-shadow" style="border-radius:30px"><div class="ugb-card__image-container" style="background-image:url(https://wpstackable.com/wp-content/uploads/2019/04/Beauty-Card.jpg);text-align:left" data-src="https://wpstackable.com/wp-content/uploads/2019/04/Beauty-Card.jpg"></div><h4 class="ugb-card__title" style="text-align:left">Beauty</h4><div><a class="ugb-button ugb-button--align-left ugb-button--size-tiny ugb-button--design-link ugb-button--has-icon" href=""><span class="">Learn more</span></a></div></div>
		<!-- /wp:ugb/card -->`,
	},
	{
		block: 'Card',
		version: '1.17.3',
		description: 'Effect',
		plan: 'Premium',
		html: `<!-- wp:ugb/card {"mediaID":17,"hoverEffect":"scale-shadow"} -->
		<div class="wp-block-ugb-card ugb-card ugb--hover-scale-shadow" style="border-radius:12px"><div class="ugb-card__image-container" style="background-image:url(http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg);text-align:left" data-src="http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg"></div><h4 class="ugb-card__title" style="text-align:left">Title for This Block</h4><p class="ugb-card__tagline" style="text-align:left">Subtitle for this block</p><p class="ugb-card__description" style="text-align:left">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p><div><a class="ugb-button ugb-button--align-left ugb-button--size-normal" href="" style="border-radius:4px;color:#ffffff"><span class="ugb-button--inner" style="color:#ffffff">Button text</span></a></div></div>
		<!-- /wp:ugb/card -->`,
	},
	{
		block: 'Card',
		version: '1.17.3',
		description: 'Custom CSS',
		plan: 'Premium',
		html: `<!-- wp:ugb/card {"mediaID":17,"customCSSUniqueID":"ugb-3fb9f23","customCSS":"/* Card container */\n.ugb-card {\n\tbackground: red;\n}\n\n/* Card image */\n.ugb-card .ugb-card__image-container {\n\t\n}\n\n/* Card title */\n.ugb-card .ugb-card__title {\n\t\n}\n\n/* Card tagline */\n.ugb-card .ugb-card__tagline {\n\t\n}\n\n/* Card description */\n.ugb-card .ugb-card__description {\n\t\n}\n\n/* Card button */\n.ugb-card .ugb-button {\n\t\n}\n\n/* Card button text */\n.ugb-card .ugb-button\u002d\u002dinner {\n\t\n}","customCSSCompiled":".ugb-3fb9f23.ugb-card{background:red !important}"} -->
		<div class="wp-block-ugb-card ugb-card ugb-3fb9f23" style="border-radius:12px"><style>.ugb-3fb9f23.ugb-card{background:red !important}</style><div class="ugb-card__image-container" style="background-image:url(http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg);text-align:left" data-src="http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg"></div><h4 class="ugb-card__title" style="text-align:left">Title for This Block</h4><p class="ugb-card__tagline" style="text-align:left">Subtitle for this block</p><p class="ugb-card__description" style="text-align:left">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p><div><a class="ugb-button ugb-button--align-left ugb-button--size-normal" href="" style="border-radius:4px;color:#ffffff"><span class="ugb-button--inner" style="color:#ffffff">Button text</span></a></div></div>
		<!-- /wp:ugb/card -->`,
	},
]
