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
		desktopTablet: {
			[ selector ]: {
				marginTop: getValue( 'marginTop', `%s${ getValue( 'marginUnit' ) || 'px' }` ),
				marginBottom: getValue( 'marginBottom', `%s${ getValue( 'marginUnit' ) || 'px' }` ),
				marginRight: getValue( 'marginRight', `%s${ getValue( 'marginUnit' ) || 'px' }` ),
				marginLeft: getValue( 'marginLeft', `%s${ getValue( 'marginUnit' ) || 'px' }` ),
				paddingTop: getValue( 'paddingTop', `%s${ getValue( 'paddingUnit' ) || 'px' }` ),
				paddingBottom: getValue( 'paddingBottom', `%s${ getValue( 'paddingUnit' ) || 'px' }` ),
				paddingRight: getValue( 'paddingRight', `%s${ getValue( 'paddingUnit' ) || 'px' }` ),
				paddingLeft: getValue( 'paddingLeft', `%s${ getValue( 'paddingUnit' ) || 'px' }` ),
			},
		},
		tabletOnly: {
			[ selector ]: {
				marginTop: getValue( 'marginTopTablet', `%s${ getValue( 'marginUnitTablet' ) || 'px' }` ),
				marginBottom: getValue( 'marginBottomTablet', `%s${ getValue( 'marginUnitTablet' ) || 'px' }` ),
				marginRight: getValue( 'marginRightTablet', `%s${ getValue( 'marginUnitTablet' ) || 'px' }` ),
				marginLeft: getValue( 'marginLeftTablet', `%s${ getValue( 'marginUnitTablet' ) || 'px' }` ),
				paddingTop: getValue( 'paddingTopTablet', `%s${ getValue( 'paddingUnitTablet' ) || 'px' }` ),
				paddingBottom: getValue( 'paddingBottomTablet', `%s${ getValue( 'paddingUnitTablet' ) || 'px' }` ),
				paddingRight: getValue( 'paddingRightTablet', `%s${ getValue( 'paddingUnitTablet' ) || 'px' }` ),
				paddingLeft: getValue( 'paddingLeftTablet', `%s${ getValue( 'paddingUnitTablet' ) || 'px' }` ),
			},
		},
		mobile: {
			[ selector ]: {
				marginTop: getValue( 'marginTopMobile', `%s${ getValue( 'marginUnitMobile' ) || 'px' }` ),
				marginBottom: getValue( 'marginBottomMobile', `%s${ getValue( 'marginUnitMobile' ) || 'px' }` ),
				marginRight: getValue( 'marginRightMobile', `%s${ getValue( 'marginUnitMobile' ) || 'px' }` ),
				marginLeft: getValue( 'marginLeftMobile', `%s${ getValue( 'marginUnitMobile' ) || 'px' }` ),
				paddingTop: getValue( 'paddingTopMobile', `%s${ getValue( 'paddingUnitMobile' ) || 'px' }` ),
				paddingBottom: getValue( 'paddingBottomMobile', `%s${ getValue( 'paddingUnitMobile' ) || 'px' }` ),
				paddingRight: getValue( 'paddingRightMobile', `%s${ getValue( 'paddingUnitMobile' ) || 'px' }` ),
				paddingLeft: getValue( 'paddingLeftMobile', `%s${ getValue( 'paddingUnitMobile' ) || 'px' }` ),
			},
		},
	}
}

