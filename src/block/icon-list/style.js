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

const getStyleParams = () => {
	const selector = 'ol > li:before, ul > li:before'
	const hoverSelector = 'ol:hover > li:before, ul:hover > li:before'

	return [
		{
			selector,
			hover: 'all',
			hoverSelector,
			styleRule: 'backgroundImage',
			attrName: 'iconColor',
			valuePreCallback: ( value, getAttribute, device, state ) => {
				const icon = getAttribute( 'icon' )
				if ( state !== 'normal' && ! value ) {
					return undefined
				}

				if ( ! icon ) {
					return undefined
				}
				const base64 = convertSVGStringToBase64( icon, value || '#000' )
				return `url('data:image/svg+xml;base64,${ base64 }')`
			},
			dependencies: [ 'icon' ],
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
			hover: 'all',
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

	const iconStyles = useStyles( attributes, getStyleParams() )

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
	const iconStyles = getStyles( propsToPass.attributes, getStyleParams() )

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
