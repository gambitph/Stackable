/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	AdvancedTextControl, AdvancedToggleControl, LinkControl,
} from '~stackable/components'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { useAttributeEditHandlers, useAttributeValue } from '~stackable/hooks'

export const LinkControls = props => {
	const {
		hasLink,
		hasTitle,
		hasLightbox,
		lightboxHelp,
		hasAnchorId = false,
	} = props

	const { updateAttributeHandler } = useAttributeEditHandlers( props.attrNameTemplate )

	const url = useAttributeValue( 'url', props.attrNameTemplate ) || ''
	const hasLinkAttr = useAttributeValue( 'hasLink', props.attrNameTemplate )
	const newTab = useAttributeValue( 'newTab', props.attrNameTemplate )
	const hasLightboxAttr = useAttributeValue( 'hasLightbox', props.attrNameTemplate )
	const rel = useAttributeValue( 'rel', props.attrNameTemplate )
	const title = useAttributeValue( 'title', props.attrNameTemplate )
	const hasTitleAttr = useAttributeValue( 'hasTitle', props.attrNameTemplate )

	const showGoogleMapHint = hasLightboxAttr &&
		url.startsWith( 'https://www.google.com/maps/' ) &&
		! url.startsWith( 'https://www.google.com/maps/embed' )

	return (
		<>
			{ ( hasLink || hasLinkAttr ) && (
				<LinkControl
					label={ __( 'Link / URL', i18n ) }
					value={ url }
					onChange={ updateAttributeHandler( 'url' ) }
				/>
			) }
			<AdvancedToggleControl
				label={ __( 'Open in new tab', i18n ) }
				checked={ newTab }
				onChange={ updateAttributeHandler( 'newTab' ) }
			/>
			{ hasLightbox && (
				<>
					<AdvancedToggleControl
						label={ __( 'Open Link in Lightbox', i18n ) }
						help={ lightboxHelp }
						checked={ hasLightboxAttr }
						onChange={ updateAttributeHandler( 'hasLightbox' ) }
					/>
					{ showGoogleMapHint && (
						<div className="stk-inspector-hint stk-inspector-hint__google-map ">
							<span>
								{ __( 'Displaying a Google Map in a Lightbox? Use the embed iframe URL instead. Need help finding it?', i18n ) }
								&nbsp;
								<a href="https://docs.wpstackable.com/article/528-how-to-add-a-google-map-in-a-lightbox?utm_source=inspector&utm_campaign=learnmore&utm_medium=gutenberg" target="_blank" rel="noreferrer">
									{ __( ' Check out our docs.', i18n ) }
								</a>
							</span>
						</div>
					) }
				</>
			) }
			<AdvancedTextControl
				label={ __( 'Link rel', i18n ) }
				help={ __( 'Link relationship keywords, e.g. nofollow noreferrer prefetch', i18n ) }
				value={ rel }
				onChange={ updateAttributeHandler( 'rel' ) }
			/>
			{ ( hasTitle || hasTitleAttr ) && (
				<AdvancedTextControl
					label={ __( 'Link Title', i18n ) }
					value={ title }
					onChange={ updateAttributeHandler( 'title' ) }
					isDynamic={ true }
					isFormatType={ false }
					help={ __( 'Also used for lightbox caption', i18n ) }
				/>
			) }
			{ hasAnchorId && <AdvancedTextControl
				label={ __( 'Anchor ID', i18n ) }
				attribute="anchorId"
				help={ __( 'Add an id attribute to the anchor tag.', i18n ) }
			/> }
		</>
	)
}

LinkControls.defaultProps = {
	attrNameTemplate: '%s',
	hasLink: true,
	hasTitle: false,
	hasLightbox: false,
	lightboxHelp: __( 'Supports links to images, videos, YouTube, Vimeo, and web pages that allow embedding', i18n ),
}
