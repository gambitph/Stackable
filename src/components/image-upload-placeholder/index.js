import classnames from 'classnames'
import { Dashicon } from '@wordpress/components'
import { MediaUpload } from '@wordpress/block-editor'
import SVGImageIcon from './images/image.svg'

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
						{ ! imageURL && <SVGImageIcon /> }
					</div>
				)
			} }
		/>
	)
}

export default ImageUploadPlaceholder
