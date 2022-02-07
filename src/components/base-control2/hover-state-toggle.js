/**
 * Internal dependencies
 */
import SVGStateNormal from './images/state-normal.svg'
import SVGStateHover from './images/state-hover.svg'
import SVGStateParentHover from './images/state-parent-hover.svg'
import ControlIconToggle from '../control-icon-toggle'
import { useBlockHoverState } from '~stackable/hooks'

/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { useMemo, memo } from '@wordpress/element'
import { __, sprintf } from '@wordpress/i18n'

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

const HoverStateToggle = props => {
	const [ currentHoverState, setCurrentHoverState, _blockHoverClass, hasParentHoverState, hasCollapsedState, isCollapsedBlock ] = useBlockHoverState()

	const stateOptions = useMemo( () => {
		const hover = props.hover === 'all' ? ALL_HOVER : props.hover
		return HOVER_OPTIONS.filter( ( { value } ) => {
			if ( ! hasCollapsedState && value === 'collapsed' && ! isCollapsedBlock ) {
				return false
			}

			return hover.includes( value )
		} ).map( state => {
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
		} )
	}, [ props.hover, hasParentHoverState ] )

	return (
		<ControlIconToggle
			value={ currentHoverState }
			options={ stateOptions }
			onChange={ state => setCurrentHoverState( state ) }
			buttonLabel={ __( 'Hover State', i18n ) }
		/>
	)
}

HoverStateToggle.defaultProps = {
	hover: false,
}

export default memo( HoverStateToggle )
