/**
 * Internal dependencies
 */
import { IconLabelStyles } from './style'

/**
 * External dependencies
 */
import { version as VERSION, i18n } from 'stackable'
import classnames from 'classnames'
import {
	InspectorTabs,
	InspectorStyleControls,
	PanelAdvancedSettings,
	ImageControl2,
	AdvancedTextControl,
	InspectorBottomTip,
} from '~stackable/components'
import {
	BlockDiv,
	useGeneratedCss,
	MarginBottom,
	getRowClasses,
	Alignment,
	getAlignmentClasses,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	Transform,
} from '~stackable/block-components'
import {
	withBlockAttributeContext, withBlockWrapper, withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { InnerBlocks } from '@wordpress/block-editor'
import { Fragment } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { addFilter } from '@wordpress/hooks'

export const defaultIcon = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="expand-alt" class="svg-inline--fa fa-expand-alt fa-w-14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="32" height="32"><path fill="currentColor" d="M212.686 315.314L120 408l32.922 31.029c15.12 15.12 4.412 40.971-16.97 40.971h-112C10.697 480 0 469.255 0 456V344c0-21.382 25.803-32.09 40.922-16.971L72 360l92.686-92.686c6.248-6.248 16.379-6.248 22.627 0l25.373 25.373c6.249 6.248 6.249 16.378 0 22.627zm22.628-118.628L328 104l-32.922-31.029C279.958 57.851 290.666 32 312.048 32h112C437.303 32 448 42.745 448 56v112c0 21.382-25.803 32.09-40.922 16.971L376 152l-92.686 92.686c-6.248 6.248-16.379 6.248-22.627 0l-25.373-25.373c-6.249-6.248-6.249-16.378 0-22.627z"></path></svg>'

const TEMPLATE = [
	[ 'stackable/icon', {
		contentAlign: 'center', icon: defaultIcon, linkHasLink: false,
	} ],
	[ 'stackable/image', { enableHandles: false } ],
]

const Edit = props => {
	const {
		className,
		attributes,
		setAttributes,
	} = props

	useGeneratedCss( props.attributes )

	const rowClass = getRowClasses( attributes )
	const blockAlignmentClass = getAlignmentClasses( attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-image-popup',
		rowClass,
	] )

	const contentClassNames = classnames( [
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
		'stk-hover-parent',
	] )

	return (
		<Fragment>
			<InspectorTabs />

			<Alignment.InspectorControls />
			<BlockDiv.InspectorControls />
			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'General', i18n ) }
					id="general"
					initialOpen={ true }
				>
					<ImageControl2
						isDynamic={ false }
						label={ __( 'Popup Option #1: Upload Image', i18n ) }
						onRemove={ () => setAttributes( {
							imageLink: '',
							imageId: '',
						} ) }
						onChange={ media => {
							setAttributes( {
								imageLink: media.url,
								imageId: media.url,
							} )
						} }
						imageId={ attributes.imageId }
						imageURL={ attributes.imageLink }
						allowedTypes={ [ 'image' ] }
					/>
					<AdvancedTextControl
						label={ __( 'Popup Option #2: Image URL', i18n ) }
						isDynamic={ true }
						isFormatType={ false }
						placeholder="https://"
						value={ attributes.imageLink }
						onChange={ imageLink => setAttributes( {
							imageLink,
							imageId: imageLink,
						} ) }
					/>
				</PanelAdvancedSettings>

			</InspectorStyleControls>
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-image-popup" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<InspectorStyleControls>
				<InspectorBottomTip />
			</InspectorStyleControls>

			<IconLabelStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-block-image-popup" />

			<BlockDiv className={ blockClassNames }>
				<div className={ contentClassNames }>
					<InnerBlocks
						template={ TEMPLATE }
						templateLock="all"
					/>
				</div>
			</BlockDiv>
			<MarginBottom />
		</Fragment>
	)
}

export default compose(
	withBlockWrapper,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )

// Disable bottom margins for child blocks.
addFilter( 'stackable.edit.margin-bottom.enable-handlers', 'stackable/image-popup', ( enabled, parentBlock ) => {
	return parentBlock?.name === 'stackable/image-popup' ? false : enabled
} )

// Disable links for image block.
addFilter( 'stackable.edit.image.enable-link', 'stackable/image-popup', ( enabled, parentBlock ) => {
	return parentBlock?.name === 'stackable/image-popup' ? false : enabled
} )