const getStyles2 = ( attributes, options = {} ) => {
	const {
		selector = '',
		attrNameTemplate = '%s',
		horizontalAlignRule = 'justifyContent',
		verticalAlignRule = 'alignItems',
	} = options

	const getAttrName = getAttrNameFunction( attrNameTemplate )
	const getValue = __getValue( attributes, getAttrName )

	return {
		[ selector ]: {
			minHeight: getValue( 'height', `%s${ getValue( 'heightUnit' ) || 'px' }` ),
			[ horizontalAlignRule || 'justifyContent' ]: getValue( 'horizontalAlign' ),
			[ verticalAlignRule || 'alignItems' ]: getValue( 'verticalAlign' ),
			maxWidth: getValue( 'width', `%s${ getValue( 'widthUnit' ) || 'px' }` ),
			minWidth: getValue( 'width' ) ? 'auto' : undefined, // Some themes can limit min-width, preventing block width.
		},
		tablet: {
			[ selector ]: {
				minHeight: getValue( 'heightTablet', `%s${ getValue( 'heightUnitTablet' ) || 'px' }` ),
				[ horizontalAlignRule || 'justifyContent' ]: getValue( 'horizontalAlignTablet' ),
				[ verticalAlignRule || 'alignItems' ]: getValue( 'verticalAlignTablet' ),
				maxWidth: getValue( 'widthTablet', `%s${ getValue( 'widthUnitTablet' ) || 'px' }` ),
				minWidth: getValue( 'widthTablet' ) ? 'auto' : undefined, // Some themes can limit min-width, preventing block width.
			},
		},
		mobile: {
			[ selector ]: {
				minHeight: getValue( 'heightMobile', `%s${ getValue( 'heightUnitMobile' ) || 'px' }` ),
				[ horizontalAlignRule || 'justifyContent' ]: getValue( 'horizontalAlignMobile' ),
				[ verticalAlignRule || 'alignItems' ]: getValue( 'verticalAlignMobile' ),
				maxWidth: getValue( 'widthMobile', `%s${ getValue( 'widthUnitMobile' ) || 'px' }` ),
				minWidth: getValue( 'widthMobile' ) ? 'auto' : undefined, // Some themes can limit min-width, preventing block width.
			},
		},
	}
}

export const SizeStyle = props => {
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
			getValue( 'marginTop' ),
			getValue( 'marginBottom' ),
			getValue( 'marginRight' ),
			getValue( 'marginLeft' ),
			getValue( 'marginUnit' ),
			getValue( 'paddingTop' ),
			getValue( 'paddingBottom' ),
			getValue( 'paddingRight' ),
			getValue( 'paddingLeft' ),
			getValue( 'paddingUnit' ),

			getValue( 'marginTopTablet' ),
			getValue( 'marginBottomTablet' ),
			getValue( 'marginRightTablet' ),
			getValue( 'marginLeftTablet' ),
			getValue( 'marginUnitTablet' ),
			getValue( 'paddingTopTablet' ),
			getValue( 'paddingBottomTablet' ),
			getValue( 'paddingRightTablet' ),
			getValue( 'paddingLeftTablet' ),
			getValue( 'paddingUnitTablet' ),

			getValue( 'marginTopMobile' ),
			getValue( 'marginBottomMobile' ),
			getValue( 'marginRightMobile' ),
			getValue( 'marginLeftMobile' ),
			getValue( 'marginUnitMobile' ),
			getValue( 'paddingTopMobile' ),
			getValue( 'paddingBottomMobile' ),
			getValue( 'paddingRightMobile' ),
			getValue( 'paddingLeftMobile' ),
			getValue( 'paddingUnitMobile' ),
			attributes.uniqueId,
		]
	)

	const styles2 = useMemo(
		() => getStyles2( attributes, options ),
		[
			options.attrNameTemplate,
			options.selector,
			options.horizontalAlignRule,
			options.verticalAlignRule,
			getValue( 'height' ),
			getValue( 'heightUnit' ),
			getValue( 'horizontalAlign' ),
			getValue( 'verticalAlign' ),
			getValue( 'width' ),
			getValue( 'widthUnit' ),
			getValue( 'width' ),

			getValue( 'heightTablet' ),
			getValue( 'heightUnitTablet' ),
			getValue( 'horizontalAlignTablet' ),
			getValue( 'verticalAlignTablet' ),
			getValue( 'widthTablet' ),
			getValue( 'widthUnitTablet' ),
			getValue( 'widthTablet' ),

			getValue( 'heightMobile' ),
			getValue( 'heightUnitMobile' ),
			getValue( 'horizontalAlignMobile' ),
			getValue( 'verticalAlignMobile' ),
			getValue( 'widthMobile' ),
			getValue( 'widthUnitMobile' ),
			getValue( 'widthMobile' ),
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

SizeStyle.Content = props => {
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
