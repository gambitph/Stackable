import classnames from 'classnames'
import { Dashicon } from '@wordpress/components'
import { MediaUpload } from '@wordpress/editor'

const ImageUploadPlaceholder = props => {
	const {
		imageID,
		imageURL,
		onChange = ( { url, id } ) => {}, // eslint-disable-line no-unused-vars
		onRemove, // = () => {},
		className = '',
		allowedTypes = [ 'image' ],
		render = undefined,
		hasRemove = true,
		style: mainStyle = {},
	} = props

	const imageClass = classnames( [
		className,
		'ugb-image-upload-placeholder',
	], {
		'ugb-image-upload-has-image': imageURL,
		'ugb-image-upload-has-placeholder': ! imageURL,
	} )

	const style = {
		...mainStyle,
		backgroundImage: imageURL && ! render ? `url(${ imageURL })` : undefined,
	}

	return (
		<MediaUpload
			onSelect={ onChange }
			allowedTypes={ allowedTypes }
			value={ imageID }
			render={ obj => {
				if ( imageURL && render ) {
					return (
						<div
							className={ imageClass }
							onClick={ obj.open }
							onKeyDown={ event => {
								if ( event.keyCode === 13 ) {
									obj.open()
								}
							} }
							style={ style }
							role="button"
							tabIndex={ 0 }
							data-is-placeholder-visible={ ! imageURL }
						>
							{ imageURL && onRemove && hasRemove && (
								<button className="ugb-image-upload-remove" onClick={ ev => {
									onRemove(); ev.stopPropagation()
								} }><Dashicon icon="no" /></button>
							) }
							{ render }
						</div>
					)
				}
				return (
					<div
						className={ imageClass }
						onClick={ obj.open }
						onKeyDown={ event => {
							if ( event.keyCode === 13 ) {
								obj.open()
							}
						} }
						style={ style }
						role="button"
						tabIndex={ 0 }
						data-is-placeholder-visible={ ! imageURL }>
						{ imageURL && onRemove && hasRemove && (
							<button className="ugb-image-upload-remove" onClick={ ev => {
								onRemove(); ev.stopPropagation()
							} }><Dashicon icon="no" /></button>
						) }
						{ ! imageURL && (
							<svg viewBox="0 0 512 376">
								<path d="M0,0v376h512V0H0z M480,344H32V32h448V344z" />
								<circle cx="409.1" cy="102.9" r="40.9" />
								<polygon points="480,344 32,344 118.3,179.8 140,191.1 189,113.8 289,226.9 297.9,217.6 315,239.9 341,193.5 393.9,264.7 409,248.8" />
							</svg>
						) }
					</div>
				)
			} }
		/>
	)
}

export default ImageUploadPlaceholder
