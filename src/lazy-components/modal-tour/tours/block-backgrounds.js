import { __ } from '@wordpress/i18n'
import { i18n } from 'stackable'
import { dispatch, select } from '@wordpress/data'
import { createInterpolateElement } from '@wordpress/element'

export const blockBackgrounds = {
	initialize: () => {
		// Add some default content that we will select

		const blockObject = wp.blocks.createBlock(
			'stackable/columns',
			{
				uniqueId: '1dbe04e',
				blockMargin: { bottom: '' },
				align: 'full',
				containerWidth: 50,
				containerHorizontalAlign: 'flex-start',
				containerWidthUnit: '%',
			},
			[
				wp.blocks.createBlock(
					'stackable/column',
					{
						uniqueId: 'f957abc',
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
			]
		)
		// Insert our block
		dispatch( 'core/block-editor' ).insertBlocks( [ blockObject ], 0 )

		// Select the inner columns block for the tour
		dispatch( 'core/block-editor' ).selectBlock( blockObject.clientId )
	},
	steps: [
		{
			title: __( 'Discover Stackable Block Backgrounds & Containers', i18n ),
			description: __( 'Welcome! Let\'s enhance your page by first adding a background to the Columns block. The Style Tab lets you tweak backgrounds, colors, borders, and typography for a custom look.', i18n ),
			help: createInterpolateElement( __( 'Click the <strong>Style Tab</strong> in the sidebar to get started.', i18n ), {
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
			title: __( 'Enable a Block Background', i18n ),
			description: __( 'Turn on the background option to instantly add a background layer to your section. Watch as your design transforms with a single toggle.', i18n ),
			help: createInterpolateElement( __( 'Toggle ON the <strong>Background</strong> option to continue.', i18n ), {
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
		},
		{
			title: __( 'Customize the Background Color', i18n ),
			description: __( 'Now let\'s personalize your section. Choose a background color to help your content stand out or integrate it seamlessly into your page design.', i18n ),
			help: createInterpolateElement( __( 'Open the <strong>Background Color</strong> panel to select a color.', i18n ), {
				strong: <strong />,
			} ),
			anchor: '.stk-color-palette-control',
			position: 'left',
			glowTarget: '.ugb-block-background-panel .block-editor-panel-color-gradient-settings__dropdown',
			nextEventTarget: '.ugb-block-background-panel .block-editor-panel-color-gradient-settings__dropdown',
			nextEvent: 'mousedown',
			preStep: () => {
				// Toggle background on
				document.querySelector( '.ugb-block-background-panel:not(is-opened)' )?.click()
				document.querySelector( '.ugb-block-background-panel .ugb-toggle-panel-form-toggle:not(is-checked) input' )?.click()
			},
			postStep: () => {
				// Click the tab
				document.querySelector( '.ugb-block-background-panel .stk-color-palette-control .block-editor-panel-color-gradient-settings__dropdown:not(is-open)' )?.click()
			},
		},
		{
			title: __( 'Pick Your Brand Color', i18n ),
			description: __( 'Select a color that matches your brand or mood. Try out different colors and instantly see the changes on your block.', i18n ),
			help: createInterpolateElement( __( 'Choose a <strong>Color</strong> from the palette to apply it.', i18n ), {
				strong: <strong />,
			} ),
			anchor: '.stk-color-palette-control__popover-content',
			position: 'left',
			glowTarget: '.stk-color-palette-control__popover-content',
			nextEvent: 'mousedown',
			nextEventTarget: '.stk-color-palette-control__popover-content *',
			postStep: () => {
				// Click the color picker
				document.querySelector( '.ugb-block-background-panel .stk-color-palette-control .block-editor-panel-color-gradient-settings__dropdown.is-open' )?.click()
			},
		},
		{
			title: __( 'Add a Container for Better Layout', i18n ),
			description: __( 'Turn on the Container option to give your columns content a background, padding, and improved alignment for a polished look.', i18n ),
			help: createInterpolateElement( __( 'Toggle ON the <strong>Container</strong> to proceed.', i18n ), {
				strong: <strong />,
			} ),
			anchor: '.ugb-panel--container-size .components-panel__body-title',
			position: 'left',
			glowTarget: '.ugb-panel--container-size .components-panel__body-title',
			nextEventTarget: '.ugb-panel--container-size .components-panel__body-title input[type="checkbox"]',
			nextEvent: 'mousedown',
			preStep: () => {
				// Click the tab
				document.querySelector( '.ugb-block-background-panel .stk-color-palette-control .block-editor-panel-color-gradient-settings__dropdown.is-open' )?.click()

				const allBlocks = select( 'core/block-editor' ).getBlocks()
				const columnsBlock = allBlocks.find( block => block.name === 'stackable/columns' )
				if ( columnsBlock && columnsBlock.innerBlocks[ 0 ] ) {
					dispatch( 'core/block-editor' ).selectBlock( columnsBlock.innerBlocks[ 0 ].clientId )
					document.querySelector( '.edit-post-sidebar__panel-tab.ugb-tab--layout:not(.is-active)' )?.click()
					setTimeout( () => {
						document.querySelector( '.ugb-panel--layout.is-opened .components-panel__body-title button' )?.click()
					}, 100 )
				}
			},
		},
		{
			title: __( 'Block Backgrounds & Containers Recap', i18n ),
			description: __( 'Great job! You\'ve learned how to add and customize block backgrounds and containers. These features are available in most Stackable blocks, helping you create beautiful, consistent layouts with ease.', i18n ),
			preStep: () => {
				// Toggle background on
				document.querySelector( '.ugb-panel--container-size:not(is-opened)' )?.click()
				document.querySelector( '.ugb-panel--container-size .ugb-toggle-panel-form-toggle:not(is-checked) input' )?.click()
			},
		},
		{
			title: __( 'Tip: Style All Blocks Efficiently', i18n ),
			description: createInterpolateElement( __( 'Use the <strong>Stackable Design System</strong> to manage styles for all Stackable blocks globally. Perfect for a unified look and quick design changes!', i18n ), {
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
