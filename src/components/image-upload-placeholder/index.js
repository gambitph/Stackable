/**
 * Internal dependencies
 */
import SVGImageIcon from './images/image.svg'

/**
 * External dependencies
 */
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { Dashicon } from '@wordpress/components'
import { MediaUpload } from '@wordpress/block-editor'

const ImageUploadPlaceholder = props => {
	const {
		imageID,
		imageURL,
		onRemove,
		className,
		allowedTypes,
		render,
		hasRemove,
		style: mainStyle,
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
			onSelect={ image => {
				// If imageSize is provided, return the URL of that size.
				let {
					url, width, height,
				} = image
				const currentSelectedSize = props.imageSize || 'full'
				if ( image.sizes[ currentSelectedSize ] ) {
					url = image.sizes[ currentSelectedSize ].url
					width = image.sizes[ currentSelectedSize ].width
					height = image.sizes[ currentSelectedSize ].height
				}

				props.onChange( {
					...image,
					url,
					width,
					height,
				} )
			} }
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

ImageUploadPlaceholder.defaultProps = {
	imageID: '',
	imageURL: '',
	imageSize: 'full', // If supplied, the imageURL that will be returned will be of this size.
	onChange: ( { url, id } ) => {}, // eslint-disable-line no-unused-vars
	onRemove: null,
	className: '',
	allowedTypes: [ 'image' ],
	render: undefined,
	hasRemove: true,
	style: {},
}

export default ImageUploadPlaceholder
