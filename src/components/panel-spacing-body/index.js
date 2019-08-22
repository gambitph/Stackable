/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { PanelBody } from '@wordpress/components'

const PanelSpacingBody = props => {
	const { blockProps } = props
	return (
		<PanelBody
			title={ __( 'Spacing', i18n ) }
			{ ...props }
		>
			{ applyFilters( 'stackable.panel-spacing-body.edit.before', null, blockProps ) }
			{ props.children }
			{ applyFilters( 'stackable.panel-spacing-body.edit.after', null, blockProps ) }
		</PanelBody>
	)
}

export default PanelSpacingBody
