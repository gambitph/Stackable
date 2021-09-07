/**
 * External dependencies
 */
import { Style as StyleComponent } from '~stackable/components'
import { getStyles, useStyles } from '~stackable/util'
import { compact } from 'lodash'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

export const separatorGetStyleParams = ( options = {}, location ) => {
	const {
		selector: _selector,
		wrapperSelector = '.stk-separator__wrapper',
		enableFlipHorizontally = true,
		enableFlipVertically = false,
		isInitiallyFlippedVertically = true,
	} = options

	const selector = _selector !== undefined ? _selector : ` > .stk-separator__${ location }`

	return [
		{
			attrNameTemplate: `${ location }%s`,
			selector,
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
			selector,
			styleRule: 'transform',
			attrName: 'separatorFlipHorizontally',
			valuePreCallback: ( value, getAttribute ) => {
				const flipHorizontally = value
				const flipVertically = getAttribute( 'separatorFlipVertically' )

				if ( ! enableFlipVertically && ! enableFlipHorizontally ) {
					return undefined
				}

				if ( ! flipHorizontally && ! flipVertically ) {
					return undefined
				}

				const shouldApplyScaleX = enableFlipHorizontally && flipHorizontally
				const shouldAddScaleYAlongsideScaleX = shouldApplyScaleX && isInitiallyFlippedVertically
				const shouldApplyScaleY = enableFlipVertically && flipVertically

				return compact( [
					shouldApplyScaleX ? 'scaleX(-1)' : undefined,
					shouldAddScaleYAlongsideScaleX ? 'scaleY(-1)' : undefined,
					shouldApplyScaleY ? 'scaleY(-1)' : undefined,
				] ).join( ' ' )
			},
			dependencies: [ 'separatorFlipVertically' ],
		},
		{
			attrNameTemplate: `${ location }%s`,
			selector: selector + ' svg',
			styleRule: 'fill',
			attrName: 'separatorColor',
		},
		{
			attrNameTemplate: `${ location }%s`,
			selector: selector + ` ${ wrapperSelector }`,
			styleRule: 'transform',
			attrName: 'separatorWidth',
			format: 'scaleX(%s)',
		},
		{
			attrNameTemplate: `${ location }%s`,
			selector: selector + ` ${ wrapperSelector }`,
			styleRule: 'height',
			responsive: 'all',
			attrName: 'separatorHeight',
			format: '%spx',
		},
		{
			attrNameTemplate: `${ location }%s`,
			selector: selector + ' svg',
			styleRule: 'filter',
			attrName: 'separatorShadow',
			format: 'drop-shadow(%s)',
			valueCallback: value => {
				return value === 'drop-shadow(none)' ? 'none' : value
			},
		},
	]
}

const editorMarginBottomParams = ( options = {} ) => {
	const {
		selector: _selector,
	} = options

	return [
		{
			renderIn: 'edit',
			selector: _selector !== undefined ? _selector : ` > .stk-separator__bottom`,
			styleRule: 'bottom',
			attrName: 'blockMargin',
			responsive: 'all',
			valuePreCallback: value => value?.bottom,
			format: '%spx',
		},
	]
}

export const Style = props => {
	const {
		attributes,
		options = {},
		...propsToPass
	} = props

	const topSeparatorStyles = useStyles( attributes, separatorGetStyleParams( options, 'top' ) )
	const bottomSeparatorStyles = useStyles( attributes, separatorGetStyleParams( { ...options, isInitiallyFlippedVertically: false }, 'bottom' ) )
	const bottomMarginBottomStyle = useStyles( attributes, editorMarginBottomParams( options ) )
	const topSeparatorLayerStyles = useStyles( attributes, applyFilters( 'stackable.block-component.separator.get-style-params', [], options, 'top' ) )
	const bottomSeparatorLayerStyles = useStyles( attributes, applyFilters( 'stackable.block-component.separator.get-style-params', [], options, 'bottom' ) )

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
			<StyleComponent
				styles={ topSeparatorLayerStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
			<StyleComponent
				styles={ bottomSeparatorLayerStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
			<StyleComponent
				styles={ bottomMarginBottomStyle }
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

	const topSeparatorStyles = getStyles( attributes, separatorGetStyleParams( options, 'top' ) )
	const bottomSeparatorStyles = getStyles( attributes, separatorGetStyleParams( options, 'bottom' ) )
	const topSeparatorLayerStyles = getStyles( attributes, applyFilters( 'stackable.block-component.separator.get-style-params', [], options, 'top' ) )
	const bottomSeparatorLayerStyles = getStyles( attributes, applyFilters( 'stackable.block-component.separator.get-style-params', [], options, 'bottom' ) )

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
			<StyleComponent.Content
				styles={ topSeparatorLayerStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
			<StyleComponent.Content
				styles={ bottomSeparatorLayerStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</>
	)
}
