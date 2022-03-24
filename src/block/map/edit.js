/**
 * Internal dependencies
 */
import { MapStyles } from './style'
import mapStyleOptions from './map-styles'
import {
	DEFAULT_HEIGHT,
	DEFAULT_ZOOM,
	getHeight,
	initMapLibrary,
	isDefined,
	getSnapYBetween,
	getIframe,
	isLatLng,
	getMapOptions,
} from './util'
/**
 * External dependencies
 */
import { debounce } from 'lodash'
import { MapIcon } from '~stackable/icons'
import classnames from 'classnames'
import {
	i18n, settings, version as VERSION,
} from 'stackable'
import {
	AdvancedToggleControl,
	AdvancedRangeControl,
	InspectorStyleControls,
	AdvancedTextControl,
	InspectorTabs,
	PanelAdvancedSettings,
	ResizerTooltip,
} from '~stackable/components'
import { useBlockHoverClass, useDeviceType } from '~stackable/hooks'
import {
	BlockDiv,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	MarginBottom,
	Transform,
} from '~stackable/block-components'
import { withQueryLoopContext } from '~stackable/higher-order'
import { getAttributeName } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Fragment, useEffect, useRef, useMemo, useState,
} from '@wordpress/element'
// import { applyFilters } from '@wordpress/hooks'
import {
	TextControl, SandBox, ResizableBox, Notice,
} from '@wordpress/components'
import { useDispatch } from '@wordpress/data'

const AdvOptions = ( { children, apiKey } ) => (
	<div
		className={ classnames( 'stk-block-map-extra-options', {
			'stk-block-map-extra-options__is-disabled': ! isDefined( apiKey ),
		} ) }
	>{ children }</div>
)

