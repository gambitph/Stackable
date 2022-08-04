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
import {
	getUniqueBlockClass, useStyles, getStyles,
} from '~stackable/util'
import { Style as StyleComponent } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { renderToString, memo } from '@wordpress/element'

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
	dependencies: [ 'Highlighted', ...dependencies ],
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

const getStyleParams = ( options = {} ) => {
	const {
		blockStyle,
	} = options

	return [
		{
			selector: '',
			styles: {
				'--stk-columns': 'columns',
			},
			responsive: 'all',
		},
		{
			selector: '',
			responsive: 'all',
			styles: {
				'--stk-container-padding-left': 'containePadding',
			},
			hasUnits: 'px',
			valueCallback: value => value?.left,
		},
		{
			selector: '',
			responsive: 'all',
			styles: {
				'--stk-container-padding-right': 'containePadding',
			},
			hasUnits: 'px',
			valueCallback: value => value?.right,
		},
		{
			selector: '',
			styles: {
				'--stk-column-gap': 'columnGap',
			},
			format: '%spx',
			responsive: 'all',
		},
		{
			selector: '.stk-content-align',
			hasUnits: 'px',
			responsive: 'all',
			styleRule: 'maxWidth',
			attrName: 'innerBlockContentWidth',
		},
		{
			selector: '.stk-content-align',
			responsive: 'all',
			styleRule: 'marginLeft',
			attrName: 'innerBlockAlign',
			valueCallback: ( value, getAttribute, device ) => {
				if ( getAttribute( 'innerBlockContentWidth', device ) === undefined || getAttribute( 'innerBlockContentWidth', device ) === '' ) {
					return undefined
				}
				if ( value === 'center' || value === 'flex-end' ) {
					return 'auto'
				}
				return 0
			},
			dependencies: [ 'innerBlockContentWidth' ],
		},
		{
			selector: '.stk-content-align',
			responsive: 'all',
			styleRule: 'marginRight',
			attrName: 'innerBlockAlign',
			valueCallback: ( value, getAttribute, device ) => {
				if ( getAttribute( 'innerBlockContentWidth', device ) === undefined || getAttribute( 'innerBlockContentWidth', device ) === '' ) {
					return undefined
				}
				if ( value === 'center' || value === 'flex-start' ) {
					return 'auto'
				}
				return 0
			},
			dependencies: [ 'innerBlockContentWidth' ],
		},

		// Category Highlight Color
		{
			selector: `${ itemSelector } .stk-button`,
			styleRule: 'background',
			attrName: 'categoryHighlightColor',
			enabledCallback: getAttribute => getAttribute( 'categoryHighlighted' ),
			dependencies: [ 'categoryHighlighted' ],
		},
		{
			selector: `${ itemSelector } .stk-button:after`,
			styleRule: 'background',
			attrName: 'categoryHighlightColor',
			hoverSelectorCallback: getAttribute => getAttribute( 'categoryHoverStateInContainer' )
				? `${ itemSelector }:hover .stk-button:after`
				: `${ itemSelector } .stk-button:hover:after`,
			hover: 'all',
			valuePreCallback: ( value, getAttribute, device, state ) => {
				if ( state === 'normal' ) {
					return undefined
				}

				return value
			},
			enabledCallback: getAttribute => getAttribute( 'categoryHighlighted' ),
			dependencies: [ 'categoryHighlighted', 'categoryHoverStateInContainer' ],
		},
		{
			selector: `${ itemSelector } .stk-button:after`,
			styleRule: 'opacity',
			attrName: 'categoryHighlightColor',
			hoverSelectorCallback: getAttribute => getAttribute( 'categoryHoverStateInContainer' )
				? `${ itemSelector }:hover .stk-button:after`
				: `${ itemSelector } .stk-button:hover:after`,
			hover: 'all',
			valuePreCallback: ( value, getAttribute, device, state ) => {
				if ( state === 'normal' ) {
					return undefined
				}

				return ( value !== undefined && value !== '' ) ? 1 : undefined
			},
			enabledCallback: getAttribute => getAttribute( 'categoryHighlighted' ),
			dependencies: [ 'categoryHighlighted', 'categoryHoverStateInContainer' ],
		},

		// Spacing
		{
			selector: `${ itemSelector } .stk-block-posts__image-link`,
			styleRule: 'marginBottom',
			attrName: 'imageSpacing',
			format: '%spx',
			responsive: 'all',
		},
		{
			selector: `.stk-block-posts__title`,
			styleRule: 'marginBottom',
			attrName: 'titleSpacing',
			format: '%spx',
			responsive: 'all',
		},
		{
			selector: `.stk-block-posts__category`,
			styleRule: 'marginBottom',
			attrName: 'categorySpacing',
			format: '%spx',
			responsive: 'all',
		},
		{
			selector: `.stk-block-posts__excerpt`,
			styleRule: 'marginBottom',
			attrName: 'excerptSpacing',
			format: '%spx',
			responsive: 'all',
		},
		{
			selector: `.stk-block-posts__meta`,
			styleRule: 'marginBottom',
			attrName: 'metaSpacing',
			format: '%spx',
			responsive: 'all',
		},
		{
			selector: `.stk-block-posts__readmore`,
			styleRule: 'marginBottom',
			attrName: 'readmoreSpacing',
			format: '%spx',
			responsive: 'all',
		},

		{
			renderIn: 'save',
			selector: `.stk-container-padding`,
			styleRule: 'width',
			attrName: 'imageWidth',
			responsive: 'all',
			valueCallback: ( value, getAttribute, device ) => {
				if ( getAttribute( 'imageWidthUnit', device ) === '%' && value !== undefined && value !== '' ) {
					return ( 100 - parseInt( value ) ) + '%'
				}

				return undefined
			},
			enabledCallback: () => blockStyle === 'list',
		},
	]
}

