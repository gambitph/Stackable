/**
 * External dependencies
 */
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'
import { ENTER, SPACE } from '@wordpress/keycodes'
import { getPropsWithDefaults } from '../../util/props'

const StyleControl = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, STYLE_CONTROL_DEFAULT_PROPS )
	const { options, value } = props

	return (
		<div className={ classnames( props.className, 'stk-block-editor-block-styles' ) }>
			{ options.map( ( option, i ) => {
				return (
					<StyleControlOption
						key={ i }
						isActive={ value === option[ props.activeProperty ] }
						onSelect={ props.onSelect }
						option={ option }
					/>
				)
			} ) }
		</div>
	)
}

const STYLE_CONTROL_DEFAULT_PROPS = {
	className: '',
	onSelect: () => {}, // The selected option object is returned
	options: [], // An option has a value, icon or image, and a label
	value: '', // The value of the option
	activeProperty: 'value', // The property to compare the value with
}

export const StyleControlOption = memo( incomingProps => {
	const props = getPropsWithDefaults( incomingProps, STYLE_CONTROL_OPTION_DEFAULT_PROPS )
	const {
		option,
		isActive,
		onSelect: _onSelect,
	} = props

	const onSelect = value => {
		if ( ! option.disabled && ! isActive ) {
			_onSelect( value )
		}
	}

	const Image = option.icon

	return (
		<div
			className={ classnames( 'stk-style-control__option', 'stk-block-editor-block-styles__item', {
				'is-active': isActive,
				'is-disabled': option.disabled,
			} ) }
			onClick={ () => onSelect( option ) }
			onKeyDown={ event => {
				if ( ENTER === event.keyCode || SPACE === event.keyCode ) {
					event.preventDefault()
					onSelect( option )
				}
			} }
			role="button"
			tabIndex="0"
			aria-label={ option.label || '' }
		>
			<div className="stk-block-editor-block-styles__item-preview stk-style-control__image">
				{ option.image || ( Image && <Image className="stk-style-control__image__icon" /> ) }
			</div>
			{ option.label && (
				<div className="stk-block-editor-block-styles__item-label">
					{ option.label }
				</div>
			) }
		</div>
	)
} )

const STYLE_CONTROL_OPTION_DEFAULT_PROPS = {
	option: {},
	isActive: false,
	onSelect: () => {},
}

export default StyleControl
