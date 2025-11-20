import { __ } from '@wordpress/i18n'
import { i18n } from 'stackable'
import { dispatch, select } from '@wordpress/data'
import { createInterpolateElement } from '@wordpress/element'
import { waitForElement } from '../utils'

export const globalColorSchemes = {
	initialize: () => {
		// Add some default content that we will select

		const headingBlock = wp.blocks.createBlock(
			'stackable/heading',
			{
				uniqueId: '3dcffca',
				// Retain our text
				text: 'The World is Yours to Explore',
				textTag: 'h1',
			}
		)

		const columnsBlock = wp.blocks.createBlock(
			'stackable/columns',
			{
				uniqueId: '1dbe04e',
				blockMargin: { bottom: '' },
				align: 'full',
				hasBackground: true,
			},
			[
				wp.blocks.createBlock(
					'stackable/column',
					{
						uniqueId: 'f957abc',
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
		dispatch( 'core/block-editor' ).insertBlocks( [ headingBlock, columnsBlock ], 0 )
		// Open the global settings sidebar.
		dispatch( 'core/edit-post' )?.openGeneralSidebar( 'stackable-global-settings/sidebar' )

		setTimeout( () => {
			document.querySelector( '.ugb-global-color-schemes__panel:not(.is-opened) .components-panel__body-title button' )?.click()
		}, 200 )
	},
	steps: [
		{
			title: '👋 ' + __( 'Welcome to Your Global Color Schemes', i18n ),
			description: __( 'You can use the Global Color Schemes to easily apply consistent color themes across your entire website for effortless branding.', i18n ),
			size: 'medium',
			anchor: '.ugb-global-color-schemes__panel .components-panel__body-title',
			position: 'left',
		},
		{
			title: __( 'Default Color Scheme', i18n ),
			description: __( 'The default color scheme is the color scheme that is applied to your entire website by default.', i18n ),
			help: createInterpolateElement( __( 'Click the <strong>Default Color Scheme</strong> button to continue.', i18n ), {
				strong: <strong />,
			} ),
			anchor: '.ugb-global-color-schemes__panel .stk-global-color-scheme__color-scheme-item[data-item-key="scheme-default-1"]',
			position: 'left',
			nextEventTarget: '.ugb-global-color-schemes__panel .stk-global-color-scheme__color-scheme-item[data-item-key="scheme-default-1"]',
			glowTarget: '.ugb-global-color-schemes__panel .stk-global-color-scheme__color-scheme-item[data-item-key="scheme-default-1"]',
			postStep: () => {
				document.querySelector( '.ugb-global-color-schemes__panel .stk-global-color-scheme__color-scheme-item[data-item-key="scheme-default-1"]' )?.click()
			},
		},
		{
			title: __( 'Setting the Default Color Scheme', i18n ),
			description: __( 'To make things easy, we\'ve added some color scheme presets. Pick the 2nd one to quickly see how your entire design system will instantly change in the Style Guide preview below.', i18n ),
			help: createInterpolateElement( __( 'Click this <strong>color scheme preset</strong> to continue.', i18n ), {
				strong: <strong />,
			} ),
			size: 'medium',
			anchor: '.stk-preset-color-schemes__preset-wrapper > .stk-global-color-scheme__preview:nth-child(2)',
			position: 'left',
			nextEventTarget: '.stk-preset-color-schemes__preset-wrapper > .stk-global-color-scheme__preview:nth-child(2)',
			glowTarget: '.stk-preset-color-schemes__preset-wrapper > .stk-global-color-scheme__preview:nth-child(2)',
			postStep: () => {
				document.querySelector( '.stk-preset-color-schemes__preset-wrapper > .stk-global-color-scheme__preview:nth-child(2) button' )?.click()
			},
		},
		{
			title: __( 'See the Stackable Blocks Change Colors', i18n ),
			description: __( 'Notice how all Stackable blocks changed their colors across your site. You can further customize the colors below to match your brand or style.', i18n ),
			offsetX: '300px',
		},
		{
			title: __( 'Go Back to Color Schemes', i18n ),
			description: __( 'Let\'s see another way that color schemes can help with your site\'s design. Click the back button to return to the list of color schemes.', i18n ),
			help: createInterpolateElement( __( 'Click the <strong>Back</strong> button to continue.', i18n ), {
				strong: <strong />,
			} ),
			anchor: '.stk-inspector-sub-header button',
			position: 'left',
			glowTarget: '.stk-inspector-sub-header button',
			nextEventTarget: '.stk-inspector-sub-header button',
			postStep: () => {
				document.querySelector( '.stk-inspector-sub-header button' )?.click()
			},
		},
		{
			title: __( 'Background Schemes', i18n ),
			description: __( 'The columns block on this page has its block background enabled. You can assign a different color scheme to blocks with backgrounds turned on.', i18n ),
			help: createInterpolateElement( __( 'Click the <strong>Background Scheme</strong> button to continue.', i18n ), {
				strong: <strong />,
			} ),
			anchor: '.ugb-global-color-schemes__panel .stk-global-color-scheme__color-scheme-item[data-item-key="scheme-default-2"]',
			position: 'left',
			nextEventTarget: '.ugb-global-color-schemes__panel .stk-global-color-scheme__color-scheme-item[data-item-key="scheme-default-2"]',
			glowTarget: '.ugb-global-color-schemes__panel .stk-global-color-scheme__color-scheme-item[data-item-key="scheme-default-2"]',
			postStep: () => {
				document.querySelector( '.ugb-global-color-schemes__panel .stk-global-color-scheme__color-scheme-item[data-item-key="scheme-default-2"]' )?.click()
			},
		},
		{
			title: __( 'Pick a Darker Background Color Scheme', i18n ),
			description: __( 'Let\'s choose a darker color scheme preset for the background. This background color scheme will be used on blocks when the block background is enabled, giving your design more contrast and customization.', i18n ),
			help: createInterpolateElement( __( 'Click this <strong>color scheme preset</strong> to continue.', i18n ), {
				strong: <strong />,
			} ),
			size: 'medium',
			anchor: '.stk-preset-color-schemes__preset-wrapper > .stk-global-color-scheme__preview:nth-child(8)',
			position: 'left',
			nextEventTarget: '.stk-preset-color-schemes__preset-wrapper > .stk-global-color-scheme__preview:nth-child(8)',
			glowTarget: '.stk-preset-color-schemes__preset-wrapper > .stk-global-color-scheme__preview:nth-child(8)',
			modalDelay: 150,
			preStep: () => {
				setTimeout( () => {
					const targetElTop = document.querySelector( '.stk-preset-color-schemes__preset-wrapper' )?.getBoundingClientRect()?.top
					const editorSidebar = document.querySelector( '.interface-complementary-area.editor-sidebar' )
					if ( editorSidebar && typeof targetElTop === 'number' ) {
						editorSidebar.scrollTo( {
							top: targetElTop - editorSidebar.getBoundingClientRect().top - 300,
							behavior: 'smooth',
						} )
					}
				}, 100 )
			},
			postStep: () => {
				document.querySelector( '.stk-preset-color-schemes__preset-wrapper > .stk-global-color-scheme__preview:nth-child(8) button' )?.click()
			},
		},
		{
			title: __( 'Looking Good! Background Scheme Updated', i18n ),
			description: __( 'The columns block now uses your chosen darker background, and its content colors automatically follow the scheme for a nice, coordinated look.', i18n ),
			offsetX: '300px',
		},
		{
			title: __( 'Open the Inspector Sidebar', i18n ),
			description: __( 'Now let\'s open the Inspector sidebar so you can see where to further customize this color scheme.', i18n ),
			help: createInterpolateElement( __( 'Click the <strong>Inspector Controls</strong> button to continue.', i18n ), {
				strong: <strong />,
			} ),
			anchor: '[aria-controls="edit-post:block"]',
			position: 'left-top',
			offsetY: '-30px',
			offsetX: '-8px',
			glowTarget: '[aria-controls="edit-post:block"]',
			nextEventTarget: '[aria-controls="edit-post:block"]',
			postStep: async () => {
				dispatch( 'core/edit-post' ).openGeneralSidebar( 'edit-post/block' )
				// Make sure the Inner Column is selected.
				const block = select( 'core/block-editor' ).getSelectedBlock()
				if ( block?.name !== 'stackable/column' ) {
					// Look for the first "stackable/columns" block
					const allBlocks = select( 'core/block-editor' ).getBlocks()
					const columnsBlock = allBlocks.find( block => block.name === 'stackable/columns' )
					if ( columnsBlock ) {
						dispatch( 'core/block-editor' ).selectBlock( columnsBlock.clientId )
						await waitForElement( '.edit-post-sidebar__panel-tab.ugb-tab--style:not(.is-active)' )
						document.querySelector( '.edit-post-sidebar__panel-tab.ugb-tab--style:not(.is-active)' )?.click()

						await waitForElement( '.ugb-block-background-panel:not(.is-opened) button' )
						document.querySelector( '.ugb-block-background-panel:not(.is-opened) button' )?.click()
					}
				}
			},
		},
		{
			title: __( 'Switch Between Color Schemes Anytime', i18n ),
			description: __( 'If you have multiple global color schemes set up, you can easily change your block\'s style by switching the color scheme option here to instantly apply a new look.', i18n ),
			anchor: '.stk-control:has([data-attribute="backgroundColorScheme"])',
			position: 'left',
			glowTarget: '.stk-control:has([data-attribute="backgroundColorScheme"])',
			nextEventTarget: '.stk-control:has([data-attribute="backgroundColorScheme"]) select',
		},
		{
			title: __( 'Global Color Schemes Ready!', i18n ),
			description: __( 'You\'re all set! Start customizing and applying your global color schemes to make your site look great.', i18n ),
			offsetX: '300px',
			offsetY: '100px',
		},
	],
}
