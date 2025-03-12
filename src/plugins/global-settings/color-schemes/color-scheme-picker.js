/**
 * Internal dependencies
 */
// import {
// 	getRgb,
// 	createColor,
// 	convertGlobalColorBlockAttributesToStatic,
// } from './util'
import { hoverState } from '../utils'
/**
 * External dependencies
 */
import { cloneDeep } from 'lodash'
import { i18n } from 'stackable'
import {
	SortablePicker,
	InspectorSubHeader,
	ColorPaletteControl,
	AdvancedTextControl,
} from '~stackable/components'

import { useRef } from '@wordpress/element'
import { useSelect } from '@wordpress/data'
// import { models } from '@wordpress/api'
import { __ } from '@wordpress/i18n'
import { useBlockHoverState } from '~stackable/hooks'
// import { ColorIndicator, ColorPicker } from '@wordpress/components'

// const saveTimeout = null

const ColorSchemePicker = props => {
	const ref = useRef()
	const {
		colorSchemes,
	} = useSelect( select => {
		const { colorSchemes: _colorSchemes } = select( 'stackable/global-color-schemes' ).getSettings()
		return {
			colorSchemes: cloneDeep( _colorSchemes ),
		}
	} )

	const [ currentHoverState ] = useBlockHoverState( { forceUpdateHoverState: true } )

	const {
		itemInEdit,
		setItemInEdit,
	} = props

	const currentState = `desktop${ hoverState[ currentHoverState ] }`

	const defaultPreviewColors = item => {
		return {
			'background-color': item.key === 'scheme-default-2' ? 'var(--stk-block-background-color)' : '#fff',
			'heading-color': '',
			'text-color': '',
			'button-color': 'var(--stk-button-background-color)',
			'button-outline-color': 'var(--stk-button-background-color)',
		}
	}
	// const updateColorSchemes = newColorSchemes => {
	// }

	// Called when updating a color.
	// const onChangeColorScheme = colorScheme => {
	// 	console.log( 'change', colorScheme )
	// }

	// // Called when deleting a color.
	// const onColorSchemeDelete = colorScheme => {
	// 	// console.log( 'delete', colorScheme )
	// }

	// Called when adding a new color.
	// const handleAddIcon = () => {
	// 	console.log( 'add' )
	// }

	// const onSortEnd = ( {
	// 	oldIndex, newIndex, setIsSorting,
	// } ) => {
	// 	console.log( 'sort end' )
	// 	setIsSorting( false )
	//   }

	  const ItemPreview = ( { item, withWrapper = false } ) => {
		const defaults = defaultPreviewColors( item )

		// console.log( 'item', item )
		const backgroundColorStyle = {
			backgroundColor: `${ item.color_scheme[ 'background-color' ].desktop !== '' ? item.color_scheme[ 'background-color' ].desktop : defaults[ 'background-color' ] }`,
		}
		// console.log( 'background', backgroundColorStyle )
		const content = <>
			<div
				className="stk-global-color-scheme__preview__background"
				style={ backgroundColorStyle }>
				<div className="stk-global-color-scheme__preview__typography">
					<span style={ {
						color: item.color_scheme[ 'heading-color' ].desktop || defaults[ 'heading-color' ],
					} }>A</span>
					<span style={ {
						color: item.color_scheme[ 'text-color' ].desktop || defaults[ 'text-color' ],
					} }>a</span>
				</div>
				<div>
					<div
						className="stk-global-color-scheme__preview__button"
						style={ {
							backgroundColor: item.color_scheme[ 'button-color' ].desktop || defaults[ 'button-color' ],
						} }
					/>
					<div
						className="stk-global-color-scheme__preview__button"
						style={ {
							borderStyle: 'solid',
							borderWidth: '1px',
							borderColor: item.color_scheme[ 'button-outline-color' ].desktop || defaults[ 'button-outline-color' ],
						} }
					/>
				</div>
			</div>
		</>

		return withWrapper ? <div
			className="stk-global-color-scheme__preview-wrapper"
			style={ backgroundColorStyle }
		> { content } </div> : content
	  }

	  const buttonOnClick = item => {
		setItemInEdit( item )
		// console.log( 'selected', item )
	  }

	  const onBack = () => {
		setItemInEdit( null )
	  }

	// return null
	return ( ! itemInEdit ? <SortablePicker
		ref={ ref }
		{ ...props }
		className="stk-global-color-scheme-picker"
		// items={ colorSchemes }
		nonSortableItems={ colorSchemes }
		editableName={ false }
		// onChangeItem={ onChangeColorScheme }
		// onDeleteItem={ onColorSchemeDelete }
		// handleAddItem={ handleAddIcon }
		// onSortEnd={ onSortEnd }
		ItemPreview={ ItemPreview }
		ItemPicker={ null }
		buttonClassName="stk-global-color-scheme__color-scheme-item"
		enableAddItem={ false }
		buttonOnClick={ buttonOnClick }
	/> : <>
		<InspectorSubHeader
			title={ __( 'Editing Color Scheme', i18n ) }
			onBack={ onBack }
		/>
		<div className="stk-global-color-scheme__edit-panel-preview">
			<p> { __( 'Editing this scheme will also change all blocks that currently use this color scheme.', i18n ) } </p>

			<ItemPreview item={ itemInEdit } withWrapper={ true } />
			<AdvancedTextControl
				label={ __( 'Color Scheme Name', i18n ) }
				hasPanelModifiedIndicator={ false }
				value={ itemInEdit?.name }
				onChange={ () => {} }
				allowReset={ false }
			/>
		</div>
		<ColorPaletteControl
			value={ itemInEdit?.color_scheme[ 'background-color' ][ currentState ] }
			label={ __( 'Background Color', i18n ) }
			onChange={ color => {
				// console.log( color )
				const currentItem = { ...itemInEdit }
				currentItem.color_scheme[ 'background-color' ][ currentState ] = color

				setItemInEdit( currentItem )
			} }
			hover="all"
			help={ __( 'Note: Background color is not used for Base Color Scheme.', i18n ) }
		/>
		<ColorPaletteControl
			label={ __( 'Heading Color', i18n ) }
			onChange={ () => {} }
			hover="all"
		/>
		<ColorPaletteControl
			label={ __( 'Text Color', i18n ) }
			onChange={ () => {} }
			hover="all"
		/>
		<ColorPaletteControl
			label={ __( 'Link Color', i18n ) }
			onChange={ () => {} }
			hover="all"
		/>
		<ColorPaletteControl
			label={ __( 'Accent Color', i18n ) }
			onChange={ () => {} }
			hover="all"
		/>
		<ColorPaletteControl
			label={ __( 'Button Color', i18n ) }
			onChange={ () => {} }
			hover="all"
		/>
		<ColorPaletteControl
			label={ __( 'Button Text Color', i18n ) }
			onChange={ () => {} }
			hover="all"
		/>
		<ColorPaletteControl
			label={ __( 'Button Outline Color', i18n ) }
			onChange={ () => {} }
			hover="all"
		/>
	</>
	)
}

ColorSchemePicker.defaultProps = {
	className: '',
	label: '',
	onReset: () => {},
}

export default ColorSchemePicker
