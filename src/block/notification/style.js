/**
 * External dependencies
 */
import {
	BlockDiv,
	Alignment,
	Advanced,
	EffectsAnimations,
	ContainerDiv,
	MarginBottom,
	Transform,
} from '~stackable/block-components'
import { BlockCss, BlockCssCompiler } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'

const containerDivOptions = {
	sizeSelector: '.stk-block-notification__content',
	sizeHorizontalAlignRule: 'margin',
}

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
				selector=".stk-container"
				attrName="dismissibleSize"
				key="dismissibleSize"
				styleRule="paddingInlineEnd"
				enabledCallback={ getAttribute => getAttribute( 'isDismissible' ) && getAttribute( 'dismissibleSize' ) }
				valuePreCallback={ value => value + 44 } // 44 is an arbitrary number based on the size of the container paddings vs the close button size.
				format="%spx"
				dependencies={ [ 'isDismissible' ] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-notification__close-button svg"
				attrName="dismissibleColor"
				key="dismissibleColor"
				styleRule="fill"
				enabledCallback={ getAttribute => getAttribute( 'isDismissible' ) }
				dependencies={ [ 'isDismissible' ] }
			/>
		</>
	)
}

const Styles = memo( _Styles )
Styles.Content = _Styles

export const ContainerStyles = memo( props => {
	return (
		<>
			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<ContainerDiv.Style { ...props } { ...containerDivOptions } />
			<MarginBottom.Style { ...props } />
			<Styles { ...props } />
		</>
	)
} )

ContainerStyles.defaultProps = {
	version: '',
}

ContainerStyles.Content = props => {
	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	return (
		<BlockCssCompiler>
			<Alignment.Style.Content { ...props } />
			<BlockDiv.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<EffectsAnimations.Style.Content { ...props } />
			<ContainerDiv.Style.Content { ...props } { ...containerDivOptions } />
			<MarginBottom.Style.Content { ...props } />
			<Styles.Content { ...props } />
		</BlockCssCompiler>
	)
}

ContainerStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}
