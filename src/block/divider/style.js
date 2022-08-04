/**
 * External dependencies
 */
import {
	BlockDiv,
	Advanced,
	Alignment,
	MarginBottom,
	EffectsAnimations,
	Transform,
} from '~stackable/block-components'
import {
	getUniqueBlockClass, useStyles, getStyles,
} from '~stackable/util'
import { getBlockStyle } from '~stackable/hooks'
import { Style as StyleComponent } from '~stackable/components'

/**
 * Internal dependencies
 */
import { blockStyles } from './block-styles'

/**
 * WordPress dependencies
 */
import { memo, renderToString } from '@wordpress/element'

const getStyleParams = ( options = {} ) => {
	const { } = options

	return [
		{
			selectorCallback: getAttribute => {
				const blockStyle = getBlockStyle( blockStyles, getAttribute( 'className' ) || '' )?.name

				if ( blockStyle === 'dots' ) {
					return '.stk-block-divider__dot'
				}

				if ( blockStyle === 'asterisks' ) {
					return '.stk-block-divider__dot:before'
				}

				return 'hr.stk-block-divider__hr'
			},
			styleRuleCallback: getAttribute => {
				const blockStyle = getBlockStyle( blockStyles, getAttribute( 'className' ) || '' )?.name

				if ( blockStyle === 'asterisks' ) {
					return 'color'
				}

				return 'background'
			},

			attrName: 'color',
			dependencies: [ 'className' ],
		},
		{
			selector: '.stk-block-divider__dot:before',
			styleRule: 'fontSize',
			attrName: 'height',
			responsive: 'all',
			format: 'calc(%spx * 1.8)',
			enabledCallback: getAttribute => {
				const blockStyle = getBlockStyle( blockStyles, getAttribute( 'className' ) || '' )?.name
				return blockStyle === 'asterisks'
			},
			dependencies: [ 'className' ],
		},
		{
			selector: 'hr.stk-block-divider__hr',
			styleRule: 'borderRadius',
			attrName: 'height',
			responsive: 'all',
			format: 'calc(%spx / 2)',
			enabledCallback: getAttribute => {
				const blockStyle = getBlockStyle( blockStyles, getAttribute( 'className' ) || '' )?.name
				return blockStyle === 'bar'
			},
			dependencies: [ 'className' ],
		},
		{
			selector: '.stk-block-divider__dot',
			styleRule: 'width',
			attrName: 'height',
			responsive: 'all',
			format: '%spx',
			enabledCallback: getAttribute => {
				const blockStyle = getBlockStyle( blockStyles, getAttribute( 'className' ) || '' )?.name
				return [ 'asterisks', 'dots' ].includes( blockStyle )
			},
			dependencies: [ 'className' ],
		},
		{
			selectorCallback: getAttribute => {
				const blockStyle = getBlockStyle( blockStyles, getAttribute( 'className' ) || '' )?.name
				if ( [ 'dots', 'asterisks' ].includes( blockStyle ) ) {
					return '.stk-block-divider__dot'
				}

				return 'hr.stk-block-divider__hr'
			},
			styleRule: 'height',
			attrName: 'height',
			format: '%spx',
			responsive: 'all',
		},
		{
			selectorCallback: getAttribute => {
				const blockStyle = getBlockStyle( blockStyles, getAttribute( 'className' ) || '' )?.name
				if ( [ 'dots', 'asterisks' ].includes( blockStyle ) ) {
					return '.stk-block-divider__dots'
				}

				return 'hr.stk-block-divider__hr'
			},
			styleRule: 'width',
			attrName: 'width',
			format: '%s%',
			responsive: 'all',
			dependencies: [ 'className' ],
		},
	]
}

export const DividerStyles = memo( props => {
	const dividerStyles = useStyles( getStyleParams() )

	return (
		<>
			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<StyleComponent
				styles={ dividerStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...props }
			/>
		</>
	)
} )

DividerStyles.defaultProps = {
	isEditor: false,
	attributes: {},
	options: {},
}

DividerStyles.Content = props => {
	const {
		...propsToPass
	} = props

	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	propsToPass.blockUniqueClassName = getUniqueBlockClass( props.attributes.uniqueId )
	const dividerStyles = getStyles( propsToPass.attributes, getStyleParams() )

	const styles = (
		<>
			<Alignment.Style.Content { ...propsToPass } />
			<BlockDiv.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Transform.Style.Content { ...propsToPass } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<MarginBottom.Style.Content { ...propsToPass } />
			<StyleComponent.Content
				styles={ dividerStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}

DividerStyles.Content.defaultProps = {
	attributes: {},
	options: {},
}
