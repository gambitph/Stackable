import { currentUserHasCapability } from '~stackable/util'

import { useEffect, useState } from '@wordpress/element'
import { useSelect } from '@wordpress/data'

export const USER_PATTERN_MANAGE_CAPABILITY = 'edit_theme_options'

let cachedCanManage = null
let inflightPromise = null

export const useCanManageUserPatterns = () => {
	const userId = useSelect( select => select( 'core' ).getCurrentUser()?.id, [] )
	const [ canManage, setCanManage ] = useState( () => cachedCanManage ?? false )

	useEffect( () => {
		if ( ! userId ) {
			setCanManage( false )
			return
		}

		if ( cachedCanManage !== null ) {
			setCanManage( cachedCanManage )
			return
		}

		if ( ! inflightPromise ) {
			inflightPromise = currentUserHasCapability( USER_PATTERN_MANAGE_CAPABILITY ).then( hasCapability => {
				cachedCanManage = !! hasCapability
				inflightPromise = null
				return cachedCanManage
			} ).catch( () => {
				cachedCanManage = false
				inflightPromise = null
				return false
			} )
		}

		let isMounted = true

		inflightPromise.then( hasCapability => {
			if ( isMounted ) {
				setCanManage( hasCapability )
			}
		} )

		return () => {
			isMounted = false
		}
	}, [ userId ] )

	return canManage
}
