/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	PanelAdvancedSettings,
	InspectorAdvancedControls,
	AdvancedToggleControl,
} from '~stackable/components'
import { useBlockAttributesContext, useBlockSetAttributesContext } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'

export const Edit = () => {
	const setAttributes = useBlockSetAttributesContext()
	const {
		hideDesktop,
		hideTablet,
		hideMobile,
	} = useBlockAttributesContext( attributes => {
		return {
			hideDesktop: attributes.hideDesktop,
			hideTablet: attributes.hideTablet,
			hideMobile: attributes.hideMobile,
		}
	} )

	return (
		<Fragment>
			<InspectorAdvancedControls>
				<PanelAdvancedSettings
					title={ __( 'Responsive', i18n ) }
					initialOpen={ false }
				>
					<AdvancedToggleControl
						label={ __( 'Hide on Desktop', i18n ) }
						checked={ hideDesktop }
						onChange={ hideDesktop => setAttributes( { hideDesktop } ) }
					/>
					<AdvancedToggleControl
						label={ __( 'Hide on Tablet', i18n ) }
						checked={ hideTablet }
						onChange={ hideTablet => setAttributes( { hideTablet } ) }
					/>
					<AdvancedToggleControl
						label={ __( 'Hide on Mobile', i18n ) }
						checked={ hideMobile }
						onChange={ hideMobile => setAttributes( { hideMobile } ) }
					/>
					{ applyFilters( 'stackable.block-components.responsive.control', null ) }
				</PanelAdvancedSettings>
			</InspectorAdvancedControls>
		</Fragment>
	)
}
