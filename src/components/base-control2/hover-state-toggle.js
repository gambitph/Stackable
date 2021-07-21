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
import { useMemo } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

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
]

const HoverStateToggle = props => {
	const [ currentHoverState, setCurrentHoverState, _blockHoverClass, hasParentHoverState ] = useBlockHoverState()

	const stateOptions = useMemo( () => {
		const hover = props.hover === 'all' ? [ 'normal', 'hover', 'parent-hovered' ] : props.hover
		return HOVER_OPTIONS.filter( ( { value } ) => {
			// Don't include the parent hover state toggle if there's no parent hovered.
			if ( ! hasParentHoverState && value === 'parent-hovered' ) {
				return false
			}
			return hover.includes( value )
		} )
	}, [ props.hover ] )

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

export default HoverStateToggle
