/**
 * External dependencies
 */
import { Style as StyleComponent } from '~stackable/components'
import { getStyles, useStyles } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

const getStyleParams = ( options = {}, location ) => {
	const { } = options
	const params = [
		{
			attrNameTemplate: `${ location }%s`,
			selector: `.stk-${ location }-separator`,
			styleRule: 'zIndex',
			attrName: 'separatorBringToFront',
			valuePreCallback: value => {
				if ( value ) {
					return 6
				}
				return undefined
			},
		},
		{
			attrNameTemplate: `${ location }%s`,
			selector: `.stk-${ location }-separator`,
			styleRule: 'transform',
			attrName: 'separatorFlipHorizontally',
			valuePreCallback: value => {
				if ( value ) {
					return 'scale(-1)'
				}
				return undefined
			},
		},
		{
			attrNameTemplate: `${ location }%s`,
			selector: `.stk-${ location }-separator svg`,
			styleRule: 'fill',
			attrName: 'separatorColor',
		},
		{
			attrNameTemplate: `${ location }%s`,
			selector: `.stk-${ location }-separator .stk-separator__wrapper`,
			styleRule: 'transform',
			attrName: 'separatorWidth',
			format: 'scaleX(%s)',
		},
		{
			attrNameTemplate: `${ location }%s`,
			selector: `.stk-${ location }-separator .stk-separator__wrapper`,
			styleRule: 'height',
			responsive: 'all',
			attrName: 'separatorHeight',
			format: '%spx',
		},
		{
			attrNameTemplate: `${ location }%s`,
			selector: `.stk-${ location }-separator svg`,
			styleRule: 'filter',
			attrName: 'separatorShadow',
			format: 'drop-shadow(%s)',
		},
	]

	return applyFilters( 'stackable.block-component.separator.get-style-params', params, options, location )
}

export const Style = props => {
	const {
		attributes,
		options = {},
		...propsToPass
	} = props

	const topSeparatorStyles = useStyles( attributes, getStyleParams( options, 'top' ) )
	const bottomSeparatorStyles = useStyles( attributes, getStyleParams( options, 'bottom' ) )

	return (
		<>
			<StyleComponent
				styles={ topSeparatorStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
			<StyleComponent
				styles={ bottomSeparatorStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</>
	)
}

Style.Content = props => {
	const {
		attributes,
		options = {},
		...propsToPass
	} = props

	const topSeparatorStyles = getStyles( attributes, getStyleParams( options, 'top' ) )
	const bottomSeparatorStyles = getStyles( attributes, getStyleParams( options, 'bottom' ) )

	return (
		<>
			<StyleComponent.Content
				styles={ topSeparatorStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
			<StyleComponent.Content
				styles={ bottomSeparatorStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</>
	)
}
