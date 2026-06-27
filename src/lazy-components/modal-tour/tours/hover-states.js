import { __ } from '@wordpress/i18n'
import { i18n } from 'stackable'
import { dispatch, select } from '@wordpress/data'
import { createInterpolateElement } from '@wordpress/element'
import { waitForElement } from '../utils'

export const hoverStates = {
	initialize: () => {
		// Add some default content that we will select

		const blockObject = wp.blocks.createBlock(
			'stackable/image',
			{
				uniqueId: 'e063798',
				imageExternalUrl: 'https://picsum.photos/id/177/500/700.jpg',
			}
		)

		// Insert our block
		dispatch( 'core/block-editor' ).insertBlocks( [ blockObject ], 0 )

		// Select the inner columns block for the tour
		dispatch( 'core/block-editor' ).selectBlock( blockObject.clientId )

		waitForElement( '.edit-post-sidebar__panel-tab.ugb-tab--style' ).then( () => {
			document.querySelector( '.edit-post-sidebar__panel-tab.ugb-tab--style:not(.is-active)' )?.click()
			setTimeout( () => {
				document.querySelector( '.ugb-panel--image:not(.is-opened)' )?.click()
				const target = document.querySelector( '.stk-control:has([data-attribute="imageZoom"])' )
				target?.scrollIntoView( { behavior: 'auto', block: 'center' } )
			}, 100 )
		} )
	},
	steps: [
		{
			title: __( 'Using the Hover Effect Controls', i18n ),
			description: createInterpolateElement(
				__( 'Block options with a <strong>hover toggle</strong> on them can be adjusted for different hover states.', i18n ),
				{ strong: <strong /> }
			),
			help: createInterpolateElement( __( 'Click the <strong>hover toggle</strong> beside <strong> Zoom</strong> to open the hover state options.', i18n ), {
				strong: <strong />,
			} ),
			anchor: '.stk-control:has([data-attribute="imageZoom"])',
			position: 'left',
			glowTarget: '.stk-control:has([data-attribute="imageZoom"]) .stk-control-label button[data-value="normal"]',
			nextEventTarget: '.stk-control:has([data-attribute="imageZoom"]) .stk-control-label button',
			preStep: () => {
				waitForElement( '.stk-control:has([data-attribute="imageZoom"])', 3000 ).then( () => {
					const target = document.querySelector( '.stk-control:has([data-attribute="imageZoom"])' )
					target?.scrollIntoView( { behavior: 'auto', block: 'center' } )
				} )
			},
		},
		{
			title: __( 'Different Hover States', i18n ),
			description: createInterpolateElement(
				__( 'Now select the <strong>Hovered State button</strong>. This lets you adjust how the image will look when hovered.', i18n ),
				{ strong: <strong /> }
			),
			help: createInterpolateElement( __( 'Click the <strong>Second button from the list</strong> to toggle this hover state.', i18n ), {
				strong: <strong />,
			} ),
			anchor: '.stk-control:has([data-attribute="imageZoom"]) .stk-label-unit-toggle__wrapper',
			position: 'left',
			glowTarget: '.stk-control:has([data-attribute="imageZoom"]) .stk-label-unit-toggle__wrapper button[data-value="hover"]',
			nextEventTarget: '.stk-control:has([data-attribute="imageZoom"]) .stk-label-unit-toggle__wrapper button:not(.is-active)[data-value="hover"]',
			nextEvent: 'mousedown',
			preStep: () => {
				document.querySelector( '.stk-control:has([data-attribute="imageZoom"]) .stk-label-unit-toggle__wrapper:not(.is-open) button' )?.click()
			},
			postStep: () => {
				document.querySelector( '.stk-control:has([data-attribute="imageZoom"]) .stk-label-unit-toggle__wrapper button:not(.is-active)[data-value="hover"]' )?.click()
			},
		},
		{
			title: __( 'Adjusting Zoom on Hover', i18n ),
			description: createInterpolateElement(
				__( 'The controls now affect the <strong>Hover</strong> state only. Try adjusting the <strong>Image Zoom</strong> value and see how the preview changes when hovered.', i18n ),
				{ strong: <strong /> }
			),
			help: createInterpolateElement( __( 'Pick a zoom value of <strong>1.2</strong> to see the hover effect then click on next.', i18n ), {
				strong: <strong />,
			} ),
			anchor: '.stk-control:has([data-attribute="imageZoom"])',
			position: 'left',
			glowTarget: '.stk-control:has([data-attribute="imageZoom"]) .stk-control-content',
			preStep: () => {
				document.querySelector( '.stk-control:has([data-attribute="imageZoom"]) .stk-label-unit-toggle__wrapper button:not(.is-active)[data-value="hover"]' )?.click()
			},
			postStep: () => {
				// Update the order of the columns for mobile by dispatching an attribute update.
				const allBlocks = select( 'core/block-editor' ).getBlocks()
				const imageBlock = allBlocks.find( block => block.name === 'stackable/image' )
				if ( imageBlock && ! imageBlock.attributes?.imageZoomHover ) {
					dispatch( 'core/block-editor' ).updateBlockAttributes( imageBlock.clientId, {
						imageZoomHover: 1.2,
					} )
				}
			},
		},
		{
			title: __( 'Hover State Preview', i18n ),
			description: createInterpolateElement(
				__( 'Notice that the image block is now zoomed in. Any changes you make to the block will be reflected in the hover state only.', i18n ),
				{ strong: <strong /> }
			),
			help: __( 'Click next to continue.', i18n ),
			offsetX: '300px',
		},
		{
			title: __( 'Return to Normal State', i18n ),
			description: createInterpolateElement(
				__( 'Switch back to the normal state by clicking the <strong>cursor icon</strong> to test the hover effect in action.', i18n ),
				{ strong: <strong /> }
			),
			anchor: '.stk-control:has([data-attribute="imageZoom"]) .stk-label-unit-toggle__wrapper button[data-value="normal"]',
			position: 'left',
			glowTarget: '.stk-control:has([data-attribute="imageZoom"]) .stk-label-unit-toggle__wrapper button[data-value="normal"]',
			nextEventTarget: '.stk-control:has([data-attribute="imageZoom"]) .stk-label-unit-toggle__wrapper button[data-value="normal"]',
			nextEvent: 'mousedown',
			preStep: () => {
				document.querySelector( '.stk-control:has([data-attribute="imageZoom"]) .stk-label-unit-toggle__wrapper:not(.is-open) button' )?.click()
			},
			postStep: () => {
				document.querySelector( '.stk-control:has([data-attribute="imageZoom"]) .stk-label-unit-toggle__wrapper:not(.is-open) button' )?.click()
				waitForElement( '.stk-control:has([data-attribute="imageZoom"]) .stk-label-unit-toggle__wrapper button[data-value="normal"]' ).then( () => {
					document.querySelector( '.stk-control:has([data-attribute="imageZoom"]) .stk-label-unit-toggle__wrapper button:not(.is-active)[data-value="normal"]' )?.click()
				} )
			},
		},
		{
			title: __( 'Back on Normal State', i18n ),
			description: createInterpolateElement(
				__( 'You are now back on the <strong>normal</strong> state. Notice the hover toggle is <strong>yellow</strong>, this means there is a value set for the hover state!', i18n ),
				{ strong: <strong /> }
			),
			anchor: '.stk-control:has([data-attribute="imageZoom"]) .stk-label-unit-toggle',
			position: 'left',
			glowTarget: '.stk-control:has([data-attribute="imageZoom"]) .stk-label-unit-toggle',
		},
		{
			title: __( 'Hover Over the Image', i18n ),
			description: createInterpolateElement(
				__( 'Hover over the image block to see the hover effect in action.', i18n ),
				{ strong: <strong /> }
			),
			help: __( 'Click next to continue.', i18n ),
			offsetX: '300px',
		},
		{
			title: __( 'Tip: Not All Controls Have Hover States', i18n ),
			description: createInterpolateElement(
				__( 'Only certain options support hover states. If you see the toggle on another option (like <strong>Image Shadow</strong>), that means the control has hover states!', i18n ),
				{ strong: <strong /> }
			),
			anchor: '.stk-control:has([data-attribute="imageShadow"])',
			position: 'left',
			glowTarget: '.stk-control:has([data-attribute="imageShadow"])',
		},
	],
}
