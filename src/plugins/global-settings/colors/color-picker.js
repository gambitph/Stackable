/**
 * External dependencies
 */
import classnames from 'classnames'
import { cloneDeep, debounce } from 'lodash'
import { i18n } from 'stackable'
import { whiteIfDark } from '~stackable/util'

/**
 * Wordpress dependencies
 */
import {
	Button, ColorPicker, Popover, BaseControl, ButtonGroup,
} from '@wordpress/components'
import {
	Fragment, useState, useMemo,
} from '@wordpress/element'
import {
	select, dispatch, useSelect,
} from '@wordpress/data'
import { doAction } from '@wordpress/hooks'
import { __, sprintf } from '@wordpress/i18n'

/**
 * Internal dependencies
 */
import { AddIcon, LockIcon } from './icons'

// Component used to add a style name field at the bottom of the ColorPicker.
const ColorPickerTextArea = props => (
	<div className="ugb-global-settings-color-picker__text-name components-color-picker__body">
		<div className="components-color-picker__controls">
			<div className="components-color-picker__inputs-wrapper">
				<div className="components-color-picker__inputs-fields">
					<BaseControl
						id="color-picker-text-name"
						className="components-color-picker__input-field"
						label={ __( 'Style name', i18n ) }
					>
						<input
							className="components-text-control__input"
							id="color-picker-text-name"
							onChange={ event => props.onChange( event.target.value ) }
							value={ props.value }
						/>
					</BaseControl>
				</div>
			</div>
		</div>
	</div>
)

ColorPickerTextArea.defaultProps = {
	value: '',
	onChange: () => {},
}

// Component used to add a Delete Style button at the bottom of the ColorPicker.
const DeleteButton = props => {
	const [ isDeletePopoverOpen, setIsDeletePopoverOpen ] = useState( false )

	return (
		<Fragment>
			<Button
				isLink
				isDestructive
				onClick={ () => setIsDeletePopoverOpen( toggle => ! toggle ) }
				disabled={ props.disabled }
			>
				{ __( 'Delete color', i18n ) }
			</Button>
			{ isDeletePopoverOpen && (
				<Popover
					className="components-dropdown__content"
					focusOnMount={ false }
					onFocusOutside={ () => setIsDeletePopoverOpen( false ) }
					position="bottom center"
				>
					<h4 className="ugb-global-settings-color-picker__title">
						{ sprintf( __( 'Delete "%s"', i18n ), props.name ) }
					</h4>
					<p className="components-base-control__help">
						{ __( 'Any blocks that use this color will become unlinked with this global color. Delete this color?', i18n ) }
					</p>
					<ButtonGroup>
						<Button
							onClick={ () => {
								setIsDeletePopoverOpen( false )
								props.onClick()
							} }
							isDestructive
							isSecondary
							isSmall
						>
							{ __( 'Delete', i18n ) }
						</Button>
						<Button
							onClick={ () => setIsDeletePopoverOpen( false ) }
							isSmall
						>
							{ __( 'Cancel', i18n ) }
						</Button>
					</ButtonGroup>
				</Popover>
			) }
		</Fragment>
	)
}

// Component used to add am add icon button.
const AddButton = props => (
	<Button
		{ ...props }
		isSecondary
		className="ugb-global-settings-color-picker__add-icon"
		label={ __( 'Add New Color', i18n ) }
		icon={ <AddIcon /> }
	/>
)

// Component used to add a reset icon button.
const ResetButton = props => {
	const [ isResetPopoverOpen, setIsResetPopoverOpen ] = useState( false )

	return (
		<div className="ugb-global-settings-color-picker__reset-button">
			<Button
				onMouseDown={ () => setIsResetPopoverOpen( toggle => ! toggle ) }
				disabled={ props.disabled }
				isSecondary
				isSmall
			>
				{ __( 'Reset', i18n ) }
			</Button>
			{ isResetPopoverOpen && (
				<Popover
					className="components-dropdown__content"
					focusOnMount={ false }
					onFocusOutside={ () => setIsResetPopoverOpen( false ) }
					position="bottom center"
				>
					<h4 className="ugb-global-settings-color-picker__title">
						{ __( 'Reset Color Palette', i18n ) }
					</h4>
					<p className="components-base-control__help">
						{ __( 'Resetting the global colors will revert all colors to its original color palette. Any added colors will be deleted and will become unlinked. Proceed?', i18n ) }
					</p>
					<ButtonGroup>
						<Button
							onClick={ () => {
								props.onClick()
								setIsResetPopoverOpen( false )
							} }
							isDestructive
							isSecondary
							isSmall
						>
							{ __( 'Reset', i18n ) }
						</Button>
						<Button
							onClick={ () => setIsResetPopoverOpen( false ) }
							isSmall
						>
							{ __( 'Cancel', i18n ) }
						</Button>
					</ButtonGroup>
				</Popover>
			) }
		</div>
	)
}

const ColorOption = props => {
	const {
		color,
		name,
	} = props

	if ( props.locked ) {
		return (
			<div className="components-circular-option-picker__option-wrapper ugb-global-settings__color-picker-disabled-color">
				<div className="components-circular-option-picker__option" style={ { backgroundColor: color, color } }>
					<LockIcon color={ whiteIfDark( null, color ) || '#222222' } />
				</div>
			</div>
		)
	}

	return (
		<Fragment>
			<div className="components-circular-option-picker__option-wrapper">
				<Button
					className="components-circular-option-picker__option"
					label={ name }
					style={ { backgroundColor: color, color } }
					onMouseDown={ () => props.onClick( color ) }
				/>
				{ props.children }
			</div>
		</Fragment>
	)
}