export const PostsStyles = memo( props => {
	const blockStyle = useBlockStyle( variations )
	const postsStyles = useStyles( getStyleParams() )

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
			<StyleComponent
				styles={ postsStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...props }
			/>
		</>
	)
} )

PostsStyles.defaultProps = {
	isEditor: false,
}

PostsStyles.Content = props => {
	const {
		...propsToPass
	} = props

	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	propsToPass.blockUniqueClassName = getUniqueBlockClass( props.attributes.uniqueId )
	const blockStyle = getBlockStyle( variations, propsToPass.attributes.className )
	const postsStyles = getStyles( propsToPass.attributes, getStyleParams( { blockStyle: blockStyle?.name } ) )
	const imageOptions = {
		..._imageOptions,
		enableHeight: ! [ 'portfolio' ].includes( blockStyle?.name ),
		...( [ 'list' ].includes( blockStyle?.name ) && props.attributes.imageHasLink ? { selector: `${ itemSelector } .stk-block-posts__image-link`, widthStyleRule: 'flexBasis' } : {} ),
	}

	const styles = (
		<>
			<Alignment.Style.Content { ...propsToPass } />
			<BlockDiv.Style.Content { ...propsToPass } />
			<Column.Style.Content { ...propsToPass } />
			<Transform.Style.Content { ...propsToPass } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } options={ advancedOptions } />
			<ContainerDiv.Style.Content { ...propsToPass } options={ containerDivOptions } />
			<Image.Style.Content { ...propsToPass } options={ imageOptions } />
			<Typography.Style.Content { ...propsToPass } options={ titleTypographyOptions } />
			<Typography.Style.Content { ...propsToPass } options={ categoryTypographyOptions } />
			<Typography.Style.Content { ...propsToPass } options={ excerptTypographyOptions } />
			<Typography.Style.Content { ...propsToPass } options={ metaTypographyOptions } />
			<Typography.Style.Content { ...propsToPass } options={ readmoreTypographyOptions } />
			<ContentAlign.Style.Content { ...propsToPass } />
			<FlexGapStyles.Content { ...propsToPass } options={ flexGapOptions } />
			<StyleComponent.Content
				styles={ postsStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}

PostsStyles.Content.defaultProps = {
	attributes: {},
}
