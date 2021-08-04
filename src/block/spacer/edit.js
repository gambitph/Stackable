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

/**
 * WordPress dependencies
 */
import { ResizableBox } from '@wordpress/components'
import { __ } from '@wordpress/i18n'

const Edit = props => {
	const {
		className,
		attributes,
		setAttributes,
	} = props

	const deviceType = useDeviceType()
	const blockHoverClass = useBlockHoverClass()
	const blockClassNames = classnames( [
		className,
		'stk-block-spacer',
		blockHoverClass,
	] )

	const heightAttrName = getAttributeName( 'height', deviceType )

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
						placeholder=""
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
					size={ {
						height: attributes[ heightAttrName ] === '' ? 50 : attributes[ heightAttrName ],
					} }
					enable={ { bottom: true } }
					onResizeStop={ ( event, direction, elt, delta ) => {
						let height = attributes[ heightAttrName ]
						if ( height === '' ) {
							height = 0
						}
						setAttributes( { [ heightAttrName ]: height + delta.height } )
					} }
				/>
			</BlockDiv>
		</>
	)
}

export default Edit
