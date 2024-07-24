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
} from '~stackable/block-components'
import { useBlockStyle, getBlockStyle } from '~stackable/hooks'
import { BlockCss, BlockCssCompiler } from '~stackable/components'

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
	dependencies: [ 'imageHoverStateInContainer', 'imageOverlayColorType' ],
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
				{ ...propsToPass }
				selector=""
				styleRule="--stk-columns"
				attrName="columns"
				key="columns"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				responsive="all"
				styleRule="--stk-container-padding-left"
				attrName="containePadding"
				key="containePadding"
				hasUnits="px"
				valueCallback={ value => value?.left }
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				responsive="all"
				styleRule="--stk-container-padding-right"
				attrName="containePadding"
				key="containePadding-right"
				hasUnits="px"
				valueCallback={ value => value?.right }
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				styleRule="--stk-column-gap"
				attrName="columnGap"
				key="columnGap"
				format="%spx"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-content-align"
				hasUnits="px"
				responsive="all"
				styleRule="maxWidth"
				attrName="innerBlockContentWidth"
				key="innerBlockContentWidth"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-content-align"
				responsive="all"
				styleRule="marginLeft"
				attrName="innerBlockAlign"
				key="innerBlockAlign-margin-left"
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
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-content-align"
				responsive="all"
				styleRule="marginRight"
				attrName="innerBlockAlign"
				key="innerBlockAlign"
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
			/>

			{ /** Category Highlight Color */ }
			<BlockCss
				{ ...propsToPass }
				selector={ `${ itemSelector } .stk-button` }
				styleRule="background"
				attrName="categoryHighlightColor"
				key="categoryHighlightColor-button"
				enabledCallback={ getAttribute => getAttribute( 'categoryHighlighted' ) }
				dependencies={ [ 'categoryHighlighted' ] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ `${ itemSelector } .stk-button:after` }
				styleRule="background"
				attrName="categoryHighlightColor"
				key="categoryHighlightColor-button-after"
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
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ `${ itemSelector } .stk-button:after` }
				styleRule="opacity"
				attrName="categoryHighlightColor"
				key="categoryHighlightColor-opacity"
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
			/>

			{ /** Spacing */ }
			<BlockCss
				{ ...propsToPass }
				selector={ `${ itemSelector } .stk-block-posts__image-link` }
				styleRule="marginBottom"
				attrName="imageSpacing"
				key="imageSpacing"
				format="%spx"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-posts__title"
				styleRule="marginBottom"
				attrName="titleSpacing"
				key="titleSpacing"
				format="%spx"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-posts__category"
				styleRule="marginBottom"
				attrName="categorySpacing"
				key="categorySpacing"
				format="%spx"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-posts__excerpt"
				styleRule="marginBottom"
				attrName="excerptSpacing"
				key="excerptSpacing"
				format="%spx"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-posts__meta"
				styleRule="marginBottom"
				attrName="metaSpacing"
				key="metaSpacing"
				format="%spx"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-posts__readmore"
				styleRule="marginBottom"
				attrName="readmoreSpacing"
				key="readmoreSpacing"
				format="%spx"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector=".stk-container-padding"
				styleRule="width"
				attrName="imageWidth"
				key="imageWidth"
				responsive="all"
				valueCallback={ ( value, getAttribute, device ) => {
					if ( getAttribute( 'imageWidthUnit', device ) === '%' && value !== undefined && value !== '' ) {
						return ( 100 - parseInt( value ) ) + '%'
					}

					return undefined
				} }
				enabledCallback={ () => blockStyle === 'list' }
				dependencies={ [ 'imageWidthUnit', 'className' ] }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector=".stk-block-posts__image-link:not(:empty)"
				styleRule="width"
				attrName="imageWidth"
				key="imageWidthHorizontalSave"
				responsive="all"
				hasUnits="%"
				enabledCallback={ getAttribute => {
					return ( getAttribute( 'imageWidthUnit' ) === '%' ||
					getAttribute( 'imageWidthUnitTablet' ) === '%' ) &&
					[ 'horizontal', 'horizontal-2' ].includes( blockStyle ) &&
					getAttribute( 'imageHasLink' )
				} }
				dependencies={ [
					'imageWidthUnitTablet',
					'imageWidthUnit',
					'imageHasLink',
					'className',
				] }
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
			<Advanced.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<ContainerDiv.Style { ...props } { ...containerDivOptions } />
			<Image.Style
				{ ...props }
				{ ..._imageOptions }
				enableHeight={ ! [ 'portfolio' ].includes( blockStyle ) }
				enableAspectRatio={ ! [ 'list', 'horizontal', 'horizontal-2', 'portfolio', 'portfolio-2', 'vertical-card-2' ].includes( blockStyle ) }
			/>
			<Typography.Style { ...props } { ...titleTypographyOptionsEditor } />
			<Typography.Style { ...props } { ...categoryTypographyOptions } />
			<Typography.Style { ...props } { ...excerptTypographyOptions } />
			<Typography.Style { ...props } { ...metaTypographyOptions } />
			<Typography.Style { ...props } { ...readmoreTypographyOptions } />
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

// Note: Styles do not get rerendered on editor refresh. Rerender only happens when margin bottom is clicked on.
// Ideally should rerender on editor refresh.
PostsStyles.Content = props => {
	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	const blockStyle = getBlockStyle( variations, props.attributes.className )

	const enableWidth = () => {
		if ( [ 'horizontal', 'horizontal-2' ].includes( blockStyle?.name ) ) {
			if ( props.attributes.imageHasLink ) {
				return false
			}
			return true
		}
		return true
	}

	const imageOptions = {
		..._imageOptions,
		enableHeight: ! [ 'portfolio' ].includes( blockStyle?.name ),
		enableWidth: enableWidth(),
		...( [ 'list' ].includes( blockStyle?.name ) && props.attributes.imageHasLink ? { selector: `${ itemSelector } .stk-block-posts__image-link`, widthStyleRule: 'flexBasis' } : {} ),
		enableAspectRatio: ! [ 'list', 'horizontal', 'horizontal-2', 'portfolio', 'portfolio-2', 'vertical-card-2' ].includes( blockStyle?.name ),
	}

	return (
		<BlockCssCompiler>
			<Alignment.Style.Content { ...props } />
			<BlockDiv.Style.Content { ...props } />
			<Column.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<EffectsAnimations.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } />
			<ContainerDiv.Style.Content { ...props } { ...containerDivOptions } />
			<Image.Style.Content { ...props } { ...imageOptions } />
			<Typography.Style.Content { ...props } { ...titleTypographyOptions } />
			<Typography.Style.Content { ...props } { ...categoryTypographyOptions } />
			<Typography.Style.Content { ...props } { ...excerptTypographyOptions } />
			<Typography.Style.Content { ...props } { ...metaTypographyOptions } />
			<Typography.Style.Content { ...props } { ...readmoreTypographyOptions } />
			<FlexGapStyles.Content { ...props } { ...flexGapOptions } />
			<Styles { ...props } blockStyle={ blockStyle?.name } />
		</BlockCssCompiler>
	)
}

PostsStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}
