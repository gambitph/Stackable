/**
 * This stores the design system attributes, and computes for the generated CSS
 * needed.
 */

/**
 * Internal dependencies
 */
import { getStyleParams } from './styles'
import { getStyles, minifyCSS } from '~stackable/util'
import { generateStyles, getEditorStylesOnly } from '~stackable/block-components/style'

/**
 * External dependencies
 */
import { debounce } from 'lodash'

/**
 * WordPress dependencies
 */
import { registerStore, dispatch } from '@wordpress/data'
import { loadPromise, models } from '@wordpress/api'
import domReady from '@wordpress/dom-ready'
import { doAction } from '@wordpress/hooks'
import { doImportant } from '~stackable/components/style'

const saveDesignSystem = debounce( ( data, frontendCss ) => {
	const settings = new models.Settings( {
		stackable_design_system: { // eslint-disable-line camelcase
			...data,
			// The CSS for the frontend will need to be compressed / minified.
			css: minifyCSS( frontendCss ),
			// We need to stringify the styles.
			styles: JSON.stringify( data.styles ),
		},
	} )
	settings.save()
}, 500 )

let updateCssTimeout = null

// Include all the stored state.
const DEFAULT_STATE = {
	styles: {},
	css: '',
	cssDesktop: '',
	cssTablet: '',
	cssMobile: '',
}

const STORE_ACTIONS = {
	updateSettings: ( payload = {} ) => ( {
		type: 'UPDATE_SETTINGS',
		payload,
	} ),
	updateStyle: ( styleName, value ) => ( {
		type: 'UPDATE_STYLE',
		payload: { styleName, value },
	} ),
	updateCss: styles => ( {
		type: 'UPDATE_CSS',
		payload: { styles },
	} ),
}

const STORE_SELECTORS = {
	getCss: ( state, deviceType = '' ) => state[ `css${ deviceType }` ],
	getStyle: ( state, styleName ) => state.styles[ styleName ] || '',
	getStyles: state => state.styles || [],
}

const STORE_REDUCER = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case 'UPDATE_SETTINGS': {
			return {
				...state,
				css: action.payload?.css || '',
				cssDesktop: action.payload?.cssDesktop || '',
				cssTablet: action.payload?.cssTablet || '',
				cssMobile: action.payload?.cssMobile || '',
				styles: action.payload?.styles || {},
			}
		}
		case 'UPDATE_STYLE': {
			const newStyles = {
				...state.styles,
				[ action.payload.styleName ]: action.payload.value,
			}

			// Update the CSS.
			clearTimeout( updateCssTimeout )
			updateCssTimeout = setTimeout( () => {
				dispatch( 'stackable/design-system' ).updateCss( newStyles )
			}, 100 )

			return {
				...state,
				styles: newStyles,
			}
		}
		case 'UPDATE_CSS': {
			// Generate the CSS for the frontend.
			const styles = getStyles( action.payload.styles, getStyleParams() )
			const frontendCss = generateStyles( doImportant( styles ), '', 1024, 768 ).join( '' ).trim()

			// Generate the CSS of the other devices for the editor.
			const stylesToRenderDesktop = getEditorStylesOnly( styles, 'Desktop' )
			const cssDesktop = generateStyles( stylesToRenderDesktop, '', 1024, 768 ).join( '' ).trim()

			const stylesToRenderTablet = getEditorStylesOnly( styles, 'Tablet' )
			const cssTablet = generateStyles( stylesToRenderTablet, '', 1024, 768 ).join( '' ).trim()

			const stylesToRenderMobile = getEditorStylesOnly( styles, 'Mobile' )
			const cssMobile = generateStyles( stylesToRenderMobile, '', 1024, 768 ).join( '' ).trim()

			const data = {
				styles: action.payload.styles, // We need to save the styles.
				css: frontendCss,
				cssDesktop,
				cssTablet,
				cssMobile,
			}

			// Update the database.
			saveDesignSystem( data, frontendCss )

			return {
				...state,
				...data,
			}
		}
		default: {
			return state
		}
	}
}

registerStore( 'stackable/design-system', {
	reducer: STORE_REDUCER,
	actions: STORE_ACTIONS,
	selectors: STORE_SELECTORS,
} )

// Load all our design system settings into our store.
domReady( () => {
	loadPromise.then( () => {
		const settings = new models.Settings()

		settings.fetch().then( response => {
			const {
				stackable_design_system: designSystem,
			} = response

			// The styles are stored as a stringified JSON.
			designSystem.styles = JSON.parse( designSystem?.styles || '{}' )

			// Load the design system into the store so we can use it.
			dispatch( 'stackable/design-system' ).updateSettings( designSystem )

			// Allow others to do stuff when the design system is loaded.
			doAction( 'stackable.design_system.loaded', designSystem )
		} )
	} )
} )
