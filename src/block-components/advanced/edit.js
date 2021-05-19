/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	AdvancedRangeControl,
	AdvancedSelectControl,
	FourRangeControl,
	InspectorAdvancedControls,
	PanelAdvancedSettings,
	ResponsiveControl2,
} from '~stackable/components'
import { useBlockAttributes } from '~stackable/hooks'
import { useDeviceEditorClasses } from '~stackable/components/resizable-column/use-device-editor-classes'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'
import { useDispatch } from '@wordpress/data'
import { Fragment } from '@wordpress/element'
import {
	__, _x, sprintf,
} from '@wordpress/i18n'

const HTML_TAG_OPTIONS = [
	{ value: '', label: __( 'Default', i18n ) },
	{ value: 'div', label: _x( 'Div', 'HTML Tag', i18n ) },
	{ value: 'blockquote', label: _x( 'Blockquote', 'HTML Tag', i18n ) },
	{ value: 'section', label: _x( 'Section', 'HTML Tag', i18n ) },
	{ value: 'article', label: _x( 'Article', 'HTML Tag', i18n ) },
	{ value: 'aside', label: _x( 'Aside', 'HTML Tag', i18n ) },
	{ value: 'main', label: _x( 'Main', 'HTML Tag', i18n ) },
	{ value: 'header', label: _x( 'Header', 'HTML Tag', i18n ) },
	{ value: 'footer', label: _x( 'Footer', 'HTML Tag', i18n ) },
	{ value: 'nav', label: _x( 'Nav', 'HTML Tag', i18n ) },
	{ value: 'address', label: _x( 'Address', 'HTML Tag', i18n ) },
	{ value: 'hgroup', label: _x( 'Hgroup', 'HTML Tag', i18n ) },
]

