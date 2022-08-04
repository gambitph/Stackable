/**
 * External dependencies
 */
import { Style as StyleComponent } from '~stackable/components'
import { Fragment } from '@wordpress/element'
import {
	__getValue, getStyles, useStyles,
} from '~stackable/util'
import { useBlockEditContext } from '@wordpress/block-editor'

const getStyleParams = ( options = {} ) => {
	const {
		clientId,
		positionSelector = '',
	} = options

	return [
		{
			selector: positionSelector,
			hoverSelector: positionSelector ? `${ positionSelector }:hover` : undefined,
			styleRule: 'top',
			attrName: 'positionNum',
			responsive: 'all',
			hover: 'all',
			hasUnits: 'px',
			valuePreCallback: ( value, getAttribute, device ) => {
				if ( value && value.top === '' ) {
					const isSticky = getAttribute( 'position', device, 'normal', true ) === 'sticky'
					if ( isSticky ) {
						return 0
					}
				}
				return value?.top
			},
		},
		{
			selector: positionSelector,
			hoverSelector: positionSelector ? `${ positionSelector }:hover` : undefined,
			styleRule: 'right',
			attrName: 'positionNum',
			responsive: 'all',
			hover: 'all',
			hasUnits: 'px',
			valuePreCallback: value => value?.right,
		},
		{
			selector: positionSelector,
			hoverSelector: positionSelector ? `${ positionSelector }:hover` : undefined,
			styleRule: 'bottom',
			attrName: 'positionNum',
			responsive: 'all',
			hover: 'all',
			hasUnits: 'px',
			valuePreCallback: value => value?.bottom,
		},
		{
			selector: positionSelector,
			hoverSelector: positionSelector ? `${ positionSelector }:hover` : undefined,
			styleRule: 'left',
			attrName: 'positionNum',
			responsive: 'all',
			hover: 'all',
			hasUnits: 'px',
			valuePreCallback: value => value?.left,
		},
		{
			renderIn: 'edit',
			selector: positionSelector,
			hoverSelector: positionSelector ? `${ positionSelector }:hover` : undefined,
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
		// We need to implement z-index on the block itself or else it won't look correct in the editor.
		{
			renderIn: 'edit',
			selectorCallback: () => `.editor-styles-wrapper [data-block="${ clientId }"]`,
			styleRule: 'zIndex',
			attrName: 'zIndex',
			responsive: 'all',
		},
		{
			renderIn: 'save',
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
			selector: '.stk-container',
			styleRule: 'overflow',
			attrName: 'overflow',
			enabledCallback: getAttribute => getAttribute( 'overflow' ) === 'visible',
			responsive: 'all',
		},
		{
			selector: '',
			styleRule: 'clear',
			attrName: 'clear',
		},
	]
}

// If a top, right, bottom, left hover state position was given, it will not
// animate since there is no initial value for the position (e.g. top: 0). This
// function adds a `top: 0` for the normal state of the CSS if there's a hover
// state position e.g. hover `top: 20px` given but no initial state.
const getStyleParams2 = ( options = {} ) => {
	const {
		positionSelector = '',
	} = options

	return [
		{
			selector: positionSelector,
			styleRule: 'top',
			attrName: 'positionNum',
			responsive: 'all',
			valuePreCallback: ( value, getAttribute, device, state ) => {
				if ( ( ! value || value.top === '' ) && state === 'normal' ) {
					const hoverValue = getAttribute( 'positionNum', device, 'hover' )
					const parentHoverValue = getAttribute( 'positionNum', device, 'parent-hovered' )
					if ( ( hoverValue && hoverValue.top !== '' ) || ( parentHoverValue && parentHoverValue.top !== '' ) ) {
						return 0
					}
				}
				return undefined
			},
		},
		{
			selector: positionSelector,
			styleRule: 'right',
			attrName: 'positionNum',
			responsive: 'all',
			valuePreCallback: ( value, getAttribute, device, state ) => {
				if ( ( ! value || value.right === '' ) && state === 'normal' ) {
					const hoverValue = getAttribute( 'positionNum', device, 'hover' )
					const parentHoverValue = getAttribute( 'positionNum', device, 'parent-hovered' )
					if ( ( hoverValue && hoverValue.right !== '' ) || ( parentHoverValue && parentHoverValue.right !== '' ) ) {
						return 0
					}
				}
				return undefined
			},
		},
		{
			selector: positionSelector,
			styleRule: 'bottom',
			attrName: 'positionNum',
			responsive: 'all',
			valuePreCallback: ( value, getAttribute, device, state ) => {
				if ( ( ! value || value.bottom === '' ) && state === 'normal' ) {
					const hoverValue = getAttribute( 'positionNum', device, 'hover' )
					const parentHoverValue = getAttribute( 'positionNum', device, 'parent-hovered' )
					if ( ( hoverValue && hoverValue.bottom !== '' ) || ( parentHoverValue && parentHoverValue.bottom !== '' ) ) {
						return 0
					}
				}
				return undefined
			},
		},
		{
			selector: positionSelector,
			styleRule: 'left',
			attrName: 'positionNum',
			responsive: 'all',
			valuePreCallback: ( value, getAttribute, device, state ) => {
				if ( ( ! value || value.left === '' ) && state === 'normal' ) {
					const hoverValue = getAttribute( 'positionNum', device, 'hover' )
					const parentHoverValue = getAttribute( 'positionNum', device, 'parent-hovered' )
					if ( ( hoverValue && hoverValue.left !== '' ) || ( parentHoverValue && parentHoverValue.left !== '' ) ) {
						return 0
					}
				}
				return undefined
			},
		},
	]
}

export const Style = props => {
	const { clientId } = useBlockEditContext()
	const styles = useStyles( getStyleParams( { ...props, clientId } ) )
	const styles2 = useStyles( getStyleParams2( props ) )

	return (
		<Fragment>
			<StyleComponent
				styles={ styles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...props }
			/>
			<StyleComponent
				styles={ styles2 }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...props }
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
	const styles2 = getStyles( attributes, getStyleParams2( options ) )

	return (
		<Fragment>
			<StyleComponent.Content
				styles={ styles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
			<StyleComponent.Content
				styles={ styles2 }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)
}
