/**
 * External dependencies
 */
import { Style as StyleComponent } from '~stackable/components'
import { Fragment } from '@wordpress/element'
import {
	__getValue, getStyles, useStyles,
} from '~stackable/util'

const getStyleParams = () => {
	return [
		{
			selector: '',
			styleRule: 'top',
			attrName: 'positionNum',
			responsive: 'all',
			hover: 'all',
			hasUnits: 'px',
			valuePreCallback: ( value, getAttribute, device ) => {
				if ( value.top === '' ) {
					const isSticky = getAttribute( 'position', device, 'normal', true ) === 'sticky'
					if ( isSticky ) {
						return 0
					}
				}
				return value.top
			},
		},
		{
			selector: '',
			styleRule: 'right',
			attrName: 'positionNum',
			responsive: 'all',
			hover: 'all',
			hasUnits: 'px',
			valuePreCallback: value => value.right,
		},
		{
			selector: '',
			styleRule: 'bottom',
			attrName: 'positionNum',
			responsive: 'all',
			hover: 'all',
			hasUnits: 'px',
			valuePreCallback: value => value.bottom,
		},
		{
			selector: '',
			styleRule: 'left',
			attrName: 'positionNum',
			responsive: 'all',
			hover: 'all',
			hasUnits: 'px',
			valuePreCallback: value => value.left,
		},
		{
			renderIn: 'edit',
			selector: '',
			styleRule: 'position',
			attrName: 'positionNum',
			responsive: 'all',
			hover: 'all',
			valuePreCallback: ( value, getAttribute, device ) => {
				if ( value && ( value.top !== '' || value.right !== '' || value.bottom !== '' || value.left !== '' ) ) {
					if ( getAttribute( 'position', device ) === '' ) {
						return 'relative'
					}
				}
				return undefined
			},
		},
		{
			selector: '',
			styleRule: 'position',
			attrName: 'position',
			responsive: 'all',
		},
		{
			selector: '',
			styleRule: 'opacity',
			attrName: 'opacity',
			responsive: 'all',
			hover: 'all',
		},
		{
			selector: '',
			styleRule: 'zIndex',
			attrName: 'zIndex',
			responsive: 'all',
		},
		{
			selector: '',
			styleRule: 'overflow',
			attrName: 'overflow',
			responsive: 'all',
		},
		{
			selector: '',
			styleRule: 'clear',
			attrName: 'clear',
		},
	]
}

export const Style = props => {
	const {
		attributes,
		options = {},
		...propsToPass
	} = props

	const styles = useStyles( attributes, getStyleParams( options ) )

	return (
		<Fragment>
			<StyleComponent
				styles={ styles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)
}

Style.Content = props => {
	const {
		attributes,
		options = {},
		...propsToPass
	} = props

	const styles = getStyles( attributes, getStyleParams( options ) )

	return (
		<Fragment>
			<StyleComponent.Content
				styles={ styles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)
}
