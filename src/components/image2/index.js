/**
 * This component is meant to replace the ImageUploadPlaceholder and Image
 */
import getSnapSizes from './get-snap-sizes'

/**
 * Internal dependencies
 */
import Tooltip from './tooltip'

/**
 * External dependencies
 */
import { useWithShift } from '~stackable/hooks'
import classnames from 'classnames'
import striptags from 'striptags'
import { clamp } from 'lodash'

/**
 * WordPress dependencies
 */
import { MediaUpload } from '@wordpress/block-editor'
import { Dashicon, ResizableBox } from '@wordpress/components'
import { useState, useEffect } from '@wordpress/element'
import { compose } from '@wordpress/compose'
import { withSelect } from '@wordpress/data'

const formSize = ( size = '', unit = '%', usePx = false, usePct = true ) => {
	if ( ! size && size !== 0 ) {
		return unit === '%' ? ( usePct ? '100%' : 100 ) : ( usePx ? '150px' : 150 )
	}
	return unit === '%' ? ( usePct ? `${ size }%` : size ) : ( usePx ? `${ size }px` : size )
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

const Image = props => {
	const [ isResizing, setIsResizing ] = useState( false )
	const [ lockAspectRatio, setLockAspectRatio ] = useState( false )
	const [ initialHeight, setInitialHeight ] = useState()
	const [ initialWidth, setInitialWidth ] = useState()
	const [ parentHeight, setParentHeight ] = useState()
	const [ parentWidth, setParentWidth ] = useState()

	const [ currentHeight, setCurrentHeight ] = useState()
	const [ currentWidth, setCurrentWidth ] = useState()

	// Used to fix issue with Resizable where height in % doesn't show while resizing.
	// @see https://github.com/bokuweb/re-resizable/issues/442
	const [ tempStyle, setTempStyle ] = useState( null )

	const [ snap, setSnap ] = useState( null )

	const isShiftKey = useWithShift()
	useEffect( () => {
		setSnap( null )
	}, [ isShiftKey ] )

	const imageClasses = classnames( [
		getImageClasses( props ),
		'stk-img-resizer',
	], {
		'stk-img-placeholder': ! props.src,
		'stk--is-resizing': isResizing,
	} )

	return (
		<MediaUpload
			onSelect={ image => {
				// If image size is provided, return the URL of that size.
				let {
					url, width, height,
				} = image
				const currentSelectedSize = props.size || 'full'

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
							width: formSize( currentWidth || props.width, props.widthUnit ),
							height: formSize( currentHeight || props.height, props.heightUnit ),
						} }

						// Resizing is a bit slow when the image is centered, make it a bit faster.
						resizeRatio={ 1.2 }

						// Lock aspect ratio when resizing via the corner handler
						lockAspectRatio={ lockAspectRatio }

						// Open the media picker, but only when the image is clicked, not the popup, etc.
						onClick={ event => {
							if ( event.target?.classList?.contains( 'stk-img' ) || event.target?.classList?.contains( 'stk-img-placeholder' ) ) {
								obj.open()
							}
						} }
						onKeyDown={ event => {
							if ( event.keyCode === 13 ) {
								obj.open()
							}
						} }

						role="button"
						tabIndex={ 0 }

						snap={ snap }
						snapGap={ 10 }

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
							} else if ( ! props.width ) {
								currentWidth = elt.getBoundingClientRect().width
							}
							setInitialWidth( currentWidth || 0 )

							setIsResizing( true )
							setSnap( null )
						} }
						onResize={ ( _event, _direction, elt, delta ) => {
							// Get the new size of the image when dragging.
							let currentHeight, currentWidth
							if ( props.heightUnit === '%' ) {
								currentHeight = clamp( Math.round( ( initialHeight + delta.height ) / parentHeight * 100 ), 0, 100 )
								// This is to make percentage heights work, see comment above about the issue in ResizableBox.
								setTempStyle( `.stk--is-resizing { height: ${ currentHeight }% !important; }` )
							} else {
								currentHeight = initialHeight + delta.height
							}
							setCurrentHeight( currentHeight )

							if ( props.widthUnit === '%' ) {
								currentWidth = clamp( Math.round( ( initialWidth + delta.width ) / parentWidth * 100 ), 0, 100 )
							} else {
								currentWidth = initialWidth + delta.width
							}
							setCurrentWidth( currentWidth )

							// Adjust the snapping of the image size.
							if ( ! snap ) {
								setSnap( getSnapSizes( parentWidth, parentHeight, props.widthUnit, props.heightUnit, _direction, isShiftKey ) )
							}
						} }
						onResizeStop={ () => {
							props.onChangeSize( {
								width: currentWidth,
								widthUnit: props.widthUnit,
								height: currentHeight,
								heightUnit: props.heightUnit,
							} )
							setIsResizing( false )
							setCurrentWidth( null )
							setCurrentHeight( null )
							setTempStyle( null )
							setSnap( null )
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
						<Tooltip
							enableHeight={ props.enableHeight || props.enableDiagonal }
							enableWidth={ props.enableWidth || props.enableDiagonal }
							height={ formSize( currentHeight || props.height, props.heightUnit, false, false ) }
							width={ formSize( currentWidth || props.width, props.widthUnit, false, false ) }
							widthUnits={ props.widthUnits }
							heightUnits={ props.heightUnits }
							heightUnit={ props.heightUnit }
							widthUnit={ props.widthUnit }
							allowReset={ props.allowReset }
							onChangeHeight={ ( { value, unit } ) => {
								const size = {}
								if ( typeof value !== 'undefined' ) {
									size.height = value
								}
								if ( typeof unit !== 'undefined' ) {
									size.heightUnit = unit
								}
								props.onChangeSize( size )
							} }
							onChangeWidth={ ( { value, unit } ) => {
								const size = {}
								if ( typeof value !== 'undefined' ) {
									size.width = value
								}
								if ( typeof unit !== 'undefined' ) {
									size.widthUnit = unit
								}
								props.onChangeSize( size )
							} }
						/>
						<img
							className="stk-img"
							src={ props.src || undefined }
							alt={ striptags( props.alt || undefined ) }
							title={ striptags( props.title || undefined ) }
							width={ props.width || undefined }
							height={ props.height || undefined }
						/>
						{ /* This is to make percentage heights work, see comment above about the issue in ResizableBox */ }
						{ isResizing && tempStyle && <style>{ tempStyle }</style> }
					</ResizableBox>
				)
			} }>

			{ props.children }
		</MediaUpload>
	)
}

