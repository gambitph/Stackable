import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { registerStore, dispatch } from '@wordpress/data'
import domReady from '@wordpress/dom-ready'
import { loadPromise, models } from '@wordpress/api'
import apiFetch from '@wordpress/api-fetch'

// Include all the stored state.
const DEFAULT_STATE = {
	/**
	 * This has the following structure:
	 * [
	 * { block: 'stackable/heading', styles: [{ name: 'default', data: 'some-serialized-data', slug: 'default' }] },
	 * { block: 'stackable/hero', styles: [{ name: 'Horizontal', data: 'some-serialized-data', slug: 'horizontal' }] },
	 * ]
	 */
	blockStyles: [],
}

const STORE_ACTIONS = {
	updateBlockStyles: blockStyles => ( {
		type: 'UPDATE_BLOCK_STYLES',
		blockStyles,
	} ),
	updateBlockDefaultStyle: ( blockName, attributes, innerBlocks, message ) => {
		const blockData = JSON.stringify( {
			attributes,
			innerBlocks,
		} )

		// Update settings.
		return {
			type: 'UPDATE_BLOCK_STYLE',
			slug: 'default',
			name: 'Default',
			blockName,
			blockData,
			successMessage: message,
		}
	},
	deleteBlockDefaultStyle: ( blockName, message ) => ( {
		type: 'DELETE_BLOCK_STYLE',
		slug: 'default',
		blockName,
		successMessage: message,
	} ),
}

const STORE_SELECTORS = {
	getBlockStyles: ( state, blockName ) => state.blockStyles.find( blockStyles => blockStyles.block === blockName ),
	getAllBlockStyles: state => state.blockStyles,
	getDefaultBlockStyle: ( state, blockName ) => state.blockStyles.find( blockStyles => blockStyles.block === blockName )?.styles.find( style => style.slug === 'default' ),
	getBlockStyle: ( state, blockName, styleSlug ) => state.blockStyles.find( blockStyles => blockStyles.block === blockName )?.styles.find( style => style.slug === styleSlug ),
}

const STORE_REDUCER = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case 'UPDATE_BLOCK_STYLES': {
			return {
				...state,
				...action.blockStyles,
			}
		}
		case 'DELETE_BLOCK_STYLE': {
			// Add the block if it doesn't exist in the block styles yet.
			const newBlockStyles = [ ...( state.blockStyles || [] ) ]
			if ( ! newBlockStyles.find( ( { block } ) => block === action.blockName ) ) {
				newBlockStyles.push( { block: action.blockName, styles: [] } )
			}

			// Delete the block style based on its slug.
			const i = newBlockStyles.map( ( { block } ) => block ).indexOf( action.blockName )
			newBlockStyles[ i ].styles.some( ( style, k ) => {
				if ( style.slug === action.slug ) {
					newBlockStyles[ i ].styles.splice( k, 1 )
					return true
				}
				return false
			} )

			// Save in the database.
			apiFetch( {
				path: `/stackable/v2/delete_block_style/`,
				method: 'POST',
				data: {
					block: action.blockName,
					slug: action.slug,
				},
			} ).then( response => {
				if ( response && action.successMessage ) {
					dispatch( 'core/notices' ).createNotice(
						'success',
						action.successMessage,
						{
							type: 'snackbar',
							isDismissible: true,
							id: 'stk-block-style-deleted',
						}
					)
				}
			} ).catch( error => {
				window.alert( __( "Couldn't update block styles, got this error:", i18n ) + `\n\n${ error.message }\n\n` + __( 'Please refresh the page and try again.', i18n ) ) // eslint-disable-line no-alert
			} )

			return {
				...state,
				blockStyles: newBlockStyles,
			}
		}
		case 'UPDATE_BLOCK_STYLE': {
			// Add the block if it doesn't exist in the block styles yet.
			const newBlockStyles = [ ...( state.blockStyles || [] ) ]
			if ( ! newBlockStyles.find( ( { block } ) => block === action.blockName ) ) {
				newBlockStyles.push( { block: action.blockName, styles: [] } )
			}

			// Add the default block style or update the one already set.
			const i = newBlockStyles.map( ( { block } ) => block ).indexOf( action.blockName )
			const hasStyle = newBlockStyles[ i ].styles.some( ( style, k ) => {
				if ( style.slug === action.slug ) {
					newBlockStyles[ i ].styles[ k ].data = action.blockData
					return true
				}
				return false
			} )

			if ( ! hasStyle ) {
				newBlockStyles[ i ].styles.push( {
					name: 'default', data: action.blockData, slug: action.slug,
				} )
			}

			// Save in the database.
			apiFetch( {
				path: `/stackable/v2/update_block_style/`,
				method: 'POST',
				data: {
					block: action.blockName,
					name: action.name,
					data: action.blockData,
					slug: action.slug,
				},
			} ).then( response => {
				if ( response && action.successMessage ) {
					dispatch( 'core/notices' ).createNotice(
						'success',
						action.successMessage,
						{
							type: 'snackbar',
							isDismissible: true,
							id: 'stk-block-style-saved',
						}
					)
				}
			} ).catch( error => {
				window.alert( __( "Couldn't update block styles, got this error:", i18n ) + `\n\n${ error.message }\n\n` + __( 'Please refresh the page and try again.', i18n ) ) // eslint-disable-line no-alert
			} )

			return {
				...state,
				blockStyles: newBlockStyles,
			}
		}
		default: {
			return state
		}
	}
}

registerStore( 'stackable/block-styles', {
	reducer: STORE_REDUCER,
	actions: STORE_ACTIONS,
	selectors: STORE_SELECTORS,
} )

// Load all our settings into our store.
domReady( () => {
	loadPromise.then( () => {
		const settings = new models.Settings()

		settings.fetch().then( response => {
			const {
				stackable_block_styles: blockStyles,
			} = response

			dispatch( 'stackable/block-styles' ).updateBlockStyles( {
				blockStyles,
			} )
		} )
	} )
} )
