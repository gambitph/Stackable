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
import classnames from 'classnames'
import { cloneDeep } from 'lodash'
import { i18n } from 'stackable'
import { Button } from '~stackable/components'
import {
	sortableContainer, sortableElement, sortableHandle,
} from 'react-sortable-hoc'

/**
 * WordPress dependencies
 */
import {
	ColorPicker,
	BaseControl,
	ColorIndicator,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalHStack as HStack,
	Dashicon,
	Dropdown,
} from '@wordpress/components'
import { useState, useRef } from '@wordpress/element'
import {
	select, dispatch, useSelect,
} from '@wordpress/data'
import { models } from '@wordpress/api'
import { __, sprintf } from '@wordpress/i18n'

const popoverProps = {
	placement: 'left-start',
	offset: 36,
	shift: true,
}

// We need to define these because 13 (return key) is not included in the
// default keyCodes to initiate a drag.
const DRAG_KEYCODES = {
	lift: [ 32, 13 ],
	drop: [ 32, 13 ],
	cancel: [ 27 ],
	up: [ 38, 37 ],
	down: [ 40, 39 ],
}

let saveTimeout = null

const ColorPickers = props => {
	const [ isSorting, setIsSorting ] = useState( false )
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

	const onSortEnd = ( { oldIndex, newIndex } ) => {
		const updatedColors = cloneDeep( colors )
		// Move the color to the new index.
		updatedColors.splice( newIndex, 0, updatedColors.splice( oldIndex, 1 )[ 0 ] )

		updateColors( updatedColors )
		setIsSorting( false )
	  }

	const classNames = classnames(
		'ugb-global-settings-color-picker',
		'components-circular-option-picker',
		'editor-color-palette-control__color-palette',
		props.className
	)

	return (
		<BaseControl className={ classNames } label={ props.label }>
			<Button
				className="ugb-global-settings-color-picker__add-button"
				onClick={ handleAddIcon }
				icon="plus-alt2"
			/>
			<div
				ref={ ref }
				className={ classnames(
					'ugb-global-settings-color-picker__color-indicators',
					{ 'is-sorting': isSorting }
				) }
			>
				<SortableContainer
					items={ colors }
					onSortStart={ () => setIsSorting( true ) }
					onSortEnd={ onSortEnd }
					axis="y"
					useDragHandle
					keyCodes={ DRAG_KEYCODES }
				>
					{ colors.map( ( color, i ) => (
						<SortableItem
							key={ i }
							index={ i }
							color={ color }
							onDelete={ () => onColorDelete( color ) }
							onChange={ color => onChangeColor( color ) }
						/> ) ) }
				</SortableContainer>
			</div>
		</BaseControl>
	)
}

ColorPickers.defaultProps = {
	className: '',
	label: '',
	onReset: () => {},
}

export default ColorPickers

const SortableItem = sortableElement( props => <LabeledColorIndicator { ...props } /> )

const SortableContainer = sortableContainer( ( { children } ) => {
	return <div>{ children }</div>
} )

const DragHandle = sortableHandle( () => <Dashicon
	icon="menu"
	size="16"
	tabIndex="0"
/> )

const LabeledColorIndicator = props => {
	const {
		color,
		onDelete,
		onChange,
	} = props

	const [ isFocused, setIsFocused ] = useState( false )

	return (
		<HStack justify="space-between" className="stk-global-settings-color-picker__color-indicator-wrapper">
			<Dropdown
				popoverProps={ popoverProps }
				// This is so that when we click on the label to edit it, the input doesn't lose focus.
				focusOnMount={ ! isFocused ? 'firstElement' : false }
				renderToggle={ ( { onToggle, isOpen } ) => {
					return (
						<Button
							className="block-editor-panel-color-gradient-settings__dropdown"
							onClick={ () => {
								if ( ! isFocused ) {
									onToggle()
								}
							} }
							isPressed={ isOpen }
						>
							<HStack justify="flex-start">
								<ColorIndicator
									className="stk-color-indicator block-editor-panel-color-gradient-settings__color-indicator"
									colorValue={ color.color }
								/>
								<input
									className="components-input-control__input"
									value={ color.name }
									onChange={ ev => {
										onChange( {
											...color,
											name: ev.target.value,
										} )
									} }
									onFocus={ () => setIsFocused( true ) }
									onBlur={ ev => {
										setIsFocused( false )
										if ( isOpen && ! ev.relatedTarget?.closest( '.components-popover' ) ) {
											onToggle()
										}
									} }
									onClick={ () => {
										if ( ! isOpen ) {
											onToggle()
										}
									} }
									onKeyDown={ ev => {
										// On enter, blur the input.
										if ( ev.keyCode === 13 ) {
											ev.target.blur()
										}
									} }
								/>
								<DragHandle />
							</HStack>
						</Button>
					)
				} }
				renderContent={ () => (
					<div className="stk-color-palette-control__popover-content">
						<ColorPicker
							onChange={ value => onChange( {
								...color,
								color: value,
							} ) }
							color={ color.color }
							enableAlpha={ true }
						/>
					</div>
				) }
			/>
			<Button
				className="stk-global-settings-color-picker__delete-button"
				icon="trash"
				isSmall
				isTertiary
				onClick={ onDelete }
			/>
		</HStack>
	)
}
