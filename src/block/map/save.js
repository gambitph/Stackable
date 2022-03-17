/**
 * WordPress dependencies
 */
import { RawHTML } from '@wordpress/element'

export default function save( { attributes } ) {
	return (
		<RawHTML>
			{ `<iframe
				title="test"
				src="https://maps.google.com/maps?q=14.633600461871746, 121.04300214414138&t=&z=12&ie=UTF8&iwloc=&output=embed"
				className="stk-map"
				height="300"
				frameBorder="0"
				style="border:0;width: 100%; max-width: none;"
				allowFullScreen=""
				aria-hidden="false"
				tabIndex="0"
			></iframe>` }
		</RawHTML>
	)
}
