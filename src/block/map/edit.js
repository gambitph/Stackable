/**
 * Internal dependencies
 */
import { MapStyles } from './style'
import mapStyleOptions from './map-styles'
import {
	DEFAULT_ADDRESS,
	DEFAULT_HEIGHT,
	DEFAULT_MIN_HEIGHT,
	DEFAULT_ZOOM,
	getIconOptions,
	getMapOptions,
	getZoom,
	initMapLibrary,
	isDefined,
} from './util'
/**
 * External dependencies
 */
import classnames from 'classnames'
import {
	settingsUrl, i18n, settings, version as VERSION,
} from 'stackable'
import {
	AdvancedRangeControl,
	AdvancedTextControl,
	AdvancedToggleControl,
	InspectorStyleControls,
	InspectorTabs,
	PanelAdvancedSettings,
	ResizerTooltip,
	StyleControl,
} from '~stackable/components'
import { useBlockHoverClass, useDeviceType } from '~stackable/hooks'
import {
	BlockDiv,
	useGeneratedCss,
	Advanced,
	CustomCSS,
	Icon,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	MarginBottom,
	Transform,
	getAlignmentClasses,
} from '~stackable/block-components'

import { withIsHovered, withQueryLoopContext } from '~stackable/higher-order'
import { getAttributeName } from '~stackable/util'

/**
 * WordPress dependencies
 */
import {
	ExternalLink,
	Notice,
	ResizableBox,
	TextControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalSpacer as Spacer,
} from '@wordpress/components'
import { compose } from '@wordpress/compose'
import { __ } from '@wordpress/i18n'
import {
	Fragment, useEffect, useRef, useState,
} from '@wordpress/element'
import { useDispatch } from '@wordpress/data'
import { isEmpty } from 'lodash'

const LocationControl = props => {
	const [ waitForGoogle, setWaitForGoogle ] = useState( 0 )

	useEffect( () => {
		const interval = setInterval( () => {
			if ( window.google && window.google.maps ) {
				clearInterval( interval )
				setWaitForGoogle( waitForGoogle + 1 )
			}
		}, 250 )
		if ( window.google && window.google.maps ) {
			clearInterval( interval )
		}
		return () => clearInterval( interval )
	}, [] )

	const ref = useRef()
	useEffect( () => {
		if ( ref.current && window.google && window.google.maps ) {
			// eslint-disable-next-line no-undef
			const autocomplete = new google.maps.places.Autocomplete(
				ref.current
			)
			autocomplete.setFields( [
				'place_id',
				'geometry',
				'formatted_address',
			] )
			autocomplete.addListener( 'place_changed', () => {
				const place = autocomplete.getPlace()
				if ( ! place.geometry ) {
					return
				}
				props.onPlaceChange( place )
			} )
		}
	}, [ ref.current, waitForGoogle ] )

	return (
		<TextControl
			label={ __( 'Location', i18n ) }
			ref={ ref }
			value={ props.value }
			onChange={ props.onTextChange }
		/>
	)
}

LocationControl.defaultProps = {
	onChange: null,
	value: '',
}

