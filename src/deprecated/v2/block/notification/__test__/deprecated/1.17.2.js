/**
 * This file contains saved block HTML from older versions.
 * These will be tested if they pass migration.
 * This will be built into the dist folder as `deprecation-tests.json`
 */

module.exports = [
	{
		block: 'Notification',
		version: '1.17.2',
		description: 'Default block',
		html: `<!-- wp:ugb/notification -->
		<div class="wp-block-ugb-notification ugb-notification ugb-notification--type-success"><p>Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p></div>
		<!-- /wp:ugb/notification -->`,
	},
	{
		block: 'Notification',
		version: '1.17.2',
		description: 'Modified text',
		html: `<!-- wp:ugb/notification -->
		<div class="wp-block-ugb-notification ugb-notification ugb-notification--type-success"><p>Testing</p></div>
		<!-- /wp:ugb/notification -->`,
	},
	{
		block: 'Notification',
		version: '1.17.2',
		description: 'Modified block',
		html: `<!-- wp:ugb/notification {"notifType":"error","dismissible":true,"borderRadius":33} -->
		<div class="wp-block-ugb-notification ugb-notification ugb-notification--type-error ugb-notification--dismissible" style="border-radius:33px"><span class="ugb-notification__close-button" role="button" tabindex="0"><svg viewbox="0 0 28.3 28.3" xmlns="http://www.w3.org/2000/svg"><path d="M52.4-166.2c3.2 0 3.2-5 0-5s-3.2 5 0 5zM16.8 13.9L26.9 3.8c.6-.6.6-1.5 0-2.1s-1.5-.6-2.1 0L14.7 11.8 4.6 1.7c-.6-.6-1.5-.6-2.1 0s-.6 1.5 0 2.1l10.1 10.1L2.5 24c-.6.6-.6 1.5 0 2.1.3.3.7.4 1.1.4s.8-.1 1.1-.4l10-10.1 10.1 10.1c.3.3.7.4 1.1.4s.8-.1 1.1-.4c.6-.6.6-1.5 0-2.1L16.8 13.9z"></path></svg></span><p>Testing</p></div>
		<!-- /wp:ugb/notification -->`,
	},
	{
		block: 'Notification',
		version: '1.17.2',
		description: 'Fully Modified block',
		html: `<!-- wp:ugb/notification {"color":"#abb8c3","textColor":"#0693e3","notifType":"info","dismissible":true,"borderRadius":33,"shadow":7} -->
		<div class="wp-block-ugb-notification ugb-notification ugb-notification--type-info ugb-notification--dismissible ugb--shadow-7" style="background-color:#abb8c3;color:#0693e3;border-radius:33px"><span class="ugb-notification__close-button" role="button" tabindex="0"><svg viewbox="0 0 28.3 28.3" xmlns="http://www.w3.org/2000/svg" style="fill:#0693e3"><path d="M52.4-166.2c3.2 0 3.2-5 0-5s-3.2 5 0 5zM16.8 13.9L26.9 3.8c.6-.6.6-1.5 0-2.1s-1.5-.6-2.1 0L14.7 11.8 4.6 1.7c-.6-.6-1.5-.6-2.1 0s-.6 1.5 0 2.1l10.1 10.1L2.5 24c-.6.6-.6 1.5 0 2.1.3.3.7.4 1.1.4s.8-.1 1.1-.4l10-10.1 10.1 10.1c.3.3.7.4 1.1.4s.8-.1 1.1-.4c.6-.6.6-1.5 0-2.1L16.8 13.9z"></path></svg></span><p style="color:#0693e3">Testing</p></div>
		<!-- /wp:ugb/notification -->`,
	},
	{
		block: 'Notification',
		version: '1.17.2',
		description: 'From demo',
		html: `<!-- wp:ugb/notification {"textColor":"#ffffff"} -->
		<div class="wp-block-ugb-notification ugb-notification ugb-notification--type-success" style="color:#ffffff"><p style="color:#ffffff"><strong>Congratulations! <br></strong>You've successfully added <strong>Dress 617</strong> to your cart. Choose another item to continue shopping.</p></div>
		<!-- /wp:ugb/notification -->`,
	},
	{
		block: 'Notification',
		version: '1.17.2',
		description: 'From demo',
		html: `<!-- wp:ugb/notification {"color":"#ff8484","textColor":"#ffffff","notifType":"error","dismissible":true,"borderRadius":3} -->
		<div class="wp-block-ugb-notification ugb-notification ugb-notification--type-error ugb-notification--dismissible" style="background-color:#ff8484;color:#ffffff;border-radius:3px"><span class="ugb-notification__close-button" role="button" tabindex="0"><svg viewbox="0 0 28.3 28.3" xmlns="http://www.w3.org/2000/svg" style="fill:#ffffff"><path d="M52.4-166.2c3.2 0 3.2-5 0-5s-3.2 5 0 5zM16.8 13.9L26.9 3.8c.6-.6.6-1.5 0-2.1s-1.5-.6-2.1 0L14.7 11.8 4.6 1.7c-.6-.6-1.5-.6-2.1 0s-.6 1.5 0 2.1l10.1 10.1L2.5 24c-.6.6-.6 1.5 0 2.1.3.3.7.4 1.1.4s.8-.1 1.1-.4l10-10.1 10.1 10.1c.3.3.7.4 1.1.4s.8-.1 1.1-.4c.6-.6.6-1.5 0-2.1L16.8 13.9z"></path></svg></span><p style="color:#ffffff">Sorry, you entered an <em>invalid email address</em>. Please double check your entry and try again to proceed. Thank you.</p></div>
		<!-- /wp:ugb/notification -->`,
	},
	{
		block: 'Notification',
		version: '1.17.2',
		description: 'From demo',
		html: `<!-- wp:ugb/notification {"color":"#bee6ff","textColor":"#007ac1","notifType":"info","dismissible":true,"borderRadius":5} -->
		<div class="wp-block-ugb-notification ugb-notification ugb-notification--type-info ugb-notification--dismissible" style="background-color:#bee6ff;color:#007ac1;border-radius:5px"><span class="ugb-notification__close-button" role="button" tabindex="0"><svg viewbox="0 0 28.3 28.3" xmlns="http://www.w3.org/2000/svg" style="fill:#007ac1"><path d="M52.4-166.2c3.2 0 3.2-5 0-5s-3.2 5 0 5zM16.8 13.9L26.9 3.8c.6-.6.6-1.5 0-2.1s-1.5-.6-2.1 0L14.7 11.8 4.6 1.7c-.6-.6-1.5-.6-2.1 0s-.6 1.5 0 2.1l10.1 10.1L2.5 24c-.6.6-.6 1.5 0 2.1.3.3.7.4 1.1.4s.8-.1 1.1-.4l10-10.1 10.1 10.1c.3.3.7.4 1.1.4s.8-.1 1.1-.4c.6-.6.6-1.5 0-2.1L16.8 13.9z"></path></svg></span><p style="color:#007ac1">Order this product now to avail of the <strong>Introductory Price of 20% off</strong>.</p></div>
		<!-- /wp:ugb/notification -->`,
	},
	{
		block: 'Notification',
		version: '1.17.2',
		description: 'Custom CSS',
		plan: 'Premium',
		html: `<!-- wp:ugb/notification {"customCSSUniqueID":"ugb-b29d78f","customCSS":"/* Notification container */\n.ugb-notification {\n\tbackground: red;\n}\n\n/* Notification text */\n.ugb-notification p {\n\tcolor: blue;\n}\n\n/* Notification close button */\n.ugb-notification .ugb-notification__close-button {\n\t\n}\n\n/* Notification close button icon */\n.ugb-notification .ugb-notification__close-button svg {\n\t\n}","customCSSCompiled":".ugb-b29d78f.ugb-notification{background:red !important}.ugb-b29d78f.ugb-notification p{color:blue !important}"} -->
		<div class="wp-block-ugb-notification ugb-notification ugb-notification--type-success ugb-b29d78f"><style>.ugb-b29d78f.ugb-notification{background:red !important}.ugb-b29d78f.ugb-notification p{color:blue !important}</style><p>Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block. Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p></div>
		<!-- /wp:ugb/notification -->`,
	},
]
