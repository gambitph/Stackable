/**
 * Internal dependencies
 */
import {
	BlockCss, 	InspectorStyleControls,
	PanelAdvancedSettings,
	AdvancedToolbarControl,
	ColorPaletteControl,
	AdvancedRangeControl,
} from '~stackable/components'

/**
 * External dependencies
 */
import {
	 useBlockAttributesContext,
	 useBlockSetAttributesContext,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __, i18n } from '@wordpress/i18n'

const addAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			hasDivider: {
				type: 'boolean',
				default: false,
			},
			dividerType: {
				type: 'string',
				default: '',
			},
			dividerColor: {
				type: 'string',
				default: '',
			},
			dividerSize: {
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

export const Edit = props => {
	const {
		// attributes,
	} = props

	const hasDivider = useBlockAttributesContext( attributes => attributes.hasDivider )
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
					default={ ':' }
					isSmall={ false }
				/>
				<AdvancedRangeControl
					label={ __( 'Size', i18n ) }
					min={ 0 }
					sliderMax={ 100 }
					attribute="dividerSize"
				/>
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
		className,
	} = props

	return (
		<div className={ className }>
			{ attributes.dividerType === ':' && (
				<> : </>
			) }
		</div>
	)
}

Divider.Content = props => {
	const {
		attributes,
		className,
	} = props

	return (
		<div className={ className }>
			{ attributes?.dividerType }
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

	const {
		selector = '',
		selectorCallback = null,
	 } = props

	return (
		<>
			{ <BlockCss
				{ ...propsToPass }
				selector={ selector }
				selectorCallback={ selectorCallback }
				styleRuleCallback={ getAttribute => getAttribute( 'dividerType' ) === ':' ? 'color' : 'backgroundColor' }
				attrName="dividerColor"
				key="dividerColor"
				responsive="all"
				dependencies={ [ 'dividerType', 'dividerColor' ] }
			/> }
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				selectorCallback={ selectorCallback }
				styleRuleCallback={ getAttribute => getAttribute( 'dividerType' ) === ':' ? 'fontSize' : 'height' }
				attrName="dividerSize"
				key="dividerSize"
				hasUnits="px"
				responsive="all"
				dependencies={ [ 'dividerType', 'dividerSize' ] }
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

