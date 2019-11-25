/**
 * External dependencies
 */
import {
	DesignPanelBody,
	ProControlButton,
} from '~stackable/components'
import { applyBlockDesign } from '~stackable/util'
import { i18n } from 'stackable'

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
				className="ugb-block-design-panel"
				options={ Object.keys( designs ).map( value => {
					const {
						label,
						image,
					} = designs[ value ]
					return {
						label,
						value,
						image,
						imageHeight: 400,
						imageWidth: 600,
					}
				} ) }
				onChange={ design => {
					if ( designs[ design ] ) {
						applyBlockDesign( designs[ design ].attributes )
					}
				} }
			>
				{ /* { options.hasPremiumDesigns && showProNotice && <ProControlButton type="design" /> } */ }
				{ /* // TODO: Remove this when we have more designs/ */ }
				{ options.hasPremiumDesigns &&
					<ProControlButton
						title={ __( 'More Designs Coming Soon 👋', i18n ) }
						description={ __( 'We\'ll be adding more pre-set sections / designs for this block soon.', i18n ) }
						showButton={ false }
					/>
				}
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
