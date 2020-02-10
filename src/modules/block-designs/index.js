/**
 * External dependencies
 */
import {
	ProControlButton, DesignLibraryControl,
} from '~stackable/components'
import { applyBlockDesign } from '~stackable/util'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import {
	addFilter, doAction,
} from '@wordpress/hooks'
import { PanelBody } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'

const addDesignPanel = ( blockName, options ) => output => {
	return (
		<Fragment>
			{ output }
			<PanelBody
				title={ __( 'Designs', i18n ) }
				initialOpen={ true }
			>
				<DesignLibraryControl
					block={ `ugb/${ blockName }` }
					onSelect={ designData => {
						applyBlockDesign( designData.attributes )
					} }
				/>

				{ /* // TODO: Remove this when we have more designs/ */ }
				{ options.hasPremiumDesigns &&
					<ProControlButton
						title={ __( 'More Designs Coming Soon 👋', i18n ) }
						description={ __( 'We\'ll be adding more pre-set sections / designs for this block soon.', i18n ) }
						showButton={ false }
					/>
				}
			</PanelBody>
		</Fragment>
	)
}

const blockDesigns = ( blockName, options = {} ) => {
	const optionsToPass = {
		hasPremiumDesigns: true,
		...options,
	}

	addFilter( `stackable.${ blockName }.edit.inspector.layout.before`, `stackable/${ blockName }/block-designs`, addDesignPanel( blockName, optionsToPass ), 20 )
	doAction( `stackable.module.block-designs`, blockName )
}

export default blockDesigns
