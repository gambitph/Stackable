/** Internal dependencies
 */
import variations from './variations'

/**
 * External dependencies
 */
import {
	Advanced,
	Alignment,
	BlockDiv, Column, ContainerDiv, EffectsAnimations, Image, Transform,
} from '~stackable/block-components'
import { getBlockStyle, useBlockAttributesContext } from '~stackable/hooks'
import { getUniqueBlockClass } from '~stackable/util'

/**
 * WordPress dependencies
 */
import {
	Fragment, renderToString, memo,
} from '@wordpress/element'

const containerDivOptions = {
	sizeSelector: '.stk-block-card__content',
	sizeHorizontalAlignRule: 'margin',
	wrapperSelector: '.%s-container',
}

export const CardStyles = memo( props => {
	const className = useBlockAttributesContext( attributes => attributes.className )
	const blockStyle = getBlockStyle( variations, className )

	return (
		<Fragment>
			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<Column.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<ContainerDiv.Style
				{ ...props }
				{ ...containerDivOptions }
			/>
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
				selector=".stk-block-card__image"
			/>
		</Fragment>
	)
} )

CardStyles.defaultProps = {
	isEditor: false,
}

CardStyles.Content = props => {
	const {
		...propsToPass
	} = props

	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	propsToPass.blockUniqueClassName = getUniqueBlockClass( props.attributes.uniqueId )
	const blockStyle = getBlockStyle( variations, props.attributes.className )

	const styles = (
		<Fragment>
			<Alignment.Style.Content { ...propsToPass } />
			<BlockDiv.Style.Content { ...propsToPass } />
			<Column.Style.Content { ...propsToPass } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Transform.Style.Content { ...propsToPass } />
			<ContainerDiv.Style.Content
				{ ...propsToPass }
				options={ containerDivOptions }
			/>
			<Image.Style.Content
				{ ...propsToPass }
				options={ {
					enableWidth: blockStyle.name === 'horizontal',
					selector: '.stk-block-card__image',
				} }
			/>
		</Fragment>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}

CardStyles.Content.defaultProps = {
	attributes: {},
}
