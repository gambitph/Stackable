/**
 * Internal dependencies
 */
import SVGStateNormal from './images/state-normal.svg'
import SVGStateHover from './images/state-hover.svg'
import SVGStateParentHover from './images/state-parent-hover.svg'
import ControlIconToggle from '../control-icon-toggle'
import {
	useBlockAttributesContext, useBlockHoverState, useDeviceType,
} from '~stackable/hooks'

/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'
import { __, sprintf } from '@wordpress/i18n'
import { dispatch } from '@wordpress/data'
import { upperFirst, camelCase } from 'lodash'
import { isEmptyAttribute } from '~stackable/util'

const HOVER_OPTIONS = [
	{
		label: __( 'Normal', i18n ),
		value: 'normal',
		icon: <SVGStateNormal />,
	},
	{
		label: __( 'Hover', i18n ),
		value: 'hover',
		icon: <SVGStateHover />,
	},
	{
		label: __( 'Parent Hovered', i18n ),
		value: 'parent-hovered',
		icon: <SVGStateParentHover />,
	},
	{
		label: __( 'Collapsed', i18n ),
		value: 'collapsed',
		icon: <SVGStateParentHover />,
	},
]

const ALL_HOVER = [ 'normal', 'hover', 'parent-hovered', 'collapsed' ]
const _ALL_HOVER = [ 'normal', 'hover', 'parent-hover', 'collapsed' ]
const ALL_HOVER_ATTRIBUTE_SUFFIX = _ALL_HOVER.map( s => upperFirst( camelCase( s ) ) )

const HoverStateToggle = props => {
	const [ currentHoverState, _blockHoverClass, hasParentHoverState, hasCollapsedState, isCollapsedBlock ] = useBlockHoverState()
	const deviceType = useDeviceType()

	// These are all of the attributes for all states.
	const stateValues = useBlockAttributesContext( attributes => {
		if ( ! props.attribute ) {
			return {}
		}
		return ALL_HOVER.reduce( ( states, state, i ) => {
			return {
				...states,
				[ state ]: attributes[ `${ props.attribute }${ props.hasResponsive && deviceType !== 'Desktop' ? deviceType : '' }${ ALL_HOVER_ATTRIBUTE_SUFFIX[ i ] }` ],
			}
		}, {} )
	} )

	const hover = props.hover === 'all' ? ALL_HOVER : props.hover

	const _stateOptions = HOVER_OPTIONS.filter( ( { value } ) => {
		if ( ! hasCollapsedState && value === 'collapsed' && ! isCollapsedBlock ) {
			return false
		}

		return hover.includes( value )
	} )

	const stateOptions = _stateOptions.map( state => {
		if ( state.value === 'parent-hovered' ) {
			return {
				disabled: ! hasParentHoverState,
				tooltip: ! hasParentHoverState
					? <span className="stk-tooltip__text">
						{ sprintf( '%s - %s', __( 'Parent Hovered', i18n ), __( 'Add a Container Background to a parent block to enable this state.', i18n ) ) }
						<br />
						<a href="https://docs.wpstackable.com/article/465-how-to-style-the-different-block-hover-states?utm_source=wp-settings-global-settings&utm_campaign=learnmore&utm_medium=wp-dashboard" target="_docs">{ __( 'Learn more', i18n ) }</a>
					</span> : undefined,
				...state,
			}
		}
		return state
	} ).map( state => {
		if ( state.value === 'normal' || ! props.attribute ) {
			return state
		}

		return {
			...state,
			hasValue: ! isEmptyAttribute( stateValues[ state.value ] ),
		}
	} )

	return (
		<ControlIconToggle
			value={ currentHoverState }
			options={ stateOptions }
			onChange={ state => dispatch( 'stackable/hover-state' ).updateHoverState( state ) }
			buttonLabel={ __( 'Hover State', i18n ) }
		/>
	)
}

HoverStateToggle.defaultProps = {
	hover: false,
	attribute: '',
	hasResponsive: false, // Wether the attribute has responsive attributes (where we have hover states per device type)
}

export default memo( HoverStateToggle )
