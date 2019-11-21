/**
 * External dependencies
 */
import {
	SvgIcon, SvgIconPlaceholder, UrlInputPopover,
} from '~stackable/components'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { Component, Fragment } from '@wordpress/element'
import classnames from 'classnames'
import { i18n } from 'stackable'
import { RichText } from '@wordpress/block-editor'

// Deprecated ButtonEdit.Content methods.
export * from './deprecated'
export { default as ButtonEditHelper } from './helper'

// TODO: [V2] move ButtonEdit to RichButton

let buttonInstanceId = 1

class ButtonEdit extends Component {
	constructor() {
		super( ...arguments )
		this.state = {
			openPopup: false,
		}
		this.buttonInstanceId = buttonInstanceId++

		this.onButtonClickHandler = this.onButtonClickHandler.bind( this )
		this.outsideClickHandler = this.outsideClickHandler.bind( this )
		this.onKeyPressHandler = this.onKeyPressHandler.bind( this )
	}

	onButtonClickHandler( event ) {
		if ( this.props.iconButton && event.target.closest( '.ugb-svg-icon-placeholder__button' ) ) {
			// If this is an icon button, open the url popover if the icon is clicked.
		} else if ( event.target.closest( '.ugb-svg-icon-placeholder__button' ) ||
			event.target.closest( '.ugb-url-input-popover' ) ||
			event.target.closest( '.ugb-icon-popover' ) ||
			event.target.closest( '.components-popover' )
		) {
			return
		}
		if ( ! this.state.openPopup ) {
			document.body.addEventListener( 'click', this.outsideClickHandler )
		}
		this.setState( { openPopup: true } )
	}

	outsideClickHandler( event ) {
		if ( ! event.target.closest( `.ugb-button-container-${ this.buttonInstanceId }` ) &&
			! event.target.closest( '.ugb-url-input-popover' ) &&
			! event.target.closest( '.components-popover' ) ) {
			this.hideUrlPopup()
		} else if ( this.props.iconButton && event.target.closest( '.ugb-svg-icon-placeholder__button' ) ) {
			// If this is an icon button, don't close the url popover if the icon is clicked.
		} else if ( event.target.closest( '.ugb-svg-icon-placeholder__button' ) ) {
			this.hideUrlPopup()
		}
	}

	hideUrlPopup = () => {
		document.body.removeEventListener( 'click', this.outsideClickHandler )
		this.setState( { openPopup: false } )
	}

	onKeyPressHandler( event ) {
		if ( event.target.closest( '.ugb-url-input-popover' ) ||
			event.target.closest( '.components-popover' ) ) {
			return
		}
		this.hideUrlPopup()
	}

