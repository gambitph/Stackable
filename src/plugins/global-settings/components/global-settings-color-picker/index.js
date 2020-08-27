/**
 * External dependencies
 */
import classnames from 'classnames'
import { cloneDeep } from 'lodash'

/**
 * Wordpress dependencies
 */
import {
	Button, ColorPicker, Popover, BaseControl,
} from '@wordpress/components'
import {
	Fragment, useState,
} from '@wordpress/element'
import {
	select, dispatch, useSelect,
} from '@wordpress/data'

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

const ColorPickers = ( { colors } ) => {
	const [ selectedIndex, setSelectedIndex ] = useState( null )
	const [ isPopoverOpen, setIsPopOverOpen ] = useState( false )
	const [ colorButtonAnchor, setColorButtonAnchor ] = useState( null )

	const onChangeColor = data => {
		const { colors: updatedColors } = cloneDeep( select( 'core/block-editor' ).getSettings() )

		// Overwrite the selected color to a new color.
		updatedColors[ selectedIndex ].color = data.hex

		dispatch( 'core/block-editor' ).updateSettings( {
			colors: updatedColors,
		} )
	}

	const onChangeStyleName = value => {
		const { colors: updatedColors } = cloneDeep( select( 'core/block-editor' ).getSettings() )

		// Overwrite the selected style name and slug to a new style name and slug.
		updatedColors[ selectedIndex ].name = value
		updatedColors[ selectedIndex ].slug = value

		dispatch( 'core/block-editor' ).updateSettings( {
			colors: updatedColors,
		} )
	}

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
			{ isPopoverOpen && (
				<Popover anchorRef={ colorButtonAnchor } onClose={ () => setIsPopOverOpen( false ) }>
					<ColorPicker
						color={ colors[ selectedIndex ].color }
						onChangeComplete={ onChangeColor }
					/>
					<ColorPickerTextArea
						id="color-picker-text-name"
						onChange={ onChangeStyleName }
						value={ colors[ selectedIndex ].name }
					/>
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
