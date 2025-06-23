/**
 * Internal dependencies
 */
import {
	getRgb,
	createColor,
	convertGlobalColorBlockAttributesToStatic,
} from './util'

/**
 * External dependencies
 */
import { cloneDeep } from 'lodash'
import { i18n } from 'stackable'
import { SortablePicker } from '~stackable/components'

import { useRef } from '@wordpress/element'
import {
	select, dispatch, useSelect,
} from '@wordpress/data'
import { models } from '@wordpress/api'
import { __, sprintf } from '@wordpress/i18n'
import { ColorIndicator, ColorPicker } from '@wordpress/components'

let saveTimeout = null

const ColorPickers = props => {
	const ref = useRef()
	const {
		colors,
	} = useSelect( select => {
		const stkSettings = select( 'stackable/global-colors' ).getSettings()
		return {
			colors: cloneDeep( stkSettings.stackableColors ),
		}
	} )

	/**
	 * Function used to update the colors in @wordpress/data,
	 *
	 * @param {Array} newColors colors passed.
	 */
	const updateColors = newColors => {
		// NOTE: Removed this because it is slow to update all blocks.
		// Update the blocks in our page.
		// updateFallbackBlockAttributes( newColors )

		// Save settings.
		clearTimeout( saveTimeout )
		saveTimeout = setTimeout( () => {
			const settings = new models.Settings( { stackable_global_colors: [ newColors ] } ) // eslint-disable-line camelcase
			settings.save()
		}, 300 )

		// Update our store.
		dispatch( 'stackable/global-colors' ).updateSettings( {
			stackableColors: newColors,
		} )
	}

	// Called when updating a color.
	const onChangeColor = color => {
		const updatedColors = cloneDeep( colors )

		const selectedIndex = colors.findIndex( c => c.slug === color.slug )
		updatedColors[ selectedIndex ] = { ...color }

		// Update the colors.
		updateColors( updatedColors )
	}

	// Called when deleting a color.
	const onColorDelete = color => {
		// Open a confirm box
		// eslint-disable-next-line no-alert
		const confirmDelete = window.confirm( __( 'Any blocks that use this color will become unlinked with this global color. Delete this color?', i18n ) )
		if ( ! confirmDelete ) {
			return
		}

		const selectedIndex = colors.findIndex( c => c.slug === color.slug )
		const updatedColors = cloneDeep( colors )

		// Delete the specific color based on the selected index.
		updatedColors.splice( selectedIndex, 1 )

		// Revert the global color attributes to hex color.
		convertGlobalColorBlockAttributesToStatic( [ colors[ selectedIndex ] ] )

		// Update the colors.
		updateColors( updatedColors )
	}

	// Called when adding a new color.
	const handleAddIcon = () => {
		const newIndex = ( colors && Array.isArray( colors ) ) ? colors.length + 1 : 1
		const slugId = Math.floor( Math.random() * new Date().getTime() ) % 100000
		const color = createColor()

		const updatedColors = [
			...select( 'stackable/global-colors' ).getSettings().stackableColors,
			{
				name: sprintf( __( 'Custom Color %s', i18n ), newIndex ),
				slug: `stk-global-color-${ slugId }`,
				color,
				rgb: getRgb( color ),
			},
		]

		// Update the colors.
		updateColors( updatedColors )

		// Open the new color picker.
		setTimeout( () => {
			ref.current?.querySelector( '.stk-global-settings-color-picker__color-indicator-wrapper:last-child .block-editor-panel-color-gradient-settings__dropdown' )?.click()
		}, 1 )
	}

	const onSortEnd = ( {
		oldIndex, newIndex, setIsSorting,
	} ) => {
		const updatedColors = cloneDeep( colors )
		// Move the color to the new index.
		updatedColors.splice( newIndex, 0, updatedColors.splice( oldIndex, 1 )[ 0 ] )

		updateColors( updatedColors )
		setIsSorting( false )
	  }

	  const ItemPreview = ( { item } ) => {
		return <ColorIndicator
			className="stk-color-indicator block-editor-panel-color-gradient-settings__color-indicator"
			colorValue={ item.color }
		/>
	  }

	  const ItemPicker = ( { item, onChange } ) => {
		return <div className="stk-color-palette-control__popover-content">
			<ColorPicker
				onChange={ value => onChange( {
					...item,
					color: value,
				} ) }
				color={ item.color }
				enableAlpha={ true }
			/>
		</div>
	  }

	return (
		<SortablePicker
			ref={ ref }
			items={ colors }
			itemType="color"
			onChangeItem={ onChangeColor }
			onDeleteItem={ onColorDelete }
			handleAddItem={ handleAddIcon }
			onSortEnd={ onSortEnd }
			ItemPreview={ ItemPreview }
			ItemPicker={ ItemPicker }
			{ ...props }
		/>
	)
}

ColorPickers.defaultProps = {
	className: '',
	label: '',
	onReset: () => {},
}

export default ColorPickers
