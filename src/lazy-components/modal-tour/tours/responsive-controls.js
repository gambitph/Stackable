import { __ } from '@wordpress/i18n'
import { i18n } from 'stackable'
import { dispatch, select } from '@wordpress/data'
import { createInterpolateElement } from '@wordpress/element'

export const responsiveControls = {
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
					]
				),
				wp.blocks.createBlock(
					'stackable/column',
					{
						uniqueId: '3dcffca',
					},
					[
						wp.blocks.createBlock(
							'stackable/image',
							{
								uniqueId: 'e063798',
								imageExternalUrl: 'https://picsum.photos/id/177/500/700.jpg',
							}
						),
					]
				),
			]
		)

		// Delete all blocks
		// const allBlocks = select( 'core/block-editor' ).getBlocks()
		// dispatch( 'core/block-editor' ).removeBlocks( allBlocks.map( block => block.clientId ) )

		// Insert our block
		dispatch( 'core/block-editor' ).insertBlocks( [ blockObject ], 0 )

		// Select the inner columns block for the tour
		dispatch( 'core/block-editor' ).selectBlock( blockObject.clientId )
	},
	steps: [
		{
			title: __( 'Enable Responsive Controls', i18n ),
			description: createInterpolateElement(
				__( 'Click the <strong>responsive toggle</strong> beside <strong>Column Arrangement</strong> to open the device options.', i18n ),
				{ strong: <strong /> }
			),
			anchor: '.ugb-sort-control .stk-control-responsive-toggle',
			position: 'left',
			glowTarget: '.ugb-sort-control.components-base-control .stk-control-responsive-toggle',
			nextEventTarget: '.ugb-sort-control.components-base-control .stk-control-responsive-toggle button',
			preStep: () => {
				dispatch( 'core/edit-post' ).openGeneralSidebar( 'edit-post/block' )
				// Make sure the Columns block is selected
				const allBlocks = select( 'core/block-editor' ).getBlocks()
				const columnsBlock = allBlocks.find( block => block.name === 'stackable/columns' )
				if ( columnsBlock ) {
					dispatch( 'core/block-editor' ).selectBlock( columnsBlock.clientId )
				}
				setTimeout( () => {
					// Open Layout tab if it's not open
					document.querySelector( '.edit-post-sidebar__panel-tab.ugb-tab--layout:not(.is-active)' )?.click()
				}, 100 )
				setTimeout( () => {
					document.querySelector( '.ugb-panel--layout:not(.is-opened)' )?.click()
				}, 200 )
			},
			postStep: () => {
				document.querySelector( '.ugb-sort-control .stk-control-responsive-toggle:not(.is-open) button' )?.click()
			},
		},
		{
			title: __( 'Switch to Mobile', i18n ),
			description: createInterpolateElement(
				__( 'Let\'s customize for mobile! Click the <strong>mobile button</strong> — this lets you change how your columns are arranged <strong>just for mobile screens</strong>.', i18n ),
				{ strong: <strong /> }
			),
			anchor: '.ugb-sort-control .stk-control-responsive-toggle',
			position: 'left',
			glowTarget: '.ugb-sort-control.components-base-control .stk-control-responsive-toggle .stk-label-unit-toggle__wrapper',
			nextEventTarget: '.ugb-sort-control .stk-control-responsive-toggle.is-open button[aria-label="Mobile"]',
			nextEvent: 'mousedown',
			preStep: () => {
				document.querySelector( '.ugb-sort-control .stk-control-responsive-toggle:not(.is-open) button' )?.click()
			},
			postStep: () => {
				document.querySelector( '.ugb-sort-control .stk-control-responsive-toggle button:not(.is-active)[data-value="mobile"]' )?.click()
			},
		},
		{
			title: __( 'Now Editing Mobile Layout', i18n ),
			description: createInterpolateElement(
				__( 'See how the editor preview changed size? The responsive toggle now shows a <strong>mobile icon</strong>, meaning you\'re adjusting <strong>only for mobile</strong>.', i18n ),
				{ strong: <strong /> }
			),
			anchor: '.ugb-sort-control .stk-control-responsive-toggle',
			position: 'left',
			glowTarget: '.ugb-sort-control.components-base-control .stk-control-responsive-toggle',
			preStep: () => {
				document.querySelector( '.ugb-sort-control .stk-control-responsive-toggle button:not(.is-active)[data-value="mobile"]' )?.click()
			},
		},
		{
			title: __( 'Change Column Order for Mobile', i18n ),
			description: createInterpolateElement(
				__( 'On mobile, it usually looks better to show the <strong>image before the text</strong>. Drag the first column below the second to rearrange them for mobile devices.', i18n ),
				{ strong: <strong /> }
			),
			anchor: '.ugb-sort-control .stk-control-content',
			position: 'left',
			glowTarget: '.ugb-sort-control .stk-control-content .ugb-sort-control__container',
			postStep: () => {
			// Update the order of the columns for mobile by dispatching an attribute update.
				const allBlocks = wp.data.select( 'core/block-editor' ).getBlocks()
				const columnsBlock = allBlocks.find( block => block.name === 'stackable/columns' )
				if ( columnsBlock ) {
				// Reverse the order of columns for mobile by updating the mobileOrder attribute.
				// The default order is [0, 1]. Swapping makes it [1, 0].
					wp.data.dispatch( 'core/block-editor' ).updateBlockAttributes( columnsBlock.clientId, {
						columnArrangementMobile: '2,1',
					} )
				}
			},
		},
		{
			title: __( 'Switching back to Desktop', i18n ),
			description: createInterpolateElement(
				__( 'Notice the arrangement now reflects <strong>your mobile order</strong>. If you want to switch back to desktop, click the responsive toggle and select the desktop icon.', i18n ),
				{ strong: <strong /> }
			),
			anchor: '.ugb-sort-control .stk-control-responsive-toggle button[data-value="desktop"]',
			position: 'left',
			glowTarget: '.ugb-sort-control .stk-control-responsive-toggle button[data-value="desktop"]',
			nextEventTarget: '.ugb-sort-control .stk-control-responsive-toggle button[data-value="desktop"]',
			nextEvent: 'mousedown',
			preStep: () => {
				document.querySelector( '.ugb-sort-control .stk-control-responsive-toggle:not(.is-open) button' )?.click()
			},
			postStep: () => {
				document.querySelector( '.ugb-sort-control .stk-control-responsive-toggle:not(.is-open) button' )?.click()
				setTimeout( () => {
					document.querySelector( '.ugb-sort-control .stk-control-responsive-toggle button:not(.is-active)[data-value="desktop"]' )?.click()
				}, 100 )
			},
		},
		{
			title: __( 'Desktop Settings Are Preserved', i18n ),
			description: createInterpolateElement(
				__( "You're now back on the <strong>desktop</strong> view and your original column order has been preserved. Notice the responsive toggle is <strong>yellow</strong> — that means a custom layout for mobile has been saved!", i18n ),
				{ strong: <strong /> }
			),
			anchor: '.ugb-sort-control .stk-control-responsive-toggle',
			position: 'left',
			glowTarget: '.ugb-sort-control.components-base-control .stk-control-responsive-toggle',
		},
		{
			title: __( 'Tip: Preview Responsively!', i18n ),
			description: createInterpolateElement(
				__( 'You can use the <strong>preview button</strong> at the top of the editor to instantly see how your arrangement looks in desktop, tablet, and mobile. Try it out!', i18n ),
				{ strong: <strong /> }
			),
			anchor: '.editor-header__settings .editor-preview-dropdown',
			position: 'bottom',
			glowTarget: '.editor-header__settings .editor-preview-dropdown',
		},
	],
}
