/**
 * Internal dependencies
 */
import blockStyles from './style'
import mapStyleOptions from './map-styles'
import LocationControl from './location-control'
import {
	DEFAULT_ADDRESS,
	DEFAULT_HEIGHT,
	DEFAULT_ZOOM,
	DEFAULT_ICON_SIZE,
	getIconOptions,
	initMapLibrary,
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
	useBlockCssGenerator,
} from '~stackable/components'
import { useDeviceType } from '~stackable/hooks'
import {
	BlockDiv,
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
import {
	withBlockAttributeContext, withBlockWrapperIsHovered, withQueryLoopContext,
} from '~stackable/higher-order'
import { currentUserHasCapability, getAttributeName } from '~stackable/util'

/**
 * External dependencies
 */
import classnames from 'classnames'
import {
	settingsUrl, i18n, settings, version as VERSION,
} from 'stackable'
import { debounce } from 'lodash'

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
	Fragment, useEffect, useRef, useState, useMemo, useCallback, memo,
} from '@wordpress/element'
import { dispatch } from '@wordpress/data'

const TABS = [ 'style', 'advanced' ]

const Edit = props => {
	const {
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

	const { stackable_google_maps_api_key: apiKey } = settings
	const userCanManageApiKey = useMemo( () => currentUserHasCapability( 'manage_options' ), [] )

	// This just forces the tooltip to update.
	const [ , setResizingHeight ] = useState( '' )

	// Initialize Google API.
	const [ isMapLoaded, setIsMapLoaded ] = useState( false )
	useEffect( () => {
		initMapLibrary( apiKey, initMap )
	}, [] )

	// Always keep note whether this block uses the Google API Key.
	useEffect( () => {
		dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
		setAttributes( { usesApiKey: !! apiKey } )

		// If the API Key was removed, ensure that our map is still centered on the previous location.
		if ( ! apiKey ) {
			if ( address && location && location.lat && location.lng ) {
				setAttributes( { address: location.lat + ',' + location.lng } )
			}
		}
	}, [ apiKey ] )

	const deviceType = useDeviceType()
	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-map',
		blockAlignmentClass,
	] )

	const heightAttrName = getAttributeName( 'height', deviceType )
	const height = attributes[ heightAttrName ]

	const mapRef = useRef()
	const markerRef = useRef()
	const canvasRef = useRef()
	const resizableRef = useRef()
	const geocoderRef = useRef()

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
		markerRef.current = new google.maps.Marker( {
			position: map.getCenter(),
		} )

		// eslint-disable-next-line no-undef
		geocoderRef.current = new google.maps.Geocoder()

		updateMarker()

		if ( ! isMapLoaded ) {
			setIsMapLoaded( true )
		}
	}

	const updateMarker = () => {
		const marker = markerRef.current
		const map = mapRef.current

		marker.setMap( showMarker ? map : null )
		const iconOptions = getIconOptions( attributes )
		marker.setOptions( {
			icon: iconOptions,
		} )
		marker.setPosition( location || DEFAULT_LOCATION )
	}

	useEffect( () => {
		if ( isMapLoaded ) {
			updateMarker()
		}
	}, [
		location,
		iconSize,
		iconAnchorPositionX,
		iconAnchorPositionY,
		iconColor1,
		iconOpacity,
		iconRotation,
		showMarker,
		icon,
	] )

	// Adjust the map options when changed.
	useEffect( () => {
		if ( mapRef.current ) {
			mapRef.current.setOptions( {
				center: location || DEFAULT_LOCATION,
				zoom: zoom || DEFAULT_ZOOM,
				fullscreenControl: showFullScreenButton,
				styles: getMapStyles( attributes ),
				zoomControl: showZoomButtons,
				mapTypeControl: showMapTypeButtons,
				streetViewControl: showStreetViewButton,
				draggable: isDraggable,
			} )
		}
	}, [
		location,
		zoom,
		isDraggable,
		showFullScreenButton,
		showZoomButtons,
		showMapTypeButtons,
		showStreetViewButton,
		mapStyle,
		customMapStyle,
	] )

	useEffect( () => {
		if ( isMapLoaded ) {
			initMap()
		}
	}, [
		htmlTag,
	] )

	// Try geocoding the address.
	const [ useGeocoding, setUseGeocoding ] = useState( true )
	const geocodeAddress = useCallback( debounce( address => {
		if ( useGeocoding ) {
			geocoderRef.current.geocode( {
				address,
			}, function( results, status ) {
				if ( status === 'OK' ) {
					setAttributes( {
						location: results[ 0 ].geometry.location,
					} )
				// If we don't have access to geocoding, don't try it again.
				} else if ( status === 'REQUEST_DENIED' ) {
					setUseGeocoding( false )
				}
			} )
		}
	}, 400 ), [ geocoderRef.current, setAttributes, useGeocoding ] )

	// Generate the CSS styles for the block.
	const blockCss = useBlockCssGenerator( {
		attributes: props.attributes,
		blockStyles,
		clientId: props.clientId,
		context: props.context,
		setAttributes: props.setAttributes,
		blockState: props.blockState,
		version: VERSION,
	} )

	return (
		<>
			<InspectorControls
				apiKey={ apiKey }
				userCanManageApiKey={ userCanManageApiKey }
				setAttributes={ setAttributes }
				geocodeAddress={ geocodeAddress }
				address={ address }
				mapStyle={ mapStyle }
				showMarker={ showMarker }
				icon={ icon }
			/>

			{ blockCss && <style key="block-css">{ blockCss }</style> }
			<CustomCSS mainBlockClass="stk-block-map" />

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				<ResizableBox
					ref={ resizableRef }
					showHandle={ isHovered || isSelected }
					size={ {
						height: parseInt( height, 10 ) || DEFAULT_HEIGHT,
					} }
					minHeight={ 50 }
					enable={ { bottom: true } }
					onResize={ ( event, direction, elt, delta ) => {
						setResizingHeight( delta.height ) // This forces the tooltip height to update.
					} }
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
									: ( height || DEFAULT_HEIGHT )
							}
							heightUnits={ [ 'px' ] }
							onChangeHeight={ ( { value } ) => {
								setAttributes( { [ heightAttrName ]: value } )
							} }
							defaultHeight={ DEFAULT_HEIGHT }
							heightPlaceholder={ DEFAULT_HEIGHT }
						/>
					) }
					{ resizableRef.current?.state?.isResizing && (
						<style>{ `.stk-block.stk-${ attributes.uniqueId } { height: auto !important; }
							.stk-block.stk-${ attributes.uniqueId } .stk-block-map__canvas { height: 100% !important; }` }</style>
					) }
					{ apiKey ? (
						<div
							className="stk-block-map__canvas"
							ref={ canvasRef }
						/>
					) : (
						<iframe
							title={ __( 'Embedded content from Google Map Platform.', i18n ) }
							src={ `https://maps.google.com/maps?q=${ address || DEFAULT_ADDRESS }&t=&z=${ zoom || DEFAULT_ZOOM }&ie=UTF8&output=embed` }
							frameBorder="0"
						/>
					) }
				</ResizableBox>
			</BlockDiv>
			{ props.isHovered && <MarginBottom /> }
		</>
	)
}

