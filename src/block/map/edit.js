/**
 * Internal dependencies
 */
import { MapStyles } from './style'
import mapStyleOptions from './map-styles'
import {
	DEFAULT_HEIGHT,
	DEFAULT_MIN_HEIGHT,
	DEFAULT_ICON_SIZE,
	DEFAULT_ICON_COLOR,
	DEFAULT_ICON_ANCHOR_POSITION_X,
	DEFAULT_ICON_ANCHOR_POSITION_Y,
	DEFAULT_ICON_OPACITY,
	DEFAULT_ICON_ROTATION,
	initMapLibrary,
	isDefined,
	getSnapYBetween,
	getIframe,
	getMapOptions,
	getLocation,
	getPathFromSvg,
	DEFAULT_ZOOM,
} from './util'
/**
 * External dependencies
 */
import classnames from 'classnames'
import {
	settingsUrl, i18n, settings, version as VERSION,
} from 'stackable'
import {
	AdvancedToggleControl,
	AdvancedRangeControl,
	InspectorStyleControls,
	AdvancedTextControl,
	InspectorTabs,
	PanelAdvancedSettings,
	ResizerTooltip,
	StyleControl,
} from '~stackable/components'
import {
	useBlockHoverClass, useBlockContext, useDeviceType,
} from '~stackable/hooks'
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
import { compose } from '@wordpress/compose'
import { __ } from '@wordpress/i18n'
import {
	Fragment, useEffect, useRef, useMemo, useState,
} from '@wordpress/element'
// import { applyFilters } from '@wordpress/hooks'
import {
	TextControl, SandBox, ResizableBox, Notice,
} from '@wordpress/components'
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
				// const address = place.formatted_address
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