Image.defaultProps = {
	imageId: '',

	alt: '',
	title: '',
	src: '',
	size: 'full',

	width: '',
	height: '',
	widthUnit: '%',
	heightUnit: 'px',
	widthUnits: [ 'px', '%' ],
	heightUnits: [ 'px', '%' ],

	shape: '',
	shapeStretch: false,
	shadow: '',

	allowedTypes: [ 'image' ],

	// Resizers.
	enableWidth: true,
	enableHeight: true,
	enableDiagonal: true,
	allowReset: true,

	hasRemove: true,
	onChange: () => {},
	onRemove: () => {},
	onChangeSize: () => {},
}

// Support responsive options.
const ImageResponsive = props => {
	const isDesktop = props.previewDeviceType === 'Desktop'
	const isMobile = props.previewDeviceType === 'Mobile'

	let width = props.width
	let widthUnit = props.widthUnit || '%'
	if ( ! isDesktop && props.widthTablet !== '' ) {
		width = props.widthTablet
		widthUnit = props.widthUnitTablet
	}
	if ( isMobile && props.widthMobile !== '' ) {
		width = props.widthMobile
		widthUnit = props.widthUnitMobile
	}

	let height = props.height
	let heightUnit = props.heightUnit || 'px'
	if ( ! isDesktop && props.heightTablet !== '' ) {
		height = props.heightTablet
		if ( props.heightUnitTablet !== '' ) {
			heightUnit = props.heightUnitTablet
		}
	}
	if ( isMobile && props.heightMobile !== '' ) {
		height = props.heightMobile
		if ( props.heightUnitMobile !== '' ) {
			heightUnit = props.heightUnitMobile
		}
	}

	return (
		<Image
			{ ...props }
			width={ width }
			widthUnit={ widthUnit }
			height={ height }
			heightUnit={ heightUnit }
			onChangeSize={ value => {
				props[ `onChangeSize${ props.previewDeviceType }` ]( value )
			} }
		/>
	)
}

ImageResponsive.defaultProps = {
	...Image.defaultProps,

	widthTablet: '',
	heightTablet: '',
	widthUnitTablet: '',
	heightUnitTablet: '',

	widthMobile: '',
	heightMobile: '',
	widthUnitMobile: '',
	heightUnitMobile: '',

	onChangeSizeDesktop: () => {},
	onChangeSizeTablet: () => {},
	onChangeSizeMobile: () => {},
}

const ImageContent = props => {
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

ImageContent.defaultProps = {
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

const _ImageResponsive = compose( [
	withSelect( select => {
		const {
			__experimentalGetPreviewDeviceType,
		} = select( 'core/edit-post' )

		return {
			previewDeviceType: __experimentalGetPreviewDeviceType(),
		}
	} ),
] )( ImageResponsive )

_ImageResponsive.Content = ImageContent
export default _ImageResponsive
