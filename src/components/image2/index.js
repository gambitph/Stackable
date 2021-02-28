/**
 * This component is meant to replace the ImageUploadPlaceholder and Image
 */
import getSnapSizes from './get-snap-sizes'

/**
 * Internal dependencies
 */
import { AdvancedTextControl } from '..'

/**
 * External dependencies
 */
import { useWithShift } from '~stackable/hooks'
import classnames from 'classnames'
import striptags from 'striptags'
import { clamp } from 'lodash'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { MediaUpload } from '@wordpress/block-editor'
import {
	BaseControl, Dashicon, Popover, ResizableBox,
} from '@wordpress/components'
import {
	Fragment, useState, useEffect, useRef, useCallback,
} from '@wordpress/element'
import { __ } from '@wordpress/i18n'

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

const Image2 = props => {
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
							props.onChangeSize( { width: currentWidth, height: currentHeight } )
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
							onChangeHeight={ value => props.onChangeSize( { height: value } ) }
							onChangeHeightUnit={ value => props.onChangeSize( { heightUnit: value } ) }
							onChangeWidth={ value => props.onChangeSize( { width: value } ) }
							onChangeWidthUnit={ value => props.onChangeSize( { widthUnit: value } ) }
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

	hasRemove: true,
	onChange: () => {},
	onRemove: () => {},
	onChangeSize: () => {},
}

const clampSize = ( value, unit = '%' ) => {
	let ret
	if ( unit === '%' ) {
		ret = clamp( value, 5, 100 )
	}
	ret = Math.max( value, 5 )
	return isNaN( ret ) ? '' : ret
}

// This is in charge of converting px <-> % sizes when switching units.
const convertSizeByUnit = ( value, toUnit = '%', side = 'height', imgEl ) => {
	// Convert to px, just get the current measurement.
	if ( toUnit === 'px' ) {
		return side === 'height' ? imgEl?.clientHeight : imgEl?.clientWidth
	}
	// Convert to %
	const imgResizerEl = imgEl?.closest( '.stk-img-resizer' )
	const parentRect = imgResizerEl?.parentElement
	if ( ! parentRect ) {
		return value
	}
	const parentSize = side === 'height' ? parentRect.clientHeight : parentRect.clientWidth
	return clamp( Math.round( value / parentSize * 10 ) * 10, 10, 100 ) // Round nearest 10%
}

