/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { TextControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import {
	useState, useEffect, useRef,
} from '@wordpress/element'

/**
 * Location Control
 *
 * @param {Object} props Component props
 */
const LocationControl = props => {
	const [ waitForGoogle, setWaitForGoogle ] = useState( 0 )

	useEffect( () => {
		if ( ! window?.google?.maps ) {
			const interval = setInterval( () => {
				if ( window.google && window.google.maps ) {
					clearInterval( interval )
					setWaitForGoogle( waitForGoogle + 1 )
				}
			}, 250 )
			return () => clearInterval( interval )
		}
	}, [] )

	const ref = useRef()
	useEffect( () => {
		if ( ref.current && window.google && window.google.maps ) {
			// eslint-disable-next-line no-undef
			const autocomplete = new google.maps.places.Autocomplete(
				ref.current
			)
			autocomplete.setFields( [
				'place_id',
				'geometry',
				'formatted_address',
			] )
			autocomplete.addListener( 'place_changed', () => {
				const place = autocomplete.getPlace()
				if ( ! place.geometry ) {
					return
				}
				props.onPlaceChange( place )
			} )
		}
	}, [ ref.current, waitForGoogle ] )

	return (
		<TextControl
			label={ __( 'Location', i18n ) }
			ref={ ref }
			value={ props.value }
			onChange={ props.onTextChange }
		/>
	)
}

LocationControl.defaultProps = {
	onChange: null,
	value: '',
}

export default LocationControl
