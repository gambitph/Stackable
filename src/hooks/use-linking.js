import { useBlockEditContext } from '@wordpress/block-editor'
import {
	useState, useEffect, useMemo,
} from '@wordpress/element'
import { select } from '@wordpress/data'
import { useBlockAttributes } from './use-block-attributes'

const getLinkedData = () => {
	return JSON.parse( window.localStorage.getItem( `stackable-linking` ) ) || []
}

export const useLinking = () => {
	const { clientId } = useBlockEditContext()
	const { uniqueId } = useBlockAttributes( clientId )
	const [ linkedData, setLinkedData ] = useState( getLinkedData() )

	useEffect( () => {
		const handleLinkedChanged = () => {
			setLinkedData( getLinkedData() )
		}

		window.addEventListener( 'stackable-linked-storage', handleLinkedChanged ) // eslint-disable-line @wordpress/no-global-event-listener
		return () => window.removeEventListener( 'stackable-linked-storage', handleLinkedChanged ) // eslint-disable-line @wordpress/no-global-event-listener
	}, [] )

	const isLinked = useMemo( () => {
		return ! linkedData.includes( uniqueId )
	}, [ linkedData ] )

	const setIsLinked = isLinked => {
		const latestLinkedData = getLinkedData()
		const newUnlinkedUniqueIds = isLinked
			? latestLinkedData.filter( unlinkedUniqueId => unlinkedUniqueId !== uniqueId )
			: [ ...latestLinkedData, uniqueId ]

		// Update localStorage
		window.localStorage.setItem( `stackable-linking`,
			JSON.stringify(
				newUnlinkedUniqueIds.slice( 0, 50 ) // Limit number of unlinkings to remember.
			)
		)

		// Trigger other used hooks to update.
		window.dispatchEvent( new window.CustomEvent( 'stackable-linked-storage' ) )
	}

	return [
		isLinked,
		setIsLinked,
	]
}

export const useIsLinked = () => {
	const { clientId } = useBlockEditContext()
	const { uniqueId } = useBlockAttributes( clientId )
	return ! getLinkedData().includes( uniqueId )
}

export const isBlockLinked = clientId => {
	if ( ! clientId ) {
		return null
	}
	const attributes = select( 'core/block-editor' ).getBlockAttributes( clientId )
	return attributes?.uniqueId ? ! getLinkedData().includes( attributes.uniqueId ) : null
}
