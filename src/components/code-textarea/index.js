/**
 * External dependencies
 */
import { debounce, uniqueId } from 'lodash'

/**
 * WordPress dependencies
 */
import { defaultSettings, initialize } from '@wordpress/codeEditor'
import { Component } from '@wordpress/element'
import deepmerge from 'deepmerge'

class CodeTextarea extends Component {
	constructor() {
		super( ...arguments )
		this.state = {
			value: this.props.value,
		}
		this.uniqueId = uniqueId( 'ugb-code-textarea-' )
		this.onChange = this.onChange.bind( this )

		// Leading should be true for testing purposes.
		this.debouncedOnChange = debounce( this.debouncedOnChange.bind( this ), 500, { leading: true } )

		this.codeMirror = null
	}

	componentWillUnmount() {
		this.debouncedOnChange.cancel()
		if ( this.codeMirror ) {
			this.codeMirror.codemirror.off( 'change', this.onChange )
		}
	}

	componentDidMount() {
		if ( initialize ) {
			this.codeMirror = initialize( this.uniqueId, deepmerge( defaultSettings, this.props.editorSettings ) )
			this.codeMirror.codemirror.on( 'change', this.onChange )
		}
	}

	debouncedOnChange( value ) {
		this.props.onChange( value || this.state.value )
	}

	// Called when the contents are changed. Throttle the call to prevent stalls.
	onChange( editor ) {
		const value = editor.getValue ? editor.getValue() : editor
		this.setState( { value } )
		this.debouncedOnChange( value )
	}

	render() {
		return <textarea className="ugb-code-textarea" id={ this.uniqueId } value={ this.state.value } onChange={ this.onChange } />
	}
}

CodeTextarea.defaultProps = {
	value: '',
	onChange: () => {},
	editorSettings: {},
}

export default CodeTextarea
