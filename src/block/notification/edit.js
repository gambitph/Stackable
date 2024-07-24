/**
 * Internal dependencies
 */
import { ContainerStyles } from './style'
import SVGCloseIcon from './images/close-icon.svg'
import variations from './variations'

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
	getContentAlignmentClasses,
} from '~stackable/block-components'
import { useBlockContext } from '~stackable/hooks'
import {
	withBlockAttributeContext, withBlockWrapperIsHovered, withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { InnerBlocks } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import { addFilter } from '@wordpress/hooks'

const TEMPLATE = variations[ 0 ].innerBlocks

const Edit = props => {
	const {
		clientId,
		className,
		attributes,
		setAttributes,
	} = props

	useGeneratedCss( props.attributes )

	const { hasInnerBlocks, innerBlocks } = useBlockContext()
	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-notification',
	], {
		'stk--is-dismissible': attributes.isDismissible,
		[ `stk--is-${ props.attributes.notificationType }` ]: props.attributes.notificationType,
	} )

	const contentClassNames = classnames( [
		'stk-block-content',
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-notification__content',
		`stk-${ attributes.uniqueId }-inner-blocks`,
	], getContentAlignmentClasses( attributes ) )

	const lastBlockName = last( innerBlocks )?.name
	const renderAppender = hasInnerBlocks ? ( [ 'stackable/text', 'core/paragraph' ].includes( lastBlockName ) ? () => <></> : InnerBlocks.DefaultBlockAppender ) : InnerBlocks.ButtonBlockAppender

	return (
		<>
			<>
				<InspectorTabs />

				<ContentAlign.InspectorControls />
				<Alignment.InspectorControls hasContainerSize={ true } hasBlockAlignment={ true } />

				<InspectorStyleControls>
					<PanelAdvancedSettings
						title={ __( 'General', i18n ) }
						id="general"
						initialOpen={ true }
					>
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

				<BlockDiv.InspectorControls />
				<ContainerDiv.InspectorControls sizeSelector=".stk-block-content" />
				<BlockLink.InspectorControls />
				<Advanced.InspectorControls />
				<Transform.InspectorControls />
				<EffectsAnimations.InspectorControls />
				<CustomAttributes.InspectorControls />
				<CustomCSS.InspectorControls mainBlockClass="stk-block-notification" />
				<Responsive.InspectorControls />
				<ConditionalDisplay.InspectorControls />
			</>

			<InspectorStyleControls>
				<InspectorBottomTip />
			</InspectorStyleControls>

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
				enableVariationPicker={ true }
			>
				<ContainerStyles
					version={ VERSION }
					clientId={ clientId }
					blockState={ props.blockState }
				/>
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
			{ props.isHovered && hasInnerBlocks && <MarginBottom /> }
		</>
	)
}

export default compose(
	withBlockWrapperIsHovered,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )

// Prevent the text from being being styled with a saved default style.
addFilter( 'stackable.block-default-styles.use-saved-style', 'stackable/notification', ( enabled, block, parentBlockNames ) => {
	if ( block.name === 'stackable/icon' && parentBlockNames.length >= 1 && parentBlockNames[ parentBlockNames.length - 1 ] === 'stackable/notification' ) {
		return false
	}
	return enabled
} )
