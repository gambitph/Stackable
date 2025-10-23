import domReady from '@wordpress/dom-ready'
class StackableCimoNotice {
	init = () => {
		// eslint-disable-next-line no-undef
		if ( typeof stackable === undefined || ! stackable[ 'cimo-notice' ] ||
			typeof wp === 'undefined' || ! wp.media || ! wp.media.view || ! wp.media.view.Attachment || ! wp.media.view.Attachment.Details
		) {
			return
		}

		// eslint-disable-next-line no-undef
		const cimoNotice = stackable[ 'cimo-notice' ]

		wp.media.view.Attachment.Details = wp.media.view.Attachment.Details.extend( {
			template: function template( view ) {
				const html = wp.media.template( 'attachment-details' )( view )
				const dom = document.createElement( 'div' )
				dom.innerHTML = html

				const details = dom.querySelector( '.attachment-info' )
				if ( details && cimoNotice.content ) {
					const noticeDiv = document.createElement( 'div' )
					noticeDiv.className = 'stk-cimo-notice'

					const content = document.createElement( 'p' )
					content.innerHTML = cimoNotice.content

					noticeDiv.appendChild( content )
					details.appendChild( noticeDiv )
				}

				return dom.innerHTML
			},
		} )
	}
}

window.stackableCimoNotice = new StackableCimoNotice()

domReady( window.stackableCimoNotice.init )
