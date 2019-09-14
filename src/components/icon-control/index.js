/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { BaseControl, Button } from '@wordpress/components'
import { withInstanceId, withState } from '@wordpress/compose'

/**
 * External dependencies
 */
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { i18n } from 'stackable'
import { omit } from 'lodash'
import { IconSearchPopover } from '~stackable/components'

/**
 * Check whether the string value is a valid icon.
 *
 * @param {string} value The string value to check.
 *
 * @return {boolean} True if the value is a valid icon.
 */
export const isValidIconValue = value => {
	const iconArray = getIconArray( value )
	if ( ! iconArray ) {
		return false
	}

	const prefix = value.match( /^\w*/ )[ 0 ]
	if ( ! [ 'fab', 'far', 'fas' ].includes( prefix ) ) {
		return false
	}

	const icons = {
		fab, far, fas,
	}
	const matches = Object.values( icons[ prefix ] ).filter( icon => icon.iconName === iconArray[ 1 ] )
	return matches.length > 0
}

export const getIconArray = value => {
	if ( typeof value !== 'string' ) {
		return null
	}
	if ( ! value.match( /\w*-/ ) ) {
		return null
	}
	return [
		value.match( /\w*/ ), // Prefix.
		// value.match( /\w*/ )[ 0 ], // Prefix.
		value.match( /\w+-(.*)$/ )[ 1 ], // Icon name.
	]
}

const IconControl = withInstanceId( withState( {
	openPopover: false,
	clickedOnButton: false,
} )( props => {
	const {
		instanceId,
		openPopover,
		clickedOnButton,
		setState,
	} = props

	const selectedIcon = getIconArray( props.value )
	const isValidIcon = isValidIconValue( props.value )

	return (
		<BaseControl
			className={ `ugb-icon-control ugb-icon-control-${ instanceId }` }
			{ ...omit( props, [ 'onChange', 'value' ] ) }
		>
			<div className="ugb-icon-control__wrapper">
				<div className="ugb-icon-control__button-wrapper">
					<Button
						// className="ugb-icon-control__button components-button is-button is-default"
						isDefault
						className="ugb-icon-control__icon-button"
						onClick={ () => {
							if ( ! clickedOnButton ) {
								setState( { openPopover: true } )
							} else {
								// If the popup closed because this button was clicked (while the popup was open) ensure the popup is closed.
								// This is needed or else the popup will always open when spam clicking the button.
								setState( {
									openPopover: false,
									clickedOnButton: false,
								} )
							}
						} }
					>
						{ isValidIcon && <FontAwesomeIcon icon={ selectedIcon } /> }
						{ ! isValidIcon && <FontAwesomeIcon icon={ [ 'far', 'smile' ] } style={ { opacity: 0.3 } } /> }
					</Button>
					{ openPopover &&
						<IconSearchPopover
							onClickOutside={ event => {
								// This statement checks whether the close was triggered by clicking on the button that opens this.
								// This is needed or else the popup will always open when spam clicking the button.
								if ( event.target ) {
									if ( event.target.closest( `.ugb-icon-control-${ instanceId }` ) ) {
										setState( { clickedOnButton: true } )
										return
									}
								}
								setState( {
									openPopover: false,
									clickedOnButton: false,
								} )
							} }
							onClose={ () => setState( { openPopover: false } ) }
							onChange={ props.onChange }
						/>
					}
				</div>
				<Button
					onClick={ () => {
						props.onChange( '' )
						setState( { openPopover: false } )
					} }
					isSmall
					isDefault
					className="components-range-control__reset"
				>
					{ __( 'Reset', i18n ) }
				</Button>
			</div>
		</BaseControl>
	)
} ) )

IconControl.defaultProps = {
	label: __( 'Icon', i18n ),
	value: '',
	onChange: () => {},
}

export default IconControl
