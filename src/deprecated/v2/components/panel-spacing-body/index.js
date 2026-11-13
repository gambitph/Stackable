/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import classnames from 'classnames'
import { PanelAdvancedSettings } from '~stackable/components'
import { getPropsWithDefaults } from '../../../../util/props'

const PanelSpacingBody = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, PANEL_SPACING_BODY_DEFAULT_PROPS )
	const { blockProps } = props
	return (
		<PanelAdvancedSettings
			title={ __( 'Spacing', i18n ) }
			{ ...props }
			className={ classnames( [ 'ugb--help-tip-spacing', props.className ] ) }
		>
			{ applyFilters( 'stackable.panel-spacing-body.edit.before', null, blockProps ) }
			{ props.children }
			{ applyFilters( 'stackable.panel-spacing-body.edit.after', null, blockProps ) }
		</PanelAdvancedSettings>
	)
}

const PANEL_SPACING_BODY_DEFAULT_PROPS = {
	className: '',
	blockProps: {},
}

export default PanelSpacingBody
