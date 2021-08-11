/**
 * Internal dependencies
 */
import { blockStyles } from './block-styles'

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
} from '~stackable/block-components'
import {
	useBlockAttributes, useDeviceType, useBlockStyle, getBlockStyle,
} from '~stackable/hooks'
import {
	getUniqueBlockClass, useStyles, getStyles,
} from '~stackable/util'
import {
	Style as StyleComponent,
} from '~stackable/components'

/**
 * WordPress dependencies
 */
import {
	renderToString, useMemo,
} from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'

const itemSelector = '.stk-block-posts__item'

const containerDivOptions = {
	backgroundSelector: itemSelector,
	borderSelector: itemSelector,
	sizeSelector: itemSelector,
}

const titleTypographyOptions = {
	selector: '.stk-block-posts__title',
	hoverSelector: `${ itemSelector }:hover .stk-block-posts__title`,
	attrNameTemplate: 'title%s',
}

const categoryTypographyOptions = {
	selector: '.stk-block-posts__category > a',
	hoverSelector: `${ itemSelector }:hover .stk-block-posts__category > a`,
	attrNameTemplate: 'category%s',
}

const excerptTypographyOptions = {
	selector: '.stk-block-posts__excerpt',
	hoverSelector: `${ itemSelector }:hover .stk-block-posts__excerpt`,
	attrNameTemplate: 'excerpt%s',
}

const metaTypographyOptions = {
	selector: '.stk-block-posts__meta',
	hoverSelector: `${ itemSelector }:hover .stk-block-posts__meta`,
	attrNameTemplate: 'meta%s',
}

const readmoreTypographyOptions = {
	selector: '.stk-block-posts__readmore',
	hoverSelector: `${ itemSelector }:hover .stk-block-posts__readmore`,
	attrNameTemplate: 'readmore%s',
}

const _imageOptions = {
	selector: '.stk-block-posts__item .stk-img-wrapper',
	hoverSelector: '.stk-block-posts__item:hover .stk-img-wrapper',
}

const getStyleParams = () => {
	return [
		{
			selector: '.stk-block-posts__items',
			styles: {
				'--stk-columns': 'columns',
			},
			responsive: 'all',
		},
		{
			selector: '.stk-block-posts__items',
			styles: {
				'--stk-column-gap': 'columnGap',
				rowGap: 'rowGap',
			},
			format: '%spx',
			responsive: 'all',
		},
		{
			selector: '.stk-block-posts__items',
			styles: {
				'--stk-img-height': 'imageHeight',
			},
			hasUnits: 'px',
			responsive: 'all',
			enabledCallback: getAttribute => [ 'vertical-card', 'vertical-card-2' ].includes( getBlockStyle( blockStyles, getAttribute( 'className' ) )?.name ),
			dependencies: [ 'className' ],
		},
	]
}

export const PostsStyles = props => {
	const {
		...propsToPass
	} = props

	const deviceType = useDeviceType()
	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )

	propsToPass.blockUniqueClassName = getUniqueBlockClass( attributes.uniqueId )
	propsToPass.deviceType = deviceType
	propsToPass.attributes = { ...attributes, clientId }

	const blockStyle = useBlockStyle( blockStyles )
	const postsStyles = useStyles( attributes, getStyleParams() )
	const imageOptions = useMemo( () => ( {
		..._imageOptions,
		enableHeight: ! [ 'portfolio' ].includes( blockStyle ),
	} ), [ blockStyle ] )

	return (
		<>
			<Alignment.Style { ...propsToPass } />
			<BlockDiv.Style { ...propsToPass } />
			<Column.Style { ...propsToPass } />
			<Advanced.Style { ...propsToPass } />
			<EffectsAnimations.Style { ...propsToPass } />
			<ContainerDiv.Style { ...propsToPass } options={ containerDivOptions } />
			<Image.Style { ...propsToPass } options={ imageOptions } />
			<Typography.Style { ...propsToPass } options={ titleTypographyOptions } />
			<Typography.Style { ...propsToPass } options={ categoryTypographyOptions } />
			<Typography.Style { ...propsToPass } options={ excerptTypographyOptions } />
			<Typography.Style { ...propsToPass } options={ metaTypographyOptions } />
			<Typography.Style { ...propsToPass } options={ readmoreTypographyOptions } />
			<StyleComponent
				styles={ postsStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</>
	)
}

PostsStyles.defaultProps = {
	isEditor: false,
}

PostsStyles.Content = props => {
	const {
		...propsToPass
	} = props

	propsToPass.blockUniqueClassName = getUniqueBlockClass( props.attributes.uniqueId )
	const blockStyle = getBlockStyle( blockStyles, propsToPass.attributes.className )
	const postsStyles = getStyles( propsToPass.attributes, getStyleParams() )
	const imageOptions = {
		..._imageOptions,
		enableHeight: ! [ 'portfolio' ].includes( blockStyle?.name ),
	}

	const styles = (
		<>
			<Alignment.Style.Content { ...propsToPass } />
			<BlockDiv.Style.Content { ...propsToPass } />
			<Column.Style.Content { ...propsToPass } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<ContainerDiv.Style.Content { ...propsToPass } options={ containerDivOptions } />
			<Image.Style.Content { ...propsToPass } options={ imageOptions } />
			<Typography.Style.Content { ...propsToPass } options={ titleTypographyOptions } />
			<Typography.Style.Content { ...propsToPass } options={ categoryTypographyOptions } />
			<Typography.Style.Content { ...propsToPass } options={ excerptTypographyOptions } />
			<Typography.Style.Content { ...propsToPass } options={ metaTypographyOptions } />
			<Typography.Style.Content { ...propsToPass } options={ readmoreTypographyOptions } />
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
