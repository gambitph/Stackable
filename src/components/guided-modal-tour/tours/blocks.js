import { __ } from '@wordpress/i18n'
import { i18n } from 'stackable'
import { dispatch, select } from '@wordpress/data'
import { createInterpolateElement } from '@wordpress/element'

export const blocks = {
	condition: () => { // If provided, true will show the tour (even if it's already done), false will not show the tour, null will show the tour only once.
		// Force show the tour if there is a GET parameter tour=blocks
		return window?.location?.search?.includes( 'tour=blocks' ) ? true : null
	},
	initialize: () => {
		// Add some default content that we will select

		const blockObject = wp.blocks.createBlock(
			'stackable/columns',
			{
				uniqueId: '1dbe04e',
				blockMargin: { bottom: '' },
				align: 'full',
			},
			[
				wp.blocks.createBlock(
					'stackable/column',
					{
						uniqueId: 'f957abc',
						hasContainer: true,
						columnSpacing: {
							top: '', right: '', bottom: '', left: '',
						},
					},
					[
						wp.blocks.createBlock(
							'stackable/heading',
							{
								uniqueId: 'a8ebea7',
								// Retain our text
								text: 'Explore the World with Us',
								textTag: 'h2',
							}
						),
						wp.blocks.createBlock(
							'stackable/text',
							{
								uniqueId: '57e76a1',
								// Retain our text
								text: 'Discover breathtaking destinations, plan your next adventure, and make unforgettable memories with our travel guides and tips.',
							}
						),
						wp.blocks.createBlock(
							'stackable/button-group',
							{ uniqueId: 'e063798' },
							[
								wp.blocks.createBlock(
									'stackable/button',
									{
										uniqueId: '5d04ca8',
										// Retain our text
										text: 'Start your journey',
										url: '',
									}
								),
							]
						),
					]
				),
				wp.blocks.createBlock(
					'stackable/column',
					{
						uniqueId: '3dcffca',
						hasContainer: true,
						containerBackgroundMediaExternalUrl: 'https://picsum.photos/id/177/500/700.jpg',
						containerHeight: '500',
					},
					[]
				),
			]
		)

		// Delete all blocks
		const allBlocks = select( 'core/block-editor' ).getBlocks()
		dispatch( 'core/block-editor' ).removeBlocks( allBlocks.map( block => block.clientId ) )

		// Insert our block
		dispatch( 'core/block-editor' ).insertBlocks( [ blockObject ], 0 )

		// Select the inner columns block for the tour
		dispatch( 'core/block-editor' ).selectBlock( blockObject.innerBlocks[ 0 ].clientId )
	},
	steps: [
		{
			title: '👋 ' + __( 'Welcome to Your Stackable Blocks', i18n ),
			description: __( 'I\'ve added some Stackable blocks for you. This inspector is contains all the settings for this block, let\'s explore it!', i18n ),
			help: createInterpolateElement( __( 'If you\'re familiar with <strong>page builders</strong>, then you\'ll feel right at home.', i18n ), {
				strong: <strong />,
			} ),
			anchor: '.ugb--has-panel-tabs',
			position: 'left',
			glowTarget: '.ugb--has-panel-tabs',
			preStep: () => {
				// Open the inspector sidebar
				dispatch( 'core/edit-post' ).openGeneralSidebar( 'edit-post/block' )
			},
		},
		{
			title: __( 'The Layout Tab', i18n ),
			description: __( 'Stackable blocks usually have 3 tabs, each with different settings. The Layout Tab contains layout-related options like flex controls, spacing and margins.', i18n ),
			help: createInterpolateElement( __( 'Open the <strong>Layout Tab</strong> to continue.', i18n ), {
				strong: <strong />,
			} ),
			anchor: '.edit-post-sidebar__panel-tab.ugb-tab--layout',
			position: 'left',
			glowTarget: '.edit-post-sidebar__panel-tab.ugb-tab--layout',
			nextEventTarget: '.edit-post-sidebar__panel-tab.ugb-tab--layout',
			preStep: () => {
				// Open the inspector sidebar
				dispatch( 'core/edit-post' ).openGeneralSidebar( 'edit-post/block' )

				// Make sure the Inner Column is selected.
				const block = select( 'core/block-editor' ).getSelectedBlock()
				if ( block?.name !== 'stackable/column' ) {
					// Look for the first "stackable/columns" block
					const allBlocks = select( 'core/block-editor' ).getBlocks()
					const columnsBlock = allBlocks.find( block => block.name === 'stackable/columns' )
					if ( columnsBlock ) {
						dispatch( 'core/block-editor' ).selectBlock( columnsBlock.innerBlocks[ 0 ].clientId )
					}
				}

				setTimeout( () => {
					// Click the tab
					document.querySelector( '.edit-post-sidebar__panel-tab.ugb-tab--layout:not(.is-active)' )?.click()
				}, 100 )
			},
		},
		{
			title: __( 'Try Changing Alignments', i18n ),
			description: __( 'Let\'s try changing the Column Alignment to Center or End, and see how it affects our block.', i18n ),
			help: createInterpolateElement( __( 'Pick <strong>Center or End</strong> Column Alignment to continue.', i18n ), {
				strong: <strong />,
			} ),
			anchor: '.ugb-column-align-control',
			position: 'left',
			glowTarget: '.ugb-column-align-control',
			nextEventTarget: '.ugb-column-align-control .stk-control-content button',
			preStep: () => {
				// Open the inspector sidebar
				dispatch( 'core/edit-post' ).openGeneralSidebar( 'edit-post/block' )

				// Make sure the Inner Column is selected.
				const block = select( 'core/block-editor' ).getSelectedBlock()
				if ( block?.name !== 'stackable/column' ) {
					// Look for the first "stackable/columns" block
					const allBlocks = select( 'core/block-editor' ).getBlocks()
					const columnsBlock = allBlocks.find( block => block.name === 'stackable/columns' )
					if ( columnsBlock ) {
						dispatch( 'core/block-editor' ).selectBlock( columnsBlock.innerBlocks[ 0 ].clientId )
					}
				}

				setTimeout( () => {
					// Click the tab
					document.querySelector( '.edit-post-sidebar__panel-tab.ugb-tab--layout:not(.is-active)' )?.click()
				}, 100 )

				setTimeout( () => {
					document.querySelector( '.ugb-panel--layout:not(.is-opened)' )?.click()
				}, 150 )
			},
		},
		{
			title: __( 'The Style Tab', i18n ),
			description: __( 'I\'ve selected the Columns block now, let\'s try to add a background to it. The Style Tab contains style-related options like backgrounds, color, borders and typography.', i18n ),
			help: createInterpolateElement( __( 'Click the <strong>Style Tab</strong> to continue.', i18n ), {
				strong: <strong />,
			} ),
			anchor: '.edit-post-sidebar__panel-tab.ugb-tab--style',
			position: 'left',
			glowTarget: '.edit-post-sidebar__panel-tab.ugb-tab--style',
			nextEventTarget: '.edit-post-sidebar__panel-tab.ugb-tab--style',
			preStep: () => {
				// Open the inspector sidebar
				dispatch( 'core/edit-post' ).openGeneralSidebar( 'edit-post/block' )

				// Look for the first "stackable/columns" block
				const allBlocks = select( 'core/block-editor' ).getBlocks()
				const columnsBlock = allBlocks.find( block => block.name === 'stackable/columns' )
				if ( columnsBlock ) {
					dispatch( 'core/block-editor' ).selectBlock( columnsBlock.clientId )
				}
			},
			postStep: () => {
				// Click the tab
				document.querySelector( '.edit-post-sidebar__panel-tab.ugb-tab--style:not(.is-active)' )?.click()
			},
		},
		{
			title: __( 'Try Enabling Backgrounds', i18n ),
			description: __( 'Let\'s try turning on the background for our section and see how it affects our block.', i18n ),
			help: createInterpolateElement( __( 'Toggle ON the <strong>Background</strong> to continue.', i18n ), {
				strong: <strong />,
			} ),
			anchor: '.ugb-block-background-panel .components-panel__body-title',
			position: 'left',
			glowTarget: '.ugb-block-background-panel .components-panel__body-title',
			nextEventTarget: '.ugb-block-background-panel .components-panel__body-title input[type="checkbox"]',
			nextEvent: 'mousedown',
			preStep: () => {
				// Open the inspector sidebar
				dispatch( 'core/edit-post' ).openGeneralSidebar( 'edit-post/block' )

				// Look for the first "stackable/columns" block
				const allBlocks = select( 'core/block-editor' ).getBlocks()
				const columnsBlock = allBlocks.find( block => block.name === 'stackable/columns' )
				if ( columnsBlock ) {
					dispatch( 'core/block-editor' ).selectBlock( columnsBlock.clientId )
				}

				setTimeout( () => {
					// Click the tab
					document.querySelector( '.edit-post-sidebar__panel-tab.ugb-tab--style:not(.is-active)' )?.click()
				}, 100 )
			},
			postStep: () => {
				const checkbox = document.querySelector( '.ugb-block-background-panel .components-panel__body-title input[type="checkbox"]' )
				if ( checkbox && ! checkbox.checked ) {
					checkbox.click()
				}
			},
		},
		{
			title: __( 'The Advanced Tab', i18n ),
			description: __( 'Lastly, the Advanced Tab contains all other options like z-index, transforms, conditional display and class names.', i18n ),
			help: createInterpolateElement( __( 'Click the <strong>Advanced Tab</strong> to continue.', i18n ), {
				strong: <strong />,
			} ),
			anchor: '.edit-post-sidebar__panel-tab.ugb-tab--advanced',
			position: 'left',
			glowTarget: '.edit-post-sidebar__panel-tab.ugb-tab--advanced',
			nextEventTarget: '.edit-post-sidebar__panel-tab.ugb-tab--advanced',
			preStep: () => {
				// Open the inspector sidebar
				dispatch( 'core/edit-post' ).openGeneralSidebar( 'edit-post/block' )

				// Look for the first "stackable/columns" block
				const allBlocks = select( 'core/block-editor' ).getBlocks()
				const columnsBlock = allBlocks.find( block => block.name === 'stackable/columns' )
				if ( columnsBlock ) {
					dispatch( 'core/block-editor' ).selectBlock( columnsBlock.clientId )
				}
			},
			postStep: () => {
				// Click the tab
				document.querySelector( '.edit-post-sidebar__panel-tab.ugb-tab--advanced:not(.is-active)' )?.click()
			},
		},
		{
			title: __( 'Consistent Options Everywhere', i18n ),
			description: __( 'Once you get the hang of these settings, you\'ll spot them in almost every Stackable block. This makes it easy and familiar to build any design you want.', i18n ),
			anchor: '.ugb--has-panel-tabs',
			position: 'left',
			preStep: () => {
				// Open the inspector sidebar
				dispatch( 'core/edit-post' ).openGeneralSidebar( 'edit-post/block' )

				// Look for the first "stackable/columns" block
				const allBlocks = select( 'core/block-editor' ).getBlocks()
				const columnsBlock = allBlocks.find( block => block.name === 'stackable/columns' )
				if ( columnsBlock ) {
					dispatch( 'core/block-editor' ).selectBlock( columnsBlock.clientId )
				}
			},
		},
		{
			title: __( 'One Last Thing…', i18n ),
			description: createInterpolateElement( __( 'You can also check the <strong>Stackable Design System</strong> to globally style all blocks. This saves a ton of time!', i18n ), {
				strong: <strong />,
			} ),
			anchor: '[aria-controls="stackable-global-settings:sidebar"]',
			position: 'left-top',
			offsetY: '-30px',
			offsetX: '-8px',
			glowTarget: '[aria-controls="stackable-global-settings:sidebar"]',
		},
	],
}
