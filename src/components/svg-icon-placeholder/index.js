import { ColorPaletteControl, IconControl } from '..'
import { Component, Fragment } from '@wordpress/element'
import { getIconArray, isValidIconValue } from '../icon-control'
import { IconButton, Popover } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { i18n } from 'stackable'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add( fab, far, fas )

class SvgIconPlaceholder extends Component {
	constructor() {
		super( ...arguments )
		this.state = {
			isOpen: false,
			value: this.props.value,
			color: this.props.color,
			isFirstFocus: true,
		}
		this.handleOpen = this.handleOpen.bind( this )
		this.handleClose = this.handleClose.bind( this )
		this.handleOnChange = this.handleOnChange.bind( this )
		this.handleOnChangeColor = this.handleOnChangeColor.bind( this )
		this.handleOnFirstFocus = this.handleOnFirstFocus.bind( this )
	}

	handleOpen() {
		if ( ! this.state.isOpen ) {
			this.setState( {
				isOpen: true,
				isFirstFocus: true,
			} )
		}
	}

	handleClose() {
		this.setState( {
			isOpen: false,
			isFirstFocus: true,
		} )
	}

	handleOnChange( value ) {
		this.setState( { value } )
		this.props.onChange( value )
	}

	handleOnChangeColor( color ) {
		this.setState( { color } )
		if ( this.props.onChangeColor ) {
			this.props.onChangeColor( color )
		}
	}

	handleOnFirstFocus() {
		if ( this.state.isFirstFocus ) {
			this.setState( { isFirstFocus: false } )
			this.inputElement.focus()
		}
	}

	render() {
		const selectedIcon = getIconArray( this.state.value )
		const isValidIcon = isValidIconValue( this.state.value )
		return (
			<IconButton
				className="ugb-svg-icon-placeholder"
				onClick={ this.handleOpen }
				icon={
					<Fragment>
						{ isValidIcon &&
							<FontAwesomeIcon
								icon={ selectedIcon }
								className={ this.props.className }
								style={ this.props.style }
							/>
						}
						{ ! isValidIcon &&
							<FontAwesomeIcon
								icon={ [ 'far', 'smile' ] }
								className={ this.props.className }
								style={ { ...this.props.style, opacity: 0.3 } }
							/>
						}
					</Fragment>
				}
			>
				{ this.state.isOpen &&
					<Popover
						className="ugb-svg-icon-placeholder__popup"
						onClose={ this.handleClose }
						position="bottom"
						focusOnMount="container"
						onFocus={ this.handleOnFirstFocus }
					>
						{ this.props.onChangeColor &&
							<ColorPaletteControl
								label={ this.props.colorLabel }
								value={ this.state.color }
								onChange={ this.handleOnChangeColor }
							/>
						}
						<IconControl
							inputRef={ el => this.inputElement = el } // Used for auto-focusing.
							label={ this.props.iconLabel }
							value={ this.state.value }
							onChange={ this.handleOnChange }
						/>
					</Popover>
				}
			</IconButton>
		)
	}
}

SvgIconPlaceholder.defaultProps = {
	colorLabel: __( 'Icon Color', i18n ),
	iconLabel: __( 'Pick an Icon', i18n ),
	onChangeColor: null,
	onChange: () => {},
	value: null,
	color: null,
	className: '',
	style: {},
}

SvgIconPlaceholder.Content = props => {
	const {
		value,
		className = '',
		style = {},
		color = '',
	} = props
	const selectedIcon = getIconArray( value )
	return (
		selectedIcon &&
			<FontAwesomeIcon
				icon={ selectedIcon }
				className={ className }
				color={ color }
				style={ style }
			/>
	)
}

export default SvgIconPlaceholder
