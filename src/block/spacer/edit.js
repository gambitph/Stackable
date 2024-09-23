/**
 * Internal dependencies
 */
import blockStyles from './style'

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
	Transform,
} from '~stackable/block-components'
import { useDeviceType } from '~stackable/hooks'
import {
	InspectorTabs, InspectorStyleControls, PanelAdvancedSettings, AdvancedRangeControl, ResizerTooltip,
	useBlockCssGenerator,
} from '~stackable/components'
import { getAttributeName } from '~stackable/util'
import {
	withBlockAttributeContext, withBlockWrapperIsHovered, withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { ResizableBox } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { compose } from '@wordpress/compose'
import {
	useState, useRef, useMemo, memo,
} from '@wordpress/element'

const getSnapYBetween = ( value, snapDiff = 50 ) => {
	return [
		Math.floor( value / snapDiff ) * snapDiff,
		Math.ceil( value / snapDiff ) * snapDiff,
	]
}

const isDefined = ( value = '' ) => {
	return value !== '' && value !== undefined
}

const TABS = [ 'style', 'advanced' ]

const Edit = props => {
	const {
		className,
		attributes,
		setAttributes,
		isHovered,
		isSelected,
	} = props

	const deviceType = useDeviceType()
	const blockClassNames = classnames( [
		className,
		'stk-block-spacer',
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
			<InspectorControls defaultMinHeight={ defaultMinHeight } />
			{ blockCss && <style key="block-css">{ blockCss }</style> }
			<CustomCSS mainBlockClass="stk-block-spacer" />
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
				</ResizableBox>
			</BlockDiv>
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
					id="general"
					initialOpen={ true }
				>
					<AdvancedRangeControl
						label={ __( 'Height', i18n ) }
						responsive="all"
						attribute="height"
						sliderMin="0"
						sliderMax="500"
						placeholder={ props.defaultMinHeight }
					/>
				</PanelAdvancedSettings>
			</InspectorStyleControls>
			<BlockDiv.InspectorControls hasSizeSpacing={ false } />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-spacer" />
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