const Edit = props => {
	const {
		clientId,
		attributes,
		className,
		isHovered,
		isSelected,
		setAttributes,
		address,
	} = props

	const {
		icon,
		isDraggable,
		location,
		mapStyle,
		placeId,
		showFullScreenButton,
		showMapTypeButtons,
		showMarker,
		showStreetViewButton,
		showZoomButtons,
		uniqueId,
		zoom,
	} = attributes

	const deviceType = useDeviceType()
	const blockHoverClass = useBlockHoverClass()
	const blockClassNames = classnames( [
		className,
		blockHoverClass,
		'stk-block-map',
	] )
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )

	const heightAttrName = getAttributeName( 'height', deviceType )
	const height = attributes[ heightAttrName ]
	// Set default min height based on device type
	const defaultMinHeight = useMemo( () =>
		deviceType === 'Tablet'
			? isDefined( attributes[ getAttributeName( 'height' ) ] )
				? attributes[ getAttributeName( 'height' ) ]
				: DEFAULT_HEIGHT
			: deviceType === 'Mobile'
				? isDefined( attributes[ getAttributeName( 'height', 'tablet' ) ] )
					? attributes[ getAttributeName( 'height', 'tablet' ) ]
					: isDefined( attributes[ getAttributeName( 'height' ) ] )
						? attributes[ getAttributeName( 'height' ) ] : DEFAULT_HEIGHT
				: DEFAULT_HEIGHT
	, [ deviceType ] )

	const [ snapY, setSnapY ] = useState( getSnapYBetween( parseInt( height === undefined ? defaultMinHeight : attributes[ heightAttrName ] ) ) )

	const stackableGoogleMap = useRef()
	const addressInput = useRef()
	const resizableRef = useRef()

	// TODO: check if user is allowed to update the API key.
	// TODO: Check if API keys has been entered and show notification.
	const canUpdateAPIKey = true
	// TODO: How do I prepend get_admin_url here?
	const settingsUrl =
		'/wp-admin/options-general.php?page=stackable#editor-settings'
	const apiKey = settings.stackable_google_maps_api_key

	const initSearchBox = () => {
		// eslint-disable-next-line no-undef
		if ( typeof google !== 'object' || typeof google.maps !== 'object' ) {
			return
		}

		const { attributes, setAttributes } = props
		const { address } = attributes

		const input = document.getElementById( `address-search-${ uniqueId }` )
		if ( ! ( input instanceof HTMLInputElement ) ) {
			return
		}
		// eslint-disable-next-line no-undef
		const autocomplete = new google.maps.places.Autocomplete( input )
		autocomplete.setFields( [ 'place_id', 'geometry', 'formatted_address' ] )
		autocomplete.addListener( 'place_changed', () => {
			const place = autocomplete.getPlace()
			if ( ! place.geometry ) {
				return
			}
			const address = place.formatted_address
			setAttributes( { placeId: place.place_id } )
			setAttributes( { address } )
			input.value = address
		} )
		input.value = address
	}

	const initMap = () => {
		const mapCanvas = stackableGoogleMap.current
		const mapOptions = getMapOptions( attributes, 'edit' )
		// eslint-disable-next-line no-undef
		const map = new google.maps.Map( mapCanvas, mapOptions )

		// eslint-disable-next-line no-undef
		google.maps.event.addListener( map, 'zoom_changed', function() {
			const zoom = map.getZoom()
			setAttributes( { zoom } )
		} )

		if ( placeId ) {
			const request = {
				placeId,
				fields: [ 'place_id', 'geometry', 'name', 'formatted_address', 'adr_address', 'website' ],
			}

			// eslint-disable-next-line no-undef
			const service = new google.maps.places.PlacesService( map )
			service.getDetails( request, ( place, status ) => {
				// eslint-disable-next-line no-undef
				if ( status === google.maps.places.PlacesServiceStatus.OK ) {
					map.setCenter( place.geometry.location )
					setAttributes( { location: place.geometry.location } )

					const markerOption = { map }
					if ( icon ) {
						markerOption.icon.path = MapIcon
					}
					// eslint-disable-next-line no-undef
					const marker = new google.maps.Marker( markerOption )
					marker.setPlace( place )
					marker.setVisible( true )

					const contentString = '<div class="stackable-gmap-marker-window"><div class="stackable-gmap-marker-place">' + place.name + '</div><div class="stackable-gmap-marker-address">' +
					place.adr_address + '</div>' +
					'<div class="stackable-gmap-marker-url"><a href="' + place.website + '" target="_blank">' + place.website + '</a></div></div>'

					// eslint-disable-next-line no-undef
					const infowindow = new google.maps.InfoWindow( {
						content: contentString,
					} )
					marker.addListener( 'click', function() {
						infowindow.open( map, marker )
					} )
				}
			} )
		}
	}

	const setStyle = ( mapStyle, currentMapStyle ) => {
		if ( mapStyle !== currentMapStyle ) {
			setAttributes( { mapStyle } )
		}
	}

	useEffect( () => {
		initMapLibrary( apiKey, initMap )
		// TODO: Do I need to clean up here?
		// Remember: there could be other maps using the library.
		// Remember: loading the google maps library more that once could result in bugs
	}, [] )

	useEffect( () => {
		const timeout = setTimeout( initSearchBox, 300 )
		return () => clearTimeout( timeout )
	}, [ isSelected ] )

	useEffect( () => {
		// eslint-disable-next-line no-undef
		if ( typeof google === 'object' && typeof google.maps === 'object' ) {
			initMap()
		}
	}, [
		 height,
		 isDraggable,
		 location,
		 mapStyle,
		 placeId,
		 showFullScreenButton,
		 showMapTypeButtons,
		 showMarker,
		 showStreetViewButton,
		 showZoomButtons,
		 zoom,
	 ] )

	return (
		<Fragment>
			<InspectorTabs />
			<BlockDiv.InspectorControls hasSizeSpacing={ false } />

			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'General', i18n ) }
					initialOpen={ true }
					id="general"
				>
					{ canUpdateAPIKey && ! isDefined( apiKey ) && (
						<Notice status="info" isDismissible={ false }>
							{ __( 'Some features require a Google Map API Key.' ) },{ ' ' }
							<a
								target="_blank"
								href={ settingsUrl }
								rel="noreferrer"
							>
								{ __( 'Add API key here', i18n ) }
							</a>
						</Notice>
					) }
					{ ! isDefined( apiKey )
						? <AdvancedTextControl label={ __( 'Location', i18n ) } attribute="location" placeholder={ __( 'Enter a location', i18n ) } />
						: <TextControl value={ address } id={ `address-search-${ uniqueId }` } ref={ addressInput } label={ __( 'Location', i18n ) } />
					}
					<AdvancedRangeControl
						label={ __( 'Height', i18n ) }
						attribute="height"
						min={ defaultMinHeight }
						sliderMax={ 600 }
						step={ 1 }
						allowReset={ true }
						placeholder={ DEFAULT_HEIGHT }
						responsive="all"
					/>
					<AdvancedRangeControl
						label={ __( 'Zoom', i18n ) }
						attribute="zoom"
						min={ 1 }
						sliderMax={ 22 }
						step={ 1 }
						allowReset={ true }
						placeholder={ DEFAULT_ZOOM }
					/>
					 <AdvOptions apiKey={ apiKey }>
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
					</AdvOptions>
				</PanelAdvancedSettings>
				<PanelAdvancedSettings
					title={ __( 'Map Style', i18n ) }
					initialOpen={ false }
					id="map-style"
				>
					<AdvOptions apiKey={ apiKey } >
						<div className="stk-block-map-extra-options__style-options">
							{ mapStyleOptions.map( style => (
								<div
									className={
										classnames( 'stk-block-map-extra-options__style', {
											'stk-block-map-extra-options__style__active': style.value === mapStyle || ( mapStyle === '' && style.value === 'default' ),
										} )
									}
									key={ style.value }
								>
									<button
										disabled={ style.value === mapStyle }
										className="stk-block-map-extra-options__style-button"
										onClick={ () =>
											setStyle( style.value, mapStyle )
										}
										onKeyUp={ e => ( e.key === 'Enter' || e.keycode === 13 ) && setStyle( style.value, mapStyle ) }
									>
										<img
											src={ style.image }
											alt={ style.value }
											className="stk-block-map-extra-options__style-image"
										/>
									</button>
									<p className="stk-block-map-extra-options__style-name">
										{ style.label }
									</p>
								</div>
							) ) }
						</div>
					</AdvOptions>
				</PanelAdvancedSettings>
				<AdvOptions apiKey={ apiKey } >
					<PanelAdvancedSettings
						title={ __( 'Map Marker', i18n ) }
						initialOpen={ false }
						checked={ isDefined( apiKey ) ? showMarker : location === '' ? true : isLatLng( location ) }
						onChange={ showMarker => updateBlockAttributes( clientId, { showMarker } ) }
						id="map-marker"
					>
						<p>Marker Options here</p>
					</PanelAdvancedSettings>
				</AdvOptions>
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
						height: isDefined( height ) ? height : DEFAULT_HEIGHT,
					} }
					minHeight={ defaultMinHeight }
					enable={ { bottom: true } }
					onResize={ ( event, direction, elt, delta ) => {
						let _height = height
						if ( _height === '' || _height === undefined ) {
							_height = defaultMinHeight
						}
						setSnapY(
							getSnapYBetween( parseInt( _height ) + delta.height )
						)
					} }
					onResizeStop={ ( event, direction, elt, delta ) => {
						let _height = height
						if ( _height === '' || _height === undefined ) {
							_height = defaultMinHeight
						}
						setAttributes( {
							[ heightAttrName ]: parseInt( _height ) + delta.height,
						} )
					} }
					snap={ {
						y: snapY,
					} }
					snapGap={ 10 }
				>
					{ isHovered && (
						<ResizerTooltip
							label={ __( 'Map Height', i18n ) }
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
					{ isDefined( apiKey )
						? <div ref={ stackableGoogleMap } style={ { height: `${ getHeight( attributes ) }px`, width: '100%' } } />
						: <SandBox html={ getIframe( attributes ) } />
					 }
				</ResizableBox>
			</BlockDiv>
			<MarginBottom />
		</Fragment>
	)
}

export default withQueryLoopContext( Edit )
