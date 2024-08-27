/**
 * External dependencies
 */
import {
	 useBlockAttributesContext,
	 useBlockSetAttributesContext,
} from '~stackable/hooks'
import {
	BlockCss,
	InspectorStyleControls,
	PanelAdvancedSettings,
	AdvancedToolbarControl,
	ColorPaletteControl,
	AdvancedRangeControl,
} from '~stackable/components'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

const addAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			hasDivider: {
				type: 'boolean',
				default: false,
			},
			dividerType: {
				type: 'string',
				default: ':',
			},
			dividerColor: {
				type: 'string',
				default: '',
			},
			dividerSizeLine: {
				type: 'number',
				default: '',
			},
			dividerSizeColon: {
				type: 'number',
				default: '',
			},
			dividerTopOffset: {
				type: 'number',
				default: '',
			},
		},
		versionAdded: '3.6.0',
		versionDeprecated: '',
	} )
}

const DIVIDER_TYPE_CONTROLS = [
	{
		value: ':',
		title: __( 'Colon', i18n ),
	},
	{
		value: '|',
		title: __( 'Line', i18n ),
	},
]

export const Edit = () => {
	const hasDivider = useBlockAttributesContext( attributes => attributes.hasDivider )
	const dividerType = useBlockAttributesContext( attributes => attributes.dividerType )
	const setAttributes = useBlockSetAttributesContext()

	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ __( 'Separator', i18n ) }
				id="divider"
				hasToggle={ true }
				checked={ hasDivider }
				onChange={ hasDivider => setAttributes( { hasDivider } ) }
			>
				<AdvancedToolbarControl
					controls={ DIVIDER_TYPE_CONTROLS }
					attribute="dividerType"
					fullwidth={ true }
					default=":"
					isSmall={ false }
				/>
				{ dividerType === ':' && <AdvancedRangeControl
					label={ __( 'Size', i18n ) }
					min={ 1 }
					sliderMin={ 1 }
					sliderMax={ 100 }
					attribute="dividerSizeColon"
					placeholder="45"
				/> }
				{ dividerType === ':' && <AdvancedRangeControl
					label={ __( 'Top Offset', i18n ) }
					min={ -50 }
					sliderMin={ -50 }
					sliderMax={ 50 }
					attribute="dividerTopOffset"
					placeholder="-12"
				/> }
				{ dividerType === '|' && <AdvancedRangeControl
					label={ __( 'Size', i18n ) }
					min={ 1 }
					max={ 100 }
					sliderMin={ 1 }
					sliderMax={ 100 }
					attribute="dividerSizeLine"
					placeholder="50"
				/> }
				<ColorPaletteControl
					label={ __( 'Color', i18n ) }
					attribute="dividerColor"
				/>
			</PanelAdvancedSettings>
		</InspectorStyleControls>
	)
}

export const Divider = props => {
	const {
		attributes,
	} = props

	return (
		<div className="stk-block-countdown__divider-wrapper">
			{ attributes.dividerType === ':' && <div className="stk-block-countdown__divider-colon">:</div> }
			{ attributes.dividerType === '|' && <div className="stk-block-countdown__divider-line"></div> }
		</div>

	)
}

Divider.Content = props => {
	const {
		attributes,
	} = props

	return (
		<div className="stk-block-countdown__divider-wrapper">
			{ attributes.dividerType === ':' && <div className="stk-block-countdown__divider-colon">:</div> }
			{ attributes.dividerType === '|' && <div className="stk-block-countdown__divider-line"></div> }
		</div>
	)
}

const Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				selectorCallback={ getAttribute => getAttribute( 'dividerType' ) === ':' ? '.stk-block-countdown__divider-colon' : '.stk-block-countdown__divider-line' }
				styleRuleCallback={ getAttribute => getAttribute( 'dividerType' ) === ':' ? 'color' : 'backgroundColor' }
				attrName="dividerColor"
				key="dividerColor"
				responsive="all"
				dependencies={ [ 'dividerType' ] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-countdown__divider-line"
				styleRule="height"
				attrName="dividerSizeLine"
				key="dividerSizeLine"
				hasUnits="%"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-countdown__divider-colon"
				styleRule="fontSize"
				attrName="dividerSizeColon"
				key="dividerSizeColon"
				hasUnits="px"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-countdown__divider-colon"
				styleRule="top"
				attrName="dividerTopOffset"
				key="dividerTopOffset"
				hasUnits="px"
				responsive="all"
			/>
		</>
	)
}

const Style = props => {
	return <Styles { ...props } />
}

Style.Content = props => {
	return <Styles { ...props } />
}

Divider.InspectorControls = Edit

Divider.addAttributes = addAttributes

Divider.Style = Style

Divider.Style.addStyles = ( blockStyleGenerator, props = {} ) => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}

	blockStyleGenerator.addBlockStyles( 'dividerColor', [ {
		...propsToPass,
		selectorCallback: getAttribute => getAttribute( 'dividerType' ) === ':' ? '.stk-block-countdown__divider-colon' : '.stk-block-countdown__divider-line',
		styleRuleCallback: getAttribute => getAttribute( 'dividerType' ) === ':' ? 'color' : 'backgroundColor',
		attrName: 'dividerColor',
		key: 'dividerColor',
		responsive: 'all',
		dependencies: [ 'dividerType' ],
	} ] )

	blockStyleGenerator.addBlockStyles( 'dividerSizeLine', [ {
		...propsToPass,
		selector: '.stk-block-countdown__divider-line',
		styleRule: 'height',
		attrName: 'dividerSizeLine',
		key: 'dividerSizeLine',
		hasUnits: '%',
		responsive: 'all',
	} ] )

	blockStyleGenerator.addBlockStyles( 'dividerSizeColon', [ {
		...propsToPass,
		selector: '.stk-block-countdown__divider-colon',
		styleRule: 'fontSize',
		attrName: 'dividerSizeColon',
		key: 'dividerSizeColon',
		hasUnits: 'px',
		responsive: 'all',
	} ] )

	blockStyleGenerator.addBlockStyles( 'dividerTopOffset', [ {
		...propsToPass,
		selector: '.stk-block-countdown__divider-colon',
		styleRule: 'top',
		attrName: 'dividerTopOffset',
		key: 'dividerTopOffset',
		hasUnits: 'px',
		responsive: 'all',
	} ] )
}