// TODO: responsiveness
const Tooltip = props => {
	const [ isEditing, setIsEditing ] = useState( false )
	const [ currentWidth, setCurrentWidth ] = useState( '' )
	const [ currentHeight, setCurrentHeight ] = useState( '' )

	const [ prevSwitchedWidth, setPrevSwitchedWidth ] = useState( null )
	const [ prevSwitchedHeight, setPrevSwitchedHeight ] = useState( null )

	const tooltipRef = useRef()
	const popupRef = useRef()

	const focusInput = useCallback( () => {
		// When the manual entry opens, select the whole value.
		setTimeout( () => {
			popupRef.current.querySelector( 'input' ).select()
		}, 1 )
	}, [ popupRef.current ] )

	useEffect( () => {
		setPrevSwitchedWidth( null )
		setPrevSwitchedHeight( null )
		if ( isEditing ) {
			setCurrentWidth( props.width )
			setCurrentHeight( props.height )
			focusInput()
		} else {
			setCurrentWidth( '' )
			setCurrentHeight( '' )
		}
	}, [ isEditing ] )

	const className = classnames( [
		'stk-img-resizer-tooltip',
	], {
		'stk--is-editing': isEditing,
	} )

	const popupClassName = classnames( [
		'stk-image-size-popup',
	], {
		'stk--is-wide': props.enableWidth && props.enableHeight,
	} )

	const widthControl = <AdvancedTextControl
		label={ props.enableWidth && props.enableHeight ? __( 'Width', i18n ) : __( 'Image Width', i18n ) }
		className="stk-image-size-popup__size"
		units={ props.widthUnits }
		unit={ props.widthUnit }
		value={ currentWidth }
		onChangeUnit={ unit => {
			if ( unit === props.widthUnit ) {
				return
			}

			// When switching units, prevent the image from abruptly changing widths
			if ( prevSwitchedWidth === null ) {
				setPrevSwitchedWidth( props.width )
				// At first switch, remember the width
				// Calculate new width based on the current one
				const imgEl = tooltipRef.current?.parentElement.querySelector( '.stk-img' )
				const newSize = convertSizeByUnit( props.width, unit, 'width', imgEl )
				setCurrentWidth( newSize )
				props.onChangeWidth( clampSize( newSize, unit ) )
			} else {
				// when already came from a switch, set the previous width back
				setCurrentWidth( prevSwitchedWidth )
				props.onChangeWidth( prevSwitchedWidth )
				setPrevSwitchedWidth( null )
			}

			props.onChangeWidthUnit( unit )
			focusInput()
		} }
		onChange={ value => {
			setPrevSwitchedWidth( null )
			setCurrentWidth( value )
			if ( value >= 5 ) {
				props.onChangeWidth( clampSize( value, props.widthUnit ) )
			}
		} }
	/>

	const heightControl = <AdvancedTextControl
		label={ props.enableWidth && props.enableHeight ? __( 'Height', i18n ) : __( 'Image Height', i18n ) }
		className="stk-image-size-popup__size"
		units={ props.heightUnits }
		unit={ props.heightUnit }
		value={ currentHeight }
		onChangeUnit={ unit => {
			if ( unit === props.heightUnit ) {
				return
			}

			// When switching units, prevent the image from abruptly changing heights
			if ( prevSwitchedHeight === null ) {
				setPrevSwitchedHeight( props.height )
				// At first switch, remember the height
				// Calculate new height based on the current one
				const imgEl = tooltipRef.current?.parentElement.querySelector( '.stk-img' )
				const newSize = convertSizeByUnit( props.height, unit, 'height', imgEl )
				setCurrentHeight( newSize )
				props.onChangeHeight( clampSize( newSize, unit ) )
			} else {
				// when already came from a switch, set the previous height back
				setCurrentHeight( prevSwitchedHeight )
				props.onChangeHeight( prevSwitchedHeight )
				setPrevSwitchedHeight( null )
			}

			props.onChangeHeightUnit( unit )
			focusInput()
		} }
		onChange={ value => {
			setPrevSwitchedHeight( null )
			setCurrentHeight( value )
			if ( value >= 5 ) {
				props.onChangeHeight( clampSize( value, props.heightUnit ) )
			}
		} }
	/>

	return (
		<Fragment>
			{ isEditing && (
				<Popover
					className={ popupClassName }
					anchorRef={ tooltipRef.current }
					position="bottom right"
					onFocusOutside={ () => setIsEditing( false ) }
				>
					<div ref={ popupRef }>
						{ props.enableWidth && props.enableHeight &&
							<BaseControl
								help={ props.help }
								className={ classnames( 'ugb-advanced-text-control', props.className ) }
							>
								<div className="components-base-control__label">{ __( 'Image Size', i18n ) }</div>
								<div className="stk-image-size-popup__control-wrapper">
									{ widthControl }
									<span className="stk-image-size-popup__x">×</span>
									{ heightControl }
								</div>
							</BaseControl>
						}
						{ props.enableWidth && ! props.enableHeight && widthControl }
						{ ! props.enableWidth && props.enableHeight && heightControl }
					</div>
				</Popover>
			) }
			<div
				className={ className }
				role="button"
				tabIndex="0"
				onMouseDown={ event => {
					event.preventDefault()
					event.stopPropagation()
					setIsEditing( ! isEditing )
				} }
				onKeyDown={ event => {
					if ( event.keyCode === 13 ) {
						setIsEditing( ! isEditing )
					}
				} }
				ref={ tooltipRef }
			>
				{ props.enableWidth ? `${ currentWidth || props.width }${ props.widthUnit }` : null }
				{ props.enableWidth && props.enableHeight ? ' × ' : null }
				{ props.enableHeight ? `${ currentHeight || props.height }${ props.heightUnit }` : null }
			</div>
		</Fragment>
	)
}
Tooltip.defaultProps = {
	width: '',
	height: '',
	widthUnit: '%',
	heightUnit: 'px',
	widthUnits: [ 'px', '%' ],
	heightUnits: [ 'px', '%' ],
	enableWidth: true,
	enableHeight: true,
	allowChange: true,
	onChangeWidth: () => {},
	onChangeHeight: () => {},
	onChangeWidthUnit: () => {},
	onChangeHeightUnit: () => {},
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
