/**
 * External dependencies
 */
import classnames from 'classnames'
import { cloneDeep, inRange } from 'lodash'
import md5 from 'md5'
import { i18n } from 'stackable'

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
import { loadPromise, models } from '@wordpress/api'
import { doAction } from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'

// Component used to add a style name field at the bottom of the ColorPicker.
const ColorPickerTextArea = props => (
	<div className="ugb-global-settings-color-picker__text-name components-color-picker__body">
		<div className="components-color-picker__controls">
			<div className="components-color-picker__inputs-wrapper">
				<div className="components-color-picker__inputs-fields">
					<BaseControl
						id={ props.id || 'text-area' }
						className="components-color-picker__input-field"
						label="Style name">
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

// Component used to add a Delete Style button at the bottom of the COlorPicker.
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
		<div className="ugb-global-settings-color-picker__text-name components-color-picker__body">
			<div className="components-color-picker__controls">
				<Button
					ref={ deleteButtonRef }
					className="ugb-global-settings-color-picker__delete-button-text"
					isLink
					onClick={ handleDelete }
				>
					{ __( 'Delete Style', i18n ) }
				</Button>
				{ isDeletePopoverOpen && (
					<Popover
						anchorRef={ deleteButtonRef.current }
						onClickOutside={ onClickOutside }
						position="bottom center"
					>
						<div className="components-color-picker__body">
							<div className="ugb-global-settings-color-picker__delete-popover-text is-red">
								{ __( 'Delete', i18n ) } { ` "${ props.name }"` }
							</div>
							<div className="ugb-global-settings-color-picker__delete-popover-text">
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
			</div>
		</div>
	)
}

const ColorPickers = ( { colors } ) => {
	const [ selectedIndex, setSelectedIndex ] = useState( null )
	const [ isPopoverOpen, setIsPopOverOpen ] = useState( false )
	const [ colorButtonAnchor, setColorButtonAnchor ] = useState( null )
	const [ hasAddedNewColor, setHasAddedNewColor ] = useState( false )

	// Open the PopOver for the newly added color.
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

	const onChangeColor = data => {
		const { colors: updatedColors } = cloneDeep( select( 'core/block-editor' ).getSettings() )
		const { colorVar: existingColorVar } = updatedColors[ selectedIndex ]
		const colorVar = `--stk-global-color-${ md5( Math.floor( Math.random() * new Date().getTime() ) ).substr( 0, 5 ) }`

		// Overwrite the selected color to a new color.
		updatedColors[ selectedIndex ].color = existingColorVar ? `var(${ existingColorVar })` : `var(${ colorVar })`
		updatedColors[ selectedIndex ].fallback = data.hex

		// Add a fallback and colorVar if not exists.
		updatedColors[ selectedIndex ].colorVar = existingColorVar || colorVar
		updatedColors[ selectedIndex ].fallback = data.hex

		dispatch( 'core/block-editor' ).updateSettings( {
			colors: updatedColors,
		} )

		// Update the global style variable values
		doAction( 'stackable.global-settings.global-styles', updatedColors )
	}

	const onChangeStyleName = value => {
		const { colors: updatedColors } = cloneDeep( select( 'core/block-editor' ).getSettings() )

		// Overwrite the selected style name and slug to a new style name and slug.
		updatedColors[ selectedIndex ].name = value

		dispatch( 'core/block-editor' ).updateSettings( {
			colors: updatedColors,
		} )
	}

	const onClickOutside = event => {
		if ( event.target !== colorButtonAnchor ) {
			setIsPopOverOpen( false )
		}
	}

	const onColorDelete = () => {
		const { colors: updatedColors } = cloneDeep( select( 'core/block-editor' ).getSettings() )

		// Delete the specific color based on the selected index.
		updatedColors.splice( selectedIndex, 1 )

		dispatch( 'core/block-editor' ).updateSettings( {
			colors: updatedColors,
		} )

		setIsPopOverOpen( false )
	}

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

	return colors && Array.isArray( colors ) && (
		<Fragment>
			{ colors.map( ( color, index ) => (
				<div className="components-circular-option-picker__option-wrapper" key={ index }>
					<Button
						className="components-circular-option-picker__option"
						label={ color.slug }
						style={ { backgroundColor: color.color, color: color.color } }
						onClick={ event => {
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
						} }
					/>
				</div>
			) ) }
			<AddIcon
				onClick={ () => {
					const newIndex = ( colors && Array.isArray( colors ) ) ? colors.length + 1 : 1
					const __id = md5( Math.floor( Math.random() * new Date().getTime() ) ).substr( 0, 5 )
					const slugId = Math.floor( Math.random() * new Date().getTime() )
					const colorVar = `--stk-global-color-${ __id }`

					dispatch( 'core/block-editor' ).updateSettings( {
						colors: [
							...select( 'core/block-editor' ).getSettings().colors,
							{
								name: `Custom Color ${ newIndex }`, slug: `stk-global-color-${ slugId }`, color: `--var(${ colorVar })`, colorVar, fallback: '#000000',
							},
						],
					} )

					// Update the global style variable values
					doAction( 'stackable.global-settings.global-styles', [
						...select( 'core/block-editor' ).getSettings().colors,
						{
							name: `Custom Color ${ newIndex }`, slug: `stk-global-color-${ slugId }`, color: `--var(${ colorVar })`, colorVar, fallback: '#000000',
						},
					] )

					setIsPopOverOpen( false )
					setSelectedIndex( newIndex - 1 )
					setHasAddedNewColor( true )
				} }
			/>
			{ isPopoverOpen && (
				<Popover
					anchorRef={ colorButtonAnchor }
					onClickOutside={ onClickOutside }
				>
					<ColorPicker
						color={ colors[ selectedIndex ] && ( colors[ selectedIndex ].fallback || colors[ selectedIndex ].color ) }
						onChangeComplete={ onChangeColor }
					/>
					<ColorPickerTextArea
						id="color-picker-text-name"
						onChange={ onChangeStyleName }
						value={ colors[ selectedIndex ] && colors[ selectedIndex ].name }
					/>
					{ ! inRange( selectedIndex, 0, 5 ) && (
						<DeleteButton
							name={ colors[ selectedIndex ] && colors[ selectedIndex ].name }
							onClick={ onColorDelete }
						/>
					) }
				</Popover>
			) }
		</Fragment>
	)
}

const GlobalSettingsColorPicker = props => {
	const classNames = classnames(
		'ugb-global-settings-color-picker',
		'components-circular-option-picker',
		'editor-color-palette-control__color-palette',
		props.className
	)

	const { colors } = useSelect( select => select( 'core/block-editor' ).getSettings() )

	useEffect( () => {
		const timeout = setTimeout( () => {
			loadPromise.then( () => {
				const model = new models.Settings( { stackable_global_colors: colors } ) // eslint-disable-line camelcase
				model.save()
			} )
		}, 1000 )

		return () => {
			clearTimeout( timeout )
		}
	}, [ colors ] )

	return (
		<div className={ classNames }>
			<ColorPickers colors={ colors } />
		</div>
	)
}

GlobalSettingsColorPicker.defaultProps = {
	className: '',
}

export default GlobalSettingsColorPicker
