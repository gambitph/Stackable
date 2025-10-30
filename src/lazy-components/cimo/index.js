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

const CimoDownloadNotice = props => {
	const [ data, setData ] = useState( { status: cimo?.status, action: cimo?.action } )
	const pollCountRef = useRef( 0 )

	const onDismiss = () => {
		const settings = new models.Settings( { stackable_hide_cimo_notice: true } ) // eslint-disable-line camelcase
		settings.save()
		props?.onDismiss?.()
	}

	// Polls the Cimo plugin status to detect installation or activation state changes
	const pollStatus = ( action, pollOnce = false ) => {
		fetch( ajaxUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams( {
			  action: 'stackable_check_cimo_status',
			  // eslint-disable-next-line camelcase
			  user_action: action,
			} ),
			credentials: 'same-origin',
		  } ).then( res => res.json() ).then( _data => {
			pollCountRef.current += 1

			if ( data.status !== _data.status ) {
				setData( _data )

				// Update the global stackable.cimo status/action variables
				// so new image block selections reflect the latest Cimo installation state
				// eslint-disable-next-line no-undef
				stackable.cimo.status = _data.status
				// eslint-disable-next-line no-undef
				stackable.cimo.action = _data.action
			}

			// Stop polling if it has reached 3 attempts, or plugin status indicates installation/activation is complete
			if ( pollOnce || pollCountRef.current >= 3 ||
				( action === 'install' && ( _data.status === 'installed' || _data.status === 'activated' ) ) ||
				( action === 'activate' && _data.status === 'activated' )
			) {
				return
			}

			setTimeout( () => {
				pollStatus( action )
			}, 3000 * pollCountRef.current )
		  } )
	}

	useEffect( () => {
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
						pollStatus( 'install', true )
						return
					}

					pollStatus( 'activate', true )
				} )
			},
		} )
	}, [] )

	const onActionClick = async () => {
		pollCountRef.current = 0

		if ( data.status === 'not_installed' ) {
			setData( { status: 'installing', action: '' } )
			setTimeout( () => {
				pollStatus( 'install' )
			}, 3000 )

			return
		}

		setData( { status: 'activating', action: '' } )
		setTimeout( () => {
			pollStatus( 'activate' )
		}, 3000 )
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
	if ( ! cimo || cimo.status === 'activated' || cimo.hideNotice || typeof wp === 'undefined' || ! wp.media || ! wp.media.view ||
		! wp.media.view.Attachment || ! wp.media.view.Attachment.Details
	) {
		return
	}

	const CurrentDetailsView = wp.media.view.Attachment.Details

	// Display the Cimo download notice in the media library
	const CustomDetailsView = CurrentDetailsView.extend( {
		render() {
			const result = CurrentDetailsView.prototype.render.apply( this, arguments )

			const details = this.el.querySelector( '.attachment-info .details' )
			if ( details && ! this.el.querySelector( '.stk-cimo-notice' ) ) {
				const noticeDiv = document.createElement( 'div' )
				noticeDiv.className = 'stk-cimo-notice'

				const onDismiss = () => {
					if ( noticeDiv && noticeDiv.parentNode ) {
						noticeDiv.parentNode.removeChild( noticeDiv )
					}
				}

				createRoot( noticeDiv ).render( <CimoDownloadNotice onDismiss={ onDismiss } /> )
				details.insertAdjacentElement( 'afterend', noticeDiv )
			}

			return result
		},
	} )

	wp.media.view.Attachment.Details = CustomDetailsView
} )
