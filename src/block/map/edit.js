/**
 * Internal dependencies
 */
import BlockStyles from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { i18n, version as VERSION } from 'stackable'
import {
	AdvancedRangeControl,
	InspectorStyleControls,
	AdvancedTextControl,
	AdvancedToggleControl,
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
} from '~stackable/block-components'
import { withQueryLoopContext } from '~stackable/higher-order'
import { getAttributeName } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { _x, __ } from '@wordpress/i18n'
import {
	Fragment, useRef, useMemo, useState,
} from '@wordpress/element'
// import { applyFilters } from '@wordpress/hooks'
import { SandBox, ResizableBox } from '@wordpress/components'

// const heightUnit = [ 'px', 'vh', '%' ]
const getSnapYBetween = ( value, snapDiff = 50 ) => {
	return [
		Math.floor( value / snapDiff ) * snapDiff,
		Math.ceil( value / snapDiff ) * snapDiff,
	]
}

const isDefined = ( value = '' ) => {
	return value !== '' && value !== undefined
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
		location, allowFullScreen, zoom,
	} = attributes

	const deviceType = useDeviceType()
	const blockHoverClass = useBlockHoverClass()
	const blockClassNames = classnames( [
		className,
		'stk-block-map',
		blockHoverClass,
		'stk--no-padding',
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

	const resizableRef = useRef()

	useGeneratedCss( props.attributes )

	const defaultLocation = '14.633600461871746, 121.04300214414138'

	const content = (
		`<iframe
				title="${ __( 'Google Map showing the location:', i18n ) } ${ location }"
				src="https://maps.google.com/maps?q=${ location || defaultLocation }&t=&z=${ zoom || 12 }&ie=UTF8&iwloc=&output=embed"
				class="stk-map__embedded"
				style="border:0;width:100%;max-width:none;height:${ isDefined( height ) ? height : 300 }px;"
				${ isDefined( allowFullScreen ) ? 'allow="allowfullscreen"' : '' }
				aria-hidden="false"
				tabIndex="0"
			></iframe>`
	)

	return (
		<Fragment>

			<InspectorTabs />

			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'General', i18n ) }
					initialOpen={ true }
					id="general"
				>
					<AdvancedTextControl
						label={ __( 'Location', i18n ) }
						attribute="location"
						placeholder={ __( 'Coordindates or address', i18n ) }
					/>
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
					<AdvancedToggleControl
						label={ __( 'Allow Fullscreen', i18n ) }
						attribute="allowFullScreen"
						allowReset={ true }
						placeholder=""
					/>
				</PanelAdvancedSettings>
				<PanelAdvancedSettings
					title={ __( 'Map Style', i18n ) }
					initialOpen={ true }
					id="map-style"
				>
				</PanelAdvancedSettings>
				<PanelAdvancedSettings
					title={ __( 'Map Marker', i18n ) }
					initialOpen={ true }
					id="map-marker"
				>
				</PanelAdvancedSettings>
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
						setSnapY( getSnapYBetween( parseInt( _height ) + delta.height ) )
					} }
					onResizeStop={ ( event, direction, elt, delta ) => {
						let _height = height
						if ( _height === '' || _height === undefined ) {
							_height = defaultMinHeight
						}
						setAttributes( { [ heightAttrName ]: parseInt( _height ) + delta.height } )
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
							height={ resizableRef.current?.state?.isResizing
								? resizableRef.current?.state?.height
								: ( height === '' || height === undefined )
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
					<SandBox html={ content } />
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
