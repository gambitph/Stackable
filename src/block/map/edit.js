/**
 * Internal dependencies
 */
import BlockStyles from './style'
import mapStyles from './map-styles'
import {
	initMapLibrary, isDefined, latLngToString,
} from './util'
/**
 * External dependencies
 */
import { MapIcon } from '~stackable/icons'
import classnames from 'classnames'
import {
	i18n, settings, version as VERSION,
} from 'stackable'
import {
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
	useGeneratedCss,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	MarginBottom,
	Transform,
	Icon,
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
	SandBox, ResizableBox, Notice,
} from '@wordpress/components'

// TODO: Implement height units.
// const heightUnit = [ 'px', 'vh', '%' ]
const getSnapYBetween = ( value, snapDiff = 50 ) => {
	return [
		Math.floor( value / snapDiff ) * snapDiff,
		Math.ceil( value / snapDiff ) * snapDiff,
	]
}

const Edit = props => {
	const {
		setAttributes,
		attributes,
		className,
		isHovered,
		isSelected,
	} = props

	const {
		placeID, mapStyle, location, allowFullScreen, zoom, icon,
	} = attributes

	const deviceType = useDeviceType()
	const blockHoverClass = useBlockHoverClass()
	const blockClassNames = classnames( [
		className,
		'stk-block-map',
		blockHoverClass,
	] )

	const heightAttrName = getAttributeName( 'height', deviceType )
	const height = attributes[ heightAttrName ]
	// Set default min height based on device type
	const defaultMinHeight = useMemo( () =>
		deviceType === 'Tablet'
			? isDefined( attributes[ getAttributeName( 'height' ) ] )
				? attributes[ getAttributeName( 'height' ) ]
				: 50
			: deviceType === 'Mobile'
				? isDefined( attributes[ getAttributeName( 'height', 'tablet' ) ] )
					? attributes[ getAttributeName( 'height', 'tablet' ) ]
					: isDefined( attributes[ getAttributeName( 'height' ) ] )
						? attributes[ getAttributeName( 'height' ) ] : 50
				: 50
	, [ deviceType ] )

	const [ snapY, setSnapY ] = useState( getSnapYBetween( parseInt( height === undefined ? defaultMinHeight : attributes[ heightAttrName ] ) ) )

	const stackableGoogleMap = useRef()
	const addressInput = useRef()
	const resizableRef = useRef()

	useGeneratedCss( props.attributes )

	// TODO: Hardcoded values to default props.
	const defaultLocation = { lat: 14.633600461871746, lng: 121.04300214414138 }

	const iframeTitle = __( 'Embedded content from Google Maps.', i18n )

	const content = (
		`<iframe
				title="${ iframeTitle }"
				src="https://maps.google.com/maps?q=${ location || latLngToString( defaultLocation ) }&t=&z=${ zoom || 12 }&ie=UTF8&output=embed"
				style="border:0;width:100%;max-width:none;height:${ isDefined( height ) ? height : 300 }px;"
				${ isDefined( allowFullScreen ) ? `allow="allowfullscreen 'src'"` : '' }
				aria-hidden="false"
				tabIndex="0"
			></iframe>`
	)

	// TODO: check if user is allowed to update the API key.
	// TODO: Check if API keys has been entered and show notification.
	const canUpdateAPIKey = true
	// TODO: How do I prepend get_admin_url here?
	const settingsUrl =
		'/wp-admin/options-general.php?page=stackable#editor-settings'
	const apiKey = settings.stackable_google_maps_api_key
	// TODO: Add marker visiblity attrib?
	const showMarker = true

	// const initSearchBox = () => {
	// 	const { attributes, setAttributes } = props
	// 	const { address } = attributes
	// 	// Create the search box and link it to the UI element.
	// 	const input = addressInput.current
	// 	if ( typeof input === 'undefined' ) {
	// 		return
	// 	}
	// 	// eslint-disable-next-line no-undef
	// 	const autocomplete = new google.maps.places.Autocomplete( input )
	// 	autocomplete.setFields( [ 'place_id', 'geometry', 'formatted_address' ] )
	// 	autocomplete.addListener( 'place_changed', () => {
	// 		const place = autocomplete.getPlace()
	// 		if ( ! place.geometry ) {
	// 			return
	// 		}
	// 		const address = place.formatted_address
	// 		setAttributes( { placeID: place.place_id } )
	// 		setAttributes( { address } )
	// 		input.value = address
	// 	} )
	// 	input.value = address
	// }

	const initMap = () => {
		const mapCanvas = stackableGoogleMap.current
		const styles = mapStyles.find( style => style.value === mapStyle )?.json
		const mapOptions = {
			center: defaultLocation,
			zoom: parseInt( zoom, 10 ),
			fullscreenControl: allowFullScreen,
			styles: styles || [],
		}
		// eslint-disable-next-line no-undef
		const map = new google.maps.Map( mapCanvas, mapOptions )

		if ( placeID ) {
			const request = {
				placeId: placeID,
				fields: [ 'place_id', 'geometry', 'name', 'formatted_address', 'adr_address', 'website' ],
			}

			// eslint-disable-next-line no-undef
			const service = new google.maps.places.PlacesService( map )
			service.getDetails( request, ( place, status ) => {
				// eslint-disable-next-line no-undef
				if ( status === google.maps.places.PlacesServiceStatus.OK ) {
					if ( place.geometry.viewport ) {
						map.fitBounds( place.geometry.viewport )
					} else {
						setAttributes( { zoom: 16 } )
						map.setCenter( place.geometry.location )
						map.setZoom( parseInt( zoom, 10 ) )
					}

					const markerOption = { map }
					if ( icon ) {
						markerOption.icon.path = MapIcon
					}
					// eslint-disable-next-line no-undef
					const marker = new google.maps.Marker( markerOption )
					// Set the position of the marker using the place ID and location.
					marker.setPlace( defaultLocation )
					marker.setVisible( showMarker )

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

	// useEffect( () => {
	// 	initSearchBox()
	// }, [ addressInput.current ] )

	useEffect( () => {
		// eslint-disable-next-line no-undef
		if ( typeof google === 'object' && typeof google.maps === 'object' ) {
			initMap()
		}
	}, [ zoom, location, mapStyle ] )

	return (
		<Fragment>
			<InspectorTabs />

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
					<AdvancedTextControl
						ref={ addressInput }
						label={ __( 'Location', i18n ) }
						attribute="location"
						placeholder={ __( 'Coordinates or address', i18n ) }
					/>
					{ /* <TextControl
						ref={ addressInput }
						label={ __( 'Location', i18n ) }
						attribute="location"
						placeholder={ __( 'Coordinates or address', i18n ) }
						onChange={ debounce( e => setAttributes( { location: e.value } ) ) }
					/> */ }
					<AdvancedRangeControl
						label={ __( 'Height', i18n ) }
						attribute="height"
						units={ props.heightUnits }
						min={ props.heightMin }
						sliderMax={ props.heightMax || 600 }
						step={ props.heightStep }
						allowReset={ true }
						placeholder=""
						responsive="all"
					/>
					<AdvancedRangeControl
						label={ __( 'Zoom', i18n ) }
						attribute="zoom"
						min={ 1 }
						sliderMax={ 25 }
						step={ 1 }
						allowReset={ true }
						placeholder="12"
					/>
				</PanelAdvancedSettings>
				<div
					className={ classnames( 'stk-block-map-extra-options', {
						'stk-block-map-extra-options__is-disabled': ! isDefined(
							apiKey
						),
					} ) }
				>
					<PanelAdvancedSettings
						title={ __( 'Map Style', i18n ) }
						initialOpen={ false }
						id="map-style"
					>
						<div className="stk-block-map-extra-options__style-options">
							{ mapStyles.map( style => (
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
					</PanelAdvancedSettings>
					<PanelAdvancedSettings
						title={ __( 'Map Marker', i18n ) }
						initialOpen={ false }
						id="map-marker"
					>
						<Icon.InspectorControls initialOpen={ true } hasMultiColor={ true } />
					</PanelAdvancedSettings>
				</div>
			</InspectorStyleControls>

			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-map" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<BlockStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-block-map" />

			<BlockDiv className={ blockClassNames }>
				<ResizableBox
					ref={ resizableRef }
					showHandle={ isHovered || isSelected }
					size={ {
						height: height === '' ? defaultMinHeight : height,
					} }
					minHeight="0"
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
							label={ __( 'Spacer', i18n ) }
							enableWidth={ false }
							height={
								resizableRef.current?.state?.isResizing
									? resizableRef.current?.state?.height
									: height === '' || height === undefined
										? ''
										: height
							}
							heightUnits={ [ 'px' ] }
							onChangeHeight={ ( { value } ) => {
								setAttributes( { [ heightAttrName ]: value } )
							} }
							defaultHeight=""
							heightPlaceholder={ defaultMinHeight }
						/>
					) }
					{ apiKey ? (
						<div
							ref={ stackableGoogleMap }
							style={ {
								height: parseInt( height, 10 ) + 'px',
								width: '100%',
							} }
						/>
					) : (
						<SandBox html={ content } />
					) }
				</ResizableBox>
			</BlockDiv>
			<MarginBottom />
		</Fragment>
	)
}

// Edit.defaultProps = {
// 	zoom: 12
// }

export default withQueryLoopContext( Edit )
