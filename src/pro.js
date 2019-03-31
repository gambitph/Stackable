import domReady from '@wordpress/dom-ready'
import { ProModalPricing } from '@stackable/components'
import { render } from '@wordpress/element'
import { showProPricePopup } from 'stackable'

domReady( () => {
	if ( showProPricePopup ) {
		const modalContainer = document.createElement( 'div' )
		document.body.appendChild( modalContainer )
		render( (
			<ProModalPricing isOpen={ true } />
		), modalContainer )
	}
} )
