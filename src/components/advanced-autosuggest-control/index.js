/**
 * WordPress dependencies
 */
import {
	Component, createRef, createPortal,
} from '@wordpress/element'
import { __ } from '@wordpress/i18n'

/**
 * External dependencies
 */
import Autosuggest from 'react-autosuggest'
import classnames from 'classnames'
import { i18n } from 'stackable'
import { kebabCase } from 'lodash'
import { BaseControl } from '..'

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
const escapeRegexCharacters = str => str.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' )

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = ( value, options ) => {
	const escapedValue = escapeRegexCharacters( value.trim() )

	// Show all options if nothing is typed yet.
	if ( ! escapedValue ) {
		return options
	}

	const regex = new RegExp( escapedValue, 'i' )

	// Non-grouped options. Find a matching value.
	if ( ! isGroupedOptions( options ) ) {
		return options.filter( option =>
			typeof option === 'string'
				? regex.test( option )
				: ( regex.test( option.label ) || regex.test( option.value ) )
		)
	}

	// Grouped options. Find a matching value.
	return options.map( ( { title, options } ) => {
		return {
			title,
			options: options.filter( option => regex.test( option.label ) || regex.test( option.value ) ),
		}
	} ).filter( section => section.options.length > 0 )
}

const isGroupedOptions = options => {
	if ( options.length ) {
		if ( typeof options[ 0 ].options === 'object' ) {
			return true
		}
	}
	return false
}

const getLabelFromValue = ( value, options ) => {
	if ( ! options.length ) {
		return value
	}

	// Non-grouped options
	if ( ! isGroupedOptions( options ) ) {
		const matchingOptions = options.filter( option => ( typeof option === 'string' ? option : option.value ) === value )
		if ( ! matchingOptions.length ) {
			return value
		}
		return matchingOptions[ 0 ].label
	}

	// Grouped options
	const matchingOptions = options.map( ( { title, options } ) => {
		return {
			title,
			options: options.filter( option => option.value === value ),
		}
	} ).filter( section => section.options.length > 0 )

	if ( ! matchingOptions.length ) {
		return value
	}

	return matchingOptions[ 0 ].options[ 0 ].label
}

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.value

const renderSectionTitle = section => {
	return <div className="ugb--autosuggest-group">{ section.title }</div>
}

const getSectionSuggestions = section => {
	return section.options
}

const shouldRenderSuggestions = () => {
	return true
}

class AdvancedAutosuggestControl extends Component {
	constructor() {
		super( ...arguments )
		this.state = {
			value: '',
			label: '',
			suggestions: [],
			isEmpty: false,
			// These are for positioning the suggestion drop down.
			isShowingSuggestions: false,
			containerRect: null,
		}
		this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind( this )
		this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind( this )
		this.onChange = this.onChange.bind( this )
		this.onFocus = this.onFocus.bind( this )
		this.autosuggestDiv = createRef()
		this.suggestionContainerLocationUpdater = this.suggestionContainerLocationUpdater.bind( this )
	}

	onChange( event, { newValue } ) {
		this.props.onChange( newValue )
		this.setState( {
			value: newValue,
			label: getLabelFromValue( newValue, this.props.options ),
		} )
	}

	onFocus() {
		if ( this.props.highlightValueOnFocus ) {
			setTimeout( () => {
				const option = this.autosuggestDiv.current.querySelector( `[data-value="${ this.state.value }"]` )
				if ( option ) {
					option.scrollIntoView()
				}
			}, 0 )
		}
	}

	// Autosuggest will call this function every time you need to update suggestions.
	// You already implemented this logic above, so just use it.
	onSuggestionsFetchRequested( { value, reason } ) {
		if ( this.props.disableAutoIndex ) {
			this.setState( {
				suggestions: getSuggestions( '', this.props.options ),
			} )
			return
		}
		// If the input was clicked (can be thought as a dropdown was opened), show all the options.
		if ( reason === 'input-focused' || reason === 'suggestion-selected' ) {
			this.setState( {
				suggestions: this.props.options,
				isEmpty: false,
			} )
			return
		}

		// Show our normal search suggestions
		const suggestions = getSuggestions( value, this.props.options )
		this.setState( {
			suggestions,
			isEmpty: value.trim() !== '' && suggestions.length === 0,
		} )
	}

	// This is for adjusting the location of the suggestion drop down.
	suggestionContainerLocationUpdater() {
		if ( this.autosuggestDiv?.current && this.state.isShowingSuggestions ) {
			this.setState( {
				containerRect: this.autosuggestDiv.current.getBoundingClientRect(),
			} )
			// Keep updating the position.
			requestAnimationFrame( this.suggestionContainerLocationUpdater )
		}
	}

	componentDidMount() {
		if ( this.props.options.length && this.props.value ) {
			this.setState( {
				value: this.props.value,
				label: this.props.value ? getLabelFromValue( this.props.value, this.props.options ) : this.props.value,
				suggestions: getSuggestions( this.props.disableAutoIndex ? '' : this.props.value, this.props.options ),
			} )
		}
	}

