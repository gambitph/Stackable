/**
 * Internal dependencies
 */

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
	useBlockAttributes, useDeviceType,
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
	renderToString,
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
	selector: '.stk-block-posts__category',
	hoverSelector: `${ itemSelector }:hover .stk-block-posts__category`,
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

const getStyleParams = () => {
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
			styles: {
				'--stk-column-gap': 'columnGap',
				rowGap: 'rowGap',
			},
			format: '%spx',
			responsive: 'all',
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

	const postsStyles = useStyles( attributes, getStyleParams() )

	return (
		<>
			<Alignment.Style { ...propsToPass } />
			<BlockDiv.Style { ...propsToPass } />
			<Column.Style { ...propsToPass } />
			<Advanced.Style { ...propsToPass } />
			<EffectsAnimations.Style { ...propsToPass } />
			<ContainerDiv.Style { ...propsToPass } options={ containerDivOptions } />
			<Image.Style { ...propsToPass } />
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
	const postsStyles = getStyles( propsToPass.attributes, getStyleParams() )

	const styles = (
		<>
			<Alignment.Style.Content { ...propsToPass } />
			<BlockDiv.Style.Content { ...propsToPass } />
			<Column.Style.Content { ...propsToPass } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<ContainerDiv.Style.Content { ...propsToPass } options={ containerDivOptions } />
			<Image.Style.Content { ...propsToPass } />
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
