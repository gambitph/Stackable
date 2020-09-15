/**
 * External dependencies
 */
import classnames from 'classnames'
import {
	cloneDeep, inRange, findIndex, isEqual,
} from 'lodash'
import md5 from 'md5'
import { i18n } from 'stackable'
import rgba from 'color-rgba'

/**
 * Wordpress dependencies
 */
import {
	Button, ColorPicker, Popover, BaseControl, ButtonGroup,
} from '@wordpress/components'
import {
	Fragment, useState, useEffect, useRef,
} from '@wordpress/element'
import {
	select, dispatch, useSelect,
} from '@wordpress/data'
import { doAction } from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'
import { loadPromise, models } from '@wordpress/api'

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

// Component used to add a Reset Button for Individual Colors
const ResetColorButton = props => {
	const [ isResetPopoverOpen, setIsResetPopoverOpen ] = useState( false )
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
		<Fragment>
			<Button
				ref={ resetButtonRef }
				onClick={ handleReset }
				isDefault
				isSmall
				disabled={ props.disabled }
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
							{ __( 'Reset', i18n ) } { ` ${ props.name }` }
						</div>
						<div className="ugb-global-settings-color-picker__popover-text">
							{ __( 'This color will revert to its default color. Proceed?', i18n ) }
						</div>
						<div className="components-color-picker__controls">
							<ButtonGroup>
								<Button
									onClick={ () => {
										props.onClick()
										setIsResetPopoverOpen( false )
									} }
									disabled={ props.disabled }
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
		</Fragment>
	)
}

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
const AddIcon = props => (
	<Button
		{ ...props }
		isDefault
		className="ugb-global-settings-color-picker__add-icon"
		label="Add New Color"
		icon={
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 190">
				<polygon points="181.9,87.6 102.6,87.6 102.6,8.4 87.6,8.4 87.6,87.6 8.4,87.6 8.4,102.6 87.6,102.6 87.6,181.8 102.6,181.8 102.6,102.6 181.9,102.6 " />
			</svg>
		}
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

const ColorPickers = ( {
	colors,
} ) => {
	// We make sure that we are getting the latest state for default colors.
	const { defaultColors } = useSelect( select => select( 'core/block-editor' ).getSettings() )
	// State used to determine the clicked index in the color picker.
	const [ selectedIndex, setSelectedIndex ] = useState( null )
	// State used to control the popover when clicking a color.
	const [ isPopoverOpen, setIsPopOverOpen ] = useState( false )
	// State used to control the anchorRef of the Popover.
	const [ colorButtonAnchor, setColorButtonAnchor ] = useState( null )
	// State used to determine if a new color is added.
	const [ hasAddedNewColor, setHasAddedNewColor ] = useState( false )
	// State used to control the reset button.
	const [ disableReset, setDisableReset ] = useState( true )

	// Show reset button if necessary.
	useEffect( () => {
		const { colors } = select( 'core/block-editor' ).getSettings()
		if ( Array.isArray( defaultColors ) && Array.isArray( colors ) ) {
			// Get only the slug and colors.
			const compareDefaultColors = defaultColors.map( defaultColor => ( { color: defaultColor.color, slug: defaultColor.slug } ) )
			const compareColors = colors.map( color => ( { color: color.fallback || color.color, slug: color.slug } ) )
			if ( ! isEqual( compareDefaultColors, compareColors ) ) {
				setDisableReset( false )
			} else {
				setDisableReset( true )
			}
		}
	}, [ defaultColors, colors ] )

	// Set stackable_global_colors_has_modified to true if modified. Otherwise, false.
	useEffect( () => {
		const saveHasModified = setTimeout( () => {
			loadPromise.then( () => {
				const settings = new models.Settings( { stackable_global_colors_has_modified: ! disableReset } ) // eslint-disable-line camelcase
				settings.save()
			} )
		}, 100 )
		return () => clearTimeout( saveHasModified )
	}, [ disableReset ] )

	// If a new color is added, set the anchorRef to the new color element and open the Popover.
	useEffect( () => {
		if ( hasAddedNewColor ) {
			const colorPickerEl = document.querySelector( '.ugb-global-settings-color-picker' )
			if ( colorPickerEl ) {
				// Get the newly created color element/
				const newButtonAnchor = colorPickerEl.children[ selectedIndex - 1 ]
				if ( newButtonAnchor ) {
					setColorButtonAnchor( newButtonAnchor )
					setIsPopOverOpen( true )
					setHasAddedNewColor( false )
				}
			}
		}
	}, [ hasAddedNewColor ] )

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
		updatedColors[ selectedIndex ].color = existingColorVar ? `var(${ existingColorVar }, ${ data.hex })` : `var(${ colorVar }, ${ data.hex })`

		// Add a fallback and colorVar if not exists.
		updatedColors[ selectedIndex ].colorVar = existingColorVar || colorVar
		updatedColors[ selectedIndex ].fallback = data.hex

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

	// When the Popover is open, this handles the onClickOutside.
	const onClickOutside = event => {
		if ( event.target !== colorButtonAnchor ) {
			setIsPopOverOpen( false )
		}
	}

	// Called when deleting a color.
	const onColorDelete = () => {
		const { colors: updatedColors } = cloneDeep( select( 'core/block-editor' ).getSettings() )

		// Delete the specific color based on the selected index.
		updatedColors.splice( selectedIndex, 1 )

		// Update the colors.
		updateColors( updatedColors )

		setIsPopOverOpen( false )
	}

	// Called when the user decided to reset the color palette.
	const onColorPaletteReset = ( setIsResetPopoverOpen, setIsBusyResetButton ) => {
		setIsBusyResetButton( true )
		const { defaultColors, colors } = cloneDeep( select( 'core/block-editor' ).getSettings() )
		const blocks = select( 'core/block-editor' ).getBlocks()
		// Map through defaultColors and update its callback and colorVar
		const updatedColors = defaultColors.map( defaultColor => {
			const {
				name, slug, color: fallback,
			} = defaultColor
			const index = findIndex( colors, color => color.slug === defaultColor.slug )
			if ( index !== -1 ) {
				const {
					colorVar = `--stk-global-color-${ md5( Math.floor( Math.random() * new Date().getTime() ) ).substr( 0, 5 ) }`,
				} = colors[ index ]
				const color = `var(${ colorVar }, ${ fallback })`
				return {
					name,
					slug,
					colorVar,
					fallback,
					color,
				}
			}
			const colorVar = `--stk-global-color-${ md5( Math.floor( Math.random() * new Date().getTime() ) ).substr( 0, 5 ) }`
			return {
				name,
				slug,
				colorVar,
				fallback,
				color: `var(${ colorVar }, ${ fallback })`,
			}
		} )

		/**
		 * Compability adjustment for stackable and other blocks.
		 *
		 * @see global-settings/colors
		 */
		doAction( 'stackable.global-settings.reset-compatibility', blocks, colors, updatedColors )

		// Update the colors
		updateColors( updatedColors )
		setIsResetPopoverOpen( false )
		setIsBusyResetButton( false )
	}

	// Called when the user decided to reset a color.
	const onColorReset = () => {
		const defaultColorIndex = findIndex( defaultColors, color => color.slug === colors[ selectedIndex ].slug )
		if ( defaultColorIndex !== -1 ) {
			const { color: defaultColor } = defaultColors[ defaultColorIndex ]
			const { colors: updatedColors } = cloneDeep( select( 'core/block-editor' ).getSettings() )
			const { colorVar: existingColorVar } = updatedColors[ selectedIndex ]
			const colorVar = `--stk-global-color-${ md5( Math.floor( Math.random() * new Date().getTime() ) ).substr( 0, 5 ) }`

			// Overwrite the selected color to a new color.
			updatedColors[ selectedIndex ].color = existingColorVar ? `var(${ existingColorVar }, ${ defaultColor })` : `var(${ colorVar }, ${ defaultColor })`

			// Add a fallback and colorVar if not exists.
			updatedColors[ selectedIndex ].colorVar = existingColorVar || colorVar
			updatedColors[ selectedIndex ].fallback = defaultColor

			// Update the colors.
			updateColors( updatedColors )
			setIsPopOverOpen( false )
		}
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
				name: `Custom Color ${ newIndex }`, slug: `stk-global-color-${ slugId }`, color: `var(${ colorVar }, #000000)`, colorVar, fallback: '#000000',
			},
		]

		// Update the colors.
		updateColors( updatedColors )

		setIsPopOverOpen( false )
		setSelectedIndex( newIndex - 1 )
		setHasAddedNewColor( true )
	}

	// Called when clicking a color.
	const handleOpenColorPicker = ( event, index ) => {
		const currIndex = selectedIndex

		setColorButtonAnchor( event.target )
		setSelectedIndex( index )

		if ( currIndex === index ) {
			// If the preview selected index is the same as the current selected index, close the Popover.
			setIsPopOverOpen( toggle => ! toggle )
		} else {
			// Otherwise, open another instance of the Popover.
			setIsPopOverOpen( true )
		}
	}

	// Used to determine the computed color to be displayed in the ColorPicker
	const colorPlaceholder = color => {
		if ( color && color.color.includes( 'var' ) ) {
			const colorVarMatch = color.color.match( /--(.*?(?=,))/g )
			if ( colorVarMatch ) {
				const computedColor = rgba( window.getComputedStyle( document.documentElement ).getPropertyValue( colorVarMatch[ 0 ] ).trim() )
				if ( Array.isArray( computedColor ) && computedColor.length ) {
					return `rgba(${ computedColor.join( ', ' ) })`
				}
			}
		}

		return color.color
	}

	const isResetDisabled = () => {
		const defaultColorIndex = findIndex( defaultColors, color => color.slug === colors[ selectedIndex ].slug )
		if ( defaultColorIndex !== -1 ) {
			if ( colors[ selectedIndex ].fallback !== defaultColors[ defaultColorIndex ].color ) {
				return false
			}
		}
		return true
	}

	return colors && Array.isArray( colors ) && (
		<Fragment>
			<ResetButton onClick={ onColorPaletteReset } disabled={ disableReset } />
			{ colors.map( ( color, index ) => (
				<div className="components-circular-option-picker__option-wrapper" key={ index }>
					<Button
						className="components-circular-option-picker__option"
						label={ color.name || 'Untitled Color' }
						style={ { backgroundColor: color.color, color: color.color } }
						onClick={ event => handleOpenColorPicker( event, index ) }
					/>
				</div>
			) ) }
			<AddIcon onClick={ handleAddIcon } />
			{ isPopoverOpen && (
				<Popover
					anchorRef={ colorButtonAnchor }
					onClickOutside={ onClickOutside }
				>
					<ColorPicker
						color={ colorPlaceholder( colors[ selectedIndex ] ) }
						onChangeComplete={ onChangeColor }
						disableAlpha
					/>
					<ColorPickerTextArea
						id="color-picker-text-name"
						onChange={ onChangeStyleName }
						value={ colors[ selectedIndex ] && colors[ selectedIndex ].name }
					/>
					<div className="ugb-global-settings-color-picker__text-name components-color-picker__body">
						<div className="components-color-picker__controls">
							<DeleteButton
								name={ colors[ selectedIndex ] && colors[ selectedIndex ].name }
								onClick={ onColorDelete }
								disabled={ inRange( selectedIndex, 0, 6 ) }
							/>
							<ResetColorButton
								name={ colors[ selectedIndex ] && colors[ selectedIndex ].name }
								onClick={ onColorReset }
								disabled={ isResetDisabled() }
							/>
						</div>
					</div>
				</Popover>
			) }
		</Fragment>
	)
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
				colors={ colors }
			/>
		</div>
	)
}

ColorPickerContainer.defaultProps = {
	className: '',
}

export default ColorPickerContainer
