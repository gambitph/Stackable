/**
 * Internal dependencies
 */
import './store'

/**
 * External dependencies
 */
import {
	AdvancedToolbarControl,
	AdvancedRangeControl,
	FourRangeControl,
	PanelAdvancedSettings,
	ShadowControl,
	getShadows,
	AdvancedSelectControl,
} from '~stackable/components'
import { IMAGE_SHADOWS, BORDER_CONTROLS } from '~stackable/block-components'
import { i18n } from 'stackable'
import { useDeviceType, useBlockHoverState } from '~stackable/hooks'
// import { cloneDeep } from 'lodash'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { models } from '@wordpress/api'
import { useSelect, dispatch } from '@wordpress/data'
import { addFilter } from '@wordpress/hooks'
import { useState } from '@wordpress/element'

export { GlobalBlockLayoutStyles } from './editor-loader'

let saveTimeout = null

const LayoutSettings = props => {
	return <>
		<div className="ugb-global-block-layouts__section-settings">
			<p className="ugb-global-block-layouts__section-title">{ props.title }</p>
			{ props.children }
		</div>
	</>
}

addFilter( 'stackable.global-settings.inspector', 'stackable/block-layouts', output => {
	const [ , setIsOpen ] = useState( false )
	const {
		blockLayouts,
	} = useSelect( select => {
		const _blockLayouts = select( 'stackable/global-block-layouts' ).getBlockLayouts()
		return {
			blockLayouts: { ..._blockLayouts },
		}
	}, [] )
	const [ currentHoverState ] = useBlockHoverState( { globalControl: true } )
	const deviceType = useDeviceType()
	const shadows = getShadows()

	const hoverState = {
		'normal': '',
		'hover': 'Hover',
		'parent-hover': 'ParentHover'
	}


	const getValue = ( property, { responsive = false, hover = false, unit = false } = {} ) => {
		return blockLayouts[ property ]?.[`${ responsive ? deviceType.toLowerCase() : 'desktop' }${ hover ? hoverState[ currentHoverState ] : '' }${ unit ? 'Unit' : '' }`]
	}

	const valueCallback = value => {
		return value ? shadows.indexOf( value ) === -1 ? 'custom' : shadows.indexOf( value ) : ''
	}

	const changeCallback = index => {
		return index !== '' ? shadows[ index ] : index
	}

	const onChange = ( property, _value, { responsive = false, hover = false, unit = false } = {} ) => {
		const newSettings = { ...blockLayouts }
		let state = 'desktop'

		if ( responsive ) {
			state = deviceType.toLowerCase()
		}

		if ( hover ) {
			state += hoverState[ currentHoverState ]
		}

		if ( unit ) {
			state += 'Unit'
		}


		if ( ! ( property in newSettings ) ) {
			newSettings[ property ] = {}
		}

		if ( _value === '' ||
			( typeof _value === 'object' && Object.values( _value ).every( v => v === '' ) ) ||
			( unit && _value === 'px') ) {
			delete newSettings[ property ][ state ]

			if ( Object.keys( newSettings[ property ] ).length === 0 ) {
				delete newSettings[ property ]
			}
		} else if ( typeof _value === 'object' ) {
			const value = {
				top: _value.top || 0,
				right: _value.right || 0,
				bottom: _value.bottom || 0,
				left: _value.left || 0,
			}

			newSettings[ property ][ state ] = value
		} else {
			newSettings[ property ][ state ] = _value
		}

		clearTimeout( saveTimeout )
		saveTimeout = setTimeout( () => {
			const settings = new models.Settings( { stackable_global_block_layouts: newSettings } ) // eslint-disable-line camelcase
			settings.save()
		}, 300 )

		// Update our store.
		dispatch( 'stackable/global-block-layouts' ).updateBlockLayouts( newSettings )
	}

	return (
		<>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'Global Block Layouts', i18n ) }
				onToggle={ isOpen => setIsOpen( isOpen ) }
			>
				<p className="components-base-control__help">
					{ __( 'Manage how Stackable blocks look when they\'re inserted.', i18n ) }
					&nbsp;
					<a href="https://docs.wpstackable.com/article/480-how-to-use-block-defaults?utm_source=wp-global-settings&utm_campaign=learnmore&utm_medium=gutenberg" target="_docs">
						{ __( 'Learn more about Block Defaults', i18n ) }
					</a>
				</p>
				<LayoutSettings title={ __( 'Container', i18n ) }>
					<FourRangeControl
						label={ __( 'Padding', i18n ) }
						responsive="all"
						hover="all"
						globalControl={ true }
						min={ [ 0, 0, 0 ] }
						sliderMax={ [ 200, 30, 100 ] }
						units={ [ 'px', 'em', '%' ] }
						unit={ getValue( '--stk-container-padding', { responsive: true, hover: true, unit: true } ) || 'px' }
						onChangeUnit={ value => onChange( '--stk-container-padding', value, { responsive: true, hover: true, unit: true } )}
						top={ getValue( '--stk-container-padding', { responsive: true, hover: true } )?.top }
						right={ getValue( '--stk-container-padding', { responsive: true, hover: true } )?.right  }
						bottom={ getValue( '--stk-container-padding', { responsive: true, hover: true } )?.bottom }
						left={ getValue( '--stk-container-padding', { responsive: true, hover: true } )?.left  }
						onChange={ value => onChange( '--stk-container-padding', value, { responsive: true, hover: true } ) }
					/>
					<AdvancedToolbarControl
						label={ __( 'Borders', i18n ) }
						controls={ BORDER_CONTROLS }
						className="ugb-border-controls__border-type-toolbar"
						isSmall={ true }
						value={ getValue( '--stk-container-border-type') }
						onChange={ value => onChange( '--stk-container-border-type', value ) }
					/>
					<FourRangeControl
						label={ __( 'Border Width', i18n ) }
						responsive="all"
						hover="all"
						globalControl={ true }
						min={ 0 }
						max={ 99 }
						step={ 1 }
						sliderMax={ 5 }
						defaultLocked={ true }
						top={ getValue( '--stk-container-border-width', { responsive: true, hover: true } )?.top }
						right={ getValue( '--stk-container-border-width', { responsive: true, hover: true } )?.right  }
						bottom={ getValue( '--stk-container-border-width', { responsive: true, hover: true } )?.bottom }
						left={ getValue( '--stk-container-border-width', { responsive: true, hover: true } )?.left  }
						onChange={ value => onChange( '--stk-container-border-width', value, { responsive: true, hover: true } ) }
					/>
					<FourRangeControl
						label={ __( 'Border Radius', i18n ) }
						min={ 0 }
						isCorner={ true }
						sliderMax={ 50 }
						responsive="all"
						onChange={ value => onChange( '--stk-container-border-radius', value, { responsive: true } ) }
						top={ getValue( '--stk-container-border-radius', { responsive: true } )?.top || '' }
						right={ getValue( '--stk-container-border-radius', { responsive: true } )?.right || '' }
						bottom={ getValue( '--stk-container-border-radius', { responsive: true } )?.bottom || '' }
						left={ getValue( '--stk-container-border-radius', { responsive: true } )?.left || '' }
					/>
					<ShadowControl
						label={ __( 'Shadow / Outline', i18n ) }
						hover="all"
						globalControl={ true }
						value={ valueCallback( getValue( '--stk-container-box-shadow', { hover: true }  || '' ) ) }
						onChange={ value => onChange( '--stk-container-box-shadow', changeCallback( value ), { hover: true } ) }
						shadowFilterValue={ getValue( '--stk-container-box-shadow', { hover: true } ) || '' }
						shadowFilterOnChange={ value => onChange( '--stk-container-box-shadow', value, { hover: true } ) }
					/>
				</LayoutSettings>

				<LayoutSettings title={ __( 'Background', i18n ) } >
					<FourRangeControl
						label={ __( 'Padding', i18n ) }
						responsive="all"
						hover="all"
						globalControl={ true }
						min={ [ 0, 0, 0 ] }
						sliderMax={ [ 200, 30, 100 ] }
						units={ [ 'px', 'em', '%' ] }
						unit={ getValue( '--stk-block-background-padding', { responsive: true, hover: true, unit: true } ) || 'px' }
						onChangeUnit={ value => onChange( '--stk-block-background-padding', value, { responsive: true, hover: true, unit: true } )}
						top={ getValue( '--stk-block-background-padding', { responsive: true, hover: true } )?.top }
						right={ getValue( '--stk-block-background-padding', { responsive: true, hover: true } )?.right  }
						bottom={ getValue( '--stk-block-background-padding', { responsive: true, hover: true } )?.bottom }
						left={ getValue( '--stk-block-background-padding', { responsive: true, hover: true } )?.left  }
						onChange={ value => onChange( '--stk-block-background-padding', value, { responsive: true, hover: true } ) }
					/>
					<AdvancedToolbarControl
						label={ __( 'Borders', i18n ) }
						controls={ BORDER_CONTROLS }
						className="ugb-border-controls__border-type-toolbar"
						isSmall={ true }
						value={ getValue( '--stk-block-background-border-type') }
						onChange={ value => onChange( '--stk-block-background-border-type', value ) }
					/>
					<FourRangeControl
						label={ __( 'Border Width', i18n ) }
						responsive="all"
						hover="all"
						globalControl={ true }
						min={ 0 }
						max={ 99 }
						step={ 1 }
						sliderMax={ 5 }
						defaultLocked={ true }
						top={ getValue( '--stk-block-background-border-width', { responsive: true, hover: true } )?.top }
						right={ getValue( '--stk-block-background-border-width', { responsive: true, hover: true } )?.right  }
						bottom={ getValue( '--stk-block-background-border-width', { responsive: true, hover: true } )?.bottom }
						left={ getValue( '--stk-block-background-border-width', { responsive: true, hover: true } )?.left  }
						onChange={ value => onChange( '--stk-block-background-border-width', value, { responsive: true, hover: true } ) }
					/>
					<FourRangeControl
						label={ __( 'Border Radius', i18n ) }
						min={ 0 }
						isCorner={ true }
						sliderMax={ 50 }
						responsive="all"
						onChange={ value => onChange( '--stk-block-background-border-radius', value, { responsive: true } ) }
						top={ getValue( '--stk-block-background-border-radius', { responsive: true } )?.top || '' }
						right={ getValue( '--stk-block-background-border-radius', { responsive: true } )?.right || '' }
						bottom={ getValue( '--stk-block-background-border-radius', { responsive: true } )?.bottom || '' }
						left={ getValue( '--stk-block-background-border-radius', { responsive: true } )?.left || '' }
					/>
					<ShadowControl
						label={ __( 'Shadow / Outline', i18n ) }
						hover="all"
						globalControl={ true }
						value={ valueCallback( getValue( '--stk-block-background-box-shadow', { hover: true }  || '' ) ) }
						onChange={ value => onChange( '--stk-block-background-box-shadow', changeCallback( value ), { hover: true } ) }
						shadowFilterValue={ getValue( '--stk-block-background-box-shadow', { hover: true } ) || '' }
						shadowFilterOnChange={ value => onChange( '--stk-block-background-box-shadow', value, { hover: true } ) }
					/>
				</LayoutSettings>

				<LayoutSettings title={ __( 'Margins', i18n ) }>
					<AdvancedRangeControl
						label={ __( 'Block Margin Bottom', i18n ) }
						responsive="all"
						units={ [ 'px', '%' ] }
						sliderMin={ [ -200, -100 ] }
						sliderMax={ [ 200, 100 ] }
						placeholder="0"
					/>
				</LayoutSettings>

				<LayoutSettings title={ __( 'Columns', i18n ) }>
					<AdvancedRangeControl
						label={ __( ' Inner Column Spacing', i18n ) }
						responsive="all"
						min={ [ 0, 0 ] }
						sliderMax={ [ 200, 30 ] }
						units={ [ 'px', 'em', 'vw' ] }
						unit={ getValue( '--stk-column-inner-spacing', { responsive: true, unit: true } ) || 'px' }
						onChangeUnit={ value => onChange( '--stk-column-inner-spacing', value, { responsive: true, unit: true } )}
						value={ valueCallback( getValue( '--stk-column-inner-spacing', { responsive: true }  || '' ) ) }
						onChange={ value => onChange( '--stk-column-inner-spacing', changeCallback( value ), { responsive: true } ) }
					/>
					<AdvancedRangeControl
						label={ __( 'Column Gap', i18n ) }
						responsive="all"
						min={ 0 }
						sliderMax={ 100 }
						placeholder="0"
						value={ valueCallback( getValue( '--stk-column-gap', { responsive: true }  || '' ) ) }
						onChange={ value => onChange( '--stk-column-gap', changeCallback( value ), { responsive: true } ) }
					/>
					<AdvancedRangeControl
						label={ __( 'Row Gap', i18n ) }
						responsive="all"
						min={ 0 }
						sliderMax={ 100 }
						placeholder="0"
						value={ valueCallback( getValue( '--stk-column-gap', { responsive: true }  || '' ) ) }
						onChange={ value => onChange( '--stk-column-gap', changeCallback( value ), { responsive: true } ) }
					/>
				</LayoutSettings>

				<LayoutSettings title={ __( 'Image', i18n ) }>
					<ShadowControl
						label={ __( 'Shadow / Outline', i18n ) }
						options={ IMAGE_SHADOWS }
						hover="all"
						globalControl={ true }
						value={ valueCallback( getValue( '--stk-image-box-shadow', { hover: true }  || '' ) ) }
						onChange={ value => onChange( '--stk-image-box-shadow', changeCallback( value ), { hover: true } ) }
						shadowFilterValue={ getValue( '--stk-image-box-shadow', { hover: true } ) || '' }
						shadowFilterOnChange={ value => onChange( '--stk-image-box-shadow', value, { hover: true } ) }
					/>
					<FourRangeControl
						label={ __( 'Border Radius', i18n ) }
						min={ 0 }
						isCorner={ true }
						sliderMax={ 50 }
						responsive="all"
						onChange={ value => onChange( '--stk-image-border-radius', value, { responsive: true } ) }
						top={ getValue( '--stk-image-border-radius', { responsive: true } )?.top || '' }
						right={ getValue( '--stk-image-border-radius', { responsive: true } )?.right || '' }
						bottom={ getValue( '--stk-image-border-radius', { responsive: true } )?.bottom || '' }
						left={ getValue( '--stk-image-border-radius', { responsive: true } )?.left || '' }
					/>

				</LayoutSettings>

				<LayoutSettings title={ __( 'Buttons', i18n ) }>
					<AdvancedRangeControl
						label={ __( 'Min. Button Height', i18n ) }
						responsive="all"
						min={ 0 }
						max={ 100 }
					/>
					<FourRangeControl
						label={ __( 'Button Padding', i18n ) }
						units={ [ 'px', '%' ] }
						responsive="all"
						sliderMin={ [ 0, 0 ] }
						sliderMax={ [ 40, 100 ] }
						vhMode={ true }
					/>
					<AdvancedToolbarControl
						label={ __( 'Borders', i18n ) }
						controls={ BORDER_CONTROLS }
						className="ugb-border-controls__border-type-toolbar"
						isSmall={ true }
						value={ getValue( '--stk-block-background-border-type') }
						onChange={ value => onChange( '--stk-block-background-border-type', value ) }
					/>
					<FourRangeControl
						label={ __( 'Border Width', i18n ) }
						responsive="all"
						hover="all"
						globalControl={ true }
						min={ 0 }
						max={ 99 }
						step={ 1 }
						sliderMax={ 5 }
						defaultLocked={ true }
						top={ getValue( '--stk-block-background-border-width', { responsive: true, hover: true } )?.top }
						right={ getValue( '--stk-block-background-border-width', { responsive: true, hover: true } )?.right  }
						bottom={ getValue( '--stk-block-background-border-width', { responsive: true, hover: true } )?.bottom }
						left={ getValue( '--stk-block-background-border-width', { responsive: true, hover: true } )?.left  }
						onChange={ value => onChange( '--stk-block-background-border-width', value, { responsive: true, hover: true } ) }
					/>
					<AdvancedRangeControl
						label={ __( 'Button Ghost Border Width', i18n ) }
						min={ 0 }
						max={ 99 }
						step={ 1 }
						sliderMax={ 5 }
					/>
					<FourRangeControl
						label={ __( 'Border Radius', i18n ) }
						min={ 0 }
						isCorner={ true }
						sliderMax={ 50 }
						responsive="all"
						onChange={ value => onChange( '--stk-block-background-border-radius', value, { responsive: true } ) }
						top={ getValue( '--stk-block-background-border-radius', { responsive: true } )?.top || '' }
						right={ getValue( '--stk-block-background-border-radius', { responsive: true } )?.right || '' }
						bottom={ getValue( '--stk-block-background-border-radius', { responsive: true } )?.bottom || '' }
						left={ getValue( '--stk-block-background-border-radius', { responsive: true } )?.left || '' }
					/>
					<ShadowControl
						label={ __( 'Shadow / Outline', i18n ) }
						hover="all"
						globalControl={ true }
						value={ valueCallback( getValue( '--stk-block-background-box-shadow', { hover: true }  || '' ) ) }
						onChange={ value => onChange( '--stk-block-background-box-shadow', changeCallback( value ), { hover: true } ) }
						shadowFilterValue={ getValue( '--stk-block-background-box-shadow', { hover: true } ) || '' }
						shadowFilterOnChange={ value => onChange( '--stk-block-background-box-shadow', value, { hover: true } ) }
					/>
					<AdvancedRangeControl
						label={ __( 'Icon Size', i18n ) }
						min={ 0 }
						sliderMax={ 100 }
						step={ 1 }
						responsive="all"
					/>
					<AdvancedRangeControl
						label={ __( 'Icon Button Gap', i18n ) }
						responsive="all"
						min={ 0 }
						sliderMax={ 50 }
					/>

					<AdvancedRangeControl
						label={ __( 'Column Gap', i18n ) }
						responsive="all"
						min="0"
						sliderMax="50"
						placeholder=""
					/>
					<AdvancedRangeControl
						label={ __( 'Row Gap', i18n ) }
						attribute="rowGap"
						responsive="all"
						min="0"
						sliderMax="50"
						placeholder=""
					/>
					<AdvancedSelectControl
						label={ __( 'Flex Wrap', i18n ) }
						attribute="flexWrap"
						options={ [
							{
								label: __( 'No Wrap', i18n ),
								value: '',
							},
							{
								label: __( 'Wrap', i18n ),
								value: 'wrap',
							},
							{
								label: __( 'Wrap Reverse', i18n ),
								value: 'wrap-reverse',
							},
						] }
						responsive="all"
					/>
				</LayoutSettings>

				<LayoutSettings title={ __( 'Icon List', i18n ) }>
					<AdvancedRangeControl
						label={ __( 'Icon Size', i18n ) }
						min={ 0 }
						max={ 50 }
						step={ 1 }
						placeholder="16"
						responsive="all"
					/>
					<AdvancedRangeControl
						label={ __( 'Row Gap', i18n ) }
						min="0"
						sliderMax="50"
						responsive="all"
					/>
					<AdvancedRangeControl
						label={ __( 'Icon Gap', i18n ) }
						min="0"
						sliderMax="20"
						placeholder="8"
						responsive="all"
					/>
					<AdvancedRangeControl
						label={ __( 'Indentation', i18n ) }
						min="0"
						sliderMax="50"
						placeholder=""
						responsive="all"
					/>
				</LayoutSettings>

				<LayoutSettings title={ __( 'Icons', i18n ) }>
					<AdvancedRangeControl
						label={ __( 'Icon Size', i18n ) }
						responsive="all"
						min={ 0 }
						sliderMax={ 100 }
						step={ 1 }
					/>
				</LayoutSettings>

			</PanelAdvancedSettings>
		</>
	)
} )
