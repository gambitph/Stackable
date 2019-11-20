/**
 * External dependencies
 */
import {
	DesignPanelBody,
	ProControlButton,
} from '~stackable/components'
import { applyBlockDesign } from '~stackable/util'
import { i18n, showProNotice } from 'stackable'

/**
 * WordPress dependencies
 */
import {
	addFilter, applyFilters, doAction,
} from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'

const addDesignPanel = ( blockName, options ) => output => {
	const designs = applyFilters( `stackable.${ blockName }.edit.designs`, {} )
	if ( ! Object.keys( designs ).length ) {
		return output
	}

	return (
		<Fragment>
			{ output }
			<DesignPanelBody
				title={ __( 'Designs', i18n ) }
				initialOpen={ true }
				options={ Object.keys( designs ).map( value => {
					const {
						label,
						image,
					} = designs[ value ]
					return {
						label,
						value,
						image,
					}
				} ) }
				onChange={ design => {
					if ( designs[ design ] ) {
						applyBlockDesign( designs[ design ].attributes )
					}
				} }
			>
				{ options.hasPremiumDesigns && showProNotice && <ProControlButton type="design" /> }
			</DesignPanelBody>
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
