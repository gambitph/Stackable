/**
 * Internal dependencies
 */
import { convertSVGStringToBase64 } from './util'

/**
 * External dependencies
 */
import {
	Typography, MarginBottom, BlockDiv, Advanced, EffectsAnimations, Alignment, Transform,
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
import { useBlockEditContext } from '@wordpress/block-editor'
import {
	Fragment, renderToString,
} from '@wordpress/element'

const typographyOptions = {
	selector: [
		'ul li',
		'ol li',
	],
	hoverSelector: [
		'.%s:hover ul li',
		'.%s:hover ol li',
	],
}

const getStyleParams = () => {
	return [
		{
			selector: 'li',
			styleRule: 'paddingInlineStart',
			attrName: 'iconGap',
			responsive: 'all',
			format: '%spx',
		},
		{
			selector: 'ol',
			styleRule: 'listStyleType',
			attrName: 'listType',
		},
		{
			selector: 'li',
			styleRule: 'marginBottom',
			attrName: 'rowGap',
			responsive: 'all',
			format: '%spx',
		},
		{
			// FIXME: this doesn't work
			selector: 'li > a',
			styleRule: 'marginBottom',
			attrName: 'rowGap',
			responsive: 'all',
			format: '%spx',
		},
		{
			selector: [ 'ul', 'ol' ],
			styleRule: 'paddingLeft',
			attrName: 'indentation',
			responsive: 'all',
			format: '%spx',
		},
		{
			selector: 'ul li',
			hover: 'all',
			hoverSelector: '.%s:hover li',
			styleRule: 'listStyleImage',
			attrName: 'markerColor',
			valuePreCallback: ( value, getAttribute, device, state ) => {
				const iconSVG = getAttribute( 'icon' )
				const iconRotation = getAttribute( 'iconRotation' )
				const iconOpacity = getAttribute( 'iconOpacity', 'desktop', state )
				if ( state !== 'normal' && ! value && ! iconRotation && ! iconOpacity ) {
					return undefined
				}

				if ( ! iconSVG ) {
					return undefined
				}

				const transform = `rotate(${ iconRotation + 'deg' })`

				const iconWithColor = convertSVGStringToBase64( iconSVG, value || '#000', { transform, opacity: iconOpacity } )
				return `url('data:image/svg+xml;base64,${ iconWithColor }')`
			},
			dependencies: [ 'icon', 'iconRotation', 'iconOpacity' ],
		},
		{
			selector: 'li::marker',
			hover: 'all',
			hoverSelector: '.%s:hover li::marker',
			styleRule: 'color',
			attrName: 'markerColor',
		},
		{
			selector: 'li::marker',
			styleRule: 'fontSize',
			attrName: 'iconSize',
			responsive: 'all',
			format: '%sem',
		},
		{
			// For calculating the approximate clickable area for
			// icon picker.
			renderIn: 'edit',
			selector: '',
			styleRule: '--stk-icon-height',
			attrName: 'iconSize',
			responsive: 'all',
			format: '%sem',
		},
		{
			selector: [ 'li' ],
			styleRule: 'marginInline',
			attrName: 'listAlignment',
			responsive: 'all',
			valueCallback: value => value === 'center' ? 'auto' : value === 'right' ? 'auto 0' : value === 'left' ? '0 auto' : '',
		},
	]
}

export const TableOfContentsStyles = props => {
	const {
		...propsToPass
	} = props

	const deviceType = useDeviceType()
	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )

	propsToPass.blockUniqueClassName = getUniqueBlockClass( attributes.uniqueId )
	propsToPass.deviceType = deviceType
	propsToPass.attributes = { ...attributes, clientId }
	const options = { attributes: propsToPass.attributes }

	const iconStyles = useStyles( attributes, getStyleParams( options ) )

	return (
		<Fragment>
			<Alignment.Style { ...propsToPass } />
			<Typography.Style { ...propsToPass } options={ typographyOptions } />
			<MarginBottom.Style { ...propsToPass } />
			<BlockDiv.Style { ...propsToPass } />
			<EffectsAnimations.Style { ...propsToPass } />
			<Advanced.Style { ...propsToPass } />
			<Transform.Style { ...propsToPass } />
			<StyleComponent
				styles={ iconStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)
}

TableOfContentsStyles.defaultProps = {
	attributes: {},
	options: {},
}

TableOfContentsStyles.Content = props => {
	const {
		...propsToPass
	} = props

	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	propsToPass.blockUniqueClassName = getUniqueBlockClass( props.attributes.uniqueId )
	const options = { attributes: propsToPass.attributes }
	const iconStyles = getStyles( propsToPass.attributes, getStyleParams( options ) )

	const styles = (
		<Fragment>
			<Alignment.Style.Content { ...propsToPass } />
			<Typography.Style.Content { ...propsToPass } options={ typographyOptions } />
			<MarginBottom.Style.Content { ...propsToPass } />
			<BlockDiv.Style.Content { ...propsToPass } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Transform.Style.Content { ...propsToPass } />
			<StyleComponent.Content
				styles={ iconStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}

TableOfContentsStyles.Content.defaultProps = {
	attributes: {},
	options: {},
}
