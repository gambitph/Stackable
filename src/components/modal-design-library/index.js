/**
 * Internal dependencies
 */
import { ModalDesignLibrary } from './modal'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { useMemo } from '@wordpress/element'
import { useLocalStorage } from '~stackable/util'

export const Switcher = props => {
	const [ _apiVersion, setApiVersion ] = useLocalStorage( 'stk__design_library_api_version', '' )

	const versions = useMemo( () => {
		return applyFilters( 'stackable.design-library.versions', [ '' ] ) // Blank means the latest version.
	}, [] )

	// If there's no version switcher, it means backward compatibility is
	// disabled, always default to the first version
	const apiVersion = versions.includes( _apiVersion ) ? _apiVersion : versions[ 0 ]

	const ModalComponent = useMemo( () => {
		return applyFilters( 'stackable.design-library.modal-component', ModalDesignLibrary, apiVersion )
	}, [ apiVersion ] )

	return (
		<ModalComponent
			hasVersionSwitcher={ versions.length > 1 }
			apiVersion={ apiVersion }
			onChangeApiVersion={ setApiVersion }
			{ ...props }
		/>
	)
}

Switcher.defaultProps = {
}

export default Switcher
