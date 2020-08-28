/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { AdvancedAutosuggestControl } from '~stackable/components'
import classnames from 'classnames'
import { pick } from 'lodash'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { Button } from '@wordpress/components'

const StyleItem = props => {
	const mainClasses = classnames( [
		'ugb-global-style-control__item',
	], {
		'ugb-global-style-control__item--large-preview': props.largePreview,
	} )

	const renderedPreview = props.renderPreview && props.renderPreview( pick( props, [ 'label', 'value' ] ) )

	return (
		<div className={ mainClasses }>
			{ renderedPreview && <div className="ugb-global-style-control__item-preview">{ renderedPreview }</div> }
			<div className="ugb-global-style-control__item-label">{ props.label }</div>
			<Button
				className="ugb-global-style-control__item-button"
				onClick={ event => {
					event.preventDefault()
					event.stopPropagation()
					props.onEdit( props.value )
				} }
				label={ __( 'Edit Style', i18n ) }
				isTertiary
				icon="edit"
			/>
		</div>
	)
}

StyleItem.defaultProps = {
	largePreview: false,
	renderPreview: () => {},
	onEdit: () => {},
}

/**
 * A function to call when a new style is selected.
 *
 * @callback onStyleChange
 * @param {Object} value The selected style value. The value is what's passed in the Control's option.value
 */

/**
 * A function to call when a style is edited.
 *
 * @callback onStyleEdit
 * @param {Object} value The selected style value. The value is what's passed in the Control's option.value
 */

/**
 * A function that renders the preview for a style suggestion
 *
 * @callback renderPreview
 * @param {Object} option The option to render the preview for
 * @param {Object} option.value The value of the option
 * @param {string} option.label The string value of the option
 *
 * @return {Object} The rendered preview
 */

/**
 * Assign the project to an employee.
 *
 * @param {Object} props
 * @param {string} props.className An addition class name to add
 * @param {string} props.label The label of the control
 * @param {Object} props.value The current value
 * @param {Object[]} props.options The available style options, this is an array
 *                                 of { value, label } objects
 * @param {onStyleChange} props.onChange Gets called when a style is selected
 * @param {onStyleEdit} props.onEdit Gets called when the edit button of a style is clicked.
 * @param {Function} props.onUnlink Gets called when the unlink button is clicked.
 * @param {renderPreview} props.renderPreview If provided, this will render a preview for
 *                                            the style option inside the suggestion list.
 * @param {boolean} props.largePreview If true, the style preview will be the whole width.
 */
const GlobalStyleControl = props => {
	// If there's a selected value, put it on the top of the list.
	let options = props.options
	if ( props.value ) {
		const foundValue = props.options.find( option => option.value === props.value )
		if ( foundValue ) {
			options = props.options.filter( option => option.value !== props.value )
			options.unshift( foundValue )
		}
	}

	const mainClasses = classnames( [
		'ugb-global-style-control',
		props.className,
	], {
		'ugb--has-value': props.value, // This visibly separates the first value (the selected one).
	} )

	return (
		<AdvancedAutosuggestControl
			className={ mainClasses }
			label={ props.label }
			onChange={ props.onChange }
			value={ props.style }
			options={ options }
			renderOption={ option =>
				<StyleItem
					{ ...option }
					largePreview={ props.largePreview }
					onEdit={ props.onEdit }
					renderPreview={ props.renderPreview }
				/>
			}
		>
			{ props.value &&
				<Button
					icon="edit"
					label={ __( 'Edit Style', i18n ) }
					isSecondary
					onClick={ () => props.onEdit( props.value ) }
				/>
			}
			{ props.value &&
				<Button
					icon="editor-unlink"
					label={ __( 'Unlink Style', i18n ) }
					isSecondary
					disabled={ ! props.value }
					onClick={ props.onUnlink }
				/>
			}
		</AdvancedAutosuggestControl>
	)
}

GlobalStyleControl.defaultProps = {
	className: '',
	label: __( 'Style', i18n ),
	value: '',
	options: [], // An array containing an object with the properties: label, value
	onChange: () => {},
	onEdit: () => {},
	onUnlink: () => {},
	renderPreview: null,
	largePreview: false,
}

export default GlobalStyleControl
