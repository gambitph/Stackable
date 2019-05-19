import { addFilter, applyFilters, doAction } from '@wordpress/hooks'
import { PanelBody, ToggleControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'

const responsivePanel = blockName => ( output, props ) => {
	const { setAttributes } = props
	const {
		hideDesktop = false,
		hideTablet = false,
		hideMobile = false,
	} = props.attributes

	return (
		<Fragment>
			{ output }
			<PanelBody
				title={ __( 'Responsive' ) }
				initialOpen={ false }
			>
				{ applyFilters( `stackable.${ blockName }.edit.advanced.responsive.before`, null, props ) }
				<ToggleControl
					label={ __( 'Hide on Desktop' ) }
					checked={ hideDesktop }
					onChange={ hideDesktop => setAttributes( { hideDesktop } ) }
				/>
				<ToggleControl
					label={ __( 'Hide on Tablet' ) }
					checked={ hideTablet }
					onChange={ hideTablet => setAttributes( { hideTablet } ) }
				/>
				<ToggleControl
					label={ __( 'Hide on Mobile' ) }
					checked={ hideMobile }
					onChange={ hideMobile => setAttributes( { hideMobile } ) }
				/>
				{ applyFilters( `stackable.${ blockName }.edit.advanced.responsive.after`, null, props ) }
			</PanelBody>
		</Fragment>
	)
}

const addHideClasses = ( mainClasses, design, props ) => {
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

const advancedResponsive = blockName => {
	addFilter( `stackable.${ blockName }.edit.inspector.advanced.before`, `stackable/${ blockName }/advanced-responsive`, responsivePanel( blockName ), 19 )
	addFilter( `stackable.${ blockName }.attributes`, `stackable/${ blockName }/advanced-responsive`, addAttributes )
	addFilter( `stackable.${ blockName }.mainclasses`, `stackable/${ blockName }/advanced-responsive`, addHideClasses )
	doAction( `stackable.module.advanced-responsive`, blockName )
}

export default advancedResponsive
