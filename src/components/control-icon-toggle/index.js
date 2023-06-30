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
	useState, memo, useMemo, useRef, useEffect,
} from '@wordpress/element'

const ControlIconToggle = props => {
	const {
		value,
		options,
	} = props

	const [ isOpen, setIsOpen ] = useState( false )
	const buttonRef = useRef( null )

	const offset = useMemo( () => {
		const index = props.options.findIndex( el => el.value === value )
		return index / options.length * 100
	}, [ options, value ] )

	// Assign the outside click listener.
	useEffect( () => {
		// Close the picker if the user clicks outside.
		const clickOutsideListener = event => {
			if ( isOpen ) {
				const closest = event.target?.closest( '.stk-label-unit-toggle' )
				if ( closest !== buttonRef.current ) {
					setIsOpen( false )
				}
			}
		}

		document.body.addEventListener( 'click', clickOutsideListener )
		return () => document.body.removeEventListener( 'click', clickOutsideListener )
	}, [ isOpen, buttonRef.current ] )

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
				className={ classnames( 'stk-label-unit-toggle__wrapper', { 'is-open': isOpen } ) }
				style={ { transform: `translateY(-${ offset }%)` } }
			>
				{ options.length > 1 &&
					options.map( ( option, i ) => {
						const label = option.label || option.value
						const isActive = value === option.value

						const className = classnames( {
							'is-active': isActive,
							'has-value': option.hasValue,
						} )

						return (
							<div key={ i }>
								<Button
									className={ className }
									data-index={ i }
									data-value={ option.value }
									disabled={ option.disabled }
									tabindex={ isActive ? '0' : '-1' }
									onClick={ () => {
										if ( ! isOpen ) {
											setIsOpen( true )
										} else {
											props.onChange( option.value )
											setIsOpen( false )
										}
									} }
									icon={ option.icon }
									label={ props.hasLabels ? label : '' }
									aria-haspopup="true"
									tooltipPosition="middle right"
								>
									{ ! option.icon ? label : undefined }
								</Button>
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
