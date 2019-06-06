import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { PanelBody } from '@wordpress/components'

const PanelSpacingBody = props => {
	const { blockProps } = props
	return (
		<PanelBody
			title={ __( 'Spacing' ) }
			{ ...props }
		>
			{ applyFilters( 'stackable.panel-spacing-body.edit.before', null, blockProps ) }
			{ props.children }
			{ applyFilters( 'stackable.panel-spacing-body.edit.after', null, blockProps ) }
		</PanelBody>
	)
}

export default PanelSpacingBody