const InspectorControls = memo( props => {
	return (
		<>
			<InspectorTabs tabs={ TABS } hasLayoutPanel={ false } />

			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'General', i18n ) }
					className={ classnames( { 'stk--uses-api-key': props.apiKey } ) }
					initialOpen={ true }
					id="general"
				>
					{ props.userCanManageApiKey && ! props.apiKey && (
						<Notice className="stk-block-map__api-key-notice" status="info" isDismissible={ false }>
							{ __( 'Some map features require a Google API Key.', i18n ) }
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
					{ ! props.apiKey ? (
						<>
							<AdvancedTextControl
								label={ __( 'Location', i18n ) }
								attribute="address"
								placeholder={ __( 'Enter an address or location', i18n ) }
							/>
						</>
					) : (
						<LocationControl
							value={ props.address }
							onTextChange={ address => {
								if ( ! address ) {
									return props.setAttributes( { address } )
								}

								// If the typed in value is a lat lng string, split it and set the lat and lng values.
								let	 location = ''
								if ( address.match( /^\s*[-\d.]+(.*?)[, ][-\d.]+/ ) ) { // Check if there's a number comma/space number.
									const [ , lat, , lng ] = address.match( /^\s*([-\d.]+)(.*?)([-\d.]+)/ )
									location = {
										lat: parseFloat( lat ),
										lng: parseFloat( lng ),
									}
								} else {
									// Try Geocoding.
									props.geocodeAddress( address )
								}
								props.setAttributes( {
									address,
									location,
								} )
							} }
							onPlaceChange={ place => {
								props.setAttributes( {
									address: place.formatted_address,
									location: { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() },
								} )
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
					className={ classnames( { 'stk--uses-api-key': props.apiKey } ) }
					initialOpen={ false }
					id="map-style"
				>
					<StyleControl
						className="stk--needs-api-key"
						options={ mapStyleOptions }
						value={ props.mapStyle }
						onSelect={ style => {
							props.setAttributes( {
								mapStyle: style.value,
								customMapStyle: '',
							} )
						} }
					/>
					<AdvancedTextControl
						className="stk--needs-api-key"
						label={ __( 'Custom Map Style (Paste JSON here)', i18n ) }
						isMultiline
						attribute="customMapStyle"
						onChange={ value => {
							props.setAttributes( {
								mapStyle: '',
								customMapStyle: value,
							} )
						} }
						help={
							<Fragment>
								<ExternalLink href="https://docs.wpstackable.com/article/483-how-to-use-stackable-map-block#style">
									{ __( 'Learn how to use Custom Map Styles', i18n ) }
								</ExternalLink>
							</Fragment>
						}
					/>
				</PanelAdvancedSettings>
				<PanelAdvancedSettings
					className={ classnames( 'stk--needs-api-key', { 'stk--uses-api-key': props.apiKey } ) }
					title={ __( 'Map Marker', i18n ) }
					initialOpen={ false }
					hasToggle={ true }
					checked={ props.apiKey ? props.showMarker : false }
					onChange={ showMarker => props.setAttributes( { showMarker } ) }
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
					{ props.icon && <AdvancedRangeControl
						label={ __( 'Horizontal Icon Anchor Point', i18n ) }
						className="stk--needs-api-key"
						attribute="iconAnchorPositionX"
						sliderMin={ -100 }
						sliderMax={ 100 }
						step={ 1 }
						allowReset={ true }
						placeholder="0"
					/> }
					{ props.icon && <AdvancedRangeControl
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

			<BlockDiv.InspectorControls hasSizeSpacing={ false } />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-map" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />
		</>
	)
} )

export default compose(
	withBlockWrapperIsHovered,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )
