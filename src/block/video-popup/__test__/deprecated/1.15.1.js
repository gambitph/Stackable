/**
 * This file contains saved block HTML from older versions.
 * These will be tested if they pass migration.
 * This will be built into the dist folder as `deprecation-tests.json`
 */

module.exports = [
	{
		block: 'Video Popup',
		version: '1.15.6',
		description: 'Default block',
		html: `<!-- wp:ugb/video-popup -->
		<div class="wp-block-ugb-video-popup ugb-video-popup ugb-video-popup--v2 ugb-video-popup--design-basic ugb-video-popup--button-normal ugb--background-opacity-5 ugb--has-background" style="background-color:#000000"><div class="ugb-video-popup__wrapper"><a href="#" class="ugb-video-popup__overlay"></a><span class="ugb-video-popup__play-button"><svg viewbox="0 0 256 320" xmlns="http://www.w3.org/2000/svg" style="fill:#ffffff" width="30" height="30"><path d="M0 0v320l256-160L0 0z"></path></svg></span></div></div>
		<!-- /wp:ugb/video-popup -->`,
	},
	{
		block: 'Video Popup',
		version: '1.15.6',
		description: 'With Video',
		html: `<!-- wp:ugb/video-popup {"videoLink":"https://www.youtube.com/watch?v=ScMzIvxBSi4"} -->
		<div class="wp-block-ugb-video-popup ugb-video-popup ugb-video-popup--v2 ugb-video-popup--design-basic ugb-video-popup--button-normal ugb--background-opacity-5 ugb--has-background" style="background-color:#000000" data-video="ScMzIvxBSi4"><div class="ugb-video-popup__wrapper"><a href="#" class="ugb-video-popup__overlay"></a><span class="ugb-video-popup__play-button"><svg viewbox="0 0 256 320" xmlns="http://www.w3.org/2000/svg" style="fill:#ffffff" width="30" height="30"><path d="M0 0v320l256-160L0 0z"></path></svg></span></div></div>
		<!-- /wp:ugb/video-popup -->`,
	},
	{
		block: 'Video Popup',
		version: '1.15.6',
		description: 'Modified block',
		html: `<!-- wp:ugb/video-popup {"backgroundColor":"#0073a8","backgroundImageID":9,"backgroundImageURL":"https://placeimg.com/640/480/any","backgroundOpacity":6} -->
		<div class="wp-block-ugb-video-popup ugb-video-popup ugb-video-popup--v2 ugb-video-popup--design-basic ugb-video-popup--button-normal ugb--background-opacity-6 ugb--has-background ugb--has-background-image" style="background-color:#0073a8;background-image:url(https://placeimg.com/640/480/any);--ugb-background-color:#0073a8"><div class="ugb-video-popup__wrapper"><a href="#" class="ugb-video-popup__overlay"></a><span class="ugb-video-popup__play-button"><svg viewbox="0 0 256 320" xmlns="http://www.w3.org/2000/svg" style="fill:#ffffff" width="30" height="30"><path d="M0 0v320l256-160L0 0z"></path></svg></span></div></div>
		<!-- /wp:ugb/video-popup -->`,
	},
	{
		block: 'Video Popup',
		version: '1.15.6',
		description: 'Modified block',
		html: `<!-- wp:ugb/video-popup {"playButtonType":"outline","playButtonColor":"#0073a8","backgroundColor":"#111","backgroundImageID":9,"backgroundImageURL":"https://placeimg.com/640/480/any","backgroundOpacity":9,"borderRadius":0,"shadow":0} -->
		<div class="wp-block-ugb-video-popup ugb-video-popup ugb-video-popup--v2 ugb-video-popup--design-basic ugb-video-popup--button-outline ugb--background-opacity-9 ugb--has-background ugb--has-background-image ugb--shadow-0" style="background-color:#111;background-image:url(https://placeimg.com/640/480/any);--ugb-background-color:#111;border-radius:0"><div class="ugb-video-popup__wrapper"><a href="#" class="ugb-video-popup__overlay"></a><span class="ugb-video-popup__play-button"><svg viewbox="0 0 34 34" xmlns="http://www.w3.org/2000/svg" style="fill:#0073a8" width="50" height="50"><path d="M17 34C7.6 34 0 26.4 0 17S7.6 0 17 0s17 7.6 17 17-7.6 17-17 17zm0-32C8.7 2 2 8.7 2 17s6.7 15 15 15 15-6.7 15-15S25.3 2 17 2z"></path><path d="M12 25.7V8.3L27 17l-15 8.7zm2-14v10.5l9-5.3-9-5.2z"></path></svg></span></div></div>
		<!-- /wp:ugb/video-popup -->`,
	},
	{
		block: 'Video Popup',
		version: '1.15.6',
		description: 'Gradient Background',
		html: `<!-- wp:ugb/video-popup {"playButtonColor":"#111","backgroundColorType":"gradient","backgroundColor":"#767676","backgroundColor2":"#FFF","backgroundColorDirection":120,"align":"full"} -->
		<div class="wp-block-ugb-video-popup alignfull ugb-video-popup ugb-video-popup--v2 ugb-video-popup--design-basic ugb-video-popup--button-normal ugb--background-opacity-5 ugb--has-background ugb--has-background-gradient" style="background-color:#767676;--ugb-background-color:#767676;--ugb-background-color2:#FFF;--ugb-background-direction:120deg"><div class="ugb-video-popup__wrapper"><a href="#" class="ugb-video-popup__overlay"></a><span class="ugb-video-popup__play-button"><svg viewbox="0 0 256 320" xmlns="http://www.w3.org/2000/svg" style="fill:#111" width="30" height="30"><path d="M0 0v320l256-160L0 0z"></path></svg></span></div></div>
		<!-- /wp:ugb/video-popup -->`,
	},
	{
		block: 'Video Popup',
		version: '1.15.6',
		description: 'Gradient Background',
		html: `<!-- wp:ugb/video-popup {"backgroundType":"video","backgroundImageID":41,"backgroundImageURL":"http://localhost2:8888/wp-content/uploads/2019/07/Pexels-Videos-1509175.mp4"} -->
		<div class="wp-block-ugb-video-popup ugb-video-popup ugb-video-popup--v2 ugb-video-popup--design-basic ugb-video-popup--button-normal ugb--background-opacity-5 ugb--has-background ugb--has-background-image ugb--has-background-video" style="background-color:#000000;background-image:url(http://localhost2:8888/wp-content/uploads/2019/07/Pexels-Videos-1509175.mp4);--ugb-background-color:#000000"><video class="ugb-video-background" autoplay muted loop src="http://localhost2:8888/wp-content/uploads/2019/07/Pexels-Videos-1509175.mp4"></video><div class="ugb-video-popup__wrapper"><a href="#" class="ugb-video-popup__overlay"></a><span class="ugb-video-popup__play-button"><svg viewbox="0 0 256 320" xmlns="http://www.w3.org/2000/svg" style="fill:#ffffff" width="30" height="30"><path d="M0 0v320l256-160L0 0z"></path></svg></span></div></div>
		<!-- /wp:ugb/video-popup -->`,
	},
	{
		block: 'Video Popup',
		version: '1.15.6',
		description: 'Gradient Background',
		html: `<!-- wp:ugb/video-popup {"backgroundColorType":"gradient","backgroundColor":"#f5efe0","backgroundColor2":"#cd2653","backgroundType":"video","backgroundImageID":41,"backgroundImageURL":"http://localhost2:8888/wp-content/uploads/2019/07/Pexels-Videos-1509175.mp4"} -->
		<div class="wp-block-ugb-video-popup ugb-video-popup ugb-video-popup--v2 ugb-video-popup--design-basic ugb-video-popup--button-normal ugb--background-opacity-5 ugb--has-background ugb--has-background-image ugb--has-background-gradient ugb--has-background-video" style="background-color:#f5efe0;background-image:url(http://localhost2:8888/wp-content/uploads/2019/07/Pexels-Videos-1509175.mp4);--ugb-background-color:#f5efe0;--ugb-background-color2:#cd2653;--ugb-background-direction:0deg"><video class="ugb-video-background" autoplay muted loop src="http://localhost2:8888/wp-content/uploads/2019/07/Pexels-Videos-1509175.mp4"></video><div class="ugb-video-popup__wrapper"><a href="#" class="ugb-video-popup__overlay"></a><span class="ugb-video-popup__play-button"><svg viewbox="0 0 256 320" xmlns="http://www.w3.org/2000/svg" style="fill:#ffffff" width="30" height="30"><path d="M0 0v320l256-160L0 0z"></path></svg></span></div></div>
		<!-- /wp:ugb/video-popup -->`,
	},
	{
		block: 'Video Popup',
		version: '1.15.6',
		description: 'Gradient Background',
		html: `<!-- wp:ugb/video-popup {"backgroundColorType":"gradient","backgroundColor2":"#cd2653","backgroundColorDirection":300,"backgroundType":"video","backgroundImageID":41,"backgroundImageURL":"http://localhost2:8888/wp-content/uploads/2019/07/Pexels-Videos-1509175.mp4","backgroundOpacity":8} -->
		<div class="wp-block-ugb-video-popup ugb-video-popup ugb-video-popup--v2 ugb-video-popup--design-basic ugb-video-popup--button-normal ugb--background-opacity-8 ugb--has-background ugb--has-background-image ugb--has-background-gradient ugb--has-background-video" style="background-color:#000000;background-image:url(http://localhost2:8888/wp-content/uploads/2019/07/Pexels-Videos-1509175.mp4);--ugb-background-color:#000000;--ugb-background-color2:#cd2653;--ugb-background-direction:300deg"><video class="ugb-video-background" autoplay muted loop src="http://localhost2:8888/wp-content/uploads/2019/07/Pexels-Videos-1509175.mp4"></video><div class="ugb-video-popup__wrapper"><a href="#" class="ugb-video-popup__overlay"></a><span class="ugb-video-popup__play-button"><svg viewbox="0 0 256 320" xmlns="http://www.w3.org/2000/svg" style="fill:#ffffff" width="30" height="30"><path d="M0 0v320l256-160L0 0z"></path></svg></span></div></div>
		<!-- /wp:ugb/video-popup -->`,
	},
	{
		block: 'Video Popup',
		version: '1.15.6',
		description: 'Effect',
		plan: 'Premium',
		html: `<!-- wp:ugb/video-popup {"hoverEffect":"lift-shadow"} -->
		<div class="wp-block-ugb-video-popup ugb-video-popup ugb-video-popup--v2 ugb-video-popup--design-basic ugb-video-popup--button-normal ugb--background-opacity-5 ugb--has-background ugb--hover-lift-shadow" style="background-color:#000000"><div class="ugb-video-popup__wrapper"><a href="#" class="ugb-video-popup__overlay"></a><span class="ugb-video-popup__play-button"><svg viewbox="0 0 256 320" xmlns="http://www.w3.org/2000/svg" style="fill:#ffffff" width="30" height="30"><path d="M0 0v320l256-160L0 0z"></path></svg></span></div></div>
		<!-- /wp:ugb/video-popup -->`,
	},
	{
		block: 'Video Popup',
		version: '1.15.6',
		description: 'Custom CSS',
		plan: 'Premium',
		html: `<!-- wp:ugb/video-popup {"customCSSUniqueID":"ugb-28c860e","customCSS":"/* Video Popup container */\n.ugb-video-popup {\n\tbackground: red;\n}\n\n/* Video Popup hover overlay */\n.ugb-video-popup:before {\n\t\n}\n\n/* Video Popup play button overlay wrapper */\n.ugb-video-popup .ugb-video-popup__play-button {\n\t\n}\n\n/* Video Popup play button svg */\n.ugb-video-popup .ugb-video-popup__play-button svg {\n\tfill: yellow;\n}","customCSSCompiled":".ugb-28c860e.ugb-video-popup{background:red !important}.ugb-28c860e.ugb-video-popup .ugb-video-popup__play-button svg{fill:yellow !important}"} -->
		<div class="wp-block-ugb-video-popup ugb-video-popup ugb-video-popup--v2 ugb-video-popup--design-basic ugb-video-popup--button-normal ugb--background-opacity-5 ugb--has-background ugb-28c860e" style="background-color:#000000"><style>.ugb-28c860e.ugb-video-popup{background:red !important}.ugb-28c860e.ugb-video-popup .ugb-video-popup__play-button svg{fill:yellow !important}</style><div class="ugb-video-popup__wrapper"><a href="#" class="ugb-video-popup__overlay"></a><span class="ugb-video-popup__play-button"><svg viewbox="0 0 256 320" xmlns="http://www.w3.org/2000/svg" style="fill:#ffffff" width="30" height="30"><path d="M0 0v320l256-160L0 0z"></path></svg></span></div></div>
		<!-- /wp:ugb/video-popup -->`,
	},
]
