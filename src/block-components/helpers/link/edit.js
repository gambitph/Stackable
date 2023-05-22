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
	} = props

	const {
		getAttribute,
		updateAttributeHandler,
	} = useAttributeEditHandlers( props.attrNameTemplate )

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
			{ hasLightbox &&
				<AdvancedToggleControl
					label={ __( 'Open Link in Lightbox', i18n ) }
					help={ lightboxHelp }
					checked={ getAttribute( 'hasLightbox' ) }
					onChange={ updateAttributeHandler( 'hasLightbox' ) }
				/>
			}
			<AdvancedTextControl
				label={ __( 'Link rel', i18n ) }
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
