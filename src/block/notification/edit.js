/**
 * Internal dependencies
 */
import { ContainerStyles } from './style'
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
} from '~stackable/components'
import {
	BlockDiv,
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
} from '~stackable/block-components'
import {
	useBlockContext,
	useBlockHoverClass,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import { useMemo } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

const TEMPLATE = [
	[ 'stackable/heading', { text: __( 'Notification', i18n ), textTag: 'h3' } ],
	[ 'stackable/text', { text: 'Description for this block. Use this space for describing your block.' } ],
	[ 'stackable/button-group', {}, [
		[ 'stackable/button', { text: 'Button' } ],
	] ],
]

const Edit = props => {
	const {
		className,
		attributes,
		setAttributes,
	} = props

	const { hasInnerBlocks, innerBlocks } = useBlockContext()
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const blockHoverClass = useBlockHoverClass()

	const blockClassNames = classnames( [
		className,
		'stk-block-notification',
		'stk-block-notification__inner-container',
		blockHoverClass,
	], {
		'stk--is-dismissible': attributes.isDismissible,
	} )

	const contentClassNames = classnames( [
		'stk-block-content',
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-notification__content',
	], useContentAlignmentClasses( attributes ) )

	const renderAppender = useMemo( () => {
		return hasInnerBlocks ? ( [ 'stackable/text', 'core/paragraph' ].includes( last( innerBlocks )?.name ) ? InnerBlocks.DefaultBlockAppender : () => <></> ) : InnerBlocks.ButtonBlockAppender
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

			<ContentAlign.InspectorControls />
			<InspectorStyleControls>
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

			<BlockDiv className={ blockClassNames }>
				<ContainerStyles version={ VERSION } />
				<CustomCSS mainBlockClass="stk-block-notification" />

				<ContainerDiv className={ contentClassNames }>
					<InnerBlocks
						template={ TEMPLATE }
						templateLock={ false }
						renderAppender={ renderAppender }
					/>
				</ContainerDiv>
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
			</BlockDiv>
			<MarginBottom />
		</>
	)
}

export default Edit
