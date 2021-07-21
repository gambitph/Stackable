/**
 * Internal dependencies
 */
import Button from '../button'

/**
 * External dependencies
 */
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import {
	useState, useCallback, memo, useMemo, useRef, useEffect,
} from '@wordpress/element'
import { Popover } from '@wordpress/components'

const ControlIconToggle = props => {
	const {
		value,
		options,
	} = props

	const [ isMouseOver, setIsMouseOver ] = useState( false )
	const [ isOpen, setIsOpen ] = useState( false )
	const buttonRef = useRef( null )

	const offset = useMemo( () => {
		const index = props.options.findIndex( el => el.value === value )
		return index / options.length * 100
	}, [ options, value ] )

	// Close the picker if the user clicks outside.
	const clickOutsideListener = useCallback( event => {
		if ( isOpen ) {
			const closest = event.target?.closest( '.stk-label-unit-toggle' )
			if ( closest !== buttonRef.current ) {
				setIsOpen( false )
			}
		}
	} )

	// Assign the outside click listener.
	useEffect( () => {
		document.body.addEventListener( 'click', clickOutsideListener )
		return () => document.body.removeEventListener( 'click', clickOutsideListener )
	}, [ clickOutsideListener ] )

	if ( options.length <= 1 ) {
		return null
	}

	const className = classnames( [
		props.className,
		'stk-label-unit-toggle',
	], {
		'stk-label-unit-toggle__colored': props.hasColors,
	} )

	return (
		<div
			className={ className }
			aria-expanded={ isOpen }
			ref={ buttonRef }
		>
			<div
				className="stk-label-unit-toggle__wrapper"
				style={ { transform: `translateY(-${ offset }%)` } }
			>
				{ options.length > 1 &&
					options.map( ( option, i ) => {
						const label = option.label || option.value
						const tooltip = ! isOpen
							? props.buttonLabel || label
							: ( props.hasLabels ? label : '' )
						return (
							<div
								key={ i }
							>
								<Button
									className={ value === option.value ? 'is-active' : '' }
									data-index={ i }
									data-value={ option.value }
									onClick={ () => {
										if ( ! isOpen ) {
											setIsOpen( true )
										} else {
											props.onChange( option.value )
											setIsOpen( false )
										}
									} }
									icon={ option.icon }
									showTooltip={ false }
									label={ label }
									onMouseEnter={ () => {
										setIsMouseOver( option.value )
									} }
									onMouseLeave={ () => {
										setIsMouseOver( false )
									} }
								>
									{ ! option.icon ? label : undefined }
								</Button>
								{ tooltip && isMouseOver === option.value &&
									<Popover
										focusOnMount={ false }
										position={ `middle ${ props.labelPosition }` }
										className="components-tooltip stk-label-unit-toggle__popup"
										aria-hidden="true"
									>
										{ tooltip }
									</Popover>
								}
							</div>
						)
					} )
				}
			</div>
		</div>
	)
}

ControlIconToggle.defaultProps = {
	className: '',
	value: '',
	options: [],
	onChange: null,
	labelPosition: 'right',
	buttonLabel: '',
	hasLabels: true,
	hasColors: true,
}

export default memo( ControlIconToggle )
