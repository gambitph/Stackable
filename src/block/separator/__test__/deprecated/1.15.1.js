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
		html: `<!-- wp:ugb/separator {"design":"wave-3","height":359,"flipVertically":true,"backgroundColor":"#eeeeee","marginTop":-113,"layer1Color":"#cf2e2e","layer1Width":2.2,"layer1Shadow":true} -->
		<div class="wp-block-ugb-separator alignfull ugb-separator ugb-separator--design-wave-3 ugb-separator--flip-vertical" style="background-color:#eeeeee;margin-top:-114px;margin-bottom:-1px" aria-hidden="true"><div class="ugb-separator__top-pad" style="height:0px;background:#eeeeee"></div><div class="ugb-separator__svg-wrapper" style="height:359px"><div class="ugb-separator__svg-inner"><svg viewbox="0 0 1600 200" filter="url(#wave-3-shadow_svg__a)" enablebackground="new 0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" style="fill:#cf2e2e;transform:scaleX(2.2)"><filter id="wave-3-shadow_svg__a"><feGaussianBlur in="SourceAlpha" stddeviation="4"></feGaussianBlur><feComponentTransfer><feFuncA type="linear" slope="0.4"></feFuncA></feComponentTransfer><feMerge><feMergeNode></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><path class="wave-3-shadow_svg__st2" d="M1413.6 161.4c-157.9 0-338.2-37.7-495.1-67.4-215.6-40.8-328.1-44.6-418.2-41.1S317 73.4 188.5 102-10 136.2-10 136.2v10s69.9-5.7 198.5-34.3 221.7-45.7 311.8-49.1 202.6.3 418.2 41.1c156.9 29.7 337.2 67.4 495.1 67.4 127.6 0 196.4-19.4 196.4-19.4v-10s-68.8 19.5-196.4 19.5z"></path></svg><svg viewbox="0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" style="fill:#cf2e2e;transform:scaleX(2.2)"><path class="wave-3_svg__st2" d="M1413.6 161.4c-157.9 0-338.2-37.7-495.1-67.4-215.6-40.8-328.1-44.6-418.2-41.1S317 73.4 188.4 102-10 136.2-10 136.2v74.2h1620v-68.5s-68.8 19.5-196.4 19.5z"></path></svg></div></div><div class="ugb-separator__bottom-pad" style="height:0px;background:#cf2e2e"></div></div>
		<!-- /wp:ugb/separator -->`,
	},
	{
		block: 'Separator',
		version: '1.15.1',
		description: 'Modified settings',
		html: `<!-- wp:ugb/separator {"design":"curve-2","height":101,"flipHorizontally":true,"backgroundColor":"#ff6900","marginBottom":155,"paddingTop":244,"paddingBottom":167,"layer1Flip":true} -->
		<div class="wp-block-ugb-separator alignfull ugb-separator ugb-separator--design-curve-2 ugb-separator--flip-horizontal" style="background-color:#ff6900;margin-top:-1px;margin-bottom:154px" aria-hidden="true"><div class="ugb-separator__top-pad" style="height:244px;background:#ff6900"></div><div class="ugb-separator__svg-wrapper" style="height:101px"><div class="ugb-separator__svg-inner"><svg viewbox="0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" style="transform:scaleX(1) scaleX(-1)"><path class="curve-2_svg__st2" d="M-10 207.6h1620S1430.8 23.8 1138.3 23.8C884 23.8 234.9 140.1-10 197.9v9.7z"></path></svg></div></div><div class="ugb-separator__bottom-pad" style="height:167px"></div></div>
		<!-- /wp:ugb/separator -->`,
	},
	{
		block: 'Separator',
		version: '1.15.1',
		description: 'Modified settings',
		html: `<!-- wp:ugb/separator {"height":385,"flipHorizontally":true,"marginTop":266,"marginBottom":18,"layer1Color":"#ff6900"} -->
		<div class="wp-block-ugb-separator alignfull ugb-separator ugb-separator--design-wave-1 ugb-separator--flip-horizontal" style="margin-top:265px;margin-bottom:17px" aria-hidden="true"><div class="ugb-separator__top-pad" style="height:0px"></div><div class="ugb-separator__svg-wrapper" style="height:385px"><div class="ugb-separator__svg-inner"><svg viewbox="0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" style="fill:#ff6900;transform:scaleX(1)"><path class="wave-1_svg__st2" d="M1341.4 48.9c-182.4 0-254.2 80.4-429.4 80.4-117.8 0-209.7-67.5-393.5-67.5-142.2 0-212.6 38.8-324.6 38.8S-10 64.7-10 64.7V210h1620V102c-110.6-40.2-181-53.1-268.6-53.1z"></path></svg></div></div><div class="ugb-separator__bottom-pad" style="height:0px;background:#ff6900"></div></div>
		<!-- /wp:ugb/separator -->`,
	},
	{
		block: 'Separator',
		version: '1.15.1',
		plan: 'premium',
		description: 'Default block',
		html: `<!-- wp:ugb/separator -->
		<div class="wp-block-ugb-separator alignfull ugb-separator ugb-separator--design-wave-1" style="margin-top:-1px;margin-bottom:-1px" aria-hidden="true"><div class="ugb-separator__top-pad" style="height:0px"></div><div class="ugb-separator__svg-wrapper" style="height:200px"><div class="ugb-separator__svg-inner"><svg viewbox="0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" style="transform:scaleX(1)"><path class="wave-1_svg__st2" d="M1341.4 48.9c-182.4 0-254.2 80.4-429.4 80.4-117.8 0-209.7-67.5-393.5-67.5-142.2 0-212.6 38.8-324.6 38.8S-10 64.7-10 64.7V210h1620V102c-110.6-40.2-181-53.1-268.6-53.1z"></path></svg></div></div><div class="ugb-separator__bottom-pad" style="height:0px"></div></div>
		<!-- /wp:ugb/separator -->`,
	},
	{
		block: 'Separator',
		version: '1.15.1',
		plan: 'premium',
		description: 'Modified settings free only',
		html: `<!-- wp:ugb/separator {"design":"wave-2","height":294,"flipVertically":true,"backgroundColor":"#cf2e2e","layer1Color":"#7bdcb5","layer1Shadow":true} -->
		<div class="wp-block-ugb-separator alignfull ugb-separator ugb-separator--design-wave-2 ugb-separator--flip-vertical" style="background-color:#cf2e2e;margin-top:-1px;margin-bottom:-1px" aria-hidden="true"><div class="ugb-separator__top-pad" style="height:0px;background:#cf2e2e"></div><div class="ugb-separator__svg-wrapper" style="height:294px"><div class="ugb-separator__svg-inner"><svg viewbox="0 0 1600 200" filter="url(#wave-2-shadow_svg__a)" enablebackground="new 0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" style="fill:#7bdcb5;transform:scaleX(1)"><filter id="wave-2-shadow_svg__a"><feGaussianBlur in="SourceAlpha" stddeviation="4"></feGaussianBlur><feComponentTransfer><feFuncA type="linear" slope="0.4"></feFuncA></feComponentTransfer><feMerge><feMergeNode></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><path class="wave-2-shadow_svg__st2" d="M1432.2 67.4c-88.8-16.7-156-5.3-204 8.5s-147.1 62.2-223.1 73.9c-75.4 11.6-164-7.5-275-27.9S571 88.1 456 98.1c-119.7 10.4-224.7 52-294.4 73-94.5 28.5-171.6-3-171.6-3v10s77.1 31.5 171.6 3c69.7-21 174.7-62.6 294.4-73 115-10 163.1 3.4 274.1 23.8 111 20.4 199.6 39.5 275 27.9 76-11.7 175.1-60.1 223.1-73.9s115.2-25.2 204-8.5c91 17.1 124.8 34.2 177.8 24.2v-10c-53 10-86.8-7.1-177.8-24.2z"></path></svg><svg viewbox="0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" style="fill:#7bdcb5;transform:scaleX(1)"><path class="wave-2_svg__st2" d="M1432.2 67.4c-88.8-16.7-156-5.3-204 8.5s-147.1 62.2-223.1 73.9c-75.4 11.6-164-7.5-275-27.9S571 88.1 456 98.1c-119.7 10.4-224.7 52-294.4 73-94.5 28.5-171.6-3-171.6-3V210h1620V91.6c-53 10-86.8-7.1-177.8-24.2z"></path></svg></div></div><div class="ugb-separator__bottom-pad" style="height:0px;background:#7bdcb5"></div></div>
		<!-- /wp:ugb/separator -->`,
	},
	{
		block: 'Separator',
		version: '1.15.1',
		plan: 'premium',
		description: 'Modified settings, default layers',
		html: `<!-- wp:ugb/separator {"design":"curve-2","height":294,"flipVertically":true,"backgroundColor":"#cf2e2e","marginTop":123,"marginBottom":69,"paddingTop":64,"layer1Color":"#7bdcb5","layer1Shadow":true,"layer2":true,"layer3":true} -->
		<div class="wp-block-ugb-separator alignfull ugb-separator ugb-separator--design-curve-2 ugb-separator--flip-vertical" style="background-color:#cf2e2e;margin-top:122px;margin-bottom:68px" aria-hidden="true"><div class="ugb-separator__top-pad" style="height:64px;background:#cf2e2e"></div><div class="ugb-separator__svg-wrapper" style="height:294px"><div class="ugb-separator__svg-inner"><svg viewbox="0 0 1600 200" filter="url(#curve-2-shadow_svg__a)" enablebackground="new 0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" style="fill:#7bdcb5;transform:scaleX(1)"><filter id="curve-2-shadow_svg__a"><feGaussianBlur in="SourceAlpha" stddeviation="4"></feGaussianBlur><feComponentTransfer><feFuncA type="linear" slope="0.4"></feFuncA></feComponentTransfer><feMerge><feMergeNode></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><path class="curve-2-shadow_svg__st2" d="M1138.3 36.2c246.1 0 412 130.1 458.4 171.4h13.3S1430.8 23.8 1138.3 23.8C884 23.8 172 156.9-10 197.9v9.7H2.2C201.7 163.7 889.3 36.2 1138.3 36.2z"></path></svg><svg viewbox="0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" style="fill:#7bdcb5;transform:scaleX(1)"><path class="curve-2_svg__st2" d="M-10 207.6h1620S1430.8 23.8 1138.3 23.8C884 23.8 234.9 140.1-10 197.9v9.7z"></path></svg><svg viewbox="0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" class="ugb-separator__layer-2" style="transform: scaleX(1) scaleY(1);opacity:0.5"><path class="curve-2-layer-2_svg__st1" d="M-10 207.6h1620S1209.4.7 916.9.7C662.6.7 170.5 137.8-10 197.9v9.7z"></path></svg><svg viewbox="0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" class="ugb-separator__layer-3" style="transform: scaleX(1) scaleY(1);opacity:0.5"><path class="curve-2-layer-3_svg__st0" d="M-10 207.6h1620S893.3 9.1 600.8 9.1C346.5 9.1 118.6 134.4-10 197.9v9.7z"></path></svg></div></div><div class="ugb-separator__bottom-pad" style="height:0px;background:#7bdcb5"></div></div>
		<!-- /wp:ugb/separator -->`,
	},
	{
		block: 'Separator',
		version: '1.15.1',
		plan: 'premium',
		description: 'Modified settings, modified layers',
		html: `<!-- wp:ugb/separator {"design":"wave-2","height":294,"flipVertically":true,"marginTop":123,"marginBottom":69,"paddingTop":64,"layer1Shadow":true,"layer2":true,"layer2Color":"#ff6900","layer2Height":1.25,"layer2Width":1.5,"layer2Flip":true,"layer2Opacity":0.3,"layer3":true,"layer3Color":"#7bdcb5","layer3Height":1.31,"layer3Width":2,"layer3Flip":true,"layer3Opacity":0.3} -->
		<div class="wp-block-ugb-separator alignfull ugb-separator ugb-separator--design-wave-2 ugb-separator--flip-vertical" style="margin-top:122px;margin-bottom:68px" aria-hidden="true"><div class="ugb-separator__top-pad" style="height:64px"></div><div class="ugb-separator__svg-wrapper" style="height:294px"><div class="ugb-separator__svg-inner"><svg viewbox="0 0 1600 200" filter="url(#wave-2-shadow_svg__a)" enablebackground="new 0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" style="transform:scaleX(1)"><filter id="wave-2-shadow_svg__a"><feGaussianBlur in="SourceAlpha" stddeviation="4"></feGaussianBlur><feComponentTransfer><feFuncA type="linear" slope="0.4"></feFuncA></feComponentTransfer><feMerge><feMergeNode></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><path class="wave-2-shadow_svg__st2" d="M1432.2 67.4c-88.8-16.7-156-5.3-204 8.5s-147.1 62.2-223.1 73.9c-75.4 11.6-164-7.5-275-27.9S571 88.1 456 98.1c-119.7 10.4-224.7 52-294.4 73-94.5 28.5-171.6-3-171.6-3v10s77.1 31.5 171.6 3c69.7-21 174.7-62.6 294.4-73 115-10 163.1 3.4 274.1 23.8 111 20.4 199.6 39.5 275 27.9 76-11.7 175.1-60.1 223.1-73.9s115.2-25.2 204-8.5c91 17.1 124.8 34.2 177.8 24.2v-10c-53 10-86.8-7.1-177.8-24.2z"></path></svg><svg viewbox="0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" style="transform:scaleX(1)"><path class="wave-2_svg__st2" d="M1432.2 67.4c-88.8-16.7-156-5.3-204 8.5s-147.1 62.2-223.1 73.9c-75.4 11.6-164-7.5-275-27.9S571 88.1 456 98.1c-119.7 10.4-224.7 52-294.4 73-94.5 28.5-171.6-3-171.6-3V210h1620V91.6c-53 10-86.8-7.1-177.8-24.2z"></path></svg><svg viewbox="0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" class="ugb-separator__layer-2" style="transform: scaleX(1.5) scaleX(-1) scaleY(1.25);fill:#ff6900;opacity:0.3"><path d="M1426.1 33.1c-82.7-36.3-161.6-10.7-203.9 13-20.6 11.5-60.2 35.2-101.6 51.9-43.4 17.5-88.1 33.4-126.6 37.3-75.9 7.6-154-5-259-41.3-106.7-36.9-188.2-62-289-46.7-118 18-214.7 91.6-284.4 112.6-94.5 28.5-171.6-3-171.6-3V207h1620V80.4c-53 10-101.9-11.3-183.9-47.3z"></path></svg><svg viewbox="0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" class="ugb-separator__layer-3" style="transform: scaleX(2) scaleX(-1) scaleY(1.31);fill:#7bdcb5;opacity:0.3"><path d="M1426.1 18.8C1343.3-17.5 1268.8 8 1225 28c-23.3 10.7-75.7 34.1-115.3 47.3-44.3 14.8-77.2 25.7-115.7 29.5-75.9 7.6-149.7 1.5-259-30.2-108.4-31.3-188.2-57-289-41.6-118 18-208.7 72.1-278.4 93.1C73.1 154.6-10 116-10 116v90h1620V68.5c-53 10-101.9-13.7-183.9-49.7z"></path></svg></div></div><div class="ugb-separator__bottom-pad" style="height:0px"></div></div>
		<!-- /wp:ugb/separator -->`,
	},
	{
		block: 'Separator',
		version: '1.15.1',
		plan: 'premium',
		description: 'Custom CSS',
		html: `<!-- wp:ugb/separator {"customCSSUniqueID":"ugb-f781bfe","customCSS":"/* Separator container */\n.ugb-separator {\n\tbackground: navy;\n\topacity: 0.8;\n}\n\n/* Separator SVG wrapper */\n.ugb-separator .ugb-separator__svg-wrapper {\n\t\n}\n\n/* SVG Layer 1 (top layer) */\n.ugb-separator .ugb-separator__layer-1 {\n\n}\n\n/* SVG Layer 1 Shadow */\n.ugb-separator .ugb-separator__shadow {\n\t\n}\n\n/* SVG Layer 2 */\n.ugb-separator .ugb-separator__layer-2 {\n\t\n}\n\n/* SVG Layer 3 */\n.ugb-separator .ugb-separator__layer-3 {\n\t\n}\n\n/* Top padding */\n.ugb-separator .ugb-separator__top-pad {\n\t\n}\n\n/* Bottom padding */\n.ugb-separator .ugb-separator__bottom-pad {\n\t\n}","customCSSCompiled":".ugb-f781bfe.ugb-separator{background:navy !important;opacity:0.8 !important}"} -->
		<div class="wp-block-ugb-separator alignfull ugb-separator ugb-separator--design-wave-1 ugb-f781bfe" style="margin-top:-1px;margin-bottom:-1px" aria-hidden="true"><style>.ugb-f781bfe.ugb-separator{background:navy !important;opacity:0.8 !important}</style><div class="ugb-separator__top-pad" style="height:0px"></div><div class="ugb-separator__svg-wrapper" style="height:200px"><div class="ugb-separator__svg-inner"><svg viewbox="0 0 1600 200" xmlns="http://www.w3.org/2000/svg" preserveaspectratio="none" style="transform:scaleX(1)"><path class="wave-1_svg__st2" d="M1341.4 48.9c-182.4 0-254.2 80.4-429.4 80.4-117.8 0-209.7-67.5-393.5-67.5-142.2 0-212.6 38.8-324.6 38.8S-10 64.7-10 64.7V210h1620V102c-110.6-40.2-181-53.1-268.6-53.1z"></path></svg></div></div><div class="ugb-separator__bottom-pad" style="height:0px"></div></div>
		<!-- /wp:ugb/separator -->`,
	},
]
