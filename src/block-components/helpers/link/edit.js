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
import { useAttributeEditHandlers } from '~stackable/hooks'

export const LinkControls = props => {
	const {
		hasLink,
		hasTitle,
		hasLightbox,
		lightboxHelp,
		hasAnchorId = false,
	} = props

	const {
		getAttribute,
		updateAttributeHandler,
	} = useAttributeEditHandlers( props.attrNameTemplate )

	const url = getAttribute( 'url' ) || ''

	const showGoogleMapHint = getAttribute( 'hasLightbox' ) &&
		url.startsWith( 'https://www.google.com/maps/' ) &&
		! url.startsWith( 'https://www.google.com/maps/embed' )

	return (
		<>
			{ ( hasLink || getAttribute( 'hasLink' ) ) && (
				<LinkControl
					label={ __( 'Link / URL', i18n ) }
					value={ getAttribute( 'url' ) }
					onChange={ updateAttributeHandler( 'url' ) }
				/>
			) }
			<AdvancedToggleControl
				label={ __( 'Open in new tab', i18n ) }
				checked={ getAttribute( 'newTab' ) }
				onChange={ updateAttributeHandler( 'newTab' ) }
			/>
			{ hasLightbox && (
				<>
					<AdvancedToggleControl
						label={ __( 'Open Link in Lightbox', i18n ) }
						help={ lightboxHelp }
						checked={ getAttribute( 'hasLightbox' ) }
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
				value={ getAttribute( 'rel' ) }
				onChange={ updateAttributeHandler( 'rel' ) }
			/>
			{ ( hasTitle || getAttribute( 'hasTitle' ) ) && (
				<AdvancedTextControl
					label={ __( 'Link Title', i18n ) }
					value={ getAttribute( 'title' ) }
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
