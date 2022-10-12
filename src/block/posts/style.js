/**
 * Internal dependencies
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
	Typography,
	FlexGapStyles,
	Transform,
	ContentAlign,
} from '~stackable/block-components'
import { useBlockStyle, getBlockStyle } from '~stackable/hooks'
import { BlockCss } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'

const itemSelector = ' .%s-container'

const hoverSelectorCallback = append => getAttribute =>
	getAttribute( 'hoverStateInContainer' )
		? `${ itemSelector }:hover ${ append }`
		: `${ itemSelector } ${ append }:hover`
const dependencies = [ 'hoverStateInContainer' ]

const flexGapOptions = {
	selector: '.stk-block-posts__items',
	enableColumnGap: false,
}

const containerDivOptions = {
	backgroundSelector: itemSelector,
	borderSelector: itemSelector,
	sizeSelector: itemSelector,
}

const titleTypographyOptionsEditor = {
	selector: `.stk-block-posts__title`,
	hoverSelectorCallback: hoverSelectorCallback( '.stk-block-posts__title' ),
	attrNameTemplate: 'title%s',
	dependencies,
}

const titleTypographyOptions = {
	selector: `.stk-block-posts__title a`,
	hoverSelectorCallback: hoverSelectorCallback( '.stk-block-posts__title a' ),
	attrNameTemplate: 'title%s',
	dependencies,
}

const categoryTypographyOptions = {
	selectorCallback: getAttribute => `.stk-block-posts__category a${ getAttribute( 'highlighted' )
		? ' .stk-button__inner-text'
		: '' }`,
	hoverSelectorCallback: getAttribute => {
		const selector = getAttribute( 'highlighted' ) ? ' .stk-button__inner-text' : ''
		return getAttribute( 'hoverStateInContainer' )
			? `${ itemSelector }:hover .stk-block-posts__category a${ selector }`
			: `.stk-block-posts__category a:hover${ selector }`
	},
	attrNameTemplate: 'category%s',
	dependencies: [ 'Highlighted', 'hoverStateInContainer', ...dependencies ],
}

const excerptTypographyOptions = {
	selector: `.stk-block-posts__excerpt p`,
	hoverSelectorCallback: hoverSelectorCallback( '.stk-block-posts__excerpt p' ),
	attrNameTemplate: 'excerpt%s',
	dependencies,
}

const metaTypographyOptions = {
	selector: `.stk-block-posts__meta`,
	hoverSelectorCallback: hoverSelectorCallback( '.stk-block-posts__meta' ),
	attrNameTemplate: 'meta%s',
	dependencies,
}

const readmoreTypographyOptions = {
	selector: `.stk-block-posts__readmore`,
	hoverSelectorCallback: hoverSelectorCallback( '.stk-block-posts__readmore' ),
	attrNameTemplate: 'readmore%s',
	dependencies,
}

const _imageOptions = {
	selector: `${ itemSelector } .stk-img-wrapper`,
	hoverSelectorCallback: getAttribute => getAttribute( 'imageHoverStateInContainer' )
		? `${ itemSelector }:hover .stk-img-wrapper img`
		: `${ itemSelector } .stk-img-wrapper:hover img`,
	dependencies: [ 'imageHoverStateInContainer' ],
}

const advancedOptions = {
	positionSelector: itemSelector,
}

const Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		blockStyle,
	} = props

	return (
		<>
			<BlockCss
				selector=""
				styleRule="--stk-columns"
				attrName="columns"
				responsive="all"
				{ ...propsToPass }
			/>
			<BlockCss
				selector=""
				responsive="all"
				styleRule="--stk-container-padding-left"
				attrName="containePadding"
				hasUnits="px"
				valueCallback={ value => value?.left }
				{ ...propsToPass }
			/>
			<BlockCss
				selector=""
				responsive="all"
				styleRule="--stk-container-padding-right"
				attrName="containePadding"
				hasUnits="px"
				valueCallback={ value => value?.right }
				{ ...propsToPass }
			/>
			<BlockCss
				selector=""
				styleRule="--stk-column-gap"
				attrName="columnGap"
				format="%spx"
				responsive="all"
				{ ...propsToPass }
			/>
			<BlockCss
				selector=".stk-content-align"
				hasUnits="px"
				responsive="all"
				styleRule="maxWidth"
				attrName="innerBlockContentWidth"
				{ ...propsToPass }
			/>
			<BlockCss
				selector=".stk-content-align"
				responsive="all"
				styleRule="marginLeft"
				attrName="innerBlockAlign"
				valueCallback={ ( value, getAttribute, device ) => {
					if ( getAttribute( 'innerBlockContentWidth', device ) === undefined || getAttribute( 'innerBlockContentWidth', device ) === '' ) {
						return undefined
					}
					if ( value === 'center' || value === 'flex-end' ) {
						return 'auto'
					}
					return 0
				} }
				dependencies={ [ 'innerBlockContentWidth' ] }
				{ ...propsToPass }
			/>
			<BlockCss
				selector=".stk-content-align"
				responsive="all"
				styleRule="marginRight"
				attrName="innerBlockAlign"
				valueCallback={ ( value, getAttribute, device ) => {
					if ( getAttribute( 'innerBlockContentWidth', device ) === undefined || getAttribute( 'innerBlockContentWidth', device ) === '' ) {
						return undefined
					}
					if ( value === 'center' || value === 'flex-start' ) {
						return 'auto'
					}
					return 0
				} }
				dependencies={ [ 'innerBlockContentWidth' ] }
				{ ...propsToPass }
			/>

			{ /** Category Highlight Color */ }
			<BlockCss
				selector={ `${ itemSelector } .stk-button` }
				styleRule="background"
				attrName="categoryHighlightColor"
				enabledCallback={ getAttribute => getAttribute( 'categoryHighlighted' ) }
				dependencies={ [ 'categoryHighlighted' ] }
				{ ...propsToPass }
			/>
			<BlockCss
				selector={ `${ itemSelector } .stk-button:after` }
				styleRule="background"
				attrName="categoryHighlightColor"
				hoverSelectorCallback={ getAttribute => getAttribute( 'categoryHoverStateInContainer' )
					? `${ itemSelector }:hover .stk-button:after`
					: `${ itemSelector } .stk-button:hover:after` }
				hover="all"
				valuePreCallback={ ( value, getAttribute, device, state ) => {
					if ( state === 'normal' ) {
						return undefined
					}

					return value
				} }
				enabledCallback={ getAttribute => getAttribute( 'categoryHighlighted' ) }
				dependencies={ [ 'categoryHighlighted', 'categoryHoverStateInContainer' ] }
				{ ...propsToPass }
			/>
			<BlockCss
				selector={ `${ itemSelector } .stk-button:after` }
				styleRule="opacity"
				attrName="categoryHighlightColor"
				hoverSelectorCallback={ getAttribute => getAttribute( 'categoryHoverStateInContainer' )
					? `${ itemSelector }:hover .stk-button:after`
					: `${ itemSelector } .stk-button:hover:after` }
				hover="all"
				valuePreCallback={ ( value, getAttribute, device, state ) => {
					if ( state === 'normal' ) {
						return undefined
					}

					return ( value !== undefined && value !== '' ) ? 1 : undefined
				} }
				enabledCallback={ getAttribute => getAttribute( 'categoryHighlighted' ) }
				dependencies={ [ 'categoryHighlighted', 'categoryHoverStateInContainer' ] }
				{ ...propsToPass }
			/>

			{ /** Spacing */ }
			<BlockCss
				selector={ `${ itemSelector } .stk-block-posts__image-link` }
				styleRule="marginBottom"
				attrName="imageSpacing"
				format="%spx"
				responsive="all"
				{ ...propsToPass }
			/>
			<BlockCss
				selector=".stk-block-posts__title"
				styleRule="marginBottom"
				attrName="titleSpacing"
				format="%spx"
				responsive="all"
				{ ...propsToPass }
			/>
			<BlockCss
				selector=".stk-block-posts__category"
				styleRule="marginBottom"
				attrName="categorySpacing"
				format="%spx"
				responsive="all"
				{ ...propsToPass }
			/>
			<BlockCss
				selector=".stk-block-posts__excerpt"
				styleRule="marginBottom"
				attrName="excerptSpacing"
				format="%spx"
				responsive="all"
				{ ...propsToPass }
			/>
			<BlockCss
				selector=".stk-block-posts__meta"
				styleRule="marginBottom"
				attrName="metaSpacing"
				format="%spx"
				responsive="all"
				{ ...propsToPass }
			/>
			<BlockCss
				selector=".stk-block-posts__readmore"
				styleRule="marginBottom"
				attrName="readmoreSpacing"
				format="%spx"
				responsive="all"
				{ ...propsToPass }
			/>
			<BlockCss
				renderIn="save"
				selector=".stk-container-padding"
				styleRule="width"
				attrName="imageWidth"
				responsive="all"
				valueCallback={ ( value, getAttribute, device ) => {
					if ( getAttribute( 'imageWidthUnit', device ) === '%' && value !== undefined && value !== '' ) {
						return ( 100 - parseInt( value ) ) + '%'
					}

					return undefined
				} }
				enabledCallback={ () => blockStyle === 'list' }
				dependencies={ [ 'imageWidthUnit', 'className' ] }
				{ ...propsToPass }
			/>
		</>
	)
}

