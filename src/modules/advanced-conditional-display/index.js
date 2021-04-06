/**
 * WordPress dependencies
 */
import {
	addFilter, applyFilters, doAction,
} from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'
import { ToggleControl } from '@wordpress/components'

/**
 * External dependencies
 */
import { i18n, showProNotice } from 'stackable'
import {
	ProControl,
	PanelAdvancedSettings,
} from '~stackable/components'

const conditionalDisplayPanel = blockName => ( output, props ) => {
	const { setAttributes } = props
	const {
		hideDesktop = false,
		hideTablet = false,
		hideMobile = false,
	} = props.attributes

	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'Conditional Display', i18n ) }
				initialOpen={ false }
			>
				{ /* Add the free options here - Device type using new conditional display format */ }
				<ToggleControl
					label={ __( 'Hide on Desktop', i18n ) }
					checked={ hideDesktop }
					onChange={ hideDesktop => setAttributes( { hideDesktop } ) }
				/>
				<ToggleControl
					label={ __( 'Hide on Tablet', i18n ) }
					checked={ hideTablet }
					onChange={ hideTablet => setAttributes( { hideTablet } ) }
				/>
				<ToggleControl
					label={ __( 'Hide on Mobile', i18n ) }
					checked={ hideMobile }
					onChange={ hideMobile => setAttributes( { hideMobile } ) }
				/>
				{ applyFilters( `stackable.${ blockName }.edit.advanced.conditional-display.after`, null, props ) }
				{ showProNotice && <ProControl type="display" /> }
			</PanelAdvancedSettings>
		</Fragment>
	)
}

const addHideClasses = ( mainClasses, props ) => {
	const {
		hideDesktop = false,
		hideTablet = false,
		hideMobile = false,
	} = props.attributes

	return {
		...mainClasses,
		'ugb--hide-desktop': hideDesktop,
		'ugb--hide-tablet': hideTablet,
		'ugb--hide-mobile': hideMobile,
	}
}

const addAttributes = attributes => {
	return {
		...attributes,
		hideDesktop: {
			type: 'boolean',
			default: false,
		},
		hideTablet: {
			type: 'boolean',
			default: false,
		},
		hideMobile: {
			type: 'boolean',
			default: false,
		},
	}
}

const advancedConditionalDisplay = blockName => {
	addFilter( `stackable.${ blockName }.edit.inspector.advanced.before`, `stackable/${ blockName }/advanced-conditional-display`, conditionalDisplayPanel( blockName ), 19 )
	addFilter( `stackable.${ blockName }.attributes`, `stackable/${ blockName }/advanced-conditional-display`, addAttributes )
	addFilter( `stackable.${ blockName }.main-block.classes`, `stackable/${ blockName }/advanced-conditional-display`, addHideClasses )
	doAction( `stackable.module.advanced-conditional-display`, blockName )
}

export default advancedConditionalDisplay
