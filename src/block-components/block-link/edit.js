/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	InspectorAdvancedControls,
	PanelAdvancedSettings,
} from '~stackable/components'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { LinkControls } from '../helpers/link'

export const Edit = props => {
	const {
		hasLink,
		hasTitle,
		hasLightbox,
	} = props

	return (
		<>
			<InspectorAdvancedControls>
				<PanelAdvancedSettings
					title={ __( 'Link', i18n ) }
					id="link"
				>
					<LinkControls
						attrNameTemplate="blockLink%s"
						hasLink={ hasLink }
						hasTitle={ hasTitle }
						hasLightbox={ hasLightbox }
						lightboxHelp={ __( 'Supports links to images, videos, YouTube, Vimeo, and web pages that allow embedding. Opens inner image block if no link is provided', i18n ) }
					/>
				</PanelAdvancedSettings>
			</InspectorAdvancedControls>
		</>
	)
}

Edit.defaultProps = {
	hasLink: true,
	hasTitle: true,
	hasLightbox: true,
}