ColorOption.defaultProps = {
	color: '#222222',
	name: __( 'Untitled Color', i18n ),
	locked: false,
	onClick: () => {},
}

const ColorPickers = ( {
	colors,
} ) => {
	// State used to determine the clicked index in the color picker.
	const [ selectedIndex, setSelectedIndex ] = useState( null )

	// Enable reset if there are Stackable global colors.
	const disableReset = useMemo( () => ! colors.some( color => color.slug && color.slug.includes( 'stk-global-color' ) ), [ colors ] )

	/**
	 * Function used to update the colors in @wordpress/data,
	 *
	 * @param {Array} updatedColors colors passed.
	 */
	const updateColors = updatedColors => {
		dispatch( 'core/block-editor' ).updateSettings( {
			colors: updatedColors,
		} )
	}

	// Called when updating a color.
	const onChangeColor = data => {
		const { colors: updatedColors } = cloneDeep( select( 'core/block-editor' ).getSettings() )

		// Overwrite the selected color to a new color.
		updatedColors[ selectedIndex ].color = data.hex

		// Update the colors.
		updateColors( updatedColors )
	}

	// Called when updating a style name.
	const onChangeStyleName = value => {
		const { colors: updatedColors } = cloneDeep( select( 'core/block-editor' ).getSettings() )

		// Overwrite the selected style name and slug to a new style name and slug.
		updatedColors[ selectedIndex ].name = value

		// Update the colors.
		updateColors( updatedColors )
	}

	// Called when deleting a color.
	const onColorDelete = () => {
		const { colors: updatedColors } = cloneDeep( select( 'core/block-editor' ).getSettings() )

		// Delete the specific color based on the selected index.
		updatedColors.splice( selectedIndex, 1 )

		/**
		 * Revert the global color attributes to hex color.
		 *
		 * @see global-settings/colors
		 */
		doAction( 'stackable.global-colors.reset-compatibility', [ colors[ selectedIndex ] ] )

		// Update the colors.
		updateColors( updatedColors )
		setSelectedIndex( null )
	}

	// Called when the user decided to reset the color palette.
	const onColorPaletteReset = () => {
		const {
			 colors,
		} = cloneDeep( select( 'core/block-editor' ).getSettings() )
		const { defaultColors, useStackableColorsOnly } = cloneDeep( select( 'stackable/global-colors' ).getSettings() )

		/**
		 * Compability adjustment for stackable and native blocks.
		 *
		 * @see global-settings/colors
		 */
		doAction( 'stackable.global-colors.reset-compatibility', colors )

		// Update the colors
		updateColors( useStackableColorsOnly ? [] : defaultColors )
	}

	// Called when adding a new color.
	const handleAddIcon = () => {
		const newIndex = ( colors && Array.isArray( colors ) ) ? colors.length + 1 : 1
		const slugId = Math.floor( Math.random() * new Date().getTime() ) % 100000

		// Generate a new random color since having 2 same colors in the color picker messes up the selection.
		const color = `#${ ( ( 1 << 24 ) * Math.random() | 0 ).toString( 16 ) }` // eslint-disable-line no-bitwise

		const updatedColors = [
			...select( 'core/block-editor' ).getSettings().colors,
			{
				name: sprintf( __( 'Custom Color %s', i18n ), newIndex ), slug: `stk-global-color-${ slugId }`, color,
			},
		]

		// Update the colors.
		updateColors( updatedColors )

		setSelectedIndex( newIndex - 1 )
	}

	return (
		<BaseControl>
			<ResetButton onClick={ onColorPaletteReset } disabled={ disableReset } />
			{ colors.map( ( color, index ) => {
				return (
					<ColorOption
						key={ index }
						color={ color.color }
						name={ color.name }
						locked={ ! color.slug.match( /^stk-/ ) }
						onClick={ () => setSelectedIndex( index ) }
					>
						{ selectedIndex === index &&
							<Popover
								className="components-dropdown__content"
								onFocusOutside={ () => setSelectedIndex( null ) }
							>
								<ColorPicker
									color={ color.color }
									onChangeComplete={ onChangeColor }
									disableAlpha
								/>
								<ColorPickerTextArea
									onChange={ onChangeStyleName }
									value={ color.name || '' }
								/>
								<div className="ugb-global-settings-color-picker__text-name components-color-picker__body">
									<div className="components-color-picker__controls">
										<DeleteButton
											name={ color.name }
											onClick={ onColorDelete }
										/>
									</div>
								</div>
							</Popover>
						}
					</ColorOption>
				)
			} ) }
			<AddButton onClick={ handleAddIcon } />
		</BaseControl>
	)
}

ColorPickers.defaultProps = {
	colors: [],
}

const debouncedDoAction = debounce( doAction, 100 )

const ColorPickerContainer = props => {
	const classNames = classnames(
		'ugb-global-settings-color-picker',
		'components-circular-option-picker',
		'editor-color-palette-control__color-palette',
		props.className
	)

	const { colors } = useSelect( select => select( 'core/block-editor' ).getSettings() )

	// Update the global colors in the models settings.
	debouncedDoAction( 'stackable.global-colors.save-model-settings', colors )

	return (
		<div className={ classNames }>
			<ColorPickers
				colors={ colors || [] }
			/>
		</div>
	)
}

ColorPickerContainer.defaultProps = {
	className: '',
}

export default ColorPickerContainer
