/**
 * This component is meant to replace the ImageUploadPlaceholder and Image
 */
import getSnapSizes from './get-snap-sizes'

/**
 * External dependencies
 */
import { useDeviceType, useWithShift } from '~stackable/hooks'
import classnames from 'classnames'
import striptags from 'striptags'
import { clamp } from 'lodash'
import { useDynamicContent } from '~stackable/components/dynamic-content-control'
import { ResizerTooltip } from '~stackable/components'

/**
 * WordPress dependencies
 */
import {
	MediaUpload, RichText, useBlockEditContext,
} from '@wordpress/block-editor'
import {
	Button, Dashicon, ResizableBox,
} from '@wordpress/components'
import {
	useState, useEffect, memo, useRef, useMemo,
} from '@wordpress/element'
import { select } from '@wordpress/data'
import { applyFilters } from '@wordpress/hooks'

const formSize = ( size = '', unit = '%', usePx = false, usePct = true ) => {
	if ( size === 'auto' ) {
		return size
	}
	if ( ! size && size !== 0 ) {
		return unit === '%' ? ( usePct ? '100%' : 100 ) : ( usePx ? '150px' : 150 )
	}
	return unit === '%' ? ( usePct ? `${ size }%` : size ) : ( usePx ? `${ size }px` : size )
}

const getImageWrapperClasses = props => {
	return classnames( [
		props.className,
		'stk-img-wrapper',
	], {
		// Shape.
		'stk-img--shape': props.shape,

		// Firefox doesn't do stretching via SVG attribute and needs to be done via CSS.
		'stk-image--shape-stretch': props.shapeStretch,

		// Shadow is only available when there is no shape.
		[ `stk--shadow-${ props.shadow }` ]: ! props.shape && props.shadow,

		'stk-img--gradient-overlay': props.hasGradientOverlay,

		'stk--has-lightbox': props.hasLightbox,
	} )
}

const getImageClasses = props => {
	return classnames( [
		'stk-img',
	], {
		// Image props Id
		[ `wp-image-${ props.imageId }` ]: props.imageId,
	} )
}

