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
			title: __( 'Advnaced Hover State Styling', i18n ),
			description: createInterpolateElement(
				__( 'Learn how to style containers and their contents together by applying hover effects to multiple blocks at once.', i18n ),
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
				__( 'Now select the <strong>Hovered State</strong> button. This lets you adjust how the container will look when hovered.', i18n ),
				{ strong: <strong /> }
			),
			anchor: '.stk-control:has([data-attribute="containerBackgroundColor"]) .stk-label-unit-toggle__wrapper button[data-value="hover"]',
			position: 'left',
			glowTarget: '.stk-control:has([data-attribute="containerBackgroundColor"]) .stk-label-unit-toggle__wrapper button[data-value="hover"]',
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
			title: __( 'Hover Background Color', i18n ),
			description: createInterpolateElement(
				__( 'The controls now affect the <strong>Hover</strong> state only. Let\'s try adjusting the <strong>Background Color</strong> to black.', i18n ),
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
			title: __( 'Pick a Dark Color', i18n ),
			description: __( 'Select a black or another dark color from the palette to apply it to the hovered state of this container.', i18n ),
			anchor: '.components-popover__content:has(.stk-color-palette-control__popover-content)',
			position: 'left',
			help: createInterpolateElement( __( 'Click next to continue.', i18n ), {
				strong: <strong />,
			} ),
			glowTarget: '.components-popover__content:has(.stk-color-palette-control__popover-content)',
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
			title: __( 'Text is Now Unreadable', i18n ),
			description: __( 'On hover, the background will now be black, but now we cannot read the Heading text properly! Let\'s change it!', i18n ),
			help: createInterpolateElement( __( 'Select the <strong>Heading Block</strong> and click next to continue.', i18n ), {
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
			title: __( 'Parent Hovered State', i18n ),
			description: createInterpolateElement( __( 'Now select the <strong>Parent Container Hover State</strong>. This lets you adjust how the heading text will look when the parent container is hovered.', i18n ), {
				strong: <strong />,
			} ),
			help: createInterpolateElement( __( 'Select the <strong>parent container hover state</strong> to continue.', i18n ), {
				strong: <strong />,
			} ),
			anchor: '.stk-control:has([data-attribute="textColor1"]) .stk-label-unit-toggle__wrapper button[data-value="parent-hover"]',
			position: 'left',
			glowTarget: '.stk-control:has([data-attribute="textColor1"]) .stk-label-unit-toggle__wrapper button[data-value="parent-hover"]',
			nextEventTarget: '.stk-control:has([data-attribute="textColor1"]) .stk-label-unit-toggle__wrapper button:not(.is-active)[data-value="parent-hover"]',
			nextEvent: 'mousedown',
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
			title: __( 'Heading Color', i18n ),
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
			title: __( 'Make the Heading White', i18n ),
			description: __( 'Select white from the palette to apply it to the hovered state of the heading text.', i18n ),
			help: createInterpolateElement( __( 'Click next to continue.', i18n ), {
				strong: <strong />,
			} ),
			anchor: '.components-popover__content:has(.stk-color-palette-control__popover-content)',
			position: 'left',
			glowTarget: '.components-popover__content:has(.stk-color-palette-control__popover-content)',
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
			title: __( 'Text Color', i18n ),
			description: createInterpolateElement( __( 'Now that\'s better! Let\'s do the same for the text block.', i18n ), {
				strong: <strong />,
			} ),
			help: createInterpolateElement( __( 'Select the <strong>text color</strong> to open the color picker.', i18n ), {
				strong: <strong />,
			} ),
			anchor: '.stk-control:has([data-attribute="textColor1"])',
			position: 'left',
			glowTarget: '.stk-control:has([data-attribute="textColor1"])',
			nextEventTarget: '.stk-control:has([data-attribute="textColor1"]) .stk-control-content button',
			modalDelay: 150,
			preStep: () => {
				setTimeout( () => {
					const allBlocks = select( 'core/block-editor' ).getBlocks()
					const columnsBlock = allBlocks.find( block => block.name === 'stackable/columns' )
					if ( columnsBlock?.innerBlocks?.[ 0 ]?.innerBlocks?.[ 1 ] ) {
						dispatch( 'core/block-editor' ).selectBlock( columnsBlock.innerBlocks[ 0 ].innerBlocks[ 1 ].clientId )
					}

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
			title: __( 'Make the Text White', i18n ),
			description: __( 'With the Text block now selected, pick white from the palette to apply it to the hovered state of the text block.', i18n ),
			help: createInterpolateElement( __( 'Click next to continue.', i18n ), {
				strong: <strong />,
			} ),
			anchor: '.components-popover__content:has(.stk-color-palette-control__popover-content)',
			position: 'left',
			glowTarget: '.components-popover__content:has(.stk-color-palette-control__popover-content)',
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
			title: __( 'Back to Normal State', i18n ),
			description: createInterpolateElement(
				__( 'Our block looks good! Now let\'s switch back to the normal state by clicking the <strong>Normal State</strong> button.', i18n ),
				{ strong: <strong /> }
			),
			help: createInterpolateElement( __( 'You can also de-select the block to return to the normal state.', i18n ), {
				strong: <strong />,
			} ),
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
			title: __( 'We\'re Done!', i18n ),
			description: createInterpolateElement(
				__( 'You are now seeing the block in its <strong>normal</strong> state. Hover over the block to see the hover states in action.', i18n ),
				{ strong: <strong /> }
			),
			help: createInterpolateElement( __( 'Hover your mouse over the block and see it switch live.', i18n ), {
				strong: <strong />,
			} ),
			offsetX: '300px',
		},
		{
			title: __( 'Pro Tip: Different Hover States', i18n ),
			description: createInterpolateElement(
				__( 'There are <strong>three levels of hover states</strong> you can style: <ul><li><strong>Normal State</strong>: when the mouse is not over any block</li><li><strong>Block Hover</strong>: when the mouse is directly over a block</li><li><strong>Container Hover</strong>: when the mouse is hovering over a container</li></ul>You can customize the appearance for all these states, making your designs more interactive and visually appealing.', i18n ),
				{
					strong: <strong />, ul: <ul />, li: <li />,
				}
			),
		},
	],
}
