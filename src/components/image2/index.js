/**
 * This component is meant to replace the ImageUploadPlaceholder and Image
 */

/**
 * External dependencies
 */
import { MediaUpload } from '@wordpress/block-editor'
import { Dashicon, ResizableBox } from '@wordpress/components'
import { useState } from '@wordpress/element'
import classnames from 'classnames'
import striptags from 'striptags'
import { clamp } from 'lodash'

const formSize = ( size = '', unit = '%' ) => {
	if ( ! size && size !== 0 ) {
		return unit === '%' ? '100%' : 150
	}
	return unit === '%' ? `${ size }%` : size
}

const getImageClasses = props => {
	return classnames( [
		props.className,
		'stk-img-wrapper',
	], {
		// Responsive.
		[ `wp-image-${ props.imageId }` ]: props.imageId,

		// Shape.
		'stk-img--shape': props.shape,

		// Firefox doesn't do stretching via SVG attribute and needs to be done via CSS.
		'stk-image--shape-stretch': props.shapeStretch,

		// Shadow is only available when there is no shape.
		[ `stk--shadow-${ props.shadow }` ]: ! props.shape && props.shadow,
	} )
}

// TODO: snapping, display size when resizing.
const Image2 = props => {
	const [ isResizing, setIsResizing ] = useState( false )
	const [ lockAspectRatio, setLockAspectRatio ] = useState( false )
	const [ initialHeight, setInitialHeight ] = useState()
	const [ initialWidth, setInitialWidth ] = useState()
	const [ parentHeight, setParentHeight ] = useState()
	const [ parentWidth, setParentWidth ] = useState()

	const imageClasses = classnames( [
		getImageClasses( props ),
	], {
		'stk-img-placeholder': ! props.src,
		'stk--is-resizing': isResizing,
	} )

	return (
		<MediaUpload
			onSelect={ image => {
				// If imageSize is provided, return the URL of that size.
				let {
					url, width, height,
				} = image
				const currentSelectedSize = props.imageSize || 'full'

				if ( image.sizes && image.sizes[ currentSelectedSize ] ) {
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
			allowedTypes={ props.allowedTypes }
			value={ props.imageID }
			render={ obj => {
				return (
					<ResizableBox
						className={ imageClasses }
						enable={ {
							top: false,
							right: props.enableWidth,
							bottom: props.enableHeight,
							left: false,
							topRight: false,
							bottomRight: props.enableDiagonal,
							bottomLeft: false,
							topLeft: false,
						} }
						size={ {
							width: formSize( props.width, props.widthUnit ),
							height: formSize( props.height, props.heightUnit ),
						} }

						// Resizing is a bit slow when the image is centered, make it a bit faster.
						resizeRatio={ 1.2 }

						// Lock aspect ratio when resizing via the corner handler
						lockAspectRatio={ lockAspectRatio }

						// Open the media picker.
						onClick={ obj.open }
						onKeyDown={ event => {
							if ( event.keyCode === 13 ) {
								obj.open()
							}
						} }

						role="button"
						tabIndex={ 0 }

						onResizeStart={ ( _event, _direction, elt ) => {
							// Lock the aspect ratio when changing diagonally.
							setLockAspectRatio( _direction === 'bottomRight' )

							// Get the current size of the image.
							let currentHeight = props.height ? parseFloat( props.height ) : 0
							if ( props.heightUnit === '%' ) {
								const parentHeight = elt.parentElement.getBoundingClientRect().height
								setParentHeight( parentHeight )
								currentHeight = ( props.height || 100 ) / 100 * parentHeight
							} else if ( ! props.height ) {
								currentHeight = elt.getBoundingClientRect().height
							}
							setInitialHeight( currentHeight || 0 )

							let currentWidth = props.width ? parseFloat( props.width ) : 0
							if ( props.widthUnit === '%' ) {
								const parentWidth = elt.parentElement.getBoundingClientRect().width
								setParentWidth( parentWidth )
								currentWidth = ( props.width || 100 ) / 100 * parentWidth
								// }
							} else if ( ! props.width ) {
								currentWidth = elt.getBoundingClientRect().width
							}
							setInitialWidth( currentWidth || 0 )

							setIsResizing( true )
						} }
						onResizeStop={ ( _event, _direction, elt, delta ) => {
							// Get the new size of the image after dragging.
							let currentHeight, currentWidth
							if ( props.heightUnit === '%' ) {
								currentHeight = clamp( Math.round( ( initialHeight + delta.height ) / parentHeight * 1000 ) / 10, 0, 100 )
							} else {
								currentHeight = initialHeight + delta.height
							}

							if ( props.widthUnit === '%' ) {
								currentWidth = clamp( Math.round( ( initialWidth + delta.width ) / parentWidth * 1000 ) / 10, 0, 100 )
							} else {
								currentWidth = initialWidth + delta.width
							}

							props.onChangeSize( { width: currentWidth, height: currentHeight } )
							setIsResizing( false )
						} }
					>
						{ props.src && props.onRemove && props.hasRemove && (
							<button
								className="stk-img-upload-remove"
								onClick={ ev => {
									props.onRemove()
									ev.stopPropagation()
								} }
							>
								<Dashicon icon="no" />
							</button>
						) }
						<img
							className="stk-img"
							src={ props.src || undefined }
							alt={ striptags( props.alt || undefined ) }
							title={ striptags( props.title || undefined ) }
							width={ props.width || undefined }
							height={ props.height || undefined }
						/>
					</ResizableBox>
				)
			} }>

			{ props.children }
		</MediaUpload>
	)
}

Image2.defaultProps = {
	imageId: '',

	alt: '',
	title: '',
	src: '',
	size: 'full',

	width: '',
	height: '',
	widthUnit: '%',
	heightUnit: 'px',

	shape: '',
	shapeStretch: false,
	shadow: '',

	allowedTypes: [ 'image' ],

	// Resizers.
	enableWidth: true,
	enableHeight: true,
	enableDiagonal: true,

	onChange: () => {},
	hasRemove: true,
	onRemove: () => {},
	onChangeSize: () => {},
}

Image2.Content = props => {
	const imageClasses = getImageClasses( props )

	const width = props.width || props.width === 0
		? ( props.widthUnit === '%' ? `${ props.width }%` : props.width )
		: undefined

	const height = props.height || props.height === 0
		? ( props.heightUnit === '%' ? `${ props.height }%` : props.height )
		: undefined

	return (
		<div className={ imageClasses }>
			<img
				className="stk-img"
				src={ props.src || undefined }
				alt={ striptags( props.alt || undefined ) }
				title={ striptags( props.title || undefined ) }
				width={ width || undefined }
				height={ height || undefined }
			/>
			{ props.children }
		</div>
	)
}

Image2.Content.defaultProps = {
	imageId: '',

	alt: '',
	title: '',
	src: '',
	size: 'full',

	width: '',
	height: '',
	widthUnit: '%',
	heightUnit: 'px',

	shape: '',
	shapeStretch: false,
	shadow: '',
}

export default Image2
