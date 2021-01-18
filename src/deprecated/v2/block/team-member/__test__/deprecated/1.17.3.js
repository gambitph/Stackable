/**
 * This file contains saved block HTML from older versions.
 * These will be tested if they pass migration.
 * This will be built into the dist folder as `deprecation-tests.json`
 */

module.exports = [
	{
		block: 'Team Member',
		version: '1.17.3',
		description: 'Default block',
		html: `<!-- wp:ugb/team-member -->
		<div class="wp-block-ugb-team-member ugb-team-member ugb-team-member--v2 ugb-team-member--columns-2 ugb-team-member--image-circle ugb-team-member--design-basic"><div class="ugb-team-member__item"><div class="ugb-team-member__content"><h4 class="ugb-team-member__name">Name</h4><p class="ugb-team-member__position">Position</p><p class="ugb-team-member__description">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p></div></div><div class="ugb-team-member__item"><div class="ugb-team-member__content"><h4 class="ugb-team-member__name">Name</h4><p class="ugb-team-member__position">Position</p><p class="ugb-team-member__description">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p></div></div></div>
		<!-- /wp:ugb/team-member -->`,
	},
	{
		block: 'Team Member',
		version: '1.17.3',
		description: 'Modified block',
		html: `<!-- wp:ugb/team-member {"mediaID1":17,"mediaID2":25,"mediaID3":24,"nameColor":"#cf2e2e","posColor":"#ff6900","desColor":"#fcb900","columns":3,"borderRadius":45,"shadow":5,"colorOnHover":true} -->
		<div class="wp-block-ugb-team-member ugb-team-member ugb-team-member--v2 ugb-team-member--columns-3 ugb-team-member--image-circle ugb-team-member--design-basic ugb-team-member--color-on-hover"><div class="ugb-team-member__item ugb--shadow-5" style="border-radius:45px"><div class="ugb-team-member__image" style="background-image:url(http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg)" data-src="http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg"></div><div class="ugb-team-member__content"><h4 class="ugb-team-member__name" style="color:#cf2e2e">Name</h4><p class="ugb-team-member__position" style="color:#ff6900">Position</p><p class="ugb-team-member__description" style="color:#fcb900">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p></div></div><div class="ugb-team-member__item ugb--shadow-5" style="border-radius:45px"><div class="ugb-team-member__image" style="background-image:url(http://localhost2:8888/wp-content/uploads/2019/08/groomsman3.jpg)" data-src="http://localhost2:8888/wp-content/uploads/2019/08/groomsman3.jpg"></div><div class="ugb-team-member__content"><h4 class="ugb-team-member__name" style="color:#cf2e2e">Name</h4><p class="ugb-team-member__position" style="color:#ff6900">Position</p><p class="ugb-team-member__description" style="color:#fcb900">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p></div></div><div class="ugb-team-member__item ugb--shadow-5" style="border-radius:45px"><div class="ugb-team-member__image" style="background-image:url(http://localhost2:8888/wp-content/uploads/2019/08/Screen-Shot-2019-08-31-at-3.06.35-PM.jpg)" data-src="http://localhost2:8888/wp-content/uploads/2019/08/Screen-Shot-2019-08-31-at-3.06.35-PM.jpg"></div><div class="ugb-team-member__content"><h4 class="ugb-team-member__name" style="color:#cf2e2e">Name</h4><p class="ugb-team-member__position" style="color:#ff6900">Position</p><p class="ugb-team-member__description" style="color:#fcb900">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p></div></div></div>
		<!-- /wp:ugb/team-member -->`,
	},
	{
		block: 'Team Member',
		version: '1.17.3',
		description: 'Modified block',
		html: `<!-- wp:ugb/team-member {"mediaID1":17,"columns":1,"shapes":"square","design":"plain","borderRadius":0} -->
		<div class="wp-block-ugb-team-member ugb-team-member ugb-team-member--v2 ugb-team-member--columns-1 ugb-team-member--image-square ugb-team-member--design-plain"><div class="ugb-team-member__item"><div class="ugb-team-member__image" style="background-image:url(http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg)" data-src="http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg"></div><div class="ugb-team-member__content"><h4 class="ugb-team-member__name">Name</h4><p class="ugb-team-member__position">Position</p><p class="ugb-team-member__description">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p></div></div></div>
		<!-- /wp:ugb/team-member -->`,
	},
	{
		block: 'Team Member',
		version: '1.17.3',
		description: 'Modified block',
		html: `<!-- wp:ugb/team-member -->
		<div class="wp-block-ugb-team-member ugb-team-member ugb-team-member--v2 ugb-team-member--columns-2 ugb-team-member--image-circle ugb-team-member--design-basic"><div class="ugb-team-member__item"><div class="ugb-team-member__content"><h4 class="ugb-team-member__name">Name1111</h4><p class="ugb-team-member__position">2222Position</p><p class="ugb-team-member__description">333333Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p></div></div><div class="ugb-team-member__item"><div class="ugb-team-member__content"><h4 class="ugb-team-member__name">aaaaName</h4><p class="ugb-team-member__position">Positionbbbbb</p></div></div></div>
		<!-- /wp:ugb/team-member -->`,
	},
	{
		block: 'Team Member',
		version: '1.17.3',
		description: 'From free demo',
		html: `<!-- wp:ugb/team-member {"mediaID1":3101,"mediaID2":3100,"mediaID3":3103,"columns":3,"shadow":7,"position":"Founder"} -->
		<div class="wp-block-ugb-team-member ugb-team-member ugb-team-member--v2 ugb-team-member--columns-3 ugb-team-member--image-circle ugb-team-member--design-basic"><div class="ugb-team-member__item ugb--shadow-7"><div class="ugb-team-member__image" style="background-image:url(https://wpstackable.com/wp-content/uploads/2019/04/Man-Team-Member-01.jpg)" data-src="https://wpstackable.com/wp-content/uploads/2019/04/Man-Team-Member-01.jpg"></div><div class="ugb-team-member__content"><h4 class="ugb-team-member__name">Ben Adams</h4><p class="ugb-team-member__position">Founder</p><p class="ugb-team-member__description">Ben is our founder and lead developer. He is the brains behind Our Product and has been using the platform since version 1.</p></div></div><div class="ugb-team-member__item ugb--shadow-7"><div class="ugb-team-member__image" style="background-image:url(https://wpstackable.com/wp-content/uploads/2019/04/Woman-Team-Member-02.jpg)" data-src="https://wpstackable.com/wp-content/uploads/2019/04/Woman-Team-Member-02.jpg"></div><div class="ugb-team-member__content"><h4 class="ugb-team-member__name">Danielle Smith</h4><p class="ugb-team-member__position">Operations</p><p class="ugb-team-member__description">Danielle is the head of operations. She has significant experience in establishing  and growing start-ups.</p></div></div><div class="ugb-team-member__item ugb--shadow-7"><div class="ugb-team-member__image" style="background-image:url(https://wpstackable.com/wp-content/uploads/2019/04/Man-Team-Member-02.jpg)" data-src="https://wpstackable.com/wp-content/uploads/2019/04/Man-Team-Member-02.jpg"></div><div class="ugb-team-member__content"><h4 class="ugb-team-member__name">Gio Ty</h4><p class="ugb-team-member__position">Sales</p><p class="ugb-team-member__description">Carl is the head of sales. He is a marketing genius and has pitched the top brands that everyone knows today.</p></div></div></div>
		<!-- /wp:ugb/team-member -->`,
	},
	{
		block: 'Team Member',
		version: '1.17.3',
		description: 'From free demo',
		html: `<!-- wp:ugb/team-member {"mediaID1":3104,"nameColor":"#f79a8d","posColor":"#707070","desColor":"#252525","columns":1,"design":"plain","borderRadius":0} -->
		<div class="wp-block-ugb-team-member ugb-team-member ugb-team-member--v2 ugb-team-member--columns-1 ugb-team-member--image-circle ugb-team-member--design-plain"><div class="ugb-team-member__item"><div class="ugb-team-member__image" style="background-image:url(https://wpstackable.com/wp-content/uploads/2019/04/Woman-Team-Member-01.jpg)" data-src="https://wpstackable.com/wp-content/uploads/2019/04/Woman-Team-Member-01.jpg"></div><div class="ugb-team-member__content"><h4 class="ugb-team-member__name" style="color:#f79a8d">Abbie Henson</h4><p class="ugb-team-member__position" style="color:#707070">Author</p><p class="ugb-team-member__description" style="color:#252525">Abbie is a lifestyle guru. She has been helping others achieve their goals in life for five years by teaching arts and crafts to young millenials.</p></div></div></div>
		<!-- /wp:ugb/team-member -->`,
	},
	{
		block: 'Team Member',
		version: '1.17.3',
		description: 'From free demo',
		html: `<!-- wp:ugb/team-member {"mediaID1":3116,"mediaID2":3110,"mediaID3":413,"shapes":"square","design":"plain"} -->
		<div class="wp-block-ugb-team-member ugb-team-member ugb-team-member--v2 ugb-team-member--columns-2 ugb-team-member--image-square ugb-team-member--design-plain"><div class="ugb-team-member__item"><div class="ugb-team-member__image" style="background-image:url(https://wpstackable.com/wp-content/uploads/2019/04/Man-Team-Member-05.jpg)" data-src="https://wpstackable.com/wp-content/uploads/2019/04/Man-Team-Member-05.jpg"></div><div class="ugb-team-member__content"><h4 class="ugb-team-member__name">Carl Ty</h4><p class="ugb-team-member__position">Co-founder</p></div></div><div class="ugb-team-member__item"><div class="ugb-team-member__image" style="background-image:url(https://wpstackable.com/wp-content/uploads/2019/04/Woman-Team-Member-03.jpg)" data-src="https://wpstackable.com/wp-content/uploads/2019/04/Woman-Team-Member-03.jpg"></div><div class="ugb-team-member__content"><h4 class="ugb-team-member__name">Carmela Dane</h4><p class="ugb-team-member__position">Co-founder</p></div></div></div>
		<!-- /wp:ugb/team-member -->`,
	},
	{
		block: 'Team Member',
		version: '1.17.3',
		description: 'From free demo',
		html: `<!-- wp:ugb/team-member {"nameColor":"#ffffff","posColor":"#ffffff","design":"plain"} -->
		<div class="wp-block-ugb-team-member ugb-team-member ugb-team-member--v2 ugb-team-member--columns-2 ugb-team-member--image-circle ugb-team-member--design-plain"><div class="ugb-team-member__item"><div class="ugb-team-member__content"><h4 class="ugb-team-member__name" style="color:#ffffff">Ben Adams</h4><p class="ugb-team-member__position" style="color:#ffffff">Founder</p></div></div><div class="ugb-team-member__item"><div class="ugb-team-member__content"><h4 class="ugb-team-member__name" style="color:#ffffff">Danielle Smith</h4><p class="ugb-team-member__position" style="color:#ffffff">Operations</p></div></div></div>
		<!-- /wp:ugb/team-member -->`,
	},
	{
		block: 'Team Member',
		version: '1.17.3',
		description: 'From premium demo',
		plan: 'Premium',
		html: `<!-- wp:ugb/team-member {"mediaID1":397,"mediaID2":398,"nameColor":"#f8db8b","design":"overlay"} -->
		<div class="wp-block-ugb-team-member ugb-team-member ugb-team-member--v2 ugb-team-member--columns-2 ugb-team-member--image-circle ugb-team-member--design-overlay"><div class="ugb-team-member__item ugb--shadow-3" style="border-radius:12px"><div class="ugb-team-member__image" style="background-image:url(https://demo.wpstackable.com/wp-content/uploads/2019/02/Team-Member-02.jpg)" data-src="https://demo.wpstackable.com/wp-content/uploads/2019/02/Team-Member-02.jpg"></div><div class="ugb-team-member__content"><h4 class="ugb-team-member__name" style="color:#f8db8b">Team Member</h4><p class="ugb-team-member__position">Position</p><p class="ugb-team-member__description">Use this to feature the individuals in your team.</p></div></div><div class="ugb-team-member__item ugb--shadow-3" style="border-radius:12px"><div class="ugb-team-member__image" style="background-image:url(https://demo.wpstackable.com/wp-content/uploads/2019/02/Team-Member-01.jpg)" data-src="https://demo.wpstackable.com/wp-content/uploads/2019/02/Team-Member-01.jpg"></div><div class="ugb-team-member__content"><h4 class="ugb-team-member__name" style="color:#f8db8b">Team Member</h4><p class="ugb-team-member__position">Position</p><p class="ugb-team-member__description">Use this to feature the individuals in your team.</p></div></div></div>
		<!-- /wp:ugb/team-member -->`,
	},
	{
		block: 'Team Member',
		version: '1.17.3',
		description: 'From premium demo',
		plan: 'Premium',
		html: `<!-- wp:ugb/team-member {"mediaID1":3101,"mediaID2":3100,"mediaID3":3103,"nameColor":"#8dfcf9","columns":3,"design":"overlay","shadow":7,"colorOnHover":true,"position":"Founder"} -->
		<div class="wp-block-ugb-team-member ugb-team-member ugb-team-member--v2 ugb-team-member--columns-3 ugb-team-member--image-circle ugb-team-member--design-overlay ugb-team-member--color-on-hover"><div class="ugb-team-member__item ugb--shadow-7 ugb--shadow-3" style="border-radius:12px"><div class="ugb-team-member__image" style="background-image:url(https://wpstackable.com/wp-content/uploads/2019/04/Man-Team-Member-01.jpg)" data-src="https://wpstackable.com/wp-content/uploads/2019/04/Man-Team-Member-01.jpg"></div><div class="ugb-team-member__content"><h4 class="ugb-team-member__name" style="color:#8dfcf9">Ben Adams</h4><p class="ugb-team-member__position">Founder</p><p class="ugb-team-member__description">Ben is our founder and lead developer. He is the brains behind Our Product and has been using the platform since version 1.</p></div></div><div class="ugb-team-member__item ugb--shadow-7 ugb--shadow-3" style="border-radius:12px"><div class="ugb-team-member__image" style="background-image:url(https://wpstackable.com/wp-content/uploads/2019/04/Woman-Team-Member-02.jpg)" data-src="https://wpstackable.com/wp-content/uploads/2019/04/Woman-Team-Member-02.jpg"></div><div class="ugb-team-member__content"><h4 class="ugb-team-member__name" style="color:#8dfcf9">Danielle Smith</h4><p class="ugb-team-member__position">Operations</p><p class="ugb-team-member__description">Danielle is the head of operations. She has significant experience in establishing  and growing start-ups.</p></div></div><div class="ugb-team-member__item ugb--shadow-7 ugb--shadow-3" style="border-radius:12px"><div class="ugb-team-member__image" style="background-image:url(https://wpstackable.com/wp-content/uploads/2019/04/Man-Team-Member-02.jpg)" data-src="https://wpstackable.com/wp-content/uploads/2019/04/Man-Team-Member-02.jpg"></div><div class="ugb-team-member__content"><h4 class="ugb-team-member__name" style="color:#8dfcf9">Gio Ty</h4><p class="ugb-team-member__position">Sales</p><p class="ugb-team-member__description">Carl is the head of sales. He is a marketing genius and has pitched the top brands that everyone knows today.</p></div></div></div>
		<!-- /wp:ugb/team-member -->`,
	},
	{
		block: 'Team Member',
		version: '1.17.3',
		description: 'From premium demo',
		plan: 'Premium',
		html: `<!-- wp:ugb/team-member {"mediaID1":3118,"nameColor":"#0693e3","posColor":"#313131","desColor":"#003d60","columns":1,"design":"horizontal","borderRadius":34,"shadow":2} -->
		<div class="wp-block-ugb-team-member ugb-team-member ugb-team-member--v2 ugb-team-member--columns-1 ugb-team-member--image-circle ugb-team-member--design-horizontal"><div class="ugb-team-member__item ugb--shadow-2 ugb--shadow-3" style="border-radius:34px"><div class="ugb-team-member__image" style="background-image:url(https://wpstackable.com/wp-content/uploads/2019/04/Man-Team-Member-06.jpg)" data-src="https://wpstackable.com/wp-content/uploads/2019/04/Man-Team-Member-06.jpg"></div><div class="ugb-team-member__content"><h4 class="ugb-team-member__name" style="color:#0693e3">George Henson</h4><p class="ugb-team-member__description" style="color:#003d60">George is a disruptive technology expert. He has been helping young minds reach new heights for two decades by sponsoring scholarships to the best schools in the country.</p></div></div></div>
		<!-- /wp:ugb/team-member -->`,
	},
	{
		block: 'Team Member',
		version: '1.17.3',
		description: 'From premium demo',
		plan: 'Premium',
		html: `<!-- wp:ugb/team-member {"mediaID1":3116,"mediaID2":3110,"mediaID3":413,"shapes":"square","design":"half","colorOnHover":true,"align":"wide"} -->
		<div class="wp-block-ugb-team-member alignwide ugb-team-member ugb-team-member--v2 ugb-team-member--columns-2 ugb-team-member--image-square ugb-team-member--design-half ugb-team-member--color-on-hover"><div class="ugb-team-member__item ugb--shadow-3" style="border-radius:12px"><div class="ugb-team-member__image" style="background-image:url(https://wpstackable.com/wp-content/uploads/2019/04/Man-Team-Member-05.jpg)" data-src="https://wpstackable.com/wp-content/uploads/2019/04/Man-Team-Member-05.jpg"></div><div class="ugb-team-member__content"><h4 class="ugb-team-member__name">Carl Ty</h4><p class="ugb-team-member__position">Co-founder</p></div></div><div class="ugb-team-member__item ugb--shadow-3" style="border-radius:12px"><div class="ugb-team-member__image" style="background-image:url(https://wpstackable.com/wp-content/uploads/2019/04/Woman-Team-Member-03.jpg)" data-src="https://wpstackable.com/wp-content/uploads/2019/04/Woman-Team-Member-03.jpg"></div><div class="ugb-team-member__content"><h4 class="ugb-team-member__name">Carmela Dane</h4><p class="ugb-team-member__position">Co-founder</p></div></div></div>
		<!-- /wp:ugb/team-member -->`,
	},
	{
		block: 'Team Member',
		version: '1.17.3',
		description: 'From premium demo',
		plan: 'Premium',
		html: `<!-- wp:ugb/team-member {"mediaID1":3100,"mediaID2":3117,"mediaID3":3118,"columns":3,"shapes":"square","design":"half","colorOnHover":true,"align":"wide"} -->
		<div class="wp-block-ugb-team-member alignwide ugb-team-member ugb-team-member--v2 ugb-team-member--columns-3 ugb-team-member--image-square ugb-team-member--design-half ugb-team-member--color-on-hover"><div class="ugb-team-member__item ugb--shadow-3" style="border-radius:12px"><div class="ugb-team-member__image" style="background-image:url(https://wpstackable.com/wp-content/uploads/2019/04/Woman-Team-Member-02.jpg)" data-src="https://wpstackable.com/wp-content/uploads/2019/04/Woman-Team-Member-02.jpg"></div><div class="ugb-team-member__content"><h4 class="ugb-team-member__name">Una Capri</h4><p class="ugb-team-member__position">Human Resources</p></div></div><div class="ugb-team-member__item ugb--shadow-3" style="border-radius:12px"><div class="ugb-team-member__image" style="background-image:url(https://wpstackable.com/wp-content/uploads/2019/04/Woman-Team-Member-04.jpg)" data-src="https://wpstackable.com/wp-content/uploads/2019/04/Woman-Team-Member-04.jpg"></div><div class="ugb-team-member__content"><h4 class="ugb-team-member__name">Justine Maine</h4><p class="ugb-team-member__position">Accounting</p></div></div><div class="ugb-team-member__item ugb--shadow-3" style="border-radius:12px"><div class="ugb-team-member__image" style="background-image:url(https://wpstackable.com/wp-content/uploads/2019/04/Man-Team-Member-06.jpg)" data-src="https://wpstackable.com/wp-content/uploads/2019/04/Man-Team-Member-06.jpg"></div><div class="ugb-team-member__content"><h4 class="ugb-team-member__name">Macky Macar</h4><p class="ugb-team-member__position">Treasury</p></div></div></div>
		<!-- /wp:ugb/team-member -->`,
	},
	{
		block: 'Team Member',
		version: '1.17.3',
		description: 'Custom CSS',
		plan: 'Premium',
		html: `<!-- wp:ugb/team-member {"mediaID1":17,"columns":1,"shapes":"square","design":"plain","borderRadius":0} -->
		<div class="wp-block-ugb-team-member ugb-team-member ugb-team-member--v2 ugb-team-member--columns-1 ugb-team-member--image-square ugb-team-member--design-plain"><div class="ugb-team-member__item"><div class="ugb-team-member__image" style="background-image:url(http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg)" data-src="http://localhost2:8888/wp-content/uploads/2019/08/premium-header-bg.jpg"></div><div class="ugb-team-member__content"><h4 class="ugb-team-member__name">Name</h4><p class="ugb-team-member__position">Position</p><p class="ugb-team-member__description">Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.</p></div></div></div>
		<!-- /wp:ugb/team-member -->`,
	},
]
