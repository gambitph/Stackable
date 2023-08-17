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
import { useEffect, useState } from '@wordpress/element'

// @see https://stackoverflow.com/questions/14729191/google-maps-link-validation-using-regex
const GoogleMapRegex = /^https?\:\/\/(www\.)?google\.(com|[a-z]{1,3})\/maps\b/gm

export const LinkControls = props => {
	const {
		hasLink,
		hasTitle,
		hasLightbox,
		lightboxHelp,
	} = props

	const {
		getAttribute,
		updateAttributeHandler,
	} = useAttributeEditHandlers( props.attrNameTemplate )

	const url = getAttribute( 'url' )
	const lightbox = getAttribute( 'hasLightbox' )

	const [ showGoogleMapHint, setShowGoogleMapHint ] = useState( false )

	useEffect( () => {
		if ( hasLightbox ) {
			if ( GoogleMapRegex.test( url ) && lightbox ) {
				setShowGoogleMapHint( true )
			} else {
				setShowGoogleMapHint( false )
			}
		}
	}, [ url, lightbox ] )

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
						<div className="stk-inspector-hint__google-map-embedd stk-inspector-hint-layout">
							<span>
								{ __( 'Displaying a Google Map? Use the embed iframe URL instead. Need help finding it? Check out our ', i18n ) }
								<a href="https://docs.wpstackable.com/article/528-how-to-add-a-google-map-in-a-lightbox?utm_source=inspector&utm_campaign=learnmore&utm_medium=gutenberg" target="_blank" rel="noreferrer">docs</a>.
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
