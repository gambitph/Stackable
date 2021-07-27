/**
 * Internal dependencies
 */
import { convertSVGStringToBase64 } from './util'

/**
 * External dependencies
 */
import {
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
import { useBlockEditContext } from '@wordpress/block-editor'
import {
	Fragment, renderToString,
} from '@wordpress/element'

const typographyOptions = {
	selector: 'ol > li, ul > li',
	hoverSelector: 'ol:hover > li, ul:hover > li',
}

const getStyleParams = ( { attributes = {} } ) => {
	const selector = [
		'ul > li:before',
		'ol > li:before',
	]
	const hoverSelector = [
		'.%s:hover ul > li:before',
		'.%s:hover ol > li:before',
	]

	const orderedListMarkerSelector = 'ol > li::marker'
	const orderedListMarkerHoverSelector = '.%s:hover ol > li::marker'

	const individualIconStyles = Object.keys( attributes.icons ).reduce( ( acc, key ) => {
		return [
			...acc,
			{
				renderIn: 'edit',
				selector: '> div >' + key + ':before',
				hover: 'all',
				hoverSelector: '.%s:hover > div >' + key + ':before',
				styleRule: 'backgroundImage',
				attrName: 'iconColor',
				valuePreCallback: ( value, getAttribute, device, state ) => {
					if ( state !== 'normal' && ! value ) {
						return undefined
					}

					const iconWithColor = convertSVGStringToBase64( getAttribute( 'icons' )?.[ key ], value || '#000' )
					return `url('data:image/svg+xml;base64,${ iconWithColor }')`
				},
				dependencies: [ 'icons' ],
			},
			{
				renderIn: 'save',
				selector: '>' + key + ':before',
				hover: 'all',
				hoverSelector: '.%s:hover >' + key + ':before',
				styleRule: 'backgroundImage',
				attrName: 'iconColor',
				valuePreCallback: ( value, getAttribute, device, state ) => {
					if ( state !== 'normal' && ! value ) {
						return undefined
					}

					const iconWithColor = convertSVGStringToBase64( getAttribute( 'icons' )?.[ key ], value || '#000' )
					return `url('data:image/svg+xml;base64,${ iconWithColor }')`
				},
				dependencies: [ 'icons' ],
			},
		]
	}, [] )

	return [
		...individualIconStyles,
		{
			selector: '',
			styleRule: 'columnCount',
			attrName: 'columns',
			responsive: 'all',
		},
		{
			selector: '',
			styleRule: 'columnGap',
			attrName: 'columnGap',
			responsive: 'all',
			format: '%spx',
		},
		{
			selector,
			hover: 'all',
			hoverSelector,
			styleRule: 'backgroundImage',
			attrName: 'iconColor',
			valuePreCallback: ( value, getAttribute, device, state ) => {
				const iconSVG = getAttribute( 'icon' )
				if ( state !== 'normal' && ! value ) {
					return undefined
				}

				if ( ! iconSVG ) {
					return undefined
				}
				const iconWithColor = convertSVGStringToBase64( iconSVG, value || '#000' )
				return `url('data:image/svg+xml;base64,${ iconWithColor }')`
			},
			dependencies: [ 'icon' ],
		},
		{
			selector: orderedListMarkerSelector,
			hover: 'all',
			hoverSelector: orderedListMarkerHoverSelector,
			styleRule: 'color',
			attrName: 'markerColor',
		},
		{
			selector,
			hoverSelector,
			styleRule: 'opacity',
			attrName: 'iconOpacity',
			hover: 'all',
		},
		{
			selector: '',
			styles: {
				'--icon-size': 'iconSize',
			},
			responsive: 'all',
			format: '%spx',
		},
		{
			selector,
			hoverSelector,
			styleRule: 'transform',
			attrName: 'iconRotation',
			hover: 'all',
			format: 'rotate(%sdeg)',
		},
	]
}

export const IconListStyles = props => {
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
			<Typography.Style { ...propsToPass } options={ typographyOptions } />
			<StyleComponent
				styles={ iconStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)
}

IconListStyles.defaultProps = {
	attributes: {},
	options: {},
}

IconListStyles.Content = props => {
	const {
		...propsToPass
	} = props

	propsToPass.blockUniqueClassName = getUniqueBlockClass( props.attributes.uniqueId )
	const options = { attributes: propsToPass.attributes }
	const iconStyles = getStyles( propsToPass.attributes, getStyleParams( options ) )

	const styles = (
		<Fragment>
			<Typography.Style.Content { ...propsToPass } options={ typographyOptions } />
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

IconListStyles.Content.defaultProps = {
	attributes: {},
	options: {},
}
