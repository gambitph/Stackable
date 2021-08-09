/**
 * Internal dependencies
 */
import { SpacerStyles } from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { i18n, version as VERSION } from 'stackable'
import {
	Advanced,
	BlockDiv,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
} from '~stackable/block-components'
import {
	useBlockHoverClass, useDeviceType,
} from '~stackable/hooks'
import {
	InspectorTabs, InspectorStyleControls, PanelAdvancedSettings, AdvancedRangeControl,
} from '~stackable/components'
import { getAttributeName } from '~stackable/util'
import { withIsHovered } from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { ResizableBox } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { compose } from '@wordpress/compose'
import { useState } from '@wordpress/element'

const getSnapYBetween = ( value, snapDiff = 50 ) => {
	return [
		Math.floor( value / snapDiff ) * snapDiff,
		Math.ceil( value / snapDiff ) * snapDiff,
	]
}

const Edit = props => {
	const {
		className,
		attributes,
		setAttributes,
		isHovered,
		isSelected,
	} = props

	const deviceType = useDeviceType()
	const blockHoverClass = useBlockHoverClass()
	const blockClassNames = classnames( [
		className,
		'stk-block-spacer',
		blockHoverClass,
	] )

	const heightAttrName = getAttributeName( 'height', deviceType )
	const defaultMinHeight = 50
	const [ snapY, setSnapY ] = useState( getSnapYBetween( parseInt( attributes[ heightAttrName ] === undefined ? defaultMinHeight : attributes[ heightAttrName ] ) ) )

	return (
		<>
			<InspectorTabs />
			<BlockDiv.InspectorControls />

			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'General', i18n ) }
					id="general"
					initialOpen={ true }
				>
					<AdvancedRangeControl
						label={ __( 'Height', i18n ) }
						responsive="all"
						attribute="height"
						sliderMin="0"
						sliderMax="500"
						placeholder={ defaultMinHeight }
					/>
				</PanelAdvancedSettings>
			</InspectorStyleControls>
			<Advanced.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-spacer" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<SpacerStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-block-spacer" />
			<BlockDiv className={ blockClassNames }>
				<ResizableBox
					showHandle={ isHovered || isSelected }
					size={ {
						height: attributes[ heightAttrName ] === '' ? defaultMinHeight : attributes[ heightAttrName ],
					} }
					enable={ { bottom: true } }
					onResize={ ( event, direction, elt, delta ) => {
						let height = attributes[ heightAttrName ]
						if ( height === '' || height === undefined ) {
							height = defaultMinHeight
						}
						setSnapY( getSnapYBetween( parseInt( height ) + delta.height ) )
					} }
					onResizeStop={ ( event, direction, elt, delta ) => {
						let height = attributes[ heightAttrName ]
						if ( height === '' || height === undefined ) {
							height = defaultMinHeight
						}
						setAttributes( { [ heightAttrName ]: parseInt( height ) + delta.height } )
					} }
					snap={ {
						y: snapY,
					} }
					snapGap={ 10 }
				/>
			</BlockDiv>
		</>
	)
}

export default compose(
	withIsHovered
)( Edit )

