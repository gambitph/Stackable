/**
 * External dependencies
 */
import { compact } from 'lodash'

/**
 * WordPress dependencies
 */
import { doAction } from '@wordpress/hooks'

export const addSeparatorStyles = ( blockStyleGenerator, props ) => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}

	const {
		location = '',
		selector: _selector,
		wrapperSelector = '.stk-separator__wrapper',
		enableFlipHorizontally = true,
		enableFlipVertically = false,
		isInitiallyFlippedVertically = true,
		dependencies = [],
	} = props

	const selector = _selector !== undefined ? _selector : ` > .stk-separator__${ location }`

	blockStyleGenerator.addBlockStyles( 'separatorBringToFront', [ {
		...propsToPass,
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
	} ] )

	blockStyleGenerator.addBlockStyles( 'separatorFlipHorizontally', [ {
		...propsToPass,
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
		dependencies: [
			 'separatorFlipVertically',
			 ...dependencies,
		],
	} ] )

	blockStyleGenerator.addBlockStyles( 'separatorColor', [ {
		...propsToPass,
		attrNameTemplate: `${ location }%s`,
		selector: selector + ' svg',
		styleRule: 'fill',
		attrName: 'separatorColor',
	} ] )

	blockStyleGenerator.addBlockStyles( 'separatorWidth', [ {
		...propsToPass,
		attrNameTemplate: `${ location }%s`,
		selector: selector + ` ${ wrapperSelector }`,
		styleRule: 'transform',
		attrName: 'separatorWidth',
		format: 'scaleX(%s)',
	} ] )

	blockStyleGenerator.addBlockStyles( 'separatorHeight', [ {
		...propsToPass,
		attrNameTemplate: `${ location }%s`,
		selector: selector + ` ${ wrapperSelector }`,
		styleRule: 'height',
		responsive: 'all',
		attrName: 'separatorHeight',
		format: '%spx',
	} ] )

	blockStyleGenerator.addBlockStyles( 'separatorShadow', [ {
		...propsToPass,
		attrNameTemplate: `${ location }%s`,
		selector: selector + ' svg',
		styleRule: 'filter',
		attrName: 'separatorShadow',
		format: 'drop-shadow(%s)',
		valueCallback: value => {
			return value === 'drop-shadow(none)' ? 'none' : value
		},
	} ] )
}

const addMarginBottomStyles = ( blockStyleGenerator, props ) => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		selector: _selector,
	} = props

	blockStyleGenerator.addBlockStyles( 'textShadow', [ {
		...propsToPass,
		renderIn: 'edit',
		selector: _selector !== undefined ? _selector : ` > .stk-separator__bottom`,
		styleRule: 'bottom',
		attrName: 'blockMargin',
		responsive: 'all',
		valuePreCallback: value => value?.bottom,
		format: '%spx',
	} ] )
}

export const addStyles = ( blockStyleGenerator, props = {} ) => {
	addSeparatorStyles( blockStyleGenerator, {
		...props,
		location: 'top',
	} )
	addSeparatorStyles( blockStyleGenerator, {
		...props,
		isInitiallyFlippedVertically: false,
		location: 'bottom',
	} )
	addMarginBottomStyles( blockStyleGenerator, props )
	doAction( 'stackable.block-component.separator.layer-styles.addStyles', blockStyleGenerator, {
		...props,
		location: 'top',
	} )
	doAction( 'stackable.block-component.separator.layer-styles.addStyles', blockStyleGenerator, {
		...props,
		location: 'bottom',
	} )
}
