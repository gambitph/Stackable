/**
 * Internal dependencies
 */
import { ContainerStyles } from './style'
import { blockStyles } from './block-styles'
import SVGCloseIcon from './images/close-icon.svg'

/**
 * External dependencies
 */
import { version as VERSION, i18n } from 'stackable'
import { last } from 'lodash'
import classnames from 'classnames'
import {
	AdvancedRangeControl,
	ColorPaletteControl,
	InspectorStyleControls,
	InspectorTabs,
	PanelAdvancedSettings,
	AdvancedSelectControl,
	InspectorBottomTip,
} from '~stackable/components'
import {
	BlockDiv,
	useGeneratedCss,
	ContainerDiv,
	ConditionalDisplay,
	Alignment,
	getAlignmentClasses,
	EffectsAnimations,
	CustomAttributes,
	CustomCSS,
	Responsive,
	Advanced,
	MarginBottom,
	BlockLink,
	Transform,
	ContentAlign,
	useContentAlignmentClasses,
	BlockStyle,
} from '~stackable/block-components'
import {
	useBlockContext,
	useBlockHoverClass,
} from '~stackable/hooks'
import { withQueryLoopContext } from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import { useMemo } from '@wordpress/element'
import { __, _x } from '@wordpress/i18n'

const TEMPLATE = [
	[ 'stackable/icon', {
		icon: '<svg data-prefix="fas" data-icon="exclamation-triangle" class="svg-inline--fa fa-exclamation-triangle fa-w-18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" aria-hidden="true" width="32" height="32"><path fill="currentColor" d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path></svg>',
		iconColor1: '#FFFFFF',
	} ],
	[ 'stackable/heading', {
		text: _x( 'Title for This Block', 'Heading placeholder', i18n ), textTag: 'h3', textRemoveTextMargins: true,
		textColorClass: 'has-white-color',
		textColor1: '#FFFFFF',
	} ],
	[ 'stackable/text', {
		textColorClass: 'has-white-color',
		textColor1: '#FFFFFF',
		text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ),
	} ],
	[ 'stackable/button-group', {}, [
		[ 'stackable/button', {
			text: _x( 'Button', 'Button placeholder', i18n ),
			buttonBackgroundColor: 'transparent',
			buttonBorderType: 'solid',
			buttonBorderColor: '#FFFFFF',
			textColorClass: 'has-white-color',
			textColor1: '#FFFFFF',
			buttonBorderWidth: {
				top: 1,
				right: 1,
				bottom: 1,
				left: 1,
			},
		} ],
	] ],
]

const Edit = props => {
	const {
		className,
		attributes,
		setAttributes,
	} = props

	useGeneratedCss( props.attributes )

	const { hasInnerBlocks, innerBlocks } = useBlockContext()
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const blockHoverClass = useBlockHoverClass()

	const blockClassNames = classnames( [
		className,
		'stk-block-notification',
		blockHoverClass,
	], {
		'stk--is-dismissible': attributes.isDismissible,
		[ `stk--is-${ props.attributes.notificationType }` ]: props.attributes.notificationType,
	} )

	const contentClassNames = classnames( [
		'stk-block-content',
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-notification__content',
	], useContentAlignmentClasses( attributes ) )

	const renderAppender = useMemo( () => {
		return hasInnerBlocks ? ( [ 'stackable/text', 'core/paragraph' ].includes( last( innerBlocks )?.name ) ? () => <></> : InnerBlocks.DefaultBlockAppender ) : InnerBlocks.ButtonBlockAppender
	}, [ hasInnerBlocks, innerBlocks ] )

	return (
		<>

			<InspectorTabs />

			<Alignment.InspectorControls hasBlockAlignment={ true } />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<BlockLink.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-notification" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<BlockStyle.InspectorControls styles={ blockStyles } />
			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'General', i18n ) }
					id="general"
					initialOpen={ true }
				>
					<ContentAlign.InspectorControls.Controls />
					<AdvancedSelectControl
						label={ __( 'Notification Type', i18n ) }
						attribute="notificationType"
						options={ [
							{
								label: __( 'Success', i18n ),
								value: '',
							},
							{
								label: __( 'Error', i18n ),
								value: 'error',
							},
							{
								label: __( 'Warning', i18n ),
								value: 'warning',
							},
							{
								label: __( 'Information', i18n ),
								value: 'info',
							},
						] }
					/>
				</PanelAdvancedSettings>
				<PanelAdvancedSettings
					title={ __( 'Dismissible', i18n ) }
					initialOpen={ props.attributes.isDismissible }
					id="dismissible"
					hasToggle={ true }
					checked={ props.attributes.isDismissible }
					onChange={ value => setAttributes( { isDismissible: value } ) }
				>
					<AdvancedRangeControl
						label={ __( 'Icon Size', i18n ) }
						attribute="dismissibleSize"
						min="0"
						sliderMax="50"
						step="1"
						placeholder="16"
					/>
					<ColorPaletteControl
						label={ __( 'Icon Color', i18n ) }
						attribute="dismissibleColor"
					/>
				</PanelAdvancedSettings>
			</InspectorStyleControls>
			<ContainerDiv.InspectorControls sizeSelector=".stk-block-content" />

			<InspectorStyleControls>
				<InspectorBottomTip />
			</InspectorStyleControls>

			<BlockDiv className={ blockClassNames }>
				<ContainerStyles version={ VERSION } />
				<CustomCSS mainBlockClass="stk-block-notification" />

				<ContainerDiv className={ contentClassNames }>
					<InnerBlocks
						template={ TEMPLATE }
						templateLock={ false }
						renderAppender={ renderAppender }
					/>
					{ attributes.isDismissible &&
						<span
							className="stk-block-notification__close-button"
							role="button"
							tabIndex="0"
						>
							<SVGCloseIcon
								width={ attributes.dismissibleSize || 16 }
								height={ attributes.dismissibleSize || 16 }
							/>
						</span>
					}
				</ContainerDiv>
			</BlockDiv>
			{ hasInnerBlocks && <MarginBottom /> }
		</>
	)
}

export default withQueryLoopContext( Edit )
