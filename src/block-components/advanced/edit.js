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
} from '~stackable/components'
import { useBlockAttributes } from '~stackable/hooks'
import { useDeviceEditorClasses } from '~stackable/components/resizable-column/use-device-editor-classes'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'
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
						attribute="htmlTag"
						options={ HTML_TAG_OPTIONS }
					/>
					<AdvancedSelectControl
						label={ __( 'Overflow', i18n ) }
						attribute="overflow"
						responsive="all"
						options={ [
							{ value: '', label: __( 'Default', i18n ) },
							{ value: 'auto', label: __( 'Auto', i18n ) },
							{ value: 'hidden', label: __( 'Hidden', i18n ) },
							{ value: 'scroll', label: __( 'Scroll', i18n ) },
							{ value: 'visible', label: __( 'Visible', i18n ) },
						] }
					/>
					<AdvancedSelectControl
						label={ __( 'Clear', i18n ) }
						attribute="clear"
						options={ [
							{ value: '', label: __( 'Default', i18n ) },
							{ value: 'left', label: __( 'Left', i18n ) },
							{ value: 'right', label: __( 'Right', i18n ) },
							{ value: 'both', label: __( 'Both', i18n ) },
							{ value: 'none', label: __( 'None', i18n ) },
						] }
					/>
				</PanelAdvancedSettings>

				<PanelAdvancedSettings
					title={ __( 'Position', i18n ) }
					id="position"
				>
					<AdvancedRangeControl
						label={ __( 'Opacity', i18n ) }
						attribute="opacity"
						responsive="all"
						hover="all"
						min={ 0.0 }
						max={ 1.0 }
						step={ 0.1 }
						allowReset={ true }
						placeholder="1"
						className="ugb--help-tip-advanced-opacity"
					/>
					<AdvancedRangeControl
						label={ __( 'Z-Index', i18n ) }
						attribute="zIndex"
						responsive="all"
						sliderMin={ -10 }
						sliderMax={ 10 }
						allowReset={ true }
						placeholder="1"
						className="ugb--help-tip-advanced-zindex"
					/>
					<AdvancedSelectControl
						label={ __( 'Position', i18n ) }
						attribute="position"
						responsive="all"
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

					<FourRangeControl
						label={ __( 'Position', i18n ) }
						attribute="positionNum"
						responsive="all"
						hover="all"
						defaultLocked={ false }
						hasLock={ false }
						sliderMin={ -100 }
						sliderMax={ 100 }
						className="ugb--help-tip-advanced-block-paddings"
					/>
				</PanelAdvancedSettings>
			</InspectorAdvancedControls>
		</Fragment>
	)
}
