/**
 * External dependencies
 */
import { fetchSettings } from '~stackable/util'

/**
 * WordPress dependencies
 */
import {
	register, createReduxStore, dispatch,
} from '@wordpress/data'
import domReady from '@wordpress/dom-ready'
import { __ } from '@wordpress/i18n'
import { models } from '@wordpress/api'
import { cloneDeep } from 'lodash'

// Include all the stored state.
const DEFAULT_STATE = {}

const STORE_ACTIONS = {
	updateGlobalBlockStyles: globalBlockStyles => ( {
		type: 'UPDATE_GLOBAL_BLOCK_STYLES',
		globalBlockStyles,
	} ),
	updateBlockStyles: ( blockName, blockStyles ) => ( {
		type: 'UPDATE_BLOCK_STYLES',
		blockName,
		blockStyles,
	} ),
}

const STORE_SELECTORS = {
	getBlockStyles: ( blockStyles, blockName ) => blockStyles?.[ blockName ] || [],
	getAllBlockStyles: blockStyles => blockStyles,
}

const STORE_REDUCER = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case 'UPDATE_BLOCK_STYLES': {
			const newBlockStyles = cloneDeep( state )

			if ( action.blockStyles.length ) {
				newBlockStyles[ action.blockName ] = action.blockStyles
			} else {
				delete newBlockStyles[ action.blockName ]
			}

			// eslint-disable-next-line camelcase
			const settings = new models.Settings( { stackable_global_block_styles: newBlockStyles } )
			settings.save()

			return newBlockStyles
		}
		case 'UPDATE_GLOBAL_BLOCK_STYLES': {
			return action.globalBlockStyles
		}
		default: {
			return state
		}
	}
}

register( createReduxStore( 'stackable/global-block-styles', {
	reducer: STORE_REDUCER,
	actions: STORE_ACTIONS,
	selectors: STORE_SELECTORS,
} ) )

// Load all our settings into our store.
domReady( () => {
	fetchSettings().then( response => {
		const {
			stackable_global_block_styles: _blockStyles,
		} = response

		const globalBlockStyles = typeof _blockStyles === 'object' && Object.keys( _blockStyles ).length ? _blockStyles : {}

		dispatch( 'stackable/global-block-styles' ).updateGlobalBlockStyles( globalBlockStyles )
	} )
} )
