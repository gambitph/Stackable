/**
 * WordPress dependencies
 */
import {
	addFilter, applyFilters, doAction,
} from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'

/**
 * External dependencies
 */
import { i18n, showProNotice } from 'stackable'
import {
	ProControl,
	PanelAdvancedSettings,
} from '~stackable/components'

const conditionalDisplayPanel = blockName => ( output, props ) => {
	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'Conditional Display', i18n ) }
				initialOpen={ false }
			>
				{ applyFilters( `stackable.${ blockName }.edit.advanced.conditional-display.after`, null, props ) }
				{ showProNotice && <ProControl type="display" /> }
			</PanelAdvancedSettings>
		</Fragment>
	)
}

const advancedConditionalDisplay = blockName => {
	addFilter( `stackable.${ blockName }.edit.inspector.advanced.before`, `stackable/${ blockName }/advanced-conditional-display`, conditionalDisplayPanel( blockName ), 19 )
	doAction( `stackable.module.advanced-conditional-display`, blockName )
}

export default advancedConditionalDisplay
