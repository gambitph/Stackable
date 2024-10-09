/**
 * External dependencies
 */
import classnames from 'classnames'
import { Button } from '~stackable/components'
import {
	sortableContainer, sortableElement, sortableHandle,
} from 'react-sortable-hoc'

/**
 * WordPress dependencies
 */
import {
	BaseControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalHStack as HStack,
	Dashicon,
	Dropdown,
} from '@wordpress/components'
import { useState } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

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

const SortablePicker = props => {
	const {
		items,
		dropdownOnAdd = false,
		onChangeItem,
		onDeleteItem,
		handleAddItem,
		onSortEnd,
		AddItemPopover = null,
		ref,
	} = props
	const [ isSorting, setIsSorting ] = useState( false )

	const classNames = classnames(
		'ugb-global-settings-color-picker',
		'components-circular-option-picker',
		'editor-color-palette-control__color-palette',
		props.className
	)

	return (
		<BaseControl className={ classNames } label={ props.label }>
			<Dropdown
				renderToggle={ ( { onToggle, isOpen } ) => (
					<Button
						className="ugb-global-settings-color-picker__add-button"
						onClick={ dropdownOnAdd ? onToggle : handleAddItem }
						icon="plus-alt2"
						aria-expanded={ isOpen }
					/>
				) }
				renderContent={ ( { onClose } ) => (
					<AddItemPopover onClose={ onClose } onChange={ handleAddItem } />
				) }
			/>
			<div
				ref={ ref }
				className={ classnames(
					'ugb-global-settings-color-picker__color-indicators',
					{ 'is-sorting': isSorting }
				) }
			>
				<SortableContainer
					items={ items }
					onSortStart={ () => setIsSorting( true ) }
					onSortEnd={ ( { oldIndex, newIndex } ) => onSortEnd( {
						oldIndex, newIndex, setIsSorting,
					} ) }
					axis="y"
					useDragHandle
					keyCodes={ DRAG_KEYCODES }
				>
					{ items.map( ( item, i ) => (
						<SortableItem
							key={ i }
							index={ i }
							item={ item }
							onDelete={ () => onDeleteItem( item ) }
							onChange={ item => onChangeItem( item ) }
							ItemPreview={ props.ItemPreview }
							ItemPicker={ props.ItemPicker }
						/> ) ) }
				</SortableContainer>
			</div>
		</BaseControl>
	)
}

SortablePicker.defaultProps = {
	className: '',
	label: '',
	onReset: () => {},
}

export default SortablePicker

const SortableItem = sortableElement( props => <LabeledItemIndicator { ...props } /> )

const SortableContainer = sortableContainer( ( { children } ) => {
	return <div>{ children }</div>
} )

const DragHandle = sortableHandle( () => <Dashicon
	icon="menu"
	size="16"
	tabIndex="0"
/> )

const LabeledItemIndicator = props => {
	const {
		item,
		onDelete,
		onChange,
		ItemPreview = null,
		ItemPicker = null,

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
								<ItemPreview item={ item } />
								<input
									className="components-input-control__input"
									value={ item.name }
									onChange={ ev => {
										onChange( {
											...item,
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
						<ItemPicker item={ item } onChange={ onChange } />
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
