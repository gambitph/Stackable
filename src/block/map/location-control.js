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
	const autocompleteRef = useRef()
	useEffect( () => {
		if ( ref.current && window.google && window.google.maps ) {
			// eslint-disable-next-line no-undef
			const autocomplete = autocompleteRef.current = new google.maps.places.Autocomplete( ref.current )
			autocomplete.setFields( [
				'place_id',
				'geometry',
				'formatted_address',
			] )
			autocomplete.addListener( 'place_changed', () => {
				const place = autocomplete.getPlace()
				if ( place.geometry ) {
					props.onPlaceChange( place )
				}
			} )

			// If we encounter errors, get rid of the error popup from Google.
			removeGoogleApiKeyError( autocompleteRef.current )
		}
	}, [ ref.current, waitForGoogle ] )

	return (
		<TextControl
			label={ __( 'Location', i18n ) }
			ref={ ref }
			value={ props.value }
			help={ __( 'Type in a pair of latitude longitude coordinates. You can also type in the name of the location if your API Key has Geolocation API and Places API enabled.', i18n ) }
			onChange={ value => {
				// If we encounter errors, get rid of the error popup from Google.
				removeGoogleApiKeyError( autocompleteRef.current )
				props.onTextChange( value )
			} }
			onFocus={ () => {
				// If we encounter errors, get rid of the error popup from Google.
				removeGoogleApiKeyError( autocompleteRef.current )
			} }
		/>
	)
}

LocationControl.defaultProps = {
	onChange: null,
	value: '',
}

export default LocationControl

// If the API Key provided doesn't have the Places API enabled, Google will show an ugly popup error, get rid of it.
const removeGoogleApiKeyError = autocompleteRef => {
	if ( document.querySelector( '.pac-container' ) ) {
		window?.google?.maps?.event?.clearInstanceListeners( autocompleteRef )
		document.querySelectorAll( '.pac-container' ).forEach( el => el.remove() )
	}
}
