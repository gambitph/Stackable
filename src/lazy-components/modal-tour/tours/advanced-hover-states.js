import { __ } from '@wordpress/i18n'
import { i18n } from 'stackable'
import { dispatch, select } from '@wordpress/data'
import { createInterpolateElement } from '@wordpress/element'

export const advancedHoverStates = {
	initialize: () => {
		// Add some default content that we will select

		const blockObject = wp.blocks.createBlock(
			'stackable/columns',
			{
				uniqueId: '1dbe04e',
				blockMargin: { bottom: '' },
				align: 'full',
				contentAlign: 'center',
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
			]
		)

		// Insert our block
		dispatch( 'core/block-editor' ).insertBlocks( [ blockObject ], 0 )

		// Select the inner columns block for the tour
		dispatch( 'core/block-editor' ).selectBlock( blockObject.innerBlocks[ 0 ].clientId )
	},
	steps: [
		{
			title: __( 'Styling Containers with Hover Styles', i18n ),
			description: createInterpolateElement(
				__( 'Styling the container with hover styles is a great way to add interactivity to your designs. Click the <strong>hover toggle</strong> next to <strong>Background Color</strong> to start.', i18n ),
				{ strong: <strong /> }
			),
			help: createInterpolateElement( __( 'Click the <strong>hover toggle</strong> next to <strong>Background Color</strong> to start.', i18n ), {
				strong: <strong />,
			} ),
			anchor: '.stk-control:has([data-attribute="containerBackgroundColor"])',
			position: 'left',
			glowTarget: '.stk-control:has([data-attribute="containerBackgroundColor"]) .stk-control-label button[data-value="normal"]',
			nextEventTarget: '.stk-control:has([data-attribute="containerBackgroundColor"]) .stk-control-label button',
			preStep: () => {
				setTimeout( () => {
					// Click the tab
					document.querySelector( '.edit-post-sidebar__panel-tab.ugb-tab--style:not(.is-active)' )?.click()

					setTimeout( () => {
						document.querySelector( '.ugb-panel--container:not(.is-opened) .stk-panel' )?.click()
					}, 100 )
				}, 100 )
			},
		},
		{
			title: __( 'Selecting the Hover State', i18n ),
			description: createInterpolateElement(
				__( 'Now select the <strong>hover button</strong>. This lets you adjust how the container will look when hovered.', i18n ),
				{ strong: <strong /> }
			),
			anchor: '.stk-control:has([data-attribute="containerBackgroundColor"]) .stk-label-unit-toggle__wrapper',
			position: 'left',
			glowTarget: '.stk-control:has([data-attribute="containerBackgroundColor"]) .stk-label-unit-toggle__wrapper',
			nextEventTarget: '.stk-control:has([data-attribute="containerBackgroundColor"]) .stk-label-unit-toggle__wrapper button:not(.is-active)[data-value="hover"]',
			nextEvent: 'mousedown',
			preStep: () => {
				document.querySelector( '.stk-control:has([data-attribute="containerBackgroundColor"]) .stk-label-unit-toggle__wrapper:not(.is-open) button' )?.click()
			},
			postStep: () => {
				document.querySelector( '.stk-control:has([data-attribute="containerBackgroundColor"]) .stk-label-unit-toggle__wrapper button:not(.is-active)[data-value="hover"]' )?.click()
			},
		},
		{
			title: __( 'Adjusting the Background Color on Hover', i18n ),
			description: createInterpolateElement(
				__( 'The controls now affect the <strong>Hover</strong> state only. Try adjusting the <strong>Background Color</strong> value and see how the preview changes when hovered.', i18n ),
				{ strong: <strong /> }
			),
			help: createInterpolateElement( __( 'Click on <strong>Background Color</strong> to open the color picker and select a color.', i18n ), {
				strong: <strong />,
			} ),
			anchor: '.stk-control:has([data-attribute="containerBackgroundColor"])',
			position: 'left',
			glowTarget: '.stk-control:has([data-attribute="containerBackgroundColor"]) .stk-control-content',
			nextEventTarget: '.stk-control-content[data-attribute="containerBackgroundColor"] button',
			preStep: () => {
				document.querySelector( '.stk-control:has([data-attribute="containerBackgroundColor"]) .stk-label-unit-toggle__wrapper button:not(.is-active)[data-value="hover"]' )?.click()
			},
			postStep: () => {
				document.querySelector( '.stk-control-content[data-attribute="containerBackgroundColor"] button:not(.is-open)' )?.click()
			},
		},
		{
			title: __( 'Pick a Color', i18n ),
			description: __( 'Select a color from the palette to apply it.', i18n ),
			anchor: '.components-popover__content:has(.stk-color-palette-control__popover-content)',
			position: 'left',
			glowTarget: '.components-popover__content:has(.stk-color-palette-control__popover-content)',
			nextEvent: 'mousedown',
			nextEventTarget: '.stk-color-palette-control__popover-content *',
			postStep: () => {
				const allBlocks = select( 'core/block-editor' ).getBlocks()
				const columnsBlock = allBlocks.find( block => block.name === 'stackable/columns' )
				if ( columnsBlock?.innerBlocks?.[ 0 ] && ! columnsBlock.innerBlocks[ 0 ].attributes?.containerBackgroundColorHover ) {
					dispatch( 'core/block-editor' ).updateBlockAttributes( columnsBlock.innerBlocks[ 0 ].clientId, {
						containerBackgroundColorHover: '#2b2b2b',
					} )
				}

				document.querySelector( '.stk-control:has([data-attribute="containerBackgroundColor"]) .block-editor-panel-color-gradient-settings__dropdown.is-open' )?.click()
			},
		},
		{
			title: __( 'Preview Your Hover Effect', i18n ),
			description: __( 'Now the background will turn dark when your mouse hovers over the container, however the text is now hard to read, let\'s change it.', i18n ),
			help: createInterpolateElement( __( 'Select the <strong>Heading Block</strong> to continue.', i18n ), {
				strong: <strong />,
			} ),
			offsetX: '300px',
			postStep: () => {
				const allBlocks = select( 'core/block-editor' ).getBlocks()
				const columnsBlock = allBlocks.find( block => block.name === 'stackable/columns' )
				if ( columnsBlock?.innerBlocks?.[ 0 ]?.innerBlocks?.[ 0 ] ) {
					dispatch( 'core/block-editor' ).selectBlock( columnsBlock.innerBlocks[ 0 ].innerBlocks[ 0 ].clientId )
				}
			},
		},
		{
			title: __( 'Selecting the Parent Container Hover State', i18n ),
			description: createInterpolateElement( __( 'Now select the <strong>parent container hover state</strong>. This lets you adjust how the heading text will look when the parent container is hovered.', i18n ), {
				strong: <strong />,
			} ),
			help: createInterpolateElement( __( 'Select the <strong>parent container hover state</strong> to continue.', i18n ), {
				strong: <strong />,
			} ),
			anchor: '.stk-control:has([data-attribute="textColor1"]) .stk-label-unit-toggle__wrapper button[data-value="parent-hover"]',
			position: 'left',
			glowTarget: '.stk-control:has([data-attribute="textColor1"]) .stk-label-unit-toggle__wrapper button[data-value="parent-hover"]',
			nextEventTarget: '.stk-control:has([data-attribute="textColor1"]) .stk-label-unit-toggle__wrapper button:not(.is-active)[data-value="parent-hover"]',
			preStep: () => {
				setTimeout( () => {
					const targetElTop = document.querySelector( '.stk-control:has([data-attribute="textColor1"])' )?.getBoundingClientRect()?.top
					const editorSidebar = document.querySelector( '.editor-sidebar.ugb--has-panel-tabs' )
					editorSidebar.scrollTo( {
						top: targetElTop - editorSidebar.getBoundingClientRect().top - 100,
						behavior: 'smooth',
					} )

					document.querySelector( '.stk-control:has([data-attribute="textColor1"]) .stk-label-unit-toggle__wrapper:not(.is-open) button' )?.click()
				}, 100 )
			},
			postStep: () => {
				document.querySelector( '.stk-control:has([data-attribute="textColor1"]) .stk-label-unit-toggle__wrapper:not(.is-open) button' )?.click()
				setTimeout( () => {
					document.querySelector( '.stk-control:has([data-attribute="textColor1"]) .stk-label-unit-toggle__wrapper button:not(.is-active)[data-value="parent-hover"]' )?.click()
				}, 100 )
			},
		},
		{
			title: __( 'Selecting the Heading Color', i18n ),
			description: createInterpolateElement( __( 'Now select the <strong>heading color</strong> to open the color picker.', i18n ), {
				strong: <strong />,
			} ),
			anchor: '.stk-control:has([data-attribute="textColor1"])',
			position: 'left',
			glowTarget: '.stk-control:has([data-attribute="textColor1"])',
			nextEventTarget: '.stk-control:has([data-attribute="textColor1"]) .stk-control-content button',
			preStep: () => {
				setTimeout( () => {
					const targetElTop = document.querySelector( '.stk-control:has([data-attribute="textColor1"])' )?.getBoundingClientRect()?.top
					const editorSidebar = document.querySelector( '.editor-sidebar.ugb--has-panel-tabs' )
					editorSidebar.scrollTo( {
						top: targetElTop - editorSidebar.getBoundingClientRect().top - 100,
						behavior: 'smooth',
					} )
				}, 100 )
			},
			postStep: () => {
				document.querySelector( '.stk-control-content[data-attribute="textColor1"] button:not(.is-open)' )?.click()
			},
		},
		{
			title: __( 'Pick a Text Color', i18n ),
			description: __( 'Select a text color from the palette to apply it.', i18n ),
			anchor: '.components-popover__content:has(.stk-color-palette-control__popover-content)',
			position: 'left',
			glowTarget: '.components-popover__content:has(.stk-color-palette-control__popover-content)',
			nextEvent: 'mousedown',
			nextEventTarget: '.stk-color-palette-control__popover-content *',
			postStep: () => {
				const allBlocks = select( 'core/block-editor' ).getBlocks()
				const columnsBlock = allBlocks.find( block => block.name === 'stackable/columns' )
				if ( columnsBlock?.innerBlocks?.[ 0 ]?.innerBlocks?.[ 0 ] && ! columnsBlock.innerBlocks[ 0 ].innerBlocks[ 0 ].attributes?.textColor1ParentHover ) {
					dispatch( 'core/block-editor' ).updateBlockAttributes( columnsBlock.innerBlocks[ 0 ].innerBlocks[ 0 ].clientId, {
						textColor1ParentHover: '#ffffff',
					} )
				}

				document.querySelector( '.stk-control:has([data-attribute="textColor1"]) .block-editor-panel-color-gradient-settings__dropdown.is-open' )?.click()
			},
		},
		{
			title: __( 'Heading Block is Now Readable', i18n ),
			description: __( 'Now the heading block is readable when your mouse hovers over the container. Let\'s do the same for the text color in the text block.', i18n ),
			offsetX: '300px',
			postStep: () => {
				const allBlocks = select( 'core/block-editor' ).getBlocks()
				const columnsBlock = allBlocks.find( block => block.name === 'stackable/columns' )
				if ( columnsBlock?.innerBlocks?.[ 0 ]?.innerBlocks?.[ 1 ] ) {
					dispatch( 'core/block-editor' ).selectBlock( columnsBlock.innerBlocks[ 0 ].innerBlocks[ 1 ].clientId )
				}
			},
		},
		{
			title: __( 'Selecting the Text Color for Parent Hover State', i18n ),
			description: createInterpolateElement( __( 'Now select the <strong>parent container hover state</strong>. This lets you adjust how the text block will look when the parent container is hovered.', i18n ), {
				strong: <strong />,
			} ),
			help: createInterpolateElement( __( 'Select the <strong>parent container hover state</strong> to continue.', i18n ), {
				strong: <strong />,
			} ),
			anchor: '.stk-control:has([data-attribute="textColor1"])',
			position: 'left',
			glowTarget: '.stk-control:has([data-attribute="textColor1"])',
			nextEventTarget: '.stk-control:has([data-attribute="textColor1"]) .stk-control-content button',
			modalDelay: 150,
			preStep: () => {
				setTimeout( () => {
					const targetElTop = document.querySelector( '.stk-control:has([data-attribute="textColor1"])' )?.getBoundingClientRect()?.top
					const editorSidebar = document.querySelector( '.editor-sidebar.ugb--has-panel-tabs' )

					if ( editorSidebar && typeof targetElTop === 'number' ) {
						editorSidebar.scrollTo( {
							top: targetElTop - editorSidebar.getBoundingClientRect().top - 100,
							behavior: 'smooth',
						} )
					}
				}, 100 )
			},
			postStep: () => {
				document.querySelector( '.stk-control-content[data-attribute="textColor1"] button:not(.is-open)' )?.click()
			},
		},
		{
			title: __( 'Pick a Text Color', i18n ),
			description: __( 'Select a text color from the palette to apply it.', i18n ),
			anchor: '.components-popover__content:has(.stk-color-palette-control__popover-content)',
			position: 'left',
			glowTarget: '.components-popover__content:has(.stk-color-palette-control__popover-content)',
			nextEvent: 'mousedown',
			nextEventTarget: '.stk-color-palette-control__popover-content *',
			postStep: () => {
				const allBlocks = select( 'core/block-editor' ).getBlocks()
				const columnsBlock = allBlocks.find( block => block.name === 'stackable/columns' )
				if ( columnsBlock?.innerBlocks?.[ 0 ]?.innerBlocks?.[ 1 ] && ! columnsBlock.innerBlocks[ 0 ].innerBlocks[ 1 ].attributes?.textColor1ParentHover ) {
					dispatch( 'core/block-editor' ).updateBlockAttributes( columnsBlock.innerBlocks[ 0 ].innerBlocks[ 1 ].clientId, {
						textColor1ParentHover: '#ffffff',
					} )
				}

				document.querySelector( '.stk-control:has([data-attribute="textColor1"]) .block-editor-panel-color-gradient-settings__dropdown.is-open' )?.click()
			},
		},
		{
			title: __( 'Text Block is also now readable', i18n ),
			description: __( 'Now the text block is also readable when your mouse hovers over the container.', i18n ),
			offsetX: '300px',
		},
		{
			title: __( 'Return to Normal State', i18n ),
			description: createInterpolateElement(
				__( 'Switch back to the normal state by clicking the <strong>cursor icon</strong> to test the hover states in action.', i18n ),
				{ strong: <strong /> }
			),
			anchor: '.stk-control:has([data-attribute="textColor1"]) .stk-label-unit-toggle__wrapper button[data-value="normal"]',
			position: 'left',
			glowTarget: '.stk-control:has([data-attribute="textColor1"]) .stk-label-unit-toggle__wrapper button[data-value="normal"]',
			nextEventTarget: '.stk-control:has([data-attribute="textColor1"]) .stk-label-unit-toggle__wrapper button[data-value="normal"]',
			nextEvent: 'mousedown',
			preStep: () => {
				document.querySelector( '.stk-control:has([data-attribute="textColor1"]) .stk-label-unit-toggle__wrapper:not(.is-open) button' )?.click()
			},
			postStep: () => {
				document.querySelector( '.stk-control:has([data-attribute="textColor1"]) .stk-label-unit-toggle__wrapper:not(.is-open) button' )?.click()
				setTimeout( () => {
					document.querySelector( '.stk-control:has([data-attribute="textColor1"]) .stk-label-unit-toggle__wrapper button:not(.is-active)[data-value="normal"]' )?.click()
				}, 100 )
			},
		},
		{
			title: __( 'Back on Normal State', i18n ),
			description: createInterpolateElement(
				__( 'You are now back on the <strong>normal</strong> state. You can now test the hover states in action.', i18n ),
				{ strong: <strong /> }
			),
			offsetX: '300px',
		},
		{
			title: __( 'Prop Tip: The Levels of Hover States', i18n ),
			description: createInterpolateElement(
				__( 'There are <strong>three levels of hover states</strong> you can style: <ul><li><strong>Normal State</strong>: when the mouse is not over any block</li><li><strong>Container Hover</strong>: when the mouse is hovering over a container</li><li><strong>Block Hover</strong>: when the mouse is directly over a block</li></ul>With Stackable, you can customize the appearance for all these states, making your designs more interactive and visually appealing.', i18n ),
				{
					strong: <strong />, ul: <ul />, li: <li />,
				}
			),
			offsetX: '300px',
		},
	],
}