	render() {
		const {
			iconButton,
			className = '',
			size = 'normal',
			text = '',
			onChange = () => {},
			design = 'basic',
			shadow = 0,
			iconPosition = '',
			hoverEffect = '',
			ghostToNormalEffect = false,

			url = '',
			newTab = '',
			noFollow = '',
			onChangeUrl = null,
			onChangeNewTab = null,
			onChangeNoFollow = null,

			onChangeIcon = null,
			icon = null,

			isSelected = null,
		} = this.props

		const mainClasses = classnames( [
			className,
			'ugb-button',
			`ugb-button--size-${ size }`,
		], {
			'ugb-button--icon-only': iconButton,
			'ugb-button--ghost-to-normal-effect': ghostToNormalEffect,
			[ `ugb--hover-effect-${ hoverEffect }` ]: design !== 'link' && hoverEffect,
			[ `ugb--shadow-${ shadow }` ]: design === 'basic' && shadow,
			[ `ugb-button--design-${ design }` ]: design !== 'basic',
			'ugb-button--has-icon': icon,
			[ `ugb-button--icon-position-${ iconPosition }` ]: iconPosition,
		} )

		const openUrlPopover = ( isSelected !== null ? isSelected : true ) && this.state.openPopup

		return (
			<div
				className={ `ugb-button-container ugb-button-container-${ this.buttonInstanceId }` }
				onClick={ this.onButtonClickHandler }
				onKeyPress={ this.onKeyPressHandler }
				role="button"
				tabIndex="0"
			>
				{ /* eslint-disable-next-line jsx-a11y/anchor-is-valid */ }
				<a className={ mainClasses }>
					{ icon && design !== 'link' &&
						<Fragment>
							{ ! onChangeIcon &&
								<SvgIcon
									value={ icon }
								/>
							}
							{ onChangeIcon &&
								<SvgIconPlaceholder
									value={ icon }
									onChange={ onChangeIcon }
									isOpen={ ! iconButton ? null : openUrlPopover }
								/>
							}
						</Fragment>
					}
					{ ! iconButton &&
						<RichText
							tagName="span"
							className={ design === 'link' ? '' : 'ugb-button--inner' }
							placeholder={ __( 'Button text', i18n ) }
							value={ text }
							onChange={ onChange }
							withoutInteractiveFormatting={ true }
							keepPlaceholderOnFocus
						/>
					}
					{ openUrlPopover &&
						<UrlInputPopover
							value={ url }
							onChange={ onChangeUrl }
							newTab={ newTab }
							noFollow={ noFollow }
							onChangeNewTab={ onChangeNewTab }
							onChangeNoFollow={ onChangeNoFollow }
							disableSuggestions={ this.props.disableSuggestions }
						/>
					}
				</a>
			</div>
		)
	}
}

ButtonEdit.defaultProps = {
	iconButton: false,
	disableSuggestions: false,
	className: '',
	size: 'normal',
	text: '',
	onChange: () => {},
	design: 'basic',
	shadow: 0,
	iconPosition: '',
	hoverEffect: '',
	ghostToNormalEffect: false,

	url: '',
	newTab: '',
	noFollow: '',
	onChangeUrl: null,
	onChangeNewTab: null,
	onChangeNoFollow: null,

	onChangeIcon: null,
	icon: null,

	isSelected: null,
}

ButtonEdit.Content = props => {
	const {
		iconButton,
		className = '',
		size = 'normal',
		url = '',
		icon = null,
		text = '',
		design = 'basic',
		newTab = false,
		shadow = 0,
		iconPosition = false,
		hoverEffect = '',
		noFollow = false,
		ghostToNormalEffect = false,
		target = '',
	} = props

	const mainClasses = classnames( [
		className,
		'ugb-button',
		`ugb-button--size-${ size }`,
	], {
		'ugb-button--icon-only': iconButton,
		'ugb-button--ghost-to-normal-effect': ghostToNormalEffect,
		[ `ugb--hover-effect-${ hoverEffect }` ]: design !== 'link' && hoverEffect,
		[ `ugb--shadow-${ shadow }` ]: design === 'basic' && shadow,
		[ `ugb-button--design-${ design }` ]: design !== 'basic',
		'ugb-button--has-icon': icon,
		[ `ugb-button--icon-position-${ iconPosition }` ]: iconPosition,
	} )

	const rel = []
	if ( newTab ) {
		rel.push( 'noopener' )
		rel.push( 'noreferrer' )
	}
	if ( noFollow ) {
		rel.push( 'nofollow' )
	}

	return (
		<div className="ugb-button-container">
			{ ( text || iconButton ) &&
				<a
					className={ mainClasses }
					href={ url }
					target={ ( target || newTab ) ? ( target || '_blank' ) : undefined }
					rel={ props.rel || rel.join( ' ' ) }
				>
					{ icon && design !== 'link' &&
						<SvgIcon.Content value={ icon } />
					}
					{ ! iconButton &&
						<RichText.Content
							tagName="span"
							className={ design === 'link' ? '' : 'ugb-button--inner' }
							value={ text }
						/>
					}
				</a>
			}
		</div>
	)
}

export default ButtonEdit