export const Edit = () => {
	const { clientId } = useBlockEditContext()

	// Needed for position sticky attribute.
	useDeviceEditorClasses()

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )
	const attributes = useBlockAttributes( clientId )

	return (
		<Fragment>
			<InspectorAdvancedControls>
				<PanelAdvancedSettings
					title={ __( 'General', i18n ) }
					id="general"
				>
					<AdvancedSelectControl
						label={ sprintf( _x( '%s HTML Tag', 'component' ), __( 'Block', i18n ) ) }
						value={ attributes.htmlTag }
						options={ HTML_TAG_OPTIONS }
						onChange={ htmlTag => updateBlockAttributes( clientId, { htmlTag } ) }
					/>
					<ResponsiveControl2
						desktopProps={ {
							value: attributes.opacity,
							onChange: opacity => updateBlockAttributes( clientId, { opacity } ),
						} }
						tabletProps={ {
							value: attributes.opacityTablet,
							onChange: opacityTablet => updateBlockAttributes( clientId, { opacityTablet } ),
						} }
						mobileProps={ {
							value: attributes.opacityMobile,
							onChange: opacityMobile => updateBlockAttributes( clientId, { opacityMobile } ),
						} }
					>
						<AdvancedRangeControl
							label={ __( 'Opacity', i18n ) }
							min={ 0.0 }
							max={ 1.0 }
							step={ 0.1 }
							allowReset={ true }
							placeholder="1"
							className="ugb--help-tip-advanced-opacity"
						/>
					</ResponsiveControl2>
					<ResponsiveControl2
						desktopProps={ {
							value: attributes.overflow,
							onChange: overflow => updateBlockAttributes( clientId, { overflow } ),
						} }
						tabletProps={ {
							value: attributes.overflowTablet,
							onChange: overflowTablet => updateBlockAttributes( clientId, { overflowTablet } ),
						} }
						mobileProps={ {
							value: attributes.overflowMobile,
							onChange: overflowMobile => updateBlockAttributes( clientId, { overflowMobile } ),
						} }
					>
						<AdvancedSelectControl
							label={ __( 'Overflow', i18n ) }
							options={ [
								{ value: '', label: __( 'Default', i18n ) },
								{ value: 'auto', label: __( 'Auto', i18n ) },
								{ value: 'hidden', label: __( 'Hidden', i18n ) },
								{ value: 'scroll', label: __( 'Scroll', i18n ) },
								{ value: 'visible', label: __( 'Visible', i18n ) },
							] }
						/>
					</ResponsiveControl2>
				</PanelAdvancedSettings>

				<PanelAdvancedSettings
					title={ __( 'Position', i18n ) }
					id="position"
				>
					<ResponsiveControl2
						desktopProps={ {
							value: attributes.zIndex,
							onChange: zIndex => updateBlockAttributes( clientId, { zIndex } ),
						} }
						tabletProps={ {
							value: attributes.zIndexTablet,
							onChange: zIndexTablet => updateBlockAttributes( clientId, { zIndexTablet } ),
						} }
						mobileProps={ {
							value: attributes.zIndexMobile,
							onChange: zIndexMobile => updateBlockAttributes( clientId, { zIndexMobile } ),
						} }
					>
						<AdvancedRangeControl
							label={ __( 'Z-Index', i18n ) }
							sliderMin={ -10 }
							sliderMax={ 10 }
							allowReset={ true }
							placeholder="1"
							className="ugb--help-tip-advanced-zindex"
						/>
					</ResponsiveControl2>
					<ResponsiveControl2
						desktopProps={ {
							value: attributes.position,
							onChange: position => updateBlockAttributes( clientId, { position } ),
						} }
						tabletProps={ {
							value: attributes.positionTablet,
							onChange: positionTablet => updateBlockAttributes( clientId, { positionTablet } ),
						} }
						mobileProps={ {
							value: attributes.positionMobile,
							onChange: positionMobile => updateBlockAttributes( clientId, { positionMobile } ),
						} }
					>
						<AdvancedSelectControl
							label={ __( 'Position', i18n ) }
							help={
								[ attributes.position, attributes.positionTablet, attributes.positionMobile ].includes( 'sticky' )
									? __( 'Sticky position may not work across all themes', i18n )
									: ''
							}
							options={ [
								{ value: '', label: __( 'Default', i18n ) },
								{ value: 'static', label: __( 'Static', i18n ) },
								{ value: 'relative', label: __( 'Relative', i18n ) },
								{ value: 'absolute', label: __( 'Absolute', i18n ) },
								{ value: 'sticky', label: __( 'Sticky', i18n ) },
							] }
						/>
					</ResponsiveControl2>
					<ResponsiveControl2
						desktopProps={ {
							top: attributes.positionTop,
							right: attributes.positionRight,
							bottom: attributes.positionBottom,
							left: attributes.positionLeft,
							unit: attributes.positionUnit || 'px',
							onChange: ( {
								top, right, bottom, left,
							} ) => {
								updateBlockAttributes( clientId, {
									positionTop: ! top && top !== 0 ? '' : parseInt( top, 10 ),
									positionRight: ! right && right !== 0 ? '' : parseInt( right, 10 ),
									positionBottom: ! bottom && bottom !== 0 ? '' : parseInt( bottom, 10 ),
									positionLeft: ! left && left !== 0 ? '' : parseInt( left, 10 ),
								} )
							},
							onChangeUnit: positionUnit => updateBlockAttributes( clientId, { positionUnit } ),
						} }
						tabletProps={ {
							top: attributes.positionTopTablet,
							right: attributes.positionRightTablet,
							bottom: attributes.positionBottomTablet,
							left: attributes.positionLeftTablet,
							unit: attributes.positionUnitTablet || 'px',
							onChange: ( {
								top, right, bottom, left,
							} ) => {
								updateBlockAttributes( clientId, {
									positionTopTablet: ! top && top !== 0 ? '' : parseInt( top, 10 ),
									positionRightTablet: ! right && right !== 0 ? '' : parseInt( right, 10 ),
									positionBottomTablet: ! bottom && bottom !== 0 ? '' : parseInt( bottom, 10 ),
									positionLeftTablet: ! left && left !== 0 ? '' : parseInt( left, 10 ),
								} )
							},
							onChangeUnit: positionUnitTablet => updateBlockAttributes( clientId, { positionUnitTablet } ),
						} }
						mobileProps={ {
							top: attributes.positionTopMobile,
							right: attributes.positionRightMobile,
							bottom: attributes.positionBottomMobile,
							left: attributes.positionLeftMobile,
							unit: attributes.positionUnitMobile || 'px',
							onChange: ( {
								top, right, bottom, left,
							} ) => {
								updateBlockAttributes( clientId, {
									positionTopMobile: ! top && top !== 0 ? '' : parseInt( top, 10 ),
									positionRightMobile: ! right && right !== 0 ? '' : parseInt( right, 10 ),
									positionBottomMobile: ! bottom && bottom !== 0 ? '' : parseInt( bottom, 10 ),
									positionLeftMobile: ! left && left !== 0 ? '' : parseInt( left, 10 ),
								} )
							},
							onChangeUnit: positionUnitMobile => updateBlockAttributes( clientId, { positionUnitMobile } ),
						} }
					>
						<FourRangeControl
							label={ __( 'Position', i18n ) }
							units={ [ 'px', 'em', '%' ] }
							defaultLocked={ false }
							sliderMin={ [ -100, -10, -20 ] }
							sliderMax={ [ 200, 30, 100 ] }
							placeholder="0"
							className="ugb--help-tip-advanced-block-paddings"
						/>
					</ResponsiveControl2>
					<AdvancedSelectControl
						label={ __( 'Clear', i18n ) }
						value={ attributes.clear }
						options={ [
							{ value: '', label: __( 'Default', i18n ) },
							{ value: 'left', label: __( 'Left', i18n ) },
							{ value: 'right', label: __( 'Right', i18n ) },
							{ value: 'both', label: __( 'Both', i18n ) },
							{ value: 'none', label: __( 'None', i18n ) },
						] }
						onChange={ clear => updateBlockAttributes( clientId, { clear } ) }
					/>
				</PanelAdvancedSettings>
			</InspectorAdvancedControls>
		</Fragment>
	)
}
