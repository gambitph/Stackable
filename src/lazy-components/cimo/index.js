import {
	cimo, i18n, ajaxUrl,
} from 'stackable'
import { createRoot } from '~stackable/util'

import { __ } from '@wordpress/i18n'
import { Dashicon } from '@wordpress/components'
import domReady from '@wordpress/dom-ready'
import {
	useState, useRef, useEffect,
} from '@wordpress/element'
import { models } from '@wordpress/api'

let isPolling = false

const CimoDownloadNotice = props => {
	const { inMediaLibrary = false } = props
	const [ data, setData ] = useState( { status: cimo?.status, action: cimo?.action } )
	const pollCountRef = useRef( 0 )

	const onDismiss = () => {
		const settings = new models.Settings( { stackable_hide_cimo_notice: true } ) // eslint-disable-line camelcase
		settings.save()

		if ( cimo ) {
			cimo.hideNotice = true
		}

		// Update the global stackable.cimo hideNotice variable
		if ( typeof window !== 'undefined' && window.stackable?.cimo ) {
			window.stackable.cimo.hideNotice = true
		}

		props?.onDismiss?.()
	}

	// Polls the Cimo plugin status to detect installation or activation state changes
	const pollStatus = ( action, link, pollOnce = false ) => {
		if ( isPolling ) {
			return
		}

		isPolling = true

		fetch( ajaxUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams( {
			  action: 'stackable_check_cimo_status',
			  // eslint-disable-next-line camelcase
			  user_action: action,
			  nonce: cimo.nonce,
			} ),
			credentials: 'same-origin',
		  } ).then( res => res.json() ).then( res => {
			if ( ! res.success ) {
				setData( { status: 'error', action: '' } )

				const errorMessage = res?.data?.message ? res.data.message : 'Server error'

				throw new Error( 'Stackable: ' + errorMessage )
			}

			if ( pollCountRef.current === 0 && link ) {
				window.open( link, '_blank' )
			}

			pollCountRef.current += 1

			const _data = res.data

			if ( data.status !== _data.status ) {
				setData( _data )

				// Update the global stackable.cimo status/action variables
				// so new image block selections reflect the latest Cimo installation state
				if ( typeof window !== 'undefined' && window.stackable?.cimo ) {
					window.stackable.cimo.status = _data.status
					window.stackable.cimo.action = _data.action
				}
			}

			// Stop polling if it has reached 3 attempts, or plugin status indicates installation/activation is complete
			if ( pollOnce || pollCountRef.current >= 3 ||
				( action === 'install' && ( _data.status === 'installed' || _data.status === 'activated' ) ) ||
				( action === 'activate' && _data.status === 'activated' )
			) {
				isPolling = false
				return
			}

			setTimeout( () => {
				pollStatus( action )
			}, 3000 * pollCountRef.current )
		  } ).catch( e => {
			// eslint-disable-next-line no-console
			console.error( e.message )
		  } )
	}

	useEffect( () => {
		if ( inMediaLibrary ) {
			return
		}

		const _media = wp.media
		const old = _media.view.MediaFrame.Select

		// When the media library closes, check and update the Cimo plugin status
		// to ensure the UI reflects the latest installation or activation state.
		_media.view.MediaFrame.Select = old.extend( {
		  initialize() {
				old.prototype.initialize.apply( this, arguments )

				this.on( 'close', () => {
					pollCountRef.current = 0
					if ( data.status === 'activated' ) {
						return
					}

					if ( data.status === 'not_installed' ) {
						pollStatus( 'install', null, true )
						return
					}

					pollStatus( 'activate', null, true )
				} )
			},
		} )
	}, [] )

	const onActionClick = e => {
		e.preventDefault()
		pollCountRef.current = 0

		if ( data.status === 'not_installed' ) {
			setData( { status: 'installing', action: '' } )
			pollStatus( 'install', e.currentTarget.href )
			return
		}

		setData( { status: 'activating', action: '' } )
		pollStatus( 'activate', e.currentTarget.href )
	}

	return ( <>
		<button aria-label="dismiss" onClick={ onDismiss }><Dashicon icon="no" /></button>
		{ data.status === 'activated'
			? <p>
				{ __( 'Cimo Image Optimizer has been activated. Please refresh this page to begin optimizing your images automatically.', i18n ) }
			  </p>
			: <p> { __( 'Instantly optimize images as you upload them with Cimo Image Optimizer.', i18n ) }
				&nbsp;
				{ data.status === 'installing'
					? <span> { __( 'Installing', i18n ) }</span>
					: ( data.status === 'activating'
						? <span>{ __( 'Activating', i18n ) } </span>
						: <a href={ data.action } target="_blank" rel="noreferrer" onClick={ onActionClick }>
							{ data.status === 'installed' ? __( 'Activate now', i18n ) : __( 'Install now', i18n ) }
						</a>
					)
				}
			</p>
		}
	</> )
}

const CimoDownloadNoticeWrapper = props => {
	return <div className="stk-cimo-notice"> <CimoDownloadNotice { ...props } /> </div>
}

export default CimoDownloadNoticeWrapper

domReady( () => {
	if ( ! cimo || cimo.status === 'activated' || cimo.hideNotice ||
		typeof wp === 'undefined' || ! wp?.media?.view?.Attachment?.Details
	) {
		return
	}

	const CurrentDetailsView = wp.media.view.Attachment.Details

	// Display the Cimo download notice in the media library
	const CustomDetailsView = CurrentDetailsView.extend( {
		render() {
			const result = CurrentDetailsView.prototype.render.apply( this, arguments )

			if ( cimo?.hideNotice ) {
				return result
			}

			const details = this.el.querySelector( '.attachment-info .details' )
			if ( details && ! this.el.querySelector( '.stk-cimo-notice' ) ) {
				const noticeDiv = document.createElement( 'div' )
				noticeDiv.className = 'stk-cimo-notice'

				const onDismiss = () => {
					if ( noticeDiv && noticeDiv.parentNode ) {
						noticeDiv.parentNode.removeChild( noticeDiv )
					}
				}

				createRoot( noticeDiv ).render( <CimoDownloadNotice onDismiss={ onDismiss } inMediaLibrary={ true } /> )
				details.insertAdjacentElement( 'afterend', noticeDiv )
			}

			return result
		},
	} )

	wp.media.view.Attachment.Details = CustomDetailsView
} )
