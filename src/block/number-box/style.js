/**
 * External dependencies
 */
import {
	BlockDiv,
	Advanced,
	Typography,
	Alignment,
	MarginBottom,
	EffectsAnimations,
	BackgroundStyle,
	BorderStyle,
	Transform,
} from '~stackable/block-components'
import { useBlockAttributesContext } from '~stackable/hooks'
import { BlockCss, BlockCssCompiler } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'

const _Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-number-box__text"
				styleRule="height"
				attrName="shapeSize"
				key="shapeSize"
				responsive="all"
				hasUnits="px"
				enabledCallback={ getAttribute => getAttribute( 'hasShape' ) }
				dependencies={ [ 'hasShape' ] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-number-box__text"
				styleRule="width"
				attrName="shapeSize"
				key="shapeSize-width"
				responsive="all"
				hasUnits="px"
				enabledCallback={ getAttribute => getAttribute( 'hasShape' ) }
				dependencies={ [ 'hasShape' ] }
			/>
		</>
	)
}

const Styles = memo( _Styles )
Styles.Content = _Styles

export const HeadingStyles = memo( props => {
	const hasShape = useBlockAttributesContext( attributes => attributes.hasShape )

	return (
		<>
			{ hasShape &&
				<>
					<BackgroundStyle
						{ ...props }
						attrNameTemplate="shape%s"
						selector=".stk-block-number-box__text"
						// backgroundFallbackColor="#000000"
					/>
					<BorderStyle
						{ ...props }
						attrNameTemplate="shape%s"
						selector=".stk-block-number-box__text"
					/>
				</>
			}
			<Styles { ...props } />
			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<Typography.Style { ...props } selector=".stk-block-number-box__text" />
			<EffectsAnimations.Style { ...props } />
		</>
	)
} )

HeadingStyles.defaultProps = {
	version: '',
}

HeadingStyles.Content = props => {
	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	return (
		<BlockCssCompiler>
			<BackgroundStyle.Content
				{ ...props }
				attrNameTemplate="shape%s"
				selector=".stk-block-number-box__text"
			/>
			<BorderStyle.Content
				{ ...props }
				attrNameTemplate="shape%s"
				selector=".stk-block-number-box__text"
			/>
			<Styles.Content { ...props } />
			<Alignment.Style.Content { ...props } />
			<BlockDiv.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<Typography.Style.Content { ...props } selector=".stk-block-number-box__text" />
			<EffectsAnimations.Style.Content { ...props } />
			<MarginBottom.Style.Content { ...props } />
		</BlockCssCompiler>
	)
}

HeadingStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}
