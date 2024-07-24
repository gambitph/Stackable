/** Internal dependencies
 */
import variations from './variations'

/**
 * External dependencies
 */
import {
	Advanced,
	Alignment,
	BlockDiv,
	Column,
	ContainerDiv,
	EffectsAnimations,
	Image,
	Transform,
} from '~stackable/block-components'
import { getBlockStyle, useBlockAttributesContext } from '~stackable/hooks'
import { BlockCssCompiler } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'

const containerDivOptions = {
	sizeSelector: '.stk-block-card__content',
	sizeHorizontalAlignRule: 'margin',
	wrapperSelector: '.%s-container',
}

export const CardStyles = memo( props => {
	const className = useBlockAttributesContext( attributes => attributes.className )
	const blockStyle = getBlockStyle( variations, className )

	return (
		<>
			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<Column.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<ContainerDiv.Style { ...props } { ...containerDivOptions } />
			<Image.Style
				{ ...props }
				enableWidth={ blockStyle.name === 'horizontal' }
				widthUnitCallback={ ( unit, device ) => {
					if ( blockStyle.name === 'horizontal' ) {
						if ( device === 'tablet' ) {
							return 'px'
						}
					}
					return unit
				} }
				enableAspectRatio={ ! [ 'horizontal', 'full', 'faded' ].includes( blockStyle.name ) }
				selector=".stk-block-card__image"
			/>
		</>
	)
} )

CardStyles.defaultProps = {
	version: '',
}

CardStyles.Content = props => {
	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	const blockStyle = getBlockStyle( variations, props.attributes.className )

	return (
		<BlockCssCompiler>
			<Alignment.Style.Content { ...props } />
			<BlockDiv.Style.Content { ...props } />
			<Column.Style.Content { ...props } />
			<EffectsAnimations.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<ContainerDiv.Style.Content { ...props } { ...containerDivOptions } />
			<Image.Style.Content
				{ ...props }
				enableWidth={ blockStyle.name === 'horizontal' }
				enableAspectRatio={ ! [ 'horizontal', 'full', 'faded' ].includes( blockStyle.name ) }
				selector=".stk-block-card__image"
			/>
		</BlockCssCompiler>
	)
}

CardStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}
