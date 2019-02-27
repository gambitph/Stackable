import { Component, Fragment } from '@wordpress/element'
import { config, library } from '@fortawesome/fontawesome-svg-core'
import { BaseControl } from '@wordpress/components'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { withInstanceId } from '@wordpress/compose'

config.autoAddCss = false
config.autoReplaceSvg = false
config.familyPrefix = 'ugbfa'
config.keepOriginalSource = false
config.observeMutations = false
config.showMissingIcons = false

// We need to add all the available icons in the Font Awesome library so we can display them.
library.add( fab, far, fas )
// fab 391
// far 152
// fas 869

// Limit to 100 searches as not to stall the browser.
const MAX_SEARCH_ICONS = 100

export const searchIconName = search => {
	const lowerSearch = search && search.toLowerCase()
	const results = [
		...Object.values( fab ).filter( icon => icon.iconName.includes( lowerSearch ) ).slice( 0, MAX_SEARCH_ICONS ),
		...Object.values( far ).filter( icon => icon.iconName.includes( lowerSearch ) ).slice( 0, MAX_SEARCH_ICONS ),
		...Object.values( fas ).filter( icon => icon.iconName.includes( lowerSearch ) ).slice( 0, MAX_SEARCH_ICONS ),
	]

	return results.slice( 0, MAX_SEARCH_ICONS )
}

export const searchIcon = ( search, onChange = () => {} ) => {
	const results = searchIconName( search )

	const onClick = event => {
		onChange( event.currentTarget.getAttribute( 'data-value' ) )
	}

	return (
		<Fragment>
			{ results.map( ( { prefix, iconName } ) => {
				return <button key={ `${ prefix }-${ iconName }` }
					className="components-button is-button is-default"
					data-value={ `${ prefix }-${ iconName }` }
					onClick={ onClick }
					onMouseDown={ onClick }
				>
					<FontAwesomeIcon icon={ [ prefix, iconName ] } />
				</button>
			} ) }
		</Fragment>
	)
}

/**
 * Check whether the string value is a valid icon.
 *
 * @param {string} value The string value to check.
 *
 * @return {boolean} True if the value is a valid icon.
 */
export const isValidIconValue = value => {
	const iconArray = getIconArray( value )
	if ( ! iconArray ) {
		return false
	}

	const prefix = value.match( /^\w*/ )[ 0 ]
	if ( ! [ 'fab', 'far', 'fas' ].includes( prefix ) ) {
		return false
	}

	const icons = { fab, far, fas }
	const matches = Object.values( icons[ prefix ] ).filter( icon => icon.iconName === iconArray[ 1 ] )
	return matches.length > 0
}

export const getIconArray = value => {
	if ( typeof value !== 'string' ) {
		return null
	}
	if ( ! value.match( /\w*-/ ) ) {
		return null
	}
	return [
		value.match( /\w*/ ), // Prefix.
		// value.match( /\w*/ )[ 0 ], // Prefix.
		value.match( /\w+-(.*)$/ )[ 1 ], // Icon name.
	]
}

class IconControl extends Component {
	constructor() {
		super( ...arguments )
		this.state = {
			focused: false,
			value: this.props.value || '',
		}
		this.handleBlur = this.handleBlur.bind( this )
		this.handleFocus = this.handleFocus.bind( this )
		this.handleOnChange = this.handleOnChange.bind( this )
	}

	componentDidUpdate( prevProps ) {
		if ( this.props.value !== prevProps.value ) {
			this.setState( { value: this.props.value } )
		}
	}

	componentWillUnmount() {

	}

	handleBlur() {
		// Add a delay here so that selecting a searched icon won't just hide the search area.
		setTimeout( () => {
			this.setState( { focused: false } )
		}, 100 )
	}

	handleFocus() {
		this.setState( { focused: true } )
	}

	handleOnChange( event ) {
		const value = event.target.value
		this.setState( { value } )
		this.props.onChange( value )
	}

	render() {
		const {
			instanceId,
			label,
			help,
			onChange = () => {},
			type = 'text',
		} = this.props
		const { focused } = this.state

		const id = `inspector-ugb-icon-control-${ instanceId }`
		const selectedIcon = getIconArray( this.state.value )
		const isValidIcon = isValidIconValue( this.state.value )

		return (
			<BaseControl label={ label } help={ help } id={ id } className="ugb-image-control">
				<div className="components-ugb-icon-control__input_wrapper">
					<input className="components-text-control__input"
						ref={ this.props.inputRef } // Used for auto-focusing.
						type={ type }
						id={ id }
						value={ this.state.value }
						onChange={ this.handleOnChange }
						onBlur={ this.handleBlur }
						onFocus={ this.handleFocus }
						aria-describedby={ !! help ? id + '__help' : undefined }
					/>
					<div className="components-text-control__icon-preview">
						{ isValidIcon && <FontAwesomeIcon icon={ selectedIcon } /> }
						{ ! isValidIcon && <FontAwesomeIcon icon={ [ 'far', 'smile' ] } style={ { opacity: 0.3 } } /> }
					</div>
				</div>
				{ focused && ( ! selectedIcon || ! this.state.value ) &&
				<div className="components-ugb-icon-control__iconlist">
					{ searchIcon( this.state.value, onChange ) }
				</div>
				}
			</BaseControl>
		)
	}
}

export default withInstanceId( IconControl )
