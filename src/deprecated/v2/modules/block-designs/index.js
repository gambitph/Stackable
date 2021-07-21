/**
 * External dependencies
 */
import { DesignLibraryControl, PanelAdvancedSettings } from '~stackable/components'
import { applyBlockDesign } from '~stackable/util'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import {
	addFilter, doAction,
} from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'

const addDesignPanel = blockName => output => {
	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'Designs', i18n ) }
				initialOpen={ true }
			>
				<p className="components-base-control__help">{ __( 'You will not lose your block content when changing designs.', i18n ) }</p>
				<DesignLibraryControl
					block={ `ugb/${ blockName }` }
					onSelect={ designData => {
						applyBlockDesign( designData.attributes )
					} }
				/>
			</PanelAdvancedSettings>
		</Fragment>
	)
}

const blockDesigns = ( blockName, options = {} ) => {
	const optionsToPass = {
		...options,
	}

	addFilter( `stackable.${ blockName }.edit.inspector.layout.before`, `stackable/${ blockName }/block-designs`, addDesignPanel( blockName, optionsToPass ), 20 )
	doAction( `stackable.module.block-designs`, blockName )
}

export default blockDesigns
