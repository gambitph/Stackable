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
			<AdvancedTextControl
				label={ __( 'Link rel', i18n ) }
				value={ getAttribute( 'rel' ) }
				onChange={ updateAttributeHandler( 'rel' ) }
			/>
		</>
	)
}

LinkControls.defaultProps = {
	attrNameTemplate: '%s',
	hasLink: true,
}
