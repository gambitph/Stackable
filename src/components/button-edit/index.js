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
		if ( event.target.closest( '.ugb-svg-icon-placeholder__button' ) ||
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
			newWindow = '',
			noFollow = '',
			onChangeUrl = null,
			onChangeNewWindow = null,
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
			'ugb-button--ghost-to-normal-effect': ghostToNormalEffect,
			[ `ugb--hover-effect-${ hoverEffect }` ]: ( design === 'basic' || design === 'ghost' ) && hoverEffect,
			[ `ugb--shadow-${ shadow }` ]: design === 'basic' && shadow,
			[ `ugb-button--design-${ design }` ]: design !== 'basic',
			'ugb-button--has-icon': icon,
			[ `ugb-button--icon-position-${ iconPosition }` ]: iconPosition,
		} )

		return (
			<div
				className={ `ugb-button-container ugb-button-container-${ this.buttonInstanceId }` }
				onClick={ this.onButtonClickHandler }
				onKeyPress={ this.onKeyPressHandler }
				role="button"
				tabIndex="0"
			>
				{ /* eslint-disable-next-line jsx-a11y/anchor-is-valid */ }
				<a
					href="#"
					className={ mainClasses }
				>
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
								/>
							}
						</Fragment>
					}
					{
						// Should be tagName="span", but div for now because of issue
						// @see https://github.com/WordPress/gutenberg/issues/7311
					}
					<RichText
						tagName="div"
						className={ design === 'link' ? '' : 'ugb-button--inner' }
						placeholder={ __( 'Button text', i18n ) }
						value={ text }
						onChange={ onChange }
						formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
						keepPlaceholderOnFocus
					/>
					{ ( isSelected !== null ? isSelected : true ) && this.state.openPopup &&
						<UrlInputPopover
							value={ url }
							onChange={ onChangeUrl }
							newWindow={ newWindow }
							noFollow={ noFollow }
							onChangeNewWindow={ onChangeNewWindow }
							onChangeNoFollow={ onChangeNoFollow }
						/>
					}
				</a>
			</div>
		)
	}
}

ButtonEdit.Content = props => {
	const {
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
	} = props

	const mainClasses = classnames( [
		className,
		'ugb-button',
		`ugb-button--size-${ size }`,
	], {
		'ugb-button--ghost-to-normal-effect': ghostToNormalEffect,
		[ `ugb--hover-effect-${ hoverEffect }` ]: ( design === 'basic' || design === 'ghost' ) && hoverEffect,
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
			<a
				className={ mainClasses }
				href={ url }
				target={ newTab ? '_blank' : undefined }
				rel={ rel.join( ' ' ) }
			>
				{ icon && design !== 'link' &&
					<SvgIcon.Content value={ icon } />
				}
				<RichText.Content
					tagName="span"
					className={ design === 'link' ? '' : 'ugb-button--inner' }
					value={ text || __( 'Button Text', i18n ) }
				/>
			</a>
		</div>
	)
}

export default ButtonEdit