	componentWillReceiveProps( receivedProps ) {
		this.setState( {
			value: receivedProps.value,
			label: receivedProps.value ? getLabelFromValue( receivedProps.value, receivedProps.options ) : receivedProps.value,
			suggestions: getSuggestions( this.props.disableAutoIndex ? '' : receivedProps.value, receivedProps.options ),
		} )
	}

	// Autosuggest will call this function every time you need to clear suggestions.
	onSuggestionsClearRequested() {
		this.setState( {
			suggestions: [],
		} )
	}

	render() {
		const { label, suggestions } = this.state

		// Autosuggest will pass through all these props to the input.
		const inputProps = {
			placeholder: this.props.placeholder,
			value: label,
			onChange: this.onChange,
			onFocus: this.onFocus,
			type: 'search', // This adds a clear button inside the text input.
			...this.props.inputProps,
		}

		return (
			<BaseControl
				help={ this.props.help }
				className={ classnames( 'ugb-advanced-autosuggest-control', this.props.className ) }
				label={ this.props.label }
				screens={ this.props.screens }
				value={ this.props.value }
				onChange={ value => { // Will be used to reset.
					if ( value === '' ) {
						this.onChange( null, { newValue: '' } )
					}
				} }
				allowReset={ this.props.allowReset }
			>
				<div className="ugb-advanced-autosuggest-control__select" ref={ this.autosuggestDiv }>
					{ /** This style is used to update the suggestion dropdown location,
					   * we use :root because the suggestion dropdown is attached to the
					   * document.body and outside the scope of our control. */ }
					{ this.state.isShowingSuggestions && (
						<style>
							{ `:root {
								--container-left: ${ this.state.containerRect?.left }px;
								--container-bottom: ${ this.state.containerRect?.bottom }px;
							}` }
						</style>
					) }
					<Autosuggest
						multiSection={ isGroupedOptions( this.props.options ) }
						suggestions={ suggestions }
						// alwaysRenderSuggestions={ true }
						focusInputOnSuggestionClick={ false }
						onSuggestionsFetchRequested={ this.onSuggestionsFetchRequested }
						onSuggestionsClearRequested={ this.onSuggestionsClearRequested }
						onSuggestionSelected={ this.props.onSuggestionSelected }
						getSuggestionValue={ this.props.getSuggestionValue || getSuggestionValue }
						renderSuggestion={ suggestion => {
							return <div
								className="ugb-autosuggest-option"
								data-value={ suggestion.value }
								id={ `ugb-autosuggest-option--${ suggestion.id || kebabCase( suggestion.value ) }` }
							>
								{ this.props.renderOption ? this.props.renderOption( suggestion ) : suggestion.label }
							</div>
						} }
						renderSectionTitle={ renderSectionTitle }
						getSectionSuggestions={ getSectionSuggestions }
						shouldRenderSuggestions={ shouldRenderSuggestions }
						inputProps={ inputProps }
						renderInputComponent={ this.props.renderInputComponent ? this.props.renderInputComponent : ( props => <input { ...props } /> ) }
						renderSuggestionsContainer={ ( { containerProps, children } ) => {
							const shouldShowSuggestions = containerProps.className.indexOf( 'react-autosuggest__suggestions-container--open' ) >= 0

							// Update the suggestion visibility state for
							// updating the suggestion dropdown position.
							if ( shouldShowSuggestions && ! this.state.isShowingSuggestions ) {
								this.setState( { isShowingSuggestions: true } )
								requestAnimationFrame( this.suggestionContainerLocationUpdater )
							} else if ( ! shouldShowSuggestions && this.state.isShowingSuggestions ) {
								this.setState( { isShowingSuggestions: false } )
							}

							if ( shouldShowSuggestions ) {
								// We need to add styling to position the
								// suggestion drop down correctly. Scrolling
								// the editor/inspector breaks the position, so
								// we need to use custom properties to ensure
								// the correct position.
								const inputCoords = this.autosuggestDiv.current.getBoundingClientRect()
								const style = {
									left: `calc(var(--container-left, 0px) + ${ window.scrollX }px)`,
									top: `calc(var(--container-bottom, 0px) + ${ window.scrollY }px)`,
									width: inputCoords.width,
								}

								containerProps.className = classnames( containerProps.className, 'ugb-advanced-autosuggest__suggestions-container' )

								const suggestions = (
									<div { ...containerProps } style={ style }>
										{ children }
									</div>
								)

								return createPortal( suggestions, document.body )
							}

							return null
						} }

					/>
					{ this.state.isEmpty && <div className="ugb--autosuggest-empty">{ this.props.noMatchesLabel }</div> }
					{ this.props.children }
				</div>
			</BaseControl>
		)
	}
}

AdvancedAutosuggestControl.defaultProps = {
	onChange: () => {},
	help: '',
	className: '',
	screens: [ 'desktop' ],
	options: [],
	value: '',
	noMatchesLabel: __( 'No matches found', i18n ),
	renderOption: null, // If given a function, it will be called to render the option.
	highlightValueOnFocus: false,
	allowReset: true,
	placeholder: '',
	getSuggestionValue: null,
	disableAutoIndex: false,
	onSuggestionSelected: () => {},
	renderInputComponent: null,
	inputProps: {},
}

export default AdvancedAutosuggestControl
