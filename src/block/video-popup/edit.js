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
	AdvancedToggleControl,
} from '~stackable/components'
import {
	BlockDiv,
	useGeneratedCss,
	MarginBottom,
	getRowClasses,
	getAlignmentClasses,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	Transform,
} from '~stackable/block-components'
import { getVideoProviderFromURL, urlIsVideo } from '~stackable/util'
import {
	withBlockAttributeContext,
	withBlockWrapperIsHovered,
	withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { InnerBlocks } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import { addFilter } from '@wordpress/hooks'

export const defaultIcon = '<svg data-prefix="fas" data-icon="play" class="svg-inline--fa fa-play fa-w-14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" aria-hidden="true"><path fill="currentColor" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path></svg>'

const TEMPLATE = [
	[ 'stackable/icon', {
		contentAlign: 'center', icon: defaultIcon, linkHasLink: false,
	} ],
	[ 'stackable/image', { enableHandles: false } ],
]

const Edit = props => {
	const {
		clientId,
		className,
		attributes,
		setAttributes,
		isSelected,
	} = props

	useGeneratedCss( props.attributes )

	const rowClass = getRowClasses( attributes )
	const blockAlignmentClass = getAlignmentClasses( attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-video-popup',
		rowClass,
	] )

	const contentClassNames = classnames( [
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
		'stk-hover-parent',
	] )

	const isVideoFile = link => {
		const regexp = /(?:^.*\.(mp4|avi|wmv|mov|flv|mkv|webm|vob|ogv|m4v|3gp|3g2|mpeg|mpg|m2v|m4v|svi|3gpp|3gpp2|mxf|roq|nsv|flv|f4v|f4p|f4a|f4b)$)/im
		return regexp.test( link )
	}

	return (
		<>
			{ isSelected && (
				<>
					<InspectorTabs hasLayoutPanel={ false } />

					<InspectorStyleControls>
						<PanelAdvancedSettings
							title={ __( 'General', i18n ) }
							id="general"
							initialOpen={ true }
						>
							<ImageControl2
								isDynamic={ false }
								label={ __( 'Popup Option #1: Upload Video', i18n ) }
								help={ __( 'Use .mp4 format for videos', i18n ) }
								onRemove={ () => setAttributes( {
									videoLink: '',
									videoId: '',
								} ) }
								onChange={ media => {
									setAttributes( {
										videoLink: media.url,
										videoId: media.url,
									} )
								} }
								imageId={ urlIsVideo( attributes.videoLink ) ? attributes.videoId : '' }
								imageURL={ urlIsVideo( attributes.videoLink ) ? attributes.videoLink : '' }
								allowedTypes={ [ 'video' ] }
							/>
							<AdvancedTextControl
								label={ __( 'Popup Option #2: Video URL', i18n ) }
								help={ __( 'Paste a Youtube / Vimeo URL', i18n ) }
								isDynamic={ true }
								isFormatType={ false }
								placeholder="https://"
								value={ ! urlIsVideo( attributes.videoLink ) ? attributes.videoLink : '' }
								onChange={ videoLink => setAttributes( {
									videoLink,
									videoId: getVideoProviderFromURL( videoLink ).id,
								} ) }
							/>
							{ isVideoFile( attributes.videoLink ) && <>
								<AdvancedToggleControl
									label={ __( 'Allow fullscreen', i18n ) }
									attribute="videoFullscreen"
									defaultValue={ true }
								/>
								<AdvancedToggleControl
									label={ __( 'Allow download video', i18n ) }
									attribute="videoDownload"
									defaultValue={ true }
								/>
								<AdvancedToggleControl
									label={ __( 'Loop video', i18n ) }
									attribute="videoLoop"
									defaultValue={ false }
								/>
							</> }
						</PanelAdvancedSettings>

					</InspectorStyleControls>
					<BlockDiv.InspectorControls />
					<Advanced.InspectorControls />
					<Transform.InspectorControls />
					<EffectsAnimations.InspectorControls />
					<CustomAttributes.InspectorControls />
					<CustomCSS.InspectorControls mainBlockClass="stk-block-video-popup" />
					<Responsive.InspectorControls />
					<ConditionalDisplay.InspectorControls />

					<InspectorStyleControls>
						<InspectorBottomTip />
					</InspectorStyleControls>
				</>
			) }

			<IconLabelStyles
				version={ VERSION }
				blockState={ props.blockState }
				clientId={ clientId }
			/>
			<CustomCSS mainBlockClass="stk-block-video-popup" />

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				<div className={ contentClassNames }>
					<InnerBlocks
						template={ TEMPLATE }
						templateLock="all"
					/>
				</div>
			</BlockDiv>
			{ props.isHovered && <MarginBottom /> }
		</>
	)
}

export default compose(
	withBlockWrapperIsHovered,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )

// Disable bottom margins for child blocks.
addFilter( 'stackable.edit.margin-bottom.enable-handlers', 'stackable/video-popup', ( enabled, parentBlock ) => {
	return parentBlock?.name === 'stackable/video-popup' ? false : enabled
} )

// Disable links for image block.
addFilter( 'stackable.edit.image.enable-link', 'stackable/video-popup', ( enabled, parentBlock ) => {
	return parentBlock?.name === 'stackable/video-popup' ? false : enabled
} )
