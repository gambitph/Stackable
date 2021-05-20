/**
 * External dependencies
 */
import { getAttrNameFunction, __getValue } from '~stackable/util'
import { Style as StyleComponent } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { Fragment, useMemo } from '@wordpress/element'

const getStyles1 = ( attributes, options = {} ) => {
	const {
		selector = '',
		attrNameTemplate = '%s',
	} = options

	const getAttrName = getAttrNameFunction( attrNameTemplate )
	const getValue = __getValue( attributes, getAttrName )

	return {
		[ selector ]: {
			borderRadius: getValue( 'borderRadius', '%spx' ),
			boxShadow: getValue( 'shadow' ),
		},
	}
}

const getStyles2 = ( attributes, options = {} ) => {
	const {
		selector = '',
		attrNameTemplate = '%s',
	} = options

	const getAttrName = getAttrNameFunction( attrNameTemplate )
	const getValue = __getValue( attributes, getAttrName )

	if ( ! getValue( 'BorderType' ) ) {
		return {}
	}

	return {
		[ selector ]: {
			borderStyle: getValue( 'BorderType' ),
			borderColor: getValue( 'BorderColor' ) || '#000000',
			borderTopWidth: getValue( 'BorderWidthTop', '%spx' ) || '1px',
			borderRightWidth: getValue( 'BorderWidthRight', '%spx' ) || '1px',
			borderBottomWidth: getValue( 'BorderWidthBottom', '%spx' ) || '1px',
			borderLeftWidth: getValue( 'BorderWidthLeft', '%spx' ) || '1px',
		},
		tablet: {
			[ selector ]: {
				borderTopWidth: getValue( 'BorderWidthTopTablet', '%spx' ),
				borderRightWidth: getValue( 'BorderWidthRightTablet', '%spx' ),
				borderBottomWidth: getValue( 'BorderWidthBottomTablet', '%spx' ),
				borderLeftWidth: getValue( 'BorderWidthLeftTablet', '%spx' ),
			},
		},
		mobile: {
			[ selector ]: {
				borderTopWidth: getValue( 'BorderWidthTopMobile', '%spx' ),
				borderRightWidth: getValue( 'BorderWidthRightMobile', '%spx' ),
				borderBottomWidth: getValue( 'BorderWidthBottomMobile', '%spx' ),
				borderLeftWidth: getValue( 'BorderWidthLeftMobile', '%spx' ),
			},
		},
	}
}

export const BorderStyle = props => {
	const {
		attributes,
		options = {},
		...propsToPass
	} = props
	const {
		attrNameTemplate = '%s',
	} = options

	const getAttrName = getAttrNameFunction( attrNameTemplate )
	const getValue = __getValue( attributes, getAttrName )

	const styles1 = useMemo(
		() => getStyles1( attributes, options ),
		[
			options.attrNameTemplate,
			options.selector,
			getValue( 'borderRadius' ),
			getValue( 'shadow' ),
			attributes.uniqueId,
		]
	)

	const styles2 = useMemo(
		() => getStyles2( attributes, options ),
		[
			options.attrNameTemplate,
			options.selector,
			getValue( 'borderRadius' ),
			getValue( 'BorderType' ),
			getValue( 'BorderColor' ),
			getValue( 'BorderWidthTop' ),
			getValue( 'BorderWidthRight' ),
			getValue( 'BorderWidthBottom' ),
			getValue( 'BorderWidthLeft' ),

			getValue( 'BorderWidthTopTablet' ),
			getValue( 'BorderWidthRightTablet' ),
			getValue( 'BorderWidthBottomTablet' ),
			getValue( 'BorderWidthLeftTablet' ),

			getValue( 'BorderWidthTopMobile' ),
			getValue( 'BorderWidthRightMobile' ),
			getValue( 'BorderWidthBottomMobile' ),
			getValue( 'BorderWidthLeftMobile' ),
			attributes.uniqueId,
		]
	)

	return (
		<Fragment>
			<StyleComponent
				styles={ styles1 }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
			<StyleComponent
				styles={ styles2 }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)
}

BorderStyle.Content = props => {
	const {
		attributes,
		options = {},
		...propsToPass
	} = props

	const styles1 = getStyles1( attributes, options )
	const styles2 = getStyles2( attributes, options )

	return (
		<Fragment>
			<StyleComponent.Content
				styles={ styles1 }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
			<StyleComponent.Content
				styles={ styles2 }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)
}