const heightUnit = [ 'px', 'vh', '%' ]

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

	useGeneratedCss( attributes )

	const { __unstableMarkNextChangeAsNotPersistent } = useDispatch( 'core/block-editor' )
	const deviceType = useDeviceType()
	const blockHoverClass = useBlockHoverClass()
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const { parentBlock } = useBlockContext( clientId )

	// TODO: Allow special or layout blocks to disable the link for the image block,
	// e.g. image box doesn't need the image to have a link since it has it's
	// own link.
	// const enableLink = applyFilters( 'stackable.edit.image.enable-link', true, parentBlock )

	const blockClassNames = classnames( [
		className,
		'stk-block-map',
		blockHoverClass,
		blockAlignmentClass,
	] )
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )

	const heightAttrName = getAttributeName( 'height', deviceType )
	const height = attributes[ heightAttrName ]
	console.log( 'height:', height, 'heightAttName:', heightAttrName )
	// Set default min height based on device type
	const defaultMinHeight = useMemo( () =>
		deviceType === 'Tablet'
			? isDefined( attributes[ getAttributeName( 'height' ) ] )
				? attributes[ getAttributeName( 'height' ) ]
				: DEFAULT_MIN_HEIGHT
			: deviceType === 'Mobile'
				? isDefined( attributes[ getAttributeName( 'height', 'tablet' ) ] )
					? attributes[ getAttributeName( 'height', 'tablet' ) ]
					: isDefined( attributes[ getAttributeName( 'height' ) ] )
						? attributes[ getAttributeName( 'height' ) ] : DEFAULT_MIN_HEIGHT
				: DEFAULT_MIN_HEIGHT
	, [ deviceType ] )

	const [ snapY, setSnapY ] = useState( getSnapYBetween( parseInt( height === undefined ? defaultMinHeight : attributes[ heightAttrName ] ) ) )

	const iFrameRef = useRef()
	const mapRef = useRef()
	const markerRef = useRef()
	const canvasRef = useRef()
	const resizableRef = useRef()

	// TODO: check if user is allowed to update the API key.
	const canUpdateAPIKey = true
	const apiKey = settings.stackable_google_maps_api_key

	const initMarker = () => {
		if ( mapRef.current ) {
			const markerOption = {
				title: address,
				position: getLocation( attributes ),
				clickable: false,
			}
			if ( isDefined( icon ) ) {
				markerOption.icon = {
					path: getPathFromSvg( icon ),
					fillColor: iconColor1 || 'black',
					fillOpacity: parseFloat( iconOpacity, 10 ) || 1.0,
					strokeWeight: 0,
					rotation: parseInt( iconRotation, 10 ) || 0,
					scale: ( parseInt( iconSize, 10 ) / 100 ) || ( DEFAULT_ICON_SIZE / 100 ),
					// eslint-disable-next-line no-undef
					anchor: new google.maps.Point(
						parseInt( iconAnchorPositionX ) || DEFAULT_ICON_ANCHOR_POSITION_X,
						parseInt( iconAnchorPositionY ) || DEFAULT_ICON_ANCHOR_POSITION_Y
					),
				}
			}

			// eslint-disable-next-line no-undef
			markerRef.current = new google.maps.Marker( markerOption )
			if ( markerRef.current && mapRef.current ) {
				markerRef.current.setMap( ( showMarker && isDefined( location ) ) ? mapRef.current : null )
			}
		}
	}

	const initMap = () => {
		const mapCanvas = canvasRef.current
		const mapOptions = getMapOptions( attributes, 'edit' )
		// eslint-disable-next-line no-undef
		const map = mapRef.current = new google.maps.Map( mapCanvas, mapOptions )

		// eslint-disable-next-line no-undef
		google.maps.event.addListener( map, 'zoom_changed', () => {
			const zoom = map.getZoom()
			setAttributes( { zoom } )
		} )

		initMarker()
	}

	const html = getIframe( attributes, iFrameRef )

	useEffect( () => {
		console.log( 'height change' )
		const getIframe = () => {
			const { address, zoom } = attributes
			const iframeTitle = __( 'Embedded content from Google Maps.', i18n )
			const src = `https://maps.google.com/maps?q=${ address || 'Philippines' }&t=&z=${ parseInt( zoom, 10 ) || DEFAULT_ZOOM }&ie=UTF8&output=embed`
			return (
				`<iframe
						title="${ iframeTitle }"
						src="${ src }"
						style="border:0;width:100%;max-width:none;height:100%;max-height:none;}"
						aria-hidden="false"
						tabIndex="0"
						allowfullscreen
						loading="lazy"
					></iframe>`
			)
		}
		getIframe()
	}, [ height ] )
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
		// Location will be set when user picks from the Google Places auto
		// complete field.
		if ( isEmpty( address ) ) {
			setAttributes( { location: '' } )
		}
	}, [ address ] )

	useEffect( () => {
		initMapLibrary( apiKey, initMap )
	}, [] )

	useEffect( () => {
		const map = mapRef.current

		if ( map && isDefined( zoom ) ) {
			map.setZoom( zoom )
		}
	}, [ zoom, mapRef.current ] )

	useEffect( () => {
		const updateMarker = () => {
			const marker = markerRef.current
			const map = mapRef.current

			if ( marker ) {
				marker.setMap( showMarker ? map : null )

				const path = getPathFromSvg( icon )

				if ( path ) {
					marker.setIcon( {
						path,
						fillColor: iconColor1 || DEFAULT_ICON_COLOR,
						fillOpacity: parseFloat( iconOpacity, 10 ) || DEFAULT_ICON_OPACITY,
						strokeWeight: 0,
						rotation: parseInt( iconRotation, 10 ) || DEFAULT_ICON_ROTATION,
						scale: ( parseInt( iconSize, 10 ) / 100 ) || ( DEFAULT_ICON_SIZE / 100 ),
						// eslint-disable-next-line no-undef
						anchor: new google.maps.Point(
							parseInt( iconAnchorPositionX ) || DEFAULT_ICON_ANCHOR_POSITION_X,
							parseInt( iconAnchorPositionY ) || DEFAULT_ICON_ANCHOR_POSITION_Y
						),
					} )
				} else {
					marker.setIcon( null )
				}
			}
		}

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
						<Notice className="stk-block-map__api-key-notice" status="info" isDismissible={ false }>
							{ __( 'Some features require a Google Map API Key.' ) },{ ' ' }
							<a
								target="_blank"
								href={ settingsUrl + '#editor-settings' }
								rel="noreferrer"
							>
								{ __( 'Add API key here', i18n ) }
							</a>
						</Notice>
					) }
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
						min={ 200 }
						max={ 1000 }
						step={ 1 }
						allowReset={ true }
						placeholder=""
						responsive="all"
					/>
					<AdvancedRangeControl
						label={ __( 'Zoom', i18n ) }
						attribute="zoom"
						min={ 1 }
						sliderMax={ 24 }
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
							className={ classnames( 'stk-block-map__adv-option', { 'stk-block-map__adv-option__disabled': ! usesApiKey } ) }
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
						/>
					</div>
					<small>Learn how to use <a href="#0">Custom Map styles</a>.</small>
				</PanelAdvancedSettings>
				<PanelAdvancedSettings
					title={ __( 'Map Marker', i18n ) }
					initialOpen={ false }
					disabled={ ! usesApiKey }
					checked={
						usesApiKey
							? showMarker
							: isDefined( location )
								? false
								: true
					}
					onChange={ showMarker =>
						updateBlockAttributes( clientId, { showMarker } )
					}
					id="map-marker"
				>
					<div className={ classnames( 'stk-block-map__adv-option', { 'stk-block-map__adv-option__disabled': ! usesApiKey } ) } >
						<Icon.InspectorControls hideControlsIfIconIsNotSet={ true } hasShape={ false } wrapInPanels={ false } hasBackgroundShape={ false } responsive="" hover="" hasGradient={ false } />
					</div>
					{ icon && <AdvancedRangeControl
						label={ __( 'Horizontal Icon Anchor Point', i18n ) }
						attribute="iconAnchorPositionX"
						min={ -1000 }
						sliderMax={ 1000 }
						step={ 10 }
						allowReset={ true }
						placeholder=""
					/> }
					{ icon && <AdvancedRangeControl
						label={ __( 'Vertical Icon Anchor Point', i18n ) }
						attribute="iconAnchorPositionY"
						min={ -1000 }
						sliderMax={ 1000 }
						step={ 10 }
						allowReset={ true }
						placeholder=""
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
						<div
							className="stk-block-map__canvas"
							ref={ canvasRef }
						/>
					) : (
						<SandBox html={ html } />
					) }
				</ResizableBox>
			</BlockDiv>
		</>
	)
}

export default compose(
	withIsHovered,
	withQueryLoopContext,
)( Edit )

