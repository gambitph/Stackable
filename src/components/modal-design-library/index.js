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
	const [ apiVersion, setApiVersion ] = useLocalStorage( 'stk__design_library_api_version', '' )

	const versions = useMemo( () => {
		return applyFilters( 'stackable.design-library.versions', [ '' ] ) // Blank means the latest version.
	}, [] )

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