const Image = memo( props => {
	const { isSelected } = useBlockEditContext()
	const [ neverResized, setNeverResized ] = useState( true )
	const [ isResizing, setIsResizing ] = useState( false )
	const [ lockAspectRatio, setLockAspectRatio ] = useState( false )
	const [ initialHeight, setInitialHeight ] = useState()
	const [ initialWidth, setInitialWidth ] = useState()
	const [ parentHeight, setParentHeight ] = useState()
	const [ parentWidth, setParentWidth ] = useState()
	const [ hasImageError, setHasImageError ] = useState( false )

	const [ currentHeight, setCurrentHeight ] = useState()
	const [ currentWidth, setCurrentWidth ] = useState()
	const [ imageWidthIsTooSmall, setImageWidthIsTooSmall ] = useState( false )
	const imageRef = useRef()
	const wrapperRef = useRef()

	const { clientId } = useBlockEditContext()
	const isImageBlock = useMemo( () => {
		return select( 'core/block-editor' ).getBlockName( clientId ) === 'stackable/image'
	}, [ clientId ] )

	// Used to fix issue with Resizable where height in % doesn't show while resizing.
	// @see https://github.com/bokuweb/re-resizable/issues/442
	const [ tempStyle, setTempStyle ] = useState( null )

	const [ snap, setSnap ] = useState( null )

	const src = useDynamicContent( props.src )
	const isShiftKey = useWithShift()
	useEffect( () => {
		setSnap( null )
	}, [ isShiftKey ] )

	const imageWrapperClasses = classnames( [
		getImageWrapperClasses( props ),
		'stk-img-resizer',
	], {
		'stk-img-placeholder': ! src || hasImageError,
		'stk--never-resized': ( ! src || hasImageError ) && neverResized,
		'stk--is-resizing': isResizing,
		'stk--no-click-to-edit': ! props.enableClickToEdit,
		// If the image is too small, hide the size tooltip.
		'stk--too-small': imageWidthIsTooSmall,
	} )

	// Observe the size of the image, if it's too small, we shouldn't show the
	// size tooltip.
	useEffect( () => {
		if ( imageRef.current ) {
			const resizeObserver = new ResizeObserver( entries => { // eslint-disable-line compat/compat
				for ( const entry of entries ) {
					setImageWidthIsTooSmall( entry.contentRect.width < 140 )
				}
			} )
			resizeObserver.observe( imageRef.current )
			return () => resizeObserver.disconnect()
		}
	}, [ imageRef.current ] )

	const imageClasses = getImageClasses( props )

	return (
		<ResizableBox
			className={ imageWrapperClasses }
			enable={ {
				top: props.showHandles && props.heightResizePosition === 'top' ? props.enableHeight : false,
				bottom: props.showHandles && props.heightResizePosition === 'bottom' ? props.enableHeight : false,
				right: props.showHandles && props.widthResizePosition === 'right' ? props.enableWidth : false,
				left: props.showHandles && props.widthResizePosition === 'left' ? props.enableWidth : false,
				topRight: false,
				bottomRight: props.showHandles && props.enableDiagonal,
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
				} else if ( ! props.height || props.height === 'auto' ) {
					currentHeight = parseInt( elt.getBoundingClientRect().height, 10 )
				}
				setInitialHeight( currentHeight || 0 )

				let currentWidth = props.width ? parseFloat( props.width ) : 0
				if ( props.widthUnit === '%' ) {
					const parentWidth = elt.parentElement.getBoundingClientRect().width
					setParentWidth( parentWidth )
					currentWidth = ( props.width || 100 ) / 100 * parentWidth
				} else if ( ! props.width || props.width === 'auto' ) {
					currentWidth = parseInt( elt.getBoundingClientRect().width, 10 )
				}
				setInitialWidth( currentWidth || 0 )

				setNeverResized( false )
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
			{ src && props.onRemove && props.hasRemove && props.showTooltips && (
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
			{ props.hasTooltip && props.showTooltips && (
				<ResizerTooltip
					enableHeight={ props.enableHeight || props.enableDiagonal }
					enableWidth={ props.enableWidth || props.enableDiagonal }
					height={ formSize( currentHeight || props.height, props.heightUnit, false, false ) }
					width={ formSize( currentWidth || props.width, props.widthUnit, false, false ) }
					widthUnits={ props.widthUnits }
					heightUnits={ props.heightUnits }
					heightUnit={ props.heightUnit }
					widthUnit={ props.widthUnit }
					allowReset={ props.allowReset }
					defaultWidth={ props.defaultWidth }
					defaultHeight={ props.defaultHeight }
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
			) }
			<div className="stk-img-resizer-wrapper" ref={ wrapperRef }>
				<img
					ref={ imageRef }
					onLoad={ () => setHasImageError( false ) }
					onError={ () => setHasImageError( true ) }
					className={ imageClasses }
					src={ src || undefined }
					alt={ striptags( props.alt || undefined ) }
					title={ striptags( props.title || undefined ) }
					width={ props.width || undefined }
					height={ props.height || undefined }
					draggable="false"
				/>
			</div>
			{ /* This is to make percentage heights work, see comment above about the issue in ResizableBox */ }
			{ isResizing && tempStyle && <style>{ tempStyle }</style> }
			{ ( isSelected && props.enableClickToEdit ) && (
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

						// If the image being selected is smaller than the
						// current width of the image block, don't use 100%
						// because the image will look blurry, instead use the
						// actual width.
						if ( isImageBlock && imageRef.current && ! props.hasManuallyChangedDimensions ) {
							// When the image gets reset, we need to also reset
							// the width unit to '' so that when we add another
							// image, the image would not be small
							props.onChangeSize( {
								width: '',
								widthUnit: '%',
							} )
							// We need the width of the image block to compare
							const imageBlockWidth = wrapperRef.current.parentElement?.parentElement?.clientWidth ||
								wrapperRef.current.clientWidth
							if ( width < imageBlockWidth ) {
								props.onChangeSize( {
									width,
									widthUnit: 'px',
								} )
							}
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
						// Show an invisible button on top of the image.
						return (
							<Button
								className="stk-img-media-manager-button"
								onClick={ () => obj.open() }
							/>
						)
					} }
				/>
			) }
			{ props.children }
		</ResizableBox>
	)
} )

Image.defaultProps = {
	imageId: '',
	enableClickToEdit: true,
	showHandles: true,
	showTooltips: true,

	alt: '',
	title: '',
	src: '',
	size: 'full',

	width: '',
	height: '',
	widthUnit: '%',
	heightUnit: 'px',
	widthUnits: [ 'px', '%', 'vw' ],
	heightUnits: [ 'px', '%', 'vh' ],

	shape: '',
	shapeStretch: false,
	shadow: '',

	allowedTypes: [ 'image' ],

	// Resizers.
	enableWidth: true,
	enableHeight: true,
	enableDiagonal: true,
	widthResizePosition: 'right',
	heightResizePosition: 'bottom',
	allowReset: true,

	hasGradientOverlay: false,
	hasRemove: true,
	hasTooltip: true,
	onChange: () => {},
	onRemove: () => {},
	onChangeSize: () => {},
}

// Support responsive options.
const ImageResponsive = props => {
	const deviceType = useDeviceType()
	const isDesktop = deviceType === 'Desktop'
	const isMobile = deviceType === 'Mobile'

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
				props[ `onChangeSize${ deviceType }` ]( value )
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

	defaultWidth: '',
	defaultHeight: '',
}

const ImageContent = props => {
	const imageWrapperClasses = getImageWrapperClasses( props )
	const imageClasses = getImageClasses( props )

	const width = props.width || props.width === 0
		? ( props.widthUnit === '%' ? `${ props.width }%` : props.width )
		: undefined

	const height = props.height || props.height === 0
		? ( props.heightUnit === '%' ? `${ props.height }%` : props.height )
		: undefined

	const propsToPass = {}
	const alt = striptags( props.alt || undefined )
	if ( alt ) {
		propsToPass.alt = alt
	}
	const title = striptags( props.title || undefined )
	if ( title ) {
		propsToPass.title = title
	}

	const figcaptionClassnames = classnames(
		props.figcaptionClassnames,
		'stk-img-figcaption'
	)

	// Allow a custom wrapper, mostly used to turn the image into an anchor
	// link.
	const Wrapper = props.customWrapper

	const ConditionalWrapper = ( {
		condition, children,
	} ) =>
		condition ? ( <Wrapper>{ children }</Wrapper> ) : children

	let image = (
		<img // eslint-disable-line jsx-a11y/alt-text
			className={ imageClasses }
			src={ props.src || undefined }
			width={ width || undefined }
			height={ height || undefined }
			{ ...propsToPass }
		/>
	)

	image = ! props.hasWrapper ? image : (
		<span className={ imageWrapperClasses }>
			{ image }
		</span>
	)

	return (
		applyFilters( 'stackable.image.save.wrapper',
			( <figure className={ props.hasWrapper ? undefined : imageWrapperClasses }>
				<ConditionalWrapper
					condition={ !! props.customWrapper }
					children={ image }
				/>
				{ props.figcaptionShow && props.src && <RichText.Content tagName="figcaption" className={ figcaptionClassnames } value={ props.figcaption } /> }
				{ props.children }
			</figure> ), props, imageWrapperClasses, image, figcaptionClassnames
		)
	)
}

ImageContent.defaultProps = {
	imageId: '',

	hasWrapper: false,

	alt: '',
	title: '',
	src: '',
	size: 'full',

	width: '',
	height: '',
	widthUnit: 'px',
	heightUnit: 'px',

	shape: '',
	shapeStretch: false,
	shadow: '',

	hasGradientOverlay: false,
	customWrapper: null,

	figcaptionShow: false,
	figcaption: '',
}

ImageResponsive.Content = ImageContent
export default ImageResponsive
