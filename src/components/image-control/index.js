import { BaseControl, Dashicon } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'
import { i18n } from 'stackable'
import { MediaUpload } from '@wordpress/block-editor'
import SVGImageIcon from './images/image.svg'

function ImageControl( props ) {
	const {
		label,
		imageID,
		imageURL,
		onChange = ( { url, id } ) => {}, // eslint-disable-line no-unused-vars
		onRemove = () => {},
		allowedTypes = [ 'image' ],
		help,
	} = props

	const type = imageURL && imageURL.match( /(mp4|webm|ogg)/i ) ? 'video' : 'image'

	return (
		<div className="ugb-image-control">
			<BaseControl label={ label } help={ help }>
				<MediaUpload
					onSelect={ onChange }
					allowedTypes={ allowedTypes }
					value={ imageID }
					render={ obj => {
						return (
							<Fragment>
								{ imageURL &&
								<div className="ugb-image-preview-wrapper">
									<button className="ugb-image-preview-remove" onClick={ onRemove }><Dashicon icon="no" /></button>
									{ type === 'video' && (
										<video
											className="ugb-image-preview"
											autoPlay
											muted
											loop
											src={ imageURL }
											onClick={ obj.open }
											onKeyDown={ event => {
												if ( event.keyCode === 13 ) {
													obj.open()
												}
											} }
										/>
									) }
									{ type === 'image' && (
										/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */
										<img
											className="ugb-image-preview"
											src={ imageURL }
											onClick={ obj.open }
											onKeyDown={ event => {
												if ( event.keyCode === 13 ) {
													obj.open()
												}
											} }
											alt={ __( 'preview', i18n ) }
										/>
									) }
								</div>
								}
								{ ! imageURL && (
									<div
										className="ugb-placeholder"
										onClick={ obj.open }
										onKeyDown={ event => {
											if ( event.keyCode === 13 ) {
												obj.open()
											}
										} }
										role="button"
										tabIndex={ 0 }
									>
										<SVGImageIcon />
									</div>
								) }
							</Fragment>
						)
					} }
				/>
			</BaseControl>
		</div>
	)
}

export default ImageControl
