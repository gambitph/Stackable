/**
 * This file contains saved block HTML from older versions.
 * These will be tested if they pass migration.
 * This will be built into the dist folder as `deprecation-tests.json`
 */

module.exports = [
	{
		block: 'Separator',
		version: '1.15.1',
		description: 'Default block',
		html: `<!-- wp:ugb/separator -->
<div class="wp-block-ugb-separator alignfull ugb-separator ugb-separator--design-wave-1" style="margin-top:-1px;margin-bottom:-1px" aria-hidden="true"><div class="ugb-separator__top-pad" style="height:0px"></div><div class="ugb-separator__svg-wrapper" style="height:200px"><div class="ugb-separator__svg-inner"><svg viewbox="0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" style="transform:scaleX(1)"><path class="wave-1_svg__st2" d="M1341.4 48.9c-182.4 0-254.2 80.4-429.4 80.4-117.8 0-209.7-67.5-393.5-67.5-142.2 0-212.6 38.8-324.6 38.8S-10 64.7-10 64.7V210h1620V102c-110.6-40.2-181-53.1-268.6-53.1z"></path></svg></div></div><div class="ugb-separator__bottom-pad" style="height:0px"></div></div>
<!-- /wp:ugb/separator -->`,
	},
	{
		block: 'Separator',
		version: '1.15.1',
		description: 'Modified settings',
		html: `<!-- wp:ugb/separator {"design":"wave-3","height":276,"flipVertically":true,"backgroundColor":"#cf2e2e","marginTop":179,"marginBottom":-214,"paddingTop":75,"paddingBottom":99,"layer1Color":"#fcb900","layer1Width":2.1,"layer1Flip":true,"layer1Shadow":true} -->
<div class="wp-block-ugb-separator alignfull ugb-separator ugb-separator--design-wave-3 ugb-separator--flip-vertical" style="background-color:#cf2e2e;margin-top:178px;margin-bottom:-215px" aria-hidden="true"><div class="ugb-separator__top-pad" style="height:75px;background:#cf2e2e"></div><div class="ugb-separator__svg-wrapper" style="height:276px"><div class="ugb-separator__svg-inner"><svg viewbox="0 0 1600 200" filter="url(#wave-3-shadow_svg__a)" enablebackground="new 0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" style="fill:#fcb900;transform:scaleX(2.1) scaleX(-1)"><filter id="wave-3-shadow_svg__a"><feGaussianBlur in="SourceAlpha" stddeviation="4"></feGaussianBlur><feComponentTransfer><feFuncA type="linear" slope="0.4"></feFuncA></feComponentTransfer><feMerge><feMergeNode></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><path class="wave-3-shadow_svg__st2" d="M1413.6 161.4c-157.9 0-338.2-37.7-495.1-67.4-215.6-40.8-328.1-44.6-418.2-41.1S317 73.4 188.5 102-10 136.2-10 136.2v10s69.9-5.7 198.5-34.3 221.7-45.7 311.8-49.1 202.6.3 418.2 41.1c156.9 29.7 337.2 67.4 495.1 67.4 127.6 0 196.4-19.4 196.4-19.4v-10s-68.8 19.5-196.4 19.5z"></path></svg><svg viewbox="0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" style="fill:#fcb900;transform:scaleX(2.1) scaleX(-1)"><path class="wave-3_svg__st2" d="M1413.6 161.4c-157.9 0-338.2-37.7-495.1-67.4-215.6-40.8-328.1-44.6-418.2-41.1S317 73.4 188.4 102-10 136.2-10 136.2v74.2h1620v-68.5s-68.8 19.5-196.4 19.5z"></path></svg></div></div><div class="ugb-separator__bottom-pad" style="height:99px;background:#fcb900"></div></div>
<!-- /wp:ugb/separator -->`,
	},
	{
		block: 'Separator',
		version: '1.15.1',
		description: 'Modified settings',
		html: `<!-- wp:ugb/separator {"design":"slant-2","height":211,"marginTop":-200,"marginBottom":76,"layer1Color":"#ffffff","layer2":true,"layer2Color":"#ff7474","layer2Height":1.34,"layer3Height":0.85,"layer3Opacity":0.4} -->
<div class="wp-block-ugb-separator alignfull ugb-separator ugb-separator--design-slant-2" style="margin-top:-201px;margin-bottom:75px" aria-hidden="true"><div class="ugb-separator__top-pad" style="height:0px"></div><div class="ugb-separator__svg-wrapper" style="height:211px"><div class="ugb-separator__svg-inner"><svg viewbox="0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" style="fill:#ffffff;transform:scaleX(1)"><path class="slant-2_svg__st1" d="M1610 39.2V209H-10V39.2l810 118.9 810-118.9z"></path></svg><svg viewbox="0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" class="ugb-separator__layer-2" style="transform: scaleX(1) scaleY(1.34);fill:#ff7474;opacity:0.5"><path class="slant-2-layer-2_svg__st0" d="M1610 22.9V209H-10V22.9l810 118.9 810-118.9z"></path></svg></div></div><div class="ugb-separator__bottom-pad" style="height:0px;background:#ffffff"></div></div>
<!-- /wp:ugb/separator -->`,
	},
	{
		block: 'Separator',
		version: '1.15.1',
		description: 'Modified settings',
		html: `<!-- wp:ugb/separator {"design":"slant-1","marginTop":-85,"marginBottom":24,"layer1Color":"#0a7be1","layer1Shadow":true,"layer2":true,"layer2Color":"#ffb66e","layer2Opacity":0.7,"layer3":true,"layer3Color":"#17dae0","layer3Height":1.01} -->
		<div class="wp-block-ugb-separator alignfull ugb-separator ugb-separator--design-slant-1" style="margin-top:-86px;margin-bottom:23px" aria-hidden="true"><div class="ugb-separator__top-pad" style="height:0px"></div><div class="ugb-separator__svg-wrapper" style="height:200px"><div class="ugb-separator__svg-inner"><svg viewbox="0 0 1600 200" filter="url(#slant-1-shadow_svg__a)" enablebackground="new 0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" style="fill:#0a7be1;transform:scaleX(1)"><filter id="slant-1-shadow_svg__a"><feGaussianBlur in="SourceAlpha" stddeviation="4"></feGaussianBlur><feComponentTransfer><feFuncA type="linear" slope="0.4"></feFuncA></feComponentTransfer><feMerge><feMergeNode></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><path class="slant-1-shadow_svg__st2" d="M-10 183.9v10L1610 10.5V.5z"></path></svg><svg viewbox="0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" style="fill:#0a7be1;transform:scaleX(1)"><path class="slant-1_svg__st2" d="M-10 210h1620V.5L-10 183.9z"></path></svg><svg viewbox="0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" class="ugb-separator__layer-2" style="transform: scaleX(1) scaleY(1);fill:#ffb66e;opacity:0.7"><path d="M-10 146v61h1285.5V.5z"></path></svg><svg viewbox="0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" class="ugb-separator__layer-3" style="transform: scaleX(1) scaleY(1.01);fill:#17dae0;opacity:0.5"><path d="M-10 58.2V209h1296.9z"></path></svg></div></div><div class="ugb-separator__bottom-pad" style="height:0px;background:#0a7be1"></div></div>
		<!-- /wp:ugb/separator -->`,
	},
	{
		block: 'Separator',
		version: '1.15.1',
		description: 'Modified settings with Custom CSS',
		html: `<!-- wp:ugb/separator {"design":"slant-2","marginTop":163,"layer1Color":"#0693e3","layer3":true,"layer3Color":"#cf2e2e","customCSSUniqueID":"ugb-70a8276","customCSS":"/* Separator container */\n.ugb-separator {\n\tbackground: #ddd;\n}\n\n/* Separator SVG wrapper */\n.ugb-separator .ugb-separator__svg-wrapper {\n\t\n}\n\n/* SVG Layer 1 (top layer) */\n.ugb-separator .ugb-separator__layer-1 {\n\t\n}\n\n/* SVG Layer 1 Shadow */\n.ugb-separator .ugb-separator__shadow {\n\t\n}\n\n/* SVG Layer 2 */\n.ugb-separator .ugb-separator__layer-2 {\n\t\n}\n\n/* SVG Layer 3 */\n.ugb-separator .ugb-separator__layer-3 {\n\topacity: 0.5;\n}\n\n/* Top padding */\n.ugb-separator .ugb-separator__top-pad {\n\t\n}\n\n/* Bottom padding */\n.ugb-separator .ugb-separator__bottom-pad {\n\t\n}","customCSSCompiled":".ugb-70a8276.ugb-separator{background:#ddd !important}.ugb-70a8276.ugb-separator .ugb-separator__layer-3{opacity:0.5 !important}"} -->
		<div class="wp-block-ugb-separator alignfull ugb-separator ugb-separator--design-slant-2 ugb-70a8276" style="margin-top:162px;margin-bottom:-1px" aria-hidden="true"><style>.ugb-70a8276.ugb-separator{background:#ddd !important}.ugb-70a8276.ugb-separator .ugb-separator__layer-3{opacity:0.5 !important}</style><div class="ugb-separator__top-pad" style="height:0px"></div><div class="ugb-separator__svg-wrapper" style="height:200px"><div class="ugb-separator__svg-inner"><svg viewbox="0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" style="fill:#0693e3;transform:scaleX(1)"><path class="slant-2_svg__st1" d="M1610 39.2V209H-10V39.2l810 118.9 810-118.9z"></path></svg><svg viewbox="0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" class="ugb-separator__layer-3" style="transform: scaleX(1) scaleY(1);fill:#cf2e2e;opacity:0.5"><path class="slant-2-layer-3_svg__st0" d="M1610 146.6V209H-10v-62.4l810-89.3 810 89.3z"></path></svg></div></div><div class="ugb-separator__bottom-pad" style="height:0px;background:#0693e3"></div></div>
		<!-- /wp:ugb/separator -->`,
	},
	{
		block: 'Separator',
		version: '1.15.1',
		description: 'Separator color & small width',
		html: `<!-- wp:ugb/separator {"align":"","design":"slant-2","height":139,"flipVertically":true,"marginTop":209,"layer1Color":"#cf2e2e","layer1Width":2.6,"layer1Shadow":true} -->
<div class="wp-block-ugb-separator ugb-separator ugb-separator--design-slant-2 ugb-separator--flip-vertical" style="margin-top:208px;margin-bottom:-1px" aria-hidden="true"><div class="ugb-separator__top-pad" style="height:0px"></div><div class="ugb-separator__svg-wrapper" style="height:139px"><div class="ugb-separator__svg-inner"><svg viewbox="0 0 1600 200" filter="url(#slant-2-shadow_svg__a)" enablebackground="new 0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" style="fill:#cf2e2e;transform:scaleX(2.6)"><filter id="slant-2-shadow_svg__a"><feGaussianBlur in="SourceAlpha" stddeviation="4"></feGaussianBlur><feComponentTransfer><feFuncA type="linear" slope="0.4"></feFuncA></feComponentTransfer><feMerge><feMergeNode></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><path class="slant-2-shadow_svg__st1" d="M1610 39.2v12L800 170.1-10 51.2v-12l810 118.9 810-118.9z"></path></svg><svg viewbox="0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" style="fill:#cf2e2e;transform:scaleX(2.6)"><path class="slant-2_svg__st1" d="M1610 39.2V209H-10V39.2l810 118.9 810-118.9z"></path></svg></div></div><div class="ugb-separator__bottom-pad" style="height:0px;background:#cf2e2e"></div></div>
<!-- /wp:ugb/separator -->`,
	},
	{
		block: 'Separator',
		version: '1.15.1',
		description: 'Layer 2 & 3 & Not Fullwidth',
		html: `<!-- wp:ugb/separator {"align":"","height":108,"layer2":true,"layer2Color":"#f78da7","layer2Height":0.84,"layer2Opacity":0.3,"layer3":true,"layer3Color":"#ff6900","layer3Opacity":0.8} -->
		<div class="wp-block-ugb-separator ugb-separator ugb-separator--design-wave-1" style="margin-top:-1px;margin-bottom:-1px" aria-hidden="true"><div class="ugb-separator__top-pad" style="height:0px"></div><div class="ugb-separator__svg-wrapper" style="height:108px"><div class="ugb-separator__svg-inner"><svg viewbox="0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" style="transform:scaleX(1)"><path class="wave-1_svg__st2" d="M1341.4 48.9c-182.4 0-254.2 80.4-429.4 80.4-117.8 0-209.7-67.5-393.5-67.5-142.2 0-212.6 38.8-324.6 38.8S-10 64.7-10 64.7V210h1620V102c-110.6-40.2-181-53.1-268.6-53.1z"></path></svg><svg viewbox="0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" class="ugb-separator__layer-2" style="transform: scaleX(1) scaleY(0.84);fill:#f78da7;opacity:0.3"><path d="M1361.5 65.9c-63.2 0-93.4-27.3-186.7-27.3-83.3 0-127.8 44.5-238.4 44.5-116.3 0-127.8-51.7-234.1-51.7S542.9 84.6 471.1 84.6c-129.3 0-178.1-79-337.5-83.3C60.2-.7-10 14.2-10 14.2l-.9 185.8h1620l.9-162.8c-57.5 0-137.9 28.7-248.5 28.7z"></path></svg><svg viewbox="0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" class="ugb-separator__layer-3" style="transform: scaleX(1) scaleY(1);fill:#ff6900;opacity:0.8"><path d="M1476.4 15.9c-146.5 0-146.5 64.6-285.8 64.6-119.2 0-106.3-53.1-271.4-53.1-93.4 0-125 41.6-231.3 41.6-93.3 0-114.9-43.1-248.4-43.1S183.8 129.3 96.2 129.3H-10V206h1620V37.4s-43.1-21.5-133.6-21.5z"></path></svg></div></div><div class="ugb-separator__bottom-pad" style="height:0px"></div></div>
		<!-- /wp:ugb/separator -->`,
	},
]
