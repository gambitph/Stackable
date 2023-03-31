/**
 * External dependencies
 */
import {
	i18n, isPro, showProNotice,
} from 'stackable'
import {
	PanelAdvancedSettings,
	InspectorAdvancedControls,
	AdvancedToggleControl,
	ProControlButton,
} from '~stackable/components'
import { useBlockAttributesContext, useBlockSetAttributesContext } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'
import { useBlockEditContext } from '@wordpress/block-editor'

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

addFilter( 'stackable.block-components.responsive.control', 'stackable/premium', output => {
	const { name } = useBlockEditContext()

	// Only do mobile column arrangement for the following blocks
	if ( ! [ 'stackable/horizontal-scroller', 'stackable/columns', 'stackable/feature' ].includes( name ) ) {
		return output
	}

	if ( showProNotice && ! isPro ) {
		return (
			<ProControlButton
				title={ __( 'Say Hello to More Responsive Options 👋', i18n ) }
				description={ __( 'Adjust the arrangement of your columns when collapsed on mobile. This feature is only available on Stackable Premium', i18n ) }
			/>
		)
	} else if ( isPro ) {
		return applyFilters( 'stackable.block.columns.column-arrangement', output )
	}

	return output
} )
