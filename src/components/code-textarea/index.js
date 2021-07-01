/**
 * External dependencies
 */
import { debounce, uniqueId as _uniqueId } from 'lodash'

/**
 * WordPress dependencies
 */
import { defaultSettings, initialize } from '@wordpress/codeEditor'
import {
	useEffect, useState, useMemo, useRef, useCallback,
} from '@wordpress/element'
import deepmerge from 'deepmerge'

const CodeTextarea = props => {
	const [ value, setValue ] = useState( props.value )
	const [ codeMirror, setCodeMirror ] = useState( null )

	const uniqueId = useMemo( () => _uniqueId( 'ugb-code-textarea-' ), [] )

	const debouncedOnChange = useRef( debounce( value => {
		props.onChange( value )
	}, 500, { leading: true } ) )

	const onChangeHandler = useCallback( editor => {
		const value = editor.getValue ? editor.getValue() : editor
		setValue( value )
		debouncedOnChange.current( value )
	}, [] )

	// Initialize CodeMirror
	useEffect( () => {
		if ( initialize ) {
			const codeMirror = initialize( uniqueId, deepmerge( defaultSettings, props.editorSettings ) )
			setCodeMirror( codeMirror )
			codeMirror.codemirror.on( 'change', onChangeHandler )
		}

		return () => {
			debouncedOnChange?.current?.cancel()
			codeMirror?.codemirror.off( 'change', onChangeHandler )
		}
	}, [] )

	return <textarea
		className="ugb-code-textarea"
		id={ uniqueId }
		value={ value }
		onChange={ onChangeHandler }
	/>
}

CodeTextarea.defaultProps = {
	value: '',
	onChange: () => {},
	editorSettings: {},
}

export default CodeTextarea
