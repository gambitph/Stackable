/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data'

export const DEFAULT_STYLE_STATE_VIEWPORT = 'default'

const PRIVATE_APIS_CONSENT = 'I acknowledge private features are not for use in themes or plugins and doing so will break in the next version of WordPress.'

let unlockPrivateApis

/**
 * Core does not publicly expose Responsive Styles state in WordPress 7.1.
 * Keep the unstable opt-in isolated here so callers have a guarded boundary
 * that can be replaced if Core provides a public API.
 *
 * @return {Function|undefined} Core's private API unlock function.
 */
const getUnlockPrivateApis = () => {
	if ( unlockPrivateApis ) {
		return unlockPrivateApis
	}

	if ( typeof window === 'undefined' ) {
		return undefined
	}

	try {
		unlockPrivateApis = window.wp?.privateApis
			?.__dangerousOptInToUnstableAPIsOnlyForCoreModules(
				PRIVATE_APIS_CONSENT,
				'@wordpress/block-editor'
			)?.unlock
	} catch {
		unlockPrivateApis = undefined
	}

	return unlockPrivateApis
}

/**
 * Unlock private selectors on the Core block editor store.
 *
 * @param {Function} select WordPress data select function.
 * @return {Object|undefined} Unlocked selectors when the API is available.
 */
export const getPrivateBlockEditorSelectors = select => {
	const unlock = getUnlockPrivateApis()

	try {
		return unlock ? unlock( select( 'core/block-editor' ) ) : undefined
	} catch {
		return undefined
	}
}

/**
 * Unlock private actions on the Core block editor store.
 *
 * @param {Object} dispatchers Public block editor dispatchers.
 * @return {Object|undefined} Unlocked dispatchers when the API is available.
 */
export const getPrivateBlockEditorDispatch = dispatchers => {
	const unlock = getUnlockPrivateApis()

	try {
		return unlock ? unlock( dispatchers ) : undefined
	} catch {
		return undefined
	}
}

/**
 * Convert Stackable's visual device name to Core's style-state viewport.
 *
 * @param {string} deviceType Stackable device name.
 * @return {string} Core style-state viewport.
 */
export const getStyleStateViewportForDeviceType = deviceType => {
	if ( deviceType === 'Tablet' ) {
		return '@tablet'
	}

	if ( deviceType === 'Mobile' ) {
		return '@mobile'
	}

	return DEFAULT_STYLE_STATE_VIEWPORT
}

/**
 * Read whether Core's Responsive Styles toggle is enabled.
 *
 * @return {boolean} Whether Responsive Styles is enabled.
 */
const useCoreResponsiveEditing = () => {
	return useSelect( select => {
		const privateSelectors = getPrivateBlockEditorSelectors( select )
		return privateSelectors?.isResponsiveEditing?.() || false
	}, [] )
}

export default useCoreResponsiveEditing
