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
import { memo } from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'

export const _SeparatorStyles = props => {
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

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				attrNameTemplate={ `${ location }%s` }
				selector={ selector }
				styleRule="zIndex"
				attrName="separatorBringToFront"
				key="separatorBringToFront"
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
				key="separatorFlipHorizontally"
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
				dependencies={ [
					 'separatorFlipVertically',
					 ...dependencies,
				] }
			/>
			<BlockCss
				{ ...propsToPass }
				attrNameTemplate={ `${ location }%s` }
				selector={ selector + ' svg' }
				styleRule="fill"
				attrName="separatorColor"
				key="separatorColor"
			/>
			<BlockCss
				{ ...propsToPass }
				attrNameTemplate={ `${ location }%s` }
				selector={ selector + ` ${ wrapperSelector }` }
				styleRule="transform"
				attrName="separatorWidth"
				key="separatorWidth"
				format="scaleX(%s)"
			/>
			<BlockCss
				{ ...propsToPass }
				attrNameTemplate={ `${ location }%s` }
				selector={ selector + ` ${ wrapperSelector }` }
				styleRule="height"
				responsive="all"
				attrName="separatorHeight"
				key="separatorHeight"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				attrNameTemplate={ `${ location }%s` }
				selector={ selector + ' svg' }
				styleRule="filter"
				attrName="separatorShadow"
				key="separatorShadow"
				format="drop-shadow(%s)"
				valueCallback={ value => {
					return value === 'drop-shadow(none)' ? 'none' : value
				} }
			/>
		</>
	)
}

export const SeparatorStyles = memo( _SeparatorStyles )
SeparatorStyles.Content = _SeparatorStyles

const MarginBottomStyles = memo( props => {
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
				key="blockMargin"
				responsive="all"
				valuePreCallback={ value => value?.bottom }
				format="%spx"
			/>
		</>
	)
} )

export const Style = props => {
	const SeparatorLayerStyles = applyFilters( 'stackable.block-component.separator.layer-styles', null )

	return (
		<>
			<SeparatorStyles { ...props } location="top" />
			<SeparatorStyles { ...props } isInitiallyFlippedVertically={ false } location="bottom" />
			<MarginBottomStyles { ...props } />
			{ SeparatorLayerStyles && <SeparatorLayerStyles { ...props } location="top" /> }
			{ SeparatorLayerStyles && <SeparatorLayerStyles { ...props } location="bottom" /> }
		</>
	)
}

Style.Content = props => {
	const SeparatorLayerStyles = applyFilters( 'stackable.block-component.separator.layer-styles.content', null )

	return (
		<>
			<SeparatorStyles.Content { ...props } location="top" />
			<SeparatorStyles.Content { ...props } isInitiallyFlippedVertically={ false } location="bottom" />
			{ SeparatorLayerStyles && <SeparatorLayerStyles { ...props } location="top" /> }
			{ SeparatorLayerStyles && <SeparatorLayerStyles { ...props } location="bottom" /> }
		</>
	)
}