export const PostsStyles = memo( props => {
	const blockStyle = useBlockStyle( variations )

	return (
		<>
			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<Column.Style { ...props } />
			<Transform.Style { ...props } />
			<Advanced.Style { ...props } { ...advancedOptions } />
			<EffectsAnimations.Style { ...props } />
			<ContainerDiv.Style { ...props } { ...containerDivOptions } />
			<Image.Style
				{ ...props }
				{ ..._imageOptions }
				enableHeight={ ! [ 'portfolio' ].includes( blockStyle ) }
			/>
			<Typography.Style { ...props } { ...titleTypographyOptionsEditor } />
			<Typography.Style { ...props } { ...categoryTypographyOptions } />
			<Typography.Style { ...props } { ...excerptTypographyOptions } />
			<Typography.Style { ...props } { ...metaTypographyOptions } />
			<Typography.Style { ...props } { ...readmoreTypographyOptions } />
			<ContentAlign.Style { ...props } />
			<FlexGapStyles { ...props } { ...flexGapOptions } />
			<Styles { ...props }
				// TODO: Check, it seems that blockStyle is supposed to be passed here but it wasn't??
			/>
		</>
	)
} )

PostsStyles.defaultProps = {
	version: '',
}

PostsStyles.Content = props => {
	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	const blockStyle = getBlockStyle( variations, props.attributes.className )

	const imageOptions = {
		..._imageOptions,
		enableHeight: ! [ 'portfolio' ].includes( blockStyle?.name ),
		...( [ 'list' ].includes( blockStyle?.name ) && props.attributes.imageHasLink ? { selector: `${ itemSelector } .stk-block-posts__image-link`, widthStyleRule: 'flexBasis' } : {} ),
	}

	return (
		<>
			<Alignment.Style.Content { ...props } />
			<BlockDiv.Style.Content { ...props } />
			<Column.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<EffectsAnimations.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } { ...advancedOptions } />
			<ContainerDiv.Style.Content { ...props } { ...containerDivOptions } />
			<Image.Style.Content { ...props } { ...imageOptions } />
			<Typography.Style.Content { ...props } { ...titleTypographyOptions } />
			<Typography.Style.Content { ...props } { ...categoryTypographyOptions } />
			<Typography.Style.Content { ...props } { ...excerptTypographyOptions } />
			<Typography.Style.Content { ...props } { ...metaTypographyOptions } />
			<Typography.Style.Content { ...props } { ...readmoreTypographyOptions } />
			<ContentAlign.Style.Content { ...props } />
			<FlexGapStyles.Content { ...props } { ...flexGapOptions } />
			<Styles { ...props } blockStyle={ blockStyle?.name } />
		</>
	)
}

PostsStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}
