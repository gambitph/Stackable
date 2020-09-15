/**
 * External dependencies
 */
import classnames from 'classnames'
import { cloneDeep } from 'lodash'
import md5 from 'md5'
import { i18n } from 'stackable'
import { whiteIfDark } from '~stackable/util'

/**
 * Wordpress dependencies
 */
import {
	Button, ColorPicker, Popover, BaseControl, ButtonGroup,
} from '@wordpress/components'
import {
	Fragment, useState, useRef,
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
						id={ props.id || 'text-area' }
						className="components-color-picker__input-field"
						label={ __( 'Style name', i18n ) }>
						<input
							className="components-text-control__input"
							{ ...props }
							id={ props.id || 'text-area' }
							onChange={ event => props.onChange && props.onChange( event.target.value ) }
						/>
					</BaseControl>
				</div>
			</div>
		</div>
	</div>
)

// Component used to add a Delete Style button at the bottom of the ColorPicker.
const DeleteButton = props => {
	const [ isDeletePopoverOpen, setIsDeletePopoverOpen ] = useState( false )
	const deleteButtonRef = useRef( null )

	const handleDelete = () => {
		setIsDeletePopoverOpen( toggle => ! toggle )
	}

	const onClickOutside = event => {
		if ( deleteButtonRef && event.target !== deleteButtonRef.current ) {
			setIsDeletePopoverOpen( false )
		}
	}

	return (
		<Fragment>
			<Button
				ref={ deleteButtonRef }
				className="ugb-global-settings-color-picker__delete-button-text"
				isLink
				onClick={ handleDelete }
				disabled={ props.disabled }
			>
				{ __( 'Delete color', i18n ) }
			</Button>
			{ isDeletePopoverOpen && (
				<Popover
					anchorRef={ deleteButtonRef.current }
					onClickOutside={ onClickOutside }
					position="bottom center"
				>
					<div className="components-color-picker__body">
						<div className="ugb-global-settings-color-picker__popover-text is-red">
							{ __( 'Delete', i18n ) } { ` "${ props.name }"` }
						</div>
						<div className="ugb-global-settings-color-picker__popover-text">
							{ __( 'Any blocks that use this color will become unlinked with this global color. Delete this color?', i18n ) }
						</div>
						<div className="components-color-picker__controls">
							<ButtonGroup>
								<Button
									className="ugb-global-settings-color-picker__delete-button"
									onClick={ props.onClick }
									isDestructive
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
						</div>
					</div>
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
		label="Add New Color"
		icon={ <AddIcon /> }
	/>
)

// Component used to add a reset icon button.
const ResetButton = props => {
	const [ isResetPopoverOpen, setIsResetPopoverOpen ] = useState( false )
	// State used to control the busy indicator in the reset button.
	const [ isBusyResetButton, setIsBusyResetButton ] = useState( false )

	const resetButtonRef = useRef( null )

	const handleReset = () => {
		setIsResetPopoverOpen( toggle => ! toggle )
	}

	const onClickOutside = event => {
		if ( resetButtonRef && event.target !== resetButtonRef.current ) {
			setIsResetPopoverOpen( false )
		}
	}
	return (
		<div className="ugb-global-settings-color-picker__reset-button">
			<Button
				ref={ resetButtonRef }
				onClick={ handleReset }
				disabled={ props.disabled }
				isDefault
				isSmall
			>
				{ __( 'Reset', i18n ) }
			</Button>
			{ isResetPopoverOpen && (
				<Popover
					anchorRef={ resetButtonRef.current }
					onClickOutside={ onClickOutside }
					position="bottom center"
				>
					<div className="components-color-picker__body">
						<div className="ugb-global-settings-color-picker__popover-text is-red">
							{ __( 'Reset Color Palette', i18n ) }
						</div>
						<div className="ugb-global-settings-color-picker__popover-text">
							{ __( 'Resetting the global colors will revert all colors to its original color palette. Any added colors will be deleted and will become unlinked. Proceed?', i18n ) }
						</div>
						<div className="components-color-picker__controls">
							<ButtonGroup>
								<Button
									onClick={ () => {
										props.onClick( setIsResetPopoverOpen, setIsBusyResetButton )
									} }
									disabled={ props.disabled }
									isBusy={ isBusyResetButton }
									isDefault
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
						</div>
					</div>
				</Popover>
			) }
		</div>
	)
}

const ColorOption = props => {
	const {
		color,
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
					label={ color.name }
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
	const disableReset = ! colors.some( color => color.slug && color.slug.includes( 'stk-global-color' ) )

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
		const { colorVar: existingColorVar } = updatedColors[ selectedIndex ]
		const colorVar = `--stk-global-color-${ md5( Math.floor( Math.random() * new Date().getTime() ) ).substr( 0, 5 ) }`

		// Overwrite the selected color to a new color.
		updatedColors[ selectedIndex ].color = data.hex

		// Add a fallback and colorVar if not exists.
		updatedColors[ selectedIndex ].colorVar = existingColorVar || colorVar

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

		// Update the colors.
		updateColors( updatedColors )
	}

	// Called when the user decided to reset the color palette.
	const onColorPaletteReset = ( setIsResetPopoverOpen, setIsBusyResetButton ) => {
		setIsBusyResetButton( true )
		const {
			defaultColors, colors, useStackableColorsOnly,
		} = cloneDeep( select( 'core/block-editor' ).getSettings() )
		const blocks = select( 'core/block-editor' ).getBlocks()

		/**
		 * Compability adjustment for stackable and other blocks.
		 *
		 * @see global-settings/colors
		 */
		doAction( 'stackable.global-settings.reset-compatibility', blocks, colors )

		// Update the colors
		updateColors( useStackableColorsOnly ? [] : defaultColors )
		setIsResetPopoverOpen( false )
		setIsBusyResetButton( false )
	}

	// Called when adding a new color.
	const handleAddIcon = () => {
		const newIndex = ( colors && Array.isArray( colors ) ) ? colors.length + 1 : 1
		const __id = md5( Math.floor( Math.random() * new Date().getTime() ) ).substr( 0, 5 )
		const slugId = Math.floor( Math.random() * new Date().getTime() )
		const colorVar = `--stk-global-color-${ __id }`

		const updatedColors = [
			...select( 'core/block-editor' ).getSettings().colors,
			{
				name: sprintf( __( 'Custom Color %s', i18n ), newIndex ), slug: `stk-global-color-${ slugId }`, color: '#000000', colorVar,
			},
		]

		// Update the colors.
		updateColors( updatedColors )

		setSelectedIndex( newIndex - 1 )
	}

	return (
		<Fragment>
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
								className="ugb-global-settings-color-picker__popup components-dropdown__content"
								onFocusOutside={ () => setSelectedIndex( null ) }
							>
								<ColorPicker
									color={ color.color }
									onChangeComplete={ onChangeColor }
									disableAlpha
								/>
								<ColorPickerTextArea
									id="color-picker-text-name"
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
		</Fragment>
	)
}

ColorPickers.defaultProps = {
	colors: [],
}

const ColorPickerContainer = props => {
	const classNames = classnames(
		'ugb-global-settings-color-picker',
		'components-circular-option-picker',
		'editor-color-palette-control__color-palette',
		props.className
	)

	const { colors } = useSelect( select => select( 'core/block-editor' ).getSettings() )

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
