/**
 * This file contains saved block HTML from older versions.
 * These will be tested if they pass migration.
 * This will be built into the dist folder as `deprecation-tests.json`
 */

module.exports = [
	{
		block: 'Blockquote',
		version: '1.17.3',
		description: 'Default block',
		html: `<!-- wp:ugb/blockquote -->
		<blockquote class="wp-block-ugb-blockquote ugb-blockquote ugb-blockquote--v2 ugb--background-opacity-5 ugb-blockquote--design-plain"><div class="ugb-content-wrapper"><svg viewbox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" style="fill:;width:70px;height:70px"><path d="M19.8 9.3C10.5 11.8 4.6 17 2.1 24.8c2.3-3.6 5.6-5.4 9.9-5.4 3.3 0 6 1.1 8.3 3.3 2.2 2.2 3.4 5 3.4 8.3 0 3.2-1.1 5.8-3.3 8-2.2 2.2-5.1 3.2-8.7 3.2-3.7 0-6.5-1.2-8.6-3.5C1 36.3 0 33.1 0 29 0 18.3 6.5 11.2 19.6 7.9l.2 1.4zm26.4 0C36.9 11.9 31 17 28.5 24.8c2.2-3.6 5.5-5.4 9.8-5.4 3.2 0 6 1.1 8.3 3.2 2.3 2.2 3.4 4.9 3.4 8.3 0 3.1-1.1 5.8-3.3 7.9-2.2 2.2-5.1 3.3-8.6 3.3-3.7 0-6.6-1.1-8.6-3.4-2.1-2.3-3.1-5.5-3.1-9.7 0-10.7 6.6-17.8 19.7-21.1l.1 1.4z"></path></svg><p class="ugb-blockquote__text" style="color:">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p></div></blockquote>
		<!-- /wp:ugb/blockquote -->`,
	},
	{
		block: 'Blockquote',
		version: '1.17.3',
		description: 'Modified block',
		html: `<!-- wp:ugb/blockquote {"color":"#0073a8","quoteColor":"#e4f7ff","quotationMark":"square-fat","quotationSize":255,"design":"basic","borderRadius":36,"shadow":8} -->
		<blockquote class="wp-block-ugb-blockquote ugb-blockquote ugb-blockquote--v2 ugb--background-opacity-5 ugb-blockquote--design-basic ugb--shadow-8" style="--quote-color:#e4f7ff;border-radius:36px"><div class="ugb-content-wrapper"><svg viewbox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" style="fill:#e4f7ff;width:255px;height:255px"><path d="M12.5 9.2H19c1.1 0 1.8.2 2.3.7.5.5.7 1.2.7 2.3v3.4c0 1.1-.2 1.8-.7 2.3-.5.5-1.2.7-2.3.7h-5.8c-.7 0-1.3.2-1.7.6-.4.4-.6 1-.6 1.7v1.3H20c1.1 0 1.8.2 2.3.7.5.5.7 1.2.7 2.3v12.5c0 1.1-.2 1.8-.7 2.3-.5.5-1.2.7-2.3.7H3c-1.1 0-1.8-.2-2.3-.7-.5-.4-.7-1.2-.7-2.2V21.9c0-4.3 1.1-7.4 3.4-9.6 2.3-2 5.3-3.1 9.1-3.1zm26.9 0h6.5c1.1 0 1.8.2 2.3.7.5.5.7 1.2.7 2.3v3.4c0 1.1-.2 1.8-.7 2.3-.5.5-1.2.7-2.3.7h-5.8c-.7 0-1.3.2-1.7.6-.4.4-.6 1-.6 1.7v1.3H47c1.1 0 1.8.2 2.3.7.5.5.7 1.2.7 2.3v12.5c0 1.1-.2 1.8-.7 2.3-.5.5-1.2.7-2.3.7H30c-1.1 0-1.8-.2-2.3-.7-.5-.5-.7-1.2-.7-2.3V21.9c0-4.3 1.1-7.4 3.4-9.6 2.2-2 5.2-3.1 9-3.1z"></path></svg><p class="ugb-blockquote__text" style="color:#0073a8">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p></div></blockquote>
		<!-- /wp:ugb/blockquote -->`,
	},
	{
		block: 'Blockquote',
		version: '1.17.3',
		description: 'Full-width basic',
		html: `<!-- wp:ugb/blockquote {"align":"full","backgroundColor":"#0073a8","design":"basic"} -->
		<blockquote class="wp-block-ugb-blockquote alignfull ugb-blockquote ugb-blockquote--v2 ugb--background-opacity-5 ugb-blockquote--design-basic ugb--has-background" style="background-color:#0073a8"><div class="ugb-content-wrapper"><svg viewbox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" style="fill:;width:70px;height:70px"><path d="M19.8 9.3C10.5 11.8 4.6 17 2.1 24.8c2.3-3.6 5.6-5.4 9.9-5.4 3.3 0 6 1.1 8.3 3.3 2.2 2.2 3.4 5 3.4 8.3 0 3.2-1.1 5.8-3.3 8-2.2 2.2-5.1 3.2-8.7 3.2-3.7 0-6.5-1.2-8.6-3.5C1 36.3 0 33.1 0 29 0 18.3 6.5 11.2 19.6 7.9l.2 1.4zm26.4 0C36.9 11.9 31 17 28.5 24.8c2.2-3.6 5.5-5.4 9.8-5.4 3.2 0 6 1.1 8.3 3.2 2.3 2.2 3.4 4.9 3.4 8.3 0 3.1-1.1 5.8-3.3 7.9-2.2 2.2-5.1 3.3-8.6 3.3-3.7 0-6.6-1.1-8.6-3.4-2.1-2.3-3.1-5.5-3.1-9.7 0-10.7 6.6-17.8 19.7-21.1l.1 1.4z"></path></svg><p class="ugb-blockquote__text" style="color:">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p></div></blockquote>
		<!-- /wp:ugb/blockquote -->`,
	},
	{
		block: 'Blockquote',
		version: '1.17.3',
		description: 'Full-width restrict basic',
		html: `<!-- wp:ugb/blockquote {"align":"full","backgroundColor":"#0073a8","contentWidth":true,"design":"basic"} -->
		<blockquote class="wp-block-ugb-blockquote alignfull ugb-blockquote ugb-blockquote--v2 ugb--background-opacity-5 ugb-blockquote--design-basic ugb--has-background ugb-content-width" style="background-color:#0073a8"><div class="ugb-content-wrapper"><svg viewbox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" style="fill:;width:70px;height:70px"><path d="M19.8 9.3C10.5 11.8 4.6 17 2.1 24.8c2.3-3.6 5.6-5.4 9.9-5.4 3.3 0 6 1.1 8.3 3.3 2.2 2.2 3.4 5 3.4 8.3 0 3.2-1.1 5.8-3.3 8-2.2 2.2-5.1 3.2-8.7 3.2-3.7 0-6.5-1.2-8.6-3.5C1 36.3 0 33.1 0 29 0 18.3 6.5 11.2 19.6 7.9l.2 1.4zm26.4 0C36.9 11.9 31 17 28.5 24.8c2.2-3.6 5.5-5.4 9.8-5.4 3.2 0 6 1.1 8.3 3.2 2.3 2.2 3.4 4.9 3.4 8.3 0 3.1-1.1 5.8-3.3 7.9-2.2 2.2-5.1 3.3-8.6 3.3-3.7 0-6.6-1.1-8.6-3.4-2.1-2.3-3.1-5.5-3.1-9.7 0-10.7 6.6-17.8 19.7-21.1l.1 1.4z"></path></svg><p class="ugb-blockquote__text" style="color:">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p></div></blockquote>
		<!-- /wp:ugb/blockquote -->`,
	},
	{
		block: 'Blockquote',
		version: '1.17.3',
		description: 'Background',
		html: `<!-- wp:ugb/blockquote {"backgroundColor":"#0073a8","design":"basic"} -->
		<blockquote class="wp-block-ugb-blockquote ugb-blockquote ugb-blockquote--v2 ugb--background-opacity-5 ugb-blockquote--design-basic ugb--has-background" style="background-color:#0073a8"><div class="ugb-content-wrapper"><svg viewbox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" style="fill:;width:70px;height:70px"><path d="M19.8 9.3C10.5 11.8 4.6 17 2.1 24.8c2.3-3.6 5.6-5.4 9.9-5.4 3.3 0 6 1.1 8.3 3.3 2.2 2.2 3.4 5 3.4 8.3 0 3.2-1.1 5.8-3.3 8-2.2 2.2-5.1 3.2-8.7 3.2-3.7 0-6.5-1.2-8.6-3.5C1 36.3 0 33.1 0 29 0 18.3 6.5 11.2 19.6 7.9l.2 1.4zm26.4 0C36.9 11.9 31 17 28.5 24.8c2.2-3.6 5.5-5.4 9.8-5.4 3.2 0 6 1.1 8.3 3.2 2.3 2.2 3.4 4.9 3.4 8.3 0 3.1-1.1 5.8-3.3 7.9-2.2 2.2-5.1 3.3-8.6 3.3-3.7 0-6.6-1.1-8.6-3.4-2.1-2.3-3.1-5.5-3.1-9.7 0-10.7 6.6-17.8 19.7-21.1l.1 1.4z"></path></svg><p class="ugb-blockquote__text" style="color:">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p></div></blockquote>
		<!-- /wp:ugb/blockquote -->`,
	},
	{
		block: 'Blockquote',
		version: '1.17.3',
		description: 'Background gradient',
		html: `<!-- wp:ugb/blockquote {"backgroundColorType":"gradient","backgroundColor":"#0073a8","backgroundColor2":"#111","backgroundColorDirection":180,"design":"basic"} -->
		<blockquote class="wp-block-ugb-blockquote ugb-blockquote ugb-blockquote--v2 ugb--background-opacity-5 ugb-blockquote--design-basic ugb--has-background ugb--has-background-gradient" style="background-color:#0073a8;--ugb-background-color:#0073a8;--ugb-background-color2:#111;--ugb-background-direction:180deg"><div class="ugb-content-wrapper"><svg viewbox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" style="fill:;width:70px;height:70px"><path d="M19.8 9.3C10.5 11.8 4.6 17 2.1 24.8c2.3-3.6 5.6-5.4 9.9-5.4 3.3 0 6 1.1 8.3 3.3 2.2 2.2 3.4 5 3.4 8.3 0 3.2-1.1 5.8-3.3 8-2.2 2.2-5.1 3.2-8.7 3.2-3.7 0-6.5-1.2-8.6-3.5C1 36.3 0 33.1 0 29 0 18.3 6.5 11.2 19.6 7.9l.2 1.4zm26.4 0C36.9 11.9 31 17 28.5 24.8c2.2-3.6 5.5-5.4 9.8-5.4 3.2 0 6 1.1 8.3 3.2 2.3 2.2 3.4 4.9 3.4 8.3 0 3.1-1.1 5.8-3.3 7.9-2.2 2.2-5.1 3.3-8.6 3.3-3.7 0-6.6-1.1-8.6-3.4-2.1-2.3-3.1-5.5-3.1-9.7 0-10.7 6.6-17.8 19.7-21.1l.1 1.4z"></path></svg><p class="ugb-blockquote__text" style="color:">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p></div></blockquote>
		<!-- /wp:ugb/blockquote -->`,
	},
	{
		block: 'Blockquote',
		version: '1.17.3',
		description: 'Background gradient image',
		html: `<!-- wp:ugb/blockquote {"backgroundColorType":"gradient","backgroundColor":"#0073a8","backgroundColor2":"#111","backgroundColorDirection":160,"backgroundImageID":17,"backgroundImageURL":"http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg","fixedBackground":true,"design":"basic"} -->
		<blockquote class="wp-block-ugb-blockquote ugb-blockquote ugb-blockquote--v2 ugb--background-opacity-5 ugb-blockquote--design-basic ugb--has-background ugb--has-background-image ugb--has-background-gradient" style="background-color:#0073a8;background-image:url(http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg);background-attachment:fixed;--ugb-background-color:#0073a8;--ugb-background-color2:#111;--ugb-background-direction:160deg"><div class="ugb-content-wrapper"><svg viewbox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" style="fill:;width:70px;height:70px"><path d="M19.8 9.3C10.5 11.8 4.6 17 2.1 24.8c2.3-3.6 5.6-5.4 9.9-5.4 3.3 0 6 1.1 8.3 3.3 2.2 2.2 3.4 5 3.4 8.3 0 3.2-1.1 5.8-3.3 8-2.2 2.2-5.1 3.2-8.7 3.2-3.7 0-6.5-1.2-8.6-3.5C1 36.3 0 33.1 0 29 0 18.3 6.5 11.2 19.6 7.9l.2 1.4zm26.4 0C36.9 11.9 31 17 28.5 24.8c2.2-3.6 5.5-5.4 9.8-5.4 3.2 0 6 1.1 8.3 3.2 2.3 2.2 3.4 4.9 3.4 8.3 0 3.1-1.1 5.8-3.3 7.9-2.2 2.2-5.1 3.3-8.6 3.3-3.7 0-6.6-1.1-8.6-3.4-2.1-2.3-3.1-5.5-3.1-9.7 0-10.7 6.6-17.8 19.7-21.1l.1 1.4z"></path></svg><p class="ugb-blockquote__text" style="color:">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p></div></blockquote>
		<!-- /wp:ugb/blockquote -->`,
	},
	{
		block: 'Blockquote',
		version: '1.17.3',
		description: 'From demo',
		html: `<!-- wp:ugb/blockquote {"quoteColor":"#ffdc7b","quotationSize":175} -->
		<blockquote class="wp-block-ugb-blockquote ugb-blockquote ugb-blockquote--v2 ugb--background-opacity-5 ugb-blockquote--design-plain" style="--quote-color:#ffdc7b"><div class="ugb-content-wrapper"><svg viewbox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" style="fill:#ffdc7b;width:175px;height:175px"><path d="M19.8 9.3C10.5 11.8 4.6 17 2.1 24.8c2.3-3.6 5.6-5.4 9.9-5.4 3.3 0 6 1.1 8.3 3.3 2.2 2.2 3.4 5 3.4 8.3 0 3.2-1.1 5.8-3.3 8-2.2 2.2-5.1 3.2-8.7 3.2-3.7 0-6.5-1.2-8.6-3.5C1 36.3 0 33.1 0 29 0 18.3 6.5 11.2 19.6 7.9l.2 1.4zm26.4 0C36.9 11.9 31 17 28.5 24.8c2.2-3.6 5.5-5.4 9.8-5.4 3.2 0 6 1.1 8.3 3.2 2.3 2.2 3.4 4.9 3.4 8.3 0 3.1-1.1 5.8-3.3 7.9-2.2 2.2-5.1 3.3-8.6 3.3-3.7 0-6.6-1.1-8.6-3.4-2.1-2.3-3.1-5.5-3.1-9.7 0-10.7 6.6-17.8 19.7-21.1l.1 1.4z"></path></svg><p class="ugb-blockquote__text" style="color:">It's okay to acknowledge that life can get complicated, but we musn't forget the beauty in its simplicity, too. From the multitude of stars above, to freshly mowed grass in the morning, life is simply wonderful.</p></div></blockquote>
		<!-- /wp:ugb/blockquote -->`,
	},
	{
		block: 'Blockquote',
		version: '1.17.3',
		description: 'From demo',
		html: `<!-- wp:ugb/blockquote {"color":"#313131","quoteColor":"#f78da7","backgroundColor":"#0693e3","quotationMark":"round-fat","quotationSize":90} -->
		<blockquote class="wp-block-ugb-blockquote ugb-blockquote ugb-blockquote--v2 ugb--background-opacity-5 ugb-blockquote--design-plain" style="--quote-color:#f78da7"><div class="ugb-content-wrapper"><svg viewbox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" style="fill:#f78da7;width:90px;height:90px"><path d="M22.3 30.5c0 6-4.8 10.8-10.8 10.8-2.3 0-4.5-.8-6.3-2-.9-.6-1.8-1.4-2.5-2.4-1.8-2.4-2.7-5.4-2.7-9 0-4.5 1.3-8.5 4-11.9 2.7-3.4 6.4-5.8 11.1-7.3v2.8c-2.7 2.2-4.4 5-4.9 8.3.4-.1.9-.1 1.3-.1 6-.1 10.8 4.8 10.8 10.8zm16.9-10.9c-.5 0-.9 0-1.3.1.5-3.3 2.2-6.1 4.9-8.3V8.7c-4.7 1.4-8.4 3.9-11.1 7.3-2.7 3.4-4 7.4-4 11.9 0 3.6.9 6.6 2.7 9 .8 1 1.6 1.8 2.5 2.4 1.8 1.3 3.9 2 6.3 2 6 0 10.8-4.8 10.8-10.8 0-6-4.8-10.9-10.8-10.9z"></path></svg><p class="ugb-blockquote__text" style="color:#313131">i carry your heart with me (i carry it in my heart)i am never without it (anywhere i go you go, my dear; and whatever is done by only me is your doing, my darling)<br><br>- e.e. cummings</p></div></blockquote>
		<!-- /wp:ugb/blockquote -->`,
	},
	{
		block: 'Blockquote',
		version: '1.17.3',
		description: 'From demo',
		html: `<!-- wp:ugb/blockquote {"color":"#eeeeee","quoteColor":"#56ab6e","backgroundColor":"#313131","backgroundType":"video","backgroundImageID":2765,"backgroundImageURL":"https://wpstackable.com/wp-content/uploads/2019/04/Pexels-Videos-1851768.sameformat.mp4","fixedBackground":true,"contentWidth":true,"quotationMark":"square-modern","quotationSize":192} -->
		<blockquote class="wp-block-ugb-blockquote ugb-blockquote ugb-blockquote--v2 ugb--background-opacity-5 ugb-blockquote--design-plain ugb--has-background-video" style="--quote-color:#56ab6e"><div class="ugb-content-wrapper"><svg viewbox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" style="fill:#56ab6e;width:192px;height:192px"><path d="M20.8 44.5H0V23.7L9.3 5.5h7.3L12 23.7h8.8v20.8zm29.2 0H29.2V23.7l9.3-18.1h7.3l-4.6 18.1H50v20.8z"></path></svg><p class="ugb-blockquote__text" style="color:#eeeeee">Try not to become a man of success. Rather become a man of value.<br><em>- Albert Einstein</em></p></div></blockquote>
		<!-- /wp:ugb/blockquote -->`,
	},
	{
		block: 'Blockquote',
		version: '1.17.3',
		description: 'Premium layout',
		plan: 'Premium',
		html: `<!-- wp:ugb/blockquote {"color":"#005075","quoteColor":"#111","quotationMark":"square-fat","quotationSize":219,"design":"centered-quote"} -->
		<blockquote class="wp-block-ugb-blockquote ugb-blockquote ugb-blockquote--v2 ugb--background-opacity-5 ugb-blockquote--design-centered-quote" style="--quote-color:#111"><div class="ugb-content-wrapper"><svg viewbox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" style="fill:#111;width:219px;height:219px"><path d="M12.5 9.2H19c1.1 0 1.8.2 2.3.7.5.5.7 1.2.7 2.3v3.4c0 1.1-.2 1.8-.7 2.3-.5.5-1.2.7-2.3.7h-5.8c-.7 0-1.3.2-1.7.6-.4.4-.6 1-.6 1.7v1.3H20c1.1 0 1.8.2 2.3.7.5.5.7 1.2.7 2.3v12.5c0 1.1-.2 1.8-.7 2.3-.5.5-1.2.7-2.3.7H3c-1.1 0-1.8-.2-2.3-.7-.5-.4-.7-1.2-.7-2.2V21.9c0-4.3 1.1-7.4 3.4-9.6 2.3-2 5.3-3.1 9.1-3.1zm26.9 0h6.5c1.1 0 1.8.2 2.3.7.5.5.7 1.2.7 2.3v3.4c0 1.1-.2 1.8-.7 2.3-.5.5-1.2.7-2.3.7h-5.8c-.7 0-1.3.2-1.7.6-.4.4-.6 1-.6 1.7v1.3H47c1.1 0 1.8.2 2.3.7.5.5.7 1.2.7 2.3v12.5c0 1.1-.2 1.8-.7 2.3-.5.5-1.2.7-2.3.7H30c-1.1 0-1.8-.2-2.3-.7-.5-.5-.7-1.2-.7-2.3V21.9c0-4.3 1.1-7.4 3.4-9.6 2.2-2 5.2-3.1 9-3.1z"></path></svg><p class="ugb-blockquote__text" style="color:#005075">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p></div></blockquote>
		<!-- /wp:ugb/blockquote -->`,
	},
	{
		block: 'Blockquote',
		version: '1.17.3',
		description: 'Premium layout',
		plan: 'Premium',
		html: `<!-- wp:ugb/blockquote {"color":"#111","quoteColor":"#0073a8","quotationMark":"round","quotationSize":194,"design":"highlight"} -->
		<blockquote class="wp-block-ugb-blockquote ugb-blockquote ugb-blockquote--v2 ugb--background-opacity-5 ugb-blockquote--design-highlight ugb-blockquote--dark-text" style="--quote-color:#0073a8;--ugb-box-color:#111"><div class="ugb-content-wrapper"><svg viewbox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" style="fill:#0073a8;width:194px;height:194px"><path d="M9.4 14.6c-2.4 2.9-3.6 5.9-3.6 8.9 0 1.3.2 2.4.5 3.3 1.8-1.4 3.8-2.1 6-2.1 2.9 0 5.3.9 7.3 2.7 2 1.8 3 4.2 3 7.3 0 1.9-.5 3.6-1.4 5.1-.9 1.5-2.2 2.7-3.8 3.6s-3.3 1.3-5.1 1.3c-4.1 0-7.3-1.6-9.5-4.9C.9 36.9 0 33.5 0 29.4c0-5.2 1.4-9.9 4.1-14 2.8-4.1 6.9-7.5 12.5-10l1.5 2.8c-3.3 1.3-6.2 3.5-8.7 6.4zm27.5 0c-2.4 2.9-3.6 5.9-3.6 8.9 0 1.3.2 2.4.5 3.3 1.8-1.4 3.8-2.1 6-2.1 2.9 0 5.4.9 7.4 2.7 2 1.8 3 4.2 3 7.3 0 2.8-1 5.2-3 7.1-2 1.9-4.4 2.9-7.3 2.9-4.1 0-7.3-1.6-9.5-4.9-1.8-2.7-2.8-6.2-2.8-10.3 0-5.2 1.4-9.9 4.1-14 2.8-4.1 6.9-7.5 12.5-10l1.5 2.8c-3.5 1.2-6.4 3.4-8.8 6.3z"></path></svg><span class="ugb-blockquote__highlight-wrap"><p class="ugb-blockquote__text" style="color:#111">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p></span></div></blockquote>
		<!-- /wp:ugb/blockquote -->`,
	},
	{
		block: 'Blockquote',
		version: '1.17.3',
		description: 'From demo',
		plan: 'Premium',
		html: `<!-- wp:ugb/blockquote {"color":"#004181","quoteColor":"#99e4e6","quotationMark":"round-fat","quotationSize":140,"design":"highlight"} -->
		<blockquote class="wp-block-ugb-blockquote ugb-blockquote ugb-blockquote--v2 ugb--background-opacity-5 ugb-blockquote--design-highlight ugb-blockquote--dark-text" style="--quote-color:#99e4e6;--ugb-box-color:#004181"><div class="ugb-content-wrapper"><svg viewbox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" style="fill:#99e4e6;width:140px;height:140px"><path d="M22.3 30.5c0 6-4.8 10.8-10.8 10.8-2.3 0-4.5-.8-6.3-2-.9-.6-1.8-1.4-2.5-2.4-1.8-2.4-2.7-5.4-2.7-9 0-4.5 1.3-8.5 4-11.9 2.7-3.4 6.4-5.8 11.1-7.3v2.8c-2.7 2.2-4.4 5-4.9 8.3.4-.1.9-.1 1.3-.1 6-.1 10.8 4.8 10.8 10.8zm16.9-10.9c-.5 0-.9 0-1.3.1.5-3.3 2.2-6.1 4.9-8.3V8.7c-4.7 1.4-8.4 3.9-11.1 7.3-2.7 3.4-4 7.4-4 11.9 0 3.6.9 6.6 2.7 9 .8 1 1.6 1.8 2.5 2.4 1.8 1.3 3.9 2 6.3 2 6 0 10.8-4.8 10.8-10.8 0-6-4.8-10.9-10.8-10.9z"></path></svg><span class="ugb-blockquote__highlight-wrap"><p class="ugb-blockquote__text" style="color:#004181">Use the Blockquote block to highlight significant parts of a post. This makes sure that your visitors get the right message.</p></span></div></blockquote>
		<!-- /wp:ugb/blockquote -->`,
	},
	{
		block: 'Blockquote',
		version: '1.17.3',
		description: 'From demo',
		plan: 'Premium',
		html: `<!-- wp:ugb/blockquote {"color":"#eeeeee","quoteColor":"#ffdc7b","quotationMark":"round-thick","quotationSize":175,"design":"huge"} -->
		<blockquote class="wp-block-ugb-blockquote ugb-blockquote ugb-blockquote--v2 ugb--background-opacity-5 ugb-blockquote--design-huge" style="--quote-color:#ffdc7b"><div class="ugb-content-wrapper"><svg viewbox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" style="fill:#ffdc7b;width:175px;height:175px"><path d="M22.6 12.8c-1.9.5-3.7 1.2-5.3 2.1-1.6.9-3.1 1.9-4.3 3-1.2 1.1-2.2 2.4-2.9 3.7-.7 1.3-1.1 2.7-1.1 4 0 1.2.1 1.8.3 1.8.8 0 1.5-.3 2.4-.9.8-.6 1.9-.9 3.3-.9 2.1 0 3.9.8 5.4 2.4 1.5 1.6 2.3 3.7 2.3 6.2s-1 4.6-2.9 6.4c-1.9 1.8-4.3 2.6-7.3 2.6-1.8 0-3.4-.4-4.9-1.1-1.5-.8-2.8-1.8-3.9-3.1s-2-2.8-2.6-4.6C.3 32.5 0 30.6 0 28.6c0-3 .6-5.8 1.8-8.3 1.2-2.5 2.8-4.8 4.9-6.7 2-1.9 4.4-3.5 7.2-4.6 2.8-1.2 5.6-1.8 8.6-2v5.8zm27.4 0c-1.9.5-3.7 1.2-5.4 2.1-1.7.9-3.1 1.9-4.3 3-1.2 1.1-2.2 2.4-2.9 3.7-.7 1.3-1.1 2.7-1.1 4 0 1.2.1 1.8.4 1.8.8 0 1.5-.3 2.3-.9.8-.6 1.9-.9 3.3-.9 2 0 3.8.8 5.3 2.4 1.5 1.6 2.3 3.7 2.3 6.2s-1 4.6-2.9 6.4c-2 1.8-4.4 2.6-7.3 2.6-1.7 0-3.3-.4-4.8-1.1-1.5-.8-2.8-1.8-3.9-3.1s-2-2.8-2.7-4.6c-.7-1.8-1-3.7-1-5.7 0-3 .6-5.8 1.8-8.3 1.2-2.5 2.8-4.8 4.9-6.7 2-1.9 4.4-3.5 7.2-4.6 2.8-1.2 5.7-1.8 8.8-2v5.7z"></path></svg><p class="ugb-blockquote__text" style="color:#eeeeee">It's okay to acknowledge that life can get complicated, but we musn't forget the beauty in its simplicity, too. From the multitude of stars above, to freshly mowed grass in the morning, life is simply wonderful.</p></div></blockquote>
		<!-- /wp:ugb/blockquote -->`,
	},
	{
		block: 'Blockquote',
		version: '1.17.3',
		description: 'From demo',
		plan: 'Premium',
		html: `<!-- wp:ugb/blockquote {"color":"#313131","quoteColor":"#f78da7","backgroundColor":"#0693e3","quotationMark":"round-fat","quotationSize":90,"design":"centered-quote"} -->
		<blockquote class="wp-block-ugb-blockquote ugb-blockquote ugb-blockquote--v2 ugb--background-opacity-5 ugb-blockquote--design-centered-quote" style="--quote-color:#f78da7"><div class="ugb-content-wrapper"><svg viewbox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" style="fill:#f78da7;width:90px;height:90px"><path d="M22.3 30.5c0 6-4.8 10.8-10.8 10.8-2.3 0-4.5-.8-6.3-2-.9-.6-1.8-1.4-2.5-2.4-1.8-2.4-2.7-5.4-2.7-9 0-4.5 1.3-8.5 4-11.9 2.7-3.4 6.4-5.8 11.1-7.3v2.8c-2.7 2.2-4.4 5-4.9 8.3.4-.1.9-.1 1.3-.1 6-.1 10.8 4.8 10.8 10.8zm16.9-10.9c-.5 0-.9 0-1.3.1.5-3.3 2.2-6.1 4.9-8.3V8.7c-4.7 1.4-8.4 3.9-11.1 7.3-2.7 3.4-4 7.4-4 11.9 0 3.6.9 6.6 2.7 9 .8 1 1.6 1.8 2.5 2.4 1.8 1.3 3.9 2 6.3 2 6 0 10.8-4.8 10.8-10.8 0-6-4.8-10.9-10.8-10.9z"></path></svg><p class="ugb-blockquote__text" style="color:#313131"><strong><g class="gr_ gr_6 gr-alert gr_tiny gr_spell gr_inline_cards gr_run_anim ContextualSpelling multiReplace" id="6" data-gr-id="6">i</g> carry your heart with me (i carry it in my heart) <g class="gr_ gr_7 gr-alert gr_tiny gr_spell gr_inline_cards gr_run_anim ContextualSpelling multiReplace" id="7" data-gr-id="7">i</g> am never without it (anywhere <g class="gr_ gr_8 gr-alert gr_tiny gr_spell gr_inline_cards gr_run_anim ContextualSpelling multiReplace" id="8" data-gr-id="8">i</g> go you go, my dear; and whatever is done by only me is your doing, my darling)<br><br>- e.e. cummings</strong></p></div></blockquote>
		<!-- /wp:ugb/blockquote -->`,
	},
	{
		block: 'Blockquote',
		version: '1.17.3',
		description: 'From demo',
		plan: 'Premium',
		html: `<!-- wp:ugb/blockquote {"align":"full","color":"#b7e3ff","quoteColor":"#386bb6","backgroundColor":"#313131","backgroundType":"video","backgroundImageID":2765,"backgroundImageURL":"https://wpstackable.com/wp-content/uploads/2019/04/Pexels-Videos-1851768.sameformat.mp4","fixedBackground":true,"contentWidth":true,"quotationMark":"square-modern","quotationSize":140,"design":"highlight"} -->
		<blockquote class="wp-block-ugb-blockquote alignfull ugb-blockquote ugb-blockquote--v2 ugb--background-opacity-5 ugb-blockquote--design-highlight ugb-content-width ugb--has-background-video" style="--quote-color:#386bb6;--ugb-box-color:#b7e3ff"><div class="ugb-content-wrapper"><svg viewbox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" style="fill:#386bb6;width:140px;height:140px"><path d="M20.8 44.5H0V23.7L9.3 5.5h7.3L12 23.7h8.8v20.8zm29.2 0H29.2V23.7l9.3-18.1h7.3l-4.6 18.1H50v20.8z"></path></svg><span class="ugb-blockquote__highlight-wrap"><p class="ugb-blockquote__text" style="color:#b7e3ff">Try not to become a man of success. Rather become a man of value.<br><em>- Albert Einstein</em></p></span></div></blockquote>
		<!-- /wp:ugb/blockquote -->`,
	},
	{
		block: 'Blockquote',
		version: '1.17.3',
		description: 'Custom CSS',
		plan: 'Premium',
		html: `<!-- wp:ugb/blockquote {"customCSSUniqueID":"ugb-981958c","customCSS":"/* Blockquote container */\n.ugb-blockquote {\n\tbackground: yellow;\n}\n\n/* Blockquote content wrapper */\n.ugb-blockquote .ugb-content-wrapper {\n\n}\n\n/* Blockquote quotation mark */\n.ugb-blockquote svg {\n\tfill: red;\n}\n\n/* Blockquote text */\n.ugb-blockquote__text {\n\tcolor: blue;\n}","customCSSCompiled":".ugb-981958c.ugb-blockquote{background:yellow !important}.ugb-981958c.ugb-blockquote svg{fill:red !important}.ugb-981958c .ugb-blockquote__text{color:blue !important}"} -->
		<blockquote class="wp-block-ugb-blockquote ugb-blockquote ugb-blockquote--v2 ugb--background-opacity-5 ugb-blockquote--design-plain ugb-981958c"><style>.ugb-981958c.ugb-blockquote{background:yellow !important}.ugb-981958c.ugb-blockquote svg{fill:red !important}.ugb-981958c .ugb-blockquote__text{color:blue !important}</style><div class="ugb-content-wrapper"><svg viewbox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" style="fill:;width:70px;height:70px"><path d="M19.8 9.3C10.5 11.8 4.6 17 2.1 24.8c2.3-3.6 5.6-5.4 9.9-5.4 3.3 0 6 1.1 8.3 3.3 2.2 2.2 3.4 5 3.4 8.3 0 3.2-1.1 5.8-3.3 8-2.2 2.2-5.1 3.2-8.7 3.2-3.7 0-6.5-1.2-8.6-3.5C1 36.3 0 33.1 0 29 0 18.3 6.5 11.2 19.6 7.9l.2 1.4zm26.4 0C36.9 11.9 31 17 28.5 24.8c2.2-3.6 5.5-5.4 9.8-5.4 3.2 0 6 1.1 8.3 3.2 2.3 2.2 3.4 4.9 3.4 8.3 0 3.1-1.1 5.8-3.3 7.9-2.2 2.2-5.1 3.3-8.6 3.3-3.7 0-6.6-1.1-8.6-3.4-2.1-2.3-3.1-5.5-3.1-9.7 0-10.7 6.6-17.8 19.7-21.1l.1 1.4z"></path></svg><p class="ugb-blockquote__text" style="color:">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p></div></blockquote>
		<!-- /wp:ugb/blockquote -->`,
	},
	{
		block: 'Blockquote',
		version: '1.17.3',
		description: 'Custom CSS Basic layout',
		plan: 'Premium',
		html: `<!-- wp:ugb/blockquote {"design":"basic","customCSSUniqueID":"ugb-981958c","customCSS":"/* Blockquote container */\n.ugb-blockquote {\n\tbackground: yellow;\n}\n\n/* Blockquote content wrapper */\n.ugb-blockquote .ugb-content-wrapper {\n\n}\n\n/* Blockquote quotation mark */\n.ugb-blockquote svg {\n\tfill: red;\n}\n\n/* Blockquote text */\n.ugb-blockquote__text {\n\tcolor: blue;\n}","customCSSCompiled":".ugb-981958c.ugb-blockquote{background:yellow !important}.ugb-981958c.ugb-blockquote svg{fill:red !important}.ugb-981958c .ugb-blockquote__text{color:blue !important}"} -->
		<blockquote class="wp-block-ugb-blockquote ugb-blockquote ugb-blockquote--v2 ugb--background-opacity-5 ugb-blockquote--design-basic ugb-981958c"><style>.ugb-981958c.ugb-blockquote{background:yellow !important}.ugb-981958c.ugb-blockquote svg{fill:red !important}.ugb-981958c .ugb-blockquote__text{color:blue !important}</style><div class="ugb-content-wrapper"><svg viewbox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" style="fill:;width:70px;height:70px"><path d="M19.8 9.3C10.5 11.8 4.6 17 2.1 24.8c2.3-3.6 5.6-5.4 9.9-5.4 3.3 0 6 1.1 8.3 3.3 2.2 2.2 3.4 5 3.4 8.3 0 3.2-1.1 5.8-3.3 8-2.2 2.2-5.1 3.2-8.7 3.2-3.7 0-6.5-1.2-8.6-3.5C1 36.3 0 33.1 0 29 0 18.3 6.5 11.2 19.6 7.9l.2 1.4zm26.4 0C36.9 11.9 31 17 28.5 24.8c2.2-3.6 5.5-5.4 9.8-5.4 3.2 0 6 1.1 8.3 3.2 2.3 2.2 3.4 4.9 3.4 8.3 0 3.1-1.1 5.8-3.3 7.9-2.2 2.2-5.1 3.3-8.6 3.3-3.7 0-6.6-1.1-8.6-3.4-2.1-2.3-3.1-5.5-3.1-9.7 0-10.7 6.6-17.8 19.7-21.1l.1 1.4z"></path></svg><p class="ugb-blockquote__text" style="color:">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p></div></blockquote>
		<!-- /wp:ugb/blockquote -->`,
	},
]
