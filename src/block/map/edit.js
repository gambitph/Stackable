/**
 * Internal dependencies
 */
import BlockStyles from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { isEmpty } from 'lodash'
import { i18n, version as VERSION } from 'stackable'
import {
	AdvancedRangeControl,
	InspectorStyleControls,
	AdvancedTextControl,
	AdvancedToggleControl,
	InspectorTabs,
	PanelAdvancedSettings,
} from '~stackable/components'
// import { useBlockHoverClass, useBlockContext } from '~stackable/hooks'
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
	getAlignmentClasses,
} from '~stackable/block-components'
import { withQueryLoopContext } from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { _x, __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'
// import { applyFilters } from '@wordpress/hooks'
import { Placeholder, SandBox } from '@wordpress/components'

// const heightUnit = [ 'px', 'vh', '%' ]

const Edit = props => {
	const {
		// clientId,
		className,
	} = props

	useGeneratedCss( props.attributes )

	// const blockHoverClass = useBlockHoverClass()
	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	// FIXME
	const styles = []

	const blockClassNames = classnames( [
		className,
		'stk-block-map',
		// blockHoverClass,
		blockAlignmentClass,
	] )

	const content = `<iframe
				title="test"
				src="https://maps.google.com/maps?q=14.633600461871746, 121.04300214414138&t=&z=12&ie=UTF8&iwloc=&output=embed"
				className="stk-map"
				height="300"
				frameBorder="0"
				style="border:0;width: 100%; max-width: none;"
				allowFullScreen=""
				aria-hidden="false"
				tabIndex="0"
			></iframe>`

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
						attribute="mapLocation"
						placeholder={ __( 'Coordindates or address', i18n ) }
					/>
					<AdvancedRangeControl
						label={ __( 'Width', i18n ) }
						attribute="mapWidth"
						units={ props.widthUnits }
						min={ props.widthMin }
						sliderMax={ props.widthMax }
						step={ props.widthStep }
						initialPosition={ 100 }
						allowReset={ true }
						placeholder="250" // TODO: This should be referenced somewher instead of just a static number
						responsive="all"
					/>
					<AdvancedRangeControl
						label={ __( 'Height', i18n ) }
						attribute="mapHeight"
						units={ props.heightUnits }
						min={ props.heightMin }
						sliderMax={ props.heightMax }
						step={ props.heightStep }
						allowReset={ true }
						placeholder=""
						responsive="all"
					/>
					<AdvancedRangeControl
						label={ __( 'Zoom', i18n ) }
						attribute="mapZoom"
						min={ 1 }
						sliderMax={ 10 }
						step={ 1 }
						allowReset={ true }
						placeholder=""
					/>
					<AdvancedToggleControl
						label={ __( 'Allow Fullscreen', i18n ) }
						attribute="mapAllowFullscreen"
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
				{ isEmpty( content )
					? <Placeholder />
					: <SandBox html={ content } styles={ styles } />
				}
			</BlockDiv>
			<MarginBottom />
		</Fragment>
	)
}

export default withQueryLoopContext( Edit )
