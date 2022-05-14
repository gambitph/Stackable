/**
 * Internal dependencies
 */
import { MapStyles } from './style'
import mapStyleOptions from './map-styles'
import LocationControl from './location-control'
import {
	DEFAULT_ADDRESS,
	DEFAULT_HEIGHT,
	DEFAULT_ZOOM,
	DEFAULT_ICON_SIZE,
	getIconOptions,
	initMapLibrary,
	isDefined,
	DEFAULT_LOCATION,
	getMapStyles,
} from './util'
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
import { currentUserHasCapability, getAttributeName } from '~stackable/util'

/**
 * External dependencies
 */
import classnames from 'classnames'
import {
	settingsUrl, i18n, settings, version as VERSION,
} from 'stackable'
import { isEmpty } from 'lodash'

/**
 * WordPress dependencies
 */
import {
	ExternalLink,
	Notice,
	ResizableBox,
} from '@wordpress/components'
import { compose } from '@wordpress/compose'
import { __ } from '@wordpress/i18n'
import {
	Fragment, useEffect, useRef, useState, useMemo,
} from '@wordpress/element'
import { useDispatch } from '@wordpress/data'

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
		zoom,
		htmlTag,
	} = attributes

	const [ waitForGoogle, setWaitForGoogle ] = useState( 0 )

	useGeneratedCss( attributes )

	// Wait for the Google Map Api to load.
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

	const { stackable_google_maps_api_key: apiKey } = settings
	const userCanManageApiKey = useMemo( () => {
		currentUserHasCapability( 'manage_options' )
	}, [] )

	// Always keep note whether this block uses the Google API Key.
	const { __unstableMarkNextChangeAsNotPersistent } = useDispatch( 'core/block-editor' )
	useEffect( () => {
		__unstableMarkNextChangeAsNotPersistent()
		setAttributes( { usesApiKey: !! apiKey } )
		// TODO: what is this for??
		if ( apiKey ) {
			if ( ! isEmpty( address ) && isEmpty( location ) ) {
				setAttributes( { address: '' } )
			}
		}
	}, [ apiKey ] )

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

	const mapRef = useRef()
	const markerRef = useRef()
	const canvasRef = useRef()
	const resizableRef = useRef()

	const initMap = () => {
		const mapCanvas = canvasRef.current

		const mapOptions = {
			center: location || DEFAULT_LOCATION,
			zoom: zoom || DEFAULT_ZOOM,
			fullscreenControl: showFullScreenButton,
			styles: getMapStyles( attributes ),
			zoomControl: showZoomButtons,
			mapTypeControl: showMapTypeButtons,
			streetViewControl: showStreetViewButton,
			draggable: isDraggable,
		}
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
		const iconOptions = getIconOptions( attributes )
		marker.setOptions( { icon: iconOptions } )
	}

	const src = `https://maps.google.com/maps?q=${ address || DEFAULT_ADDRESS }&t=&z=${ parseInt( zoom, 10 ) || DEFAULT_ZOOM }&ie=UTF8&output=embed`

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
	}, [ waitForGoogle ] )

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

	// Adjust the map options when changed.
	useEffect( () => {
		if ( mapRef.current ) {
			mapRef.current.setOptions( {
				fullscreenControl: showFullScreenButton,
				// styles: parsedStyles,
				zoomControl: showZoomButtons,
				mapTypeControl: showMapTypeButtons,
				streetViewControl: showStreetViewButton,
				draggable: isDraggable,
			} )
		}
	}, [ isDraggable, showFullScreenButton, showZoomButtons, showMapTypeButtons, showStreetViewButton ] )

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
		waitForGoogle,
	 ] )

	return (
		<>
			<InspectorTabs />
			<BlockDiv.InspectorControls hasSizeSpacing={ false } />

			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'General', i18n ) }
					className={ classnames( { 'stk--uses-api-key': apiKey } ) }
					initialOpen={ true }
					id="general"
				>
					{ userCanManageApiKey && ! apiKey && (
						<Notice className="stk-block-map__api-key-notice" status="info" isDismissible={ false }>
							{ __( 'Some map features require a Google API Key.' ) }
							&nbsp;
							<ExternalLink
								type="link"
								href={ settingsUrl + '#editor-settings' }
								rel="next"
							>
								{ __( 'Add API key here.', i18n ) }
							</ExternalLink>
						</Notice>
					) }
					{ ! apiKey ? (
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
						min={ 0 }
						sliderMin={ 200 }
						sliderMax={ 500 }
						step={ 1 }
						allowReset={ true }
						placeholder={ DEFAULT_HEIGHT }
						responsive="all"
					/>
					<AdvancedRangeControl
						label={ __( 'Zoom', i18n ) }
						attribute="zoom"
						min={ 1 }
						max={ 24 }
						step={ 1 }
						allowReset={ true }
						placeholder={ DEFAULT_ZOOM }
						onChange={ zoom => {
							setAttributes( { zoom: zoom || DEFAULT_ZOOM } )
							mapRef.current.setZoom( zoom || DEFAULT_ZOOM )
						} }
					/>
					<AdvancedToggleControl
						label={ __( 'Enable Dragging', i18n ) }
						className="stk--needs-api-key"
						attribute="isDraggable"
						defaultValue={ true }
					/>
					<AdvancedToggleControl
						label={ __( 'Full Screen Button', i18n ) }
						className="stk--needs-api-key"
						attribute="showFullScreenButton"
						defaultValue={ true }
					/>
					<AdvancedToggleControl
						label={ __( 'Map Type Buttons', i18n ) }
						className="stk--needs-api-key"
						attribute="showMapTypeButtons"
						defaultValue={ true }
					/>
					<AdvancedToggleControl
						label={ __( 'Street View Button', i18n ) }
						className="stk--needs-api-key"
						attribute="showStreetViewButton"
						defaultValue={ true }
					/>
					<AdvancedToggleControl
						label={ __( 'Zoom Buttons', i18n ) }
						className="stk--needs-api-key"
						attribute="showZoomButtons"
						defaultValue={ true }
					/>
				</PanelAdvancedSettings>
				<PanelAdvancedSettings
					title={ __( 'Map Style', i18n ) }
					className={ classnames( { 'stk--uses-api-key': apiKey } ) }
					initialOpen={ false }
					id="map-style"
				>
					<StyleControl
						className="stk--needs-api-key"
						options={ mapStyleOptions }
						value={ mapStyle }
						onSelect={ style => {
							setAttributes( { mapStyle: style.value } )
							setAttributes( { customMapStyle: '' } )
						} }
					/>
					<AdvancedTextControl
						className="stk--needs-api-key"
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
				</PanelAdvancedSettings>
				<PanelAdvancedSettings
					className={ classnames( 'stk--needs-api-key', { 'stk--uses-api-key': apiKey } ) }
					title={ __( 'Map Marker', i18n ) }
					initialOpen={ false }
					checked={ apiKey ? showMarker : false }
					onChange={ showMarker =>
						updateBlockAttributes( clientId, { showMarker } )
					}
					id="map-marker"
				>
					<div className="stk--needs-api-key">
						<Icon.InspectorControls
							hideControlsIfIconIsNotSet={ true }
							hasShape={ false }
							wrapInPanels={ false }
							hasBackgroundShape={ false }
							responsive=""
							hover=""
							hasGradient={ false }
							iconSizeProps={ {
								sliderMin: 20,
								sliderMax: 100,
								placeholder: DEFAULT_ICON_SIZE,
							} }
							iconControlHelp={ __( 'Uploaded Icon and Icon Color settings are not fully compatible.', i18n ) }
						/>
					</div>
					{ icon && <AdvancedRangeControl
						label={ __( 'Horizontal Icon Anchor Point', i18n ) }
						className="stk--needs-api-key"
						attribute="iconAnchorPositionX"
						sliderMin={ -100 }
						sliderMax={ 100 }
						step={ 1 }
						allowReset={ true }
						placeholder="0"
					/> }
					{ icon && <AdvancedRangeControl
						label={ __( 'Vertical Icon Anchor Point', i18n ) }
						className="stk--needs-api-key"
						attribute="iconAnchorPositionY"
						sliderMin={ -100 }
						sliderMax={ 100 }
						step={ 1 }
						allowReset={ true }
						placeholder="0"
					/> }
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
					minHeight={ 50 }
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
							heightPlaceholder={ DEFAULT_HEIGHT }
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

