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

		waitForElement( '.edit-post-sidebar__panel-tab.ugb-tab--style:not(.is-active)' ).then( () => {
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
				__( 'Locate the <strong>hover toggle</strong> next to <strong> Zoom</strong>. Click it to show the different hover state options.', i18n ),
				{ strong: <strong /> }
			),
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
				__( 'Now select the <strong>hover button</strong>. This lets you adjust how the image will look when hovered.', i18n ),
				{ strong: <strong /> }
			),
			anchor: '.stk-control:has([data-attribute="imageZoom"]) .stk-label-unit-toggle__wrapper',
			position: 'left',
			glowTarget: '.stk-control:has([data-attribute="imageZoom"]) .stk-label-unit-toggle__wrapper',
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
						imageZoomHover: 1.5,
					} )
				}
			},
		},
		{
			title: __( 'Preview Your Hover Effect', i18n ),
			description: createInterpolateElement(
				__( 'The image on the canvas is now showing your <strong>new hover zoom effect</strong>. No need to hover—this view already reflects the hover state.', i18n ),
				{ strong: <strong /> }
			),
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
				waitForElement( '.stk-control:has([data-attribute="imageZoom"]) .stk-label-unit-toggle__wrapper button:not(.is-active)[data-value="normal"]' ).then( () => {
					document.querySelector( '.stk-control:has([data-attribute="imageZoom"]) .stk-label-unit-toggle__wrapper button:not(.is-active)[data-value="normal"]' )?.click()
				} )
			},
		},
		{
			title: __( 'Back on Normal State', i18n ),
			description: createInterpolateElement(
				__( 'You are now back on the <strong>normal</strong> state. Notice the hover toggle is <strong>yellow</strong> - that means a custom hover effect has been saved!', i18n ),
				{ strong: <strong /> }
			),
			anchor: '.stk-control:has([data-attribute="imageZoom"]) .stk-control-label button',
			position: 'left',
			glowTarget: '.stk-control:has([data-attribute="imageZoom"]) .stk-control-label button',
		},
		{
			title: __( 'Pro Tip: Only Some Controls Feature Hover Toggle', i18n ),
			description: createInterpolateElement(
				__( 'Tip: Watch out—for some controls you <strong>won\'t see the hover state toggle</strong>. Only certain options support hover states. If you don\'t see the toggle, that control doesn\'t have hover customization!', i18n ),
				{ strong: <strong /> }
			),
			offsetX: '300px',
		},
	],
}
