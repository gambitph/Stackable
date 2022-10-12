/**
 * Internal dependencies
 */
import { BlockCss } from '~stackable/components'

/**
 * External dependencies
 */
import { compact } from 'lodash'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

export const SeparatorStyles = props => {
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
	} = props

	const selector = _selector !== undefined ? _selector : ` > .stk-separator__${ location }`

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				attrNameTemplate={ `${ location }%s` }
				selector={ selector }
				styleRule="zIndex"
				attrName="separatorBringToFront"
				valuePreCallback={ value => {
					if ( value ) {
						return 6
					}
					return undefined
				} }
			/>
			<BlockCss
				{ ...propsToPass }
				attrNameTemplate={ `${ location }%s` }
				selector={ selector }
				styleRule="transform"
				attrName="separatorFlipHorizontally"
				valuePreCallback={ ( value, getAttribute ) => {
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
				} }
				dependencies={ [ 'separatorFlipVertically' ] }
			/>
			<BlockCss
				{ ...propsToPass }
				attrNameTemplate={ `${ location }%s` }
				selector={ selector + ' svg' }
				styleRule="fill"
				attrName="separatorColor"
			/>
			<BlockCss
				{ ...propsToPass }
				attrNameTemplate={ `${ location }%s` }
				selector={ selector + ` ${ wrapperSelector }` }
				styleRule="transform"
				attrName="separatorWidth"
				format="scaleX(%s)"
			/>
			<BlockCss
				{ ...propsToPass }
				attrNameTemplate={ `${ location }%s` }
				selector={ selector + ` ${ wrapperSelector }` }
				styleRule="height"
				responsive="all"
				attrName="separatorHeight"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				attrNameTemplate={ `${ location }%s` }
				selector={ selector + ' svg' }
				styleRule="filter"
				attrName="separatorShadow"
				format="drop-shadow(%s)"
				valueCallback={ value => {
					return value === 'drop-shadow(none)' ? 'none' : value
				} }
			/>
		</>
	)
}

const MarginBottomStyles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		selector: _selector,
	} = props

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selector={ _selector !== undefined ? _selector : ` > .stk-separator__bottom` }
				styleRule="bottom"
				attrName="blockMargin"
				responsive="all"
				valuePreCallback={ value => value?.bottom }
				format="%spx"
			/>
		</>
	)
}

export const Style = props => {
	return (
		<>
			<SeparatorStyles { ...props } location="top" />
			<SeparatorStyles { ...props } isInitiallyFlippedVertically={ false } location="bottom" />
			<MarginBottomStyles { ...props } />
			{ applyFilters( 'stackable.block-component.separator.get-style-params', null, { ...props, location: 'top' } ) }
			{ applyFilters( 'stackable.block-component.separator.get-style-params', null, { ...props, location: 'bottom' } ) }
		</>
	)
}

Style.Content = props => {
	return (
		<>
			<SeparatorStyles { ...props } location="top" />
			<SeparatorStyles { ...props } isInitiallyFlippedVertically={ false } location="bottom" />
			{ applyFilters( 'stackable.block-component.separator.get-style-params', null, { ...props, location: 'top' } ) }
			{ applyFilters( 'stackable.block-component.separator.get-style-params', null, { ...props, location: 'bottom' } ) }
		</>
	)
}
