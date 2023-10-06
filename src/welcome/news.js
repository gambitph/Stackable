/**
 * WordPress dependencies
 */
import { send as ajaxSend } from '@wordpress/ajax'
import domReady from '@wordpress/dom-ready'
import { Spinner } from '@wordpress/components'
import { createRoot } from '~stackable/util/element'

/**
 * External dependencies
 */
import { nonceNews } from 'stackable'

domReady( () => {
	const content = document.querySelector( '.s-news-box-content' )
	if ( ! content ) {
		return
	}

	// Ajax load if nothing printed out (nothing cached in PHP).
	if ( content.innerHTML !== '' ) {
		return
	}

	// Spinner.
	createRoot( content ).render( <div><Spinner /></div> )

	// Ajax load the news so as not to stall the page load.
	ajaxSend( 'stackable_news_feed_ajax', {
		success: data => {
			content.innerHTML = data
		},
		error: message => {
			alert( message ) // eslint-disable-line no-alert
		},
		data: {
			nonce: nonceNews,
		},
	} )
} )