const Edit = props => {
	const {
		clientId,
		attributes,
		className,
		isHovered,
		isSelected,
		setAttributes,
	} = props

	const {
		address,
		icon,
		iconAnchorPositionX,
		iconAnchorPositionY,
		iconColor1,
		iconOpacity,
		iconRotation,
		iconSize,
		location,
		mapStyle,
		customMapStyle,
		isDraggable,
		showFullScreenButton,
		showMapTypeButtons,
		showMarker,
		showStreetViewButton,
		showZoomButtons,
		usesApiKey,
		zoom,
		htmlTag,
	} = attributes

	// TODO: What is this for?
	useGeneratedCss( attributes )

	const { __unstableMarkNextChangeAsNotPersistent } = useDispatch( 'core/block-editor' )
	const deviceType = useDeviceType()
	const blockHoverClass = useBlockHoverClass()
	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-map',
		blockHoverClass,
		blockAlignmentClass,
	] )
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )

	const heightAttrName = getAttributeName( 'height', deviceType )
	const height = attributes[ heightAttrName ]
	const defaultMinHeight = DEFAULT_MIN_HEIGHT

	const mapRef = useRef()
	const markerRef = useRef()
	const canvasRef = useRef()
	const resizableRef = useRef()

	// TODO: check if user is allowed to update the API key.
	const canUpdateAPIKey = true
	const apiKey = settings.stackable_google_maps_api_key

	const initMap = () => {
		const mapCanvas = canvasRef.current
		const mapOptions = getMapOptions( attributes )
		// eslint-disable-next-line no-undef
		const map = mapRef.current = new google.maps.Map( mapCanvas, mapOptions )
		// eslint-disable-next-line no-undef
		const marker = new google.maps.Marker( {
			position: map.getCenter(),
		} )

		markerRef.current = marker

		updateMarker()

		/* FIXME: The following causes the Zoom AdvRangeControl's reset button to be non-functional
		 * However, without this, zooming on the map will not reflect on the slider.
		 * i.e. user can play around with the zoom level on the map and the zoom value
		 * in the slider won't change.
		 */
		// eslint-disable-next-line no-undef
		// google.maps.event.addListener( map, 'zoom_changed', () => {
		// 	const zoom = map.getZoom()
		// 	setAttributes( { zoom } )
		// } )
	}

	const updateMarker = () => {
		const marker = markerRef.current
		const map = mapRef.current

		marker.setMap( showMarker ? map : null )
		// TODO: Add return here no need to do the rest.

		// const path = getPathFromSvg( icon )

		// const fillColor = getFillColor( iconColor1 )

		// TODO: @see convertSVGStringToBase64
		/**
		 * Process:
		 * - convert to element
		 * - add fill & style color
		 * - remove / specify width & height
		 * - convert element to string and add as icon url
		 */
		//  const icon = `<?xml version="1.0" encoding="UTF-8"?><svg style="color: ${ iconColor1 }" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-marker-alt" className="svg-inline--fa fa-map-marker-alt fa-w-12" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path></svg>`
		//  const icon = `<?xml version="1.0" encoding="UTF-8"?>
		//  <svg version="1.1" width="${ iconSize }" height="${ iconSize }" style="color:${ iconColor1 };" viewBox="0 0 752 752" xmlns="http://www.w3.org/2000/svg">
		//   <g fill="currentColor">
		//    <path d="m413.11 432.12-7.1406 11.387c35.93 3.5039 61.387 12.16 61.387 22.289 0 13.238-43.41 23.98-96.941 23.98-53.539 0-96.941-10.738-96.941-23.98 0-10.062 25.051-18.652 60.543-22.223l-7.1562-11.406c-43.043 5.3477-73.48 18.375-73.48 33.629 0 20.012 52.316 36.23 116.85 36.23 64.539 0 116.84-16.219 116.84-36.23 0.007813-15.309-30.66-28.371-73.957-33.676z"/>
		//    <path d="m369.51 227.61c-44.258 0-80.129 37.812-80.129 84.445 0 20.008 6.6406 37.023 17.57 52.922l62.312 99.363 0.003906 0.13281 0.046875-0.042968 0.21094 0.34766 0.078124-0.84375 61.07-97.395c11.293-15.934 18.965-33.703 18.965-54.484 0-46.633-35.875-84.445-80.129-84.445zm-0.003906 112.64c-19.734 0-35.738-15.996-35.738-35.73 0-19.738 16.008-35.738 35.738-35.738 19.738 0 35.73 16 35.73 35.738-0.003906 19.734-15.992 35.73-35.73 35.73z"/>
		//   </g>
		//  </svg>`
		const iconOptions = getIconOptions( attributes )
		marker.setOptions( { icon: iconOptions } )
	}

	const src = `https://maps.google.com/maps?q=${ address || DEFAULT_ADDRESS }&t=&z=${ parseInt( zoom, 10 ) || DEFAULT_ZOOM }&ie=UTF8&output=embed`

	useEffect( () => {
		__unstableMarkNextChangeAsNotPersistent()
		setAttributes( { usesApiKey: isDefined( apiKey ) } )
		if ( usesApiKey ) {
			if ( ! isEmpty( address ) && isEmpty( location ) ) {
				setAttributes( { address: '' } )
			}
		}
	}, [ usesApiKey, apiKey ] ),

	useEffect( () => {
		/* Location will be set when user picks from the Google Places auto
		 * complete field.
		 */
		if ( isEmpty( address ) ) {
			setAttributes( { location: '' } )
		}
	}, [ address ] )

	useEffect( () => {
		initMapLibrary( apiKey, initMap )
	}, [] )

	useEffect( () => {
		const map = mapRef.current

		if ( isEmpty( map ) ) {
			return
		}
		const value = getZoom( attributes )
		map.setZoom( value )
	}, [ zoom, mapRef.current ] )

	useEffect( () => {
		if ( mapRef.current && markerRef.current ) {
			updateMarker()
		}
	}, [
		iconSize,
		iconAnchorPositionX,
		iconAnchorPositionY,
		iconColor1,
		iconOpacity,
		iconRotation,
		mapRef.current,
		markerRef.current,
		showMarker,
		icon,
	] )

	useEffect( () => {
		// eslint-disable-next-line no-undef
		if ( typeof google === 'object' && typeof google.maps === 'object' ) {
			initMap()
		}
	}, [
		address,
		deviceType,
		height,
		htmlTag,
		location,
		mapStyle,
		customMapStyle,
		isDraggable,
		showFullScreenButton,
		showMapTypeButtons,
		showStreetViewButton,
		showZoomButtons,
		usesApiKey,
	 ] )

	return (
		<>
			<InspectorTabs />
			<BlockDiv.InspectorControls hasSizeSpacing={ false } />

			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'General', i18n ) }
					initialOpen={ true }
					id="general"
				>
					{ canUpdateAPIKey && ! isDefined( apiKey ) && (
						<>
							<Notice className="stk-block-map__api-key-notice" status="info" isDismissible={ false }>
								{ __( 'Some features require a Google API Key.' ) }{ ' ' }
								<ExternalLink
									type="link"
									href={ settingsUrl + '#editor-settings' }
									rel="next"
								>
									{ __( 'Add API key here.', i18n ) }
								</ExternalLink>
							</Notice>
							<ExternalLink href="https://developers.google.com/maps/documentation/javascript/get-api-key">
								{ __( 'Learn more about Google API Keys', i18n ) }
							</ExternalLink>
						</>
					) }
					<Spacer />
					{ ! isDefined( apiKey ) ? (
						<>
							<AdvancedTextControl
								label={ __( 'Location', i18n ) }
								attribute="address"
								placeholder={ __( 'Enter an address or location', i18n ) }
							/>
						</>
					) : (
						<LocationControl
							value={ address }
							onTextChange={ address => {
								setAttributes( { address } )
								setAttributes( { location: '' } )
							} }
							onPlaceChange={ place => {
								setAttributes( { address: place.formatted_address } )
								const location = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }
								setAttributes( { location } )
							 } }
						/>
					) }
					<AdvancedRangeControl
						label={ __( 'Height', i18n ) }
						attribute="height"
						sliderMin={ 200 }
						sliderMax={ 1000 }
						step={ 1 }
						allowReset={ true }
						placeholder=""
						responsive="all"
					/>
					<AdvancedRangeControl
						label={ __( 'Zoom', i18n ) }
						attribute="zoom"
						min={ 1 }
						max={ 24 }
						step={ 1 }
						allowReset={ true }
						placeholder=""
					/>
					<div className={ classnames( 'stk-block-map__adv-option', { 'stk-block-map__adv-option__disabled': ! usesApiKey } ) } >
						<AdvancedToggleControl
							label={ __( 'Enable Dragging', i18n ) }
							attribute="isDraggable"
							defaultValue={ true }
						/>
						<AdvancedToggleControl
							label={ __( 'Full Screen Button', i18n ) }
							attribute="showFullScreenButton"
							defaultValue={ true }
						/>
						<AdvancedToggleControl
							label={ __( 'Map Type Buttons', i18n ) }
							attribute="showMapTypeButtons"
							defaultValue={ true }
						/>
						<AdvancedToggleControl
							label={ __( 'Street View Button', i18n ) }
							attribute="showStreetViewButton"
							defaultValue={ true }
						/>
						<AdvancedToggleControl
							label={ __( 'Zoom Buttons', i18n ) }
							attribute="showZoomButtons"
							defaultValue={ true }
						/>
					</div>
				</PanelAdvancedSettings>
				<PanelAdvancedSettings
					title={ __( 'Map Style', i18n ) }
					initialOpen={ false }
					id="map-style"
				>
					<div className={ classnames( 'stk-block-map__adv-option', { 'stk-block-map__adv-option__disabled': ! usesApiKey } ) } >
						<StyleControl
							options={ mapStyleOptions }
							value={ mapStyle }
							onSelect={ style => {
								setAttributes( { mapStyle: style.value } )
								setAttributes( { customMapStyle: '' } )
							} }
						/>
					</div>
					<div className={ classnames( 'stk-block-map__adv-option', { 'stk-block-map__adv-option__disabled': ! usesApiKey } ) } >
						<AdvancedTextControl
							label={ __( 'Custom Map Style (Paste JSON here)', i18n ) }
							isMultiline
							attribute="customMapStyle"
							onChange={ value => {
								setAttributes( { customMapStyle: value } )
								setAttributes( { mapStyle: '' } )
							} }
							help={
								<Fragment>
									<ExternalLink href="https://docs.wpstackable.com/article/483-how-to-use-stackable-map-block">
										{ __( 'Learn how to use Custom Map Style', i18n ) }
									</ExternalLink>
								</Fragment>
							}
						/>
					</div>
				</PanelAdvancedSettings>
				<PanelAdvancedSettings
					className={ classnames( 'stk-block-map__map-marker', { 'stk-block-map__map-marker__disabled': ! usesApiKey } ) }
					title={ __( 'Map Marker', i18n ) }
					initialOpen={ false }
					checked={
						usesApiKey && isDefined( apiKey )
							? showMarker
							: false
					}
					onChange={ showMarker =>
						updateBlockAttributes( clientId, { showMarker } )
					}
					id="map-marker"
				>
					<div className={ classnames( 'stk-block-map__adv-option', { 'stk-block-map__adv-option__disabled': ! usesApiKey } ) } >
						<Icon.InspectorControls
							hideControlsIfIconIsNotSet={ true }
							hasShape={ false }
							wrapInPanels={ false }
							hasBackgroundShape={ false }
							responsive=""
							hover=""
							hasGradient={ false }
							iconSizeProps={ {
								sliderMin: 50,
								sliderMax: 300,
							} }
						/>
					</div>
					<div className={ classnames( 'stk-block-map__adv-option', { 'stk-block-map__adv-option__disabled': ! usesApiKey } ) } >
						{ icon && <AdvancedRangeControl
							label={ __( 'Horizontal Icon Anchor Point', i18n ) }
							attribute="iconAnchorPositionX"
							sliderMin={ -100 }
							sliderMax={ 100 }
							step={ 1 }
							allowReset={ true }
							placeholder="0"
						/> }
						{ icon && <AdvancedRangeControl
							label={ __( 'Vertical Icon Anchor Point', i18n ) }
							attribute="iconAnchorPositionY"
							sliderMin={ -100 }
							sliderMax={ 100 }
							step={ 1 }
							allowReset={ true }
							placeholder="0"
						/> }
					</div>
				</PanelAdvancedSettings>
			</InspectorStyleControls>

			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-map" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<MapStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-block-map" />

			<BlockDiv className={ blockClassNames }>
				<ResizableBox
					ref={ resizableRef }
					showHandle={ isHovered || isSelected }
					size={ {
						height: parseInt( height, 10 ) || DEFAULT_HEIGHT,
					} }
					minHeight={ defaultMinHeight }
					enable={ { bottom: true } }
					onResizeStop={ ( event, direction, elt, delta ) => {
						let _height = height
						if ( _height === '' || _height === undefined ) {
							_height = DEFAULT_HEIGHT
						}
						setAttributes( {
							[ heightAttrName ]: parseInt( _height ) + delta.height,
						} )
					} }
				>
					{ isHovered && (
						<ResizerTooltip
							label={ __( 'Map', i18n ) }
							enableWidth={ false }
							height={
								resizableRef.current?.state?.isResizing
									? resizableRef.current?.state?.height
									: isDefined( height )
										? height
										: DEFAULT_HEIGHT
							}
							heightUnits={ [ 'px' ] }
							onChangeHeight={ ( { value } ) => {
								setAttributes( { [ heightAttrName ]: value } )
							} }
							defaultHeight={ DEFAULT_HEIGHT }
							heightPlaceholder={ defaultMinHeight }
						/>
					) }
					{ isDefined( apiKey ) ? (
						<div className="stk-block-map__canvas-wrapper">
							<div
								className="stk-block-map__canvas"
								ref={ canvasRef }
							/>
						</div>
					) : (
						<iframe
							title={ __( 'Embedded content from Google Map Platform.', i18n ) }
							src={ src }
							className="stk-block-map__embedded-map"
							frameBorder="0"
						/>
					) }
				</ResizableBox>
			</BlockDiv>
			<MarginBottom />
		</>
	)
}

export default compose(
	withIsHovered,
	withQueryLoopContext,
)( Edit )

