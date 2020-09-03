import './responsive-color-palette-change'

/**
 * Internal dependencies
 */
import { GlobalSettingsColorPicker } from '../components'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { PanelAdvancedSettings } from '~stackable/components'
import {
	isEqual, find,
} from 'lodash'
import md5 from 'md5'

/**
 * Wordpress dependencies
 */
import {
	addFilter, addAction, doAction,
} from '@wordpress/hooks'
import {
	Fragment, useState, useEffect,
} from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import domReady from '@wordpress/dom-ready'
import { loadPromise, models } from '@wordpress/api'
import {
	dispatch, useSelect, select,
} from '@wordpress/data'

addFilter( 'stackable.global-settings.inspector', 'global-settings/global-colors', output => {
	const [ isPanelOpen, setIsPanelOpen ] = useState( true )
	const [ disableReset, setDisableReset ] = useState( true )

	// We make sure that we are getting the latest state for default colors.
	const { defaultColors } = useSelect( select => select( 'core/block-editor' ).getSettings() )

	const handleToggle = () => {
		setIsPanelOpen( toggle => ! toggle )
	}

	// Show reset button if necessary.
	useEffect( () => {
		if ( disableReset ) {
			const { colors } = select( 'core/block-editor' ).getSettings()
			if ( Array.isArray( defaultColors ) && Array.isArray( colors ) ) {
				// Get only the slug and colors.
				const compareDefaultColors = defaultColors.map( defaultColor => ( { color: defaultColor.color, slug: defaultColor.slug } ) )
				const compareColors = colors.map( color => ( { color: color.fallback || color.color, slug: color.slug } ) )
				if ( ! isEqual( compareDefaultColors, compareColors ) ) {
					setDisableReset( false )
				}
			}
		}
	}, [ defaultColors ] )

	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'Global Color Palette', i18n ) }
				initialOpen={ true }
				opened={ isPanelOpen }
				onToggle={ handleToggle }
			>
				<p className="components-base-control__help">
					{ __( 'Change your color palette for all your blocks across your site.', i18n ) }
					&nbsp;
					<a href="https://docs.wpstackable.com/stackable-guides/advanced-guides/how-to-use-global-colors/?utm_source=wp-global-settings&utm_campaign=learnmore&utm_medium=gutenberg" target="_docs">
						{ __( 'Learn more about Global Colors', i18n ) }
					</a>
				</p>
				<GlobalSettingsColorPicker
					disableReset={ disableReset }
					setDisableReset={ setDisableReset }
				/>
			</PanelAdvancedSettings>
		</Fragment>
	)
} )

// Update the global style values
addAction( 'stackable.global-settings.global-styles', 'update', ( colors = [] ) => {
	const styleRules = colors.map( color => {
		if ( color.colorVar && color.fallback ) {
			return `${ color.colorVar }: ${ color.fallback };`
		}

		return ''
	} )

	const globalStyleEl = document.querySelector( '#stackable-global-colors' )
	if ( globalStyleEl ) {
		// Overwrite all the global styles inside this style tag.
		globalStyleEl.innerHTML = `:root { ${ styleRules.join( ' ' ) } }`
	}
} )

const updateToStackableGlobalColors = () => {
	const { colors } = select( 'core/block-editor' ).getSettings()
	const newColors = colors.map( color => {
		const { name, slug } = color
		const newColor = { name, slug }
		newColor.colorVar = `--stk-global-color-${ md5( Math.floor( Math.random() * new Date().getTime() ) ).substr( 0, 5 ) }`
		newColor.color = `var(${ newColor.colorVar }, ${ color.color })`
		newColor.fallback = color.color
		return newColor
	} )

	// Dispatch the newColors to the current colors
	dispatch( 'core/block-editor' ).updateSettings( {
		colors: newColors,
		defaultColors: colors,
	} )

	// Save the settings
	loadPromise.then( () => {
		const model = new models.Settings( { stackable_global_colors: newColors } ) // eslint-disable-line camelcase
		model.save()
	} )

	doAction( 'stackable.global-settings.global-styles', newColors )
}

/**
 * Used in ColorPaletteControl component.
 * Changing the Global Colors inside the Stackable Global Settings updates its fallback value ( e.g.
 * var(--stk-global-color-ugb12, #000000) to var(--stk-global-color-ugb12, #34aa6b) ), resulting to
 * unmatched fallback values between the block attribute and the global color. With this, we are
 * forcing the passed value to match its corresponding global color.
 * Trigger the sidebar toggle.
 * With this, we can still toggle the sidebar
 * even if the Stackable logo at the top is hidden.
 */
addFilter( 'stackable.global-settings.update-color-value', 'update-value', ( value, colors ) => {
	// If the value is an empty string or undefined, return the value.
	if ( ! value ) {
		return value
	}

	// If the value does not contain any global color variable, return the value.
	if ( value && typeof value === 'string' && ! value.match( /--stk-global-color-/ ) ) {
		return value
	}

	let newValue = value

	if ( colors && Array.isArray( colors ) && colors.length !== 0 ) {
		colors.forEach( color => {
			const colorVarID = value.match( /--stk-global-color-(\S*),/ )[ 1 ]
			if ( colorVarID ) {
				const colorVarRegex = new RegExp( `--stk-global-color-${ colorVarID }` )
				if ( color.color.match( colorVarRegex ) ) {
					newValue = color.color
				}
			}
		} )
	}

	return newValue
} )

/**
 * Used for attributes compatibility when resetting the global colors.
 */
addAction( 'stackable.global-settings.reset-compatibility', 'color-reset', ( blocks, colors, updatedColors, updateBlockAttributes ) => {
	const colorVars = colors.map( color => color.colorVar )

	/**
	 * Compatibility adjustments for stackable and other blocks.
	 */

	// Iterate through all blocks and update existing color attributes.
	blocks.forEach( block => {
		const { clientId, name } = block
		const newAttributes = {}

		if ( name.includes( 'ugb/' ) ) {
			//
			/**
			 * For stackable blocks.
			 * We are retaining the color of blocks that uses
			 * the deleted global color. Otherwise, reset its color
			 * as well.
			 */
			let stringifiedAttributes = JSON.stringify( block.attributes )
			colorVars.forEach( colorVar => {
				const colorVarRegExp = new RegExp( `var\\(${ colorVar },(.*)\\)`, 'g' )
				stringifiedAttributes = stringifiedAttributes.replace( colorVarRegExp, () => {
					const defaultColor = find( updatedColors, updatedColor => updatedColor.colorVar === colorVar )
					if ( ! defaultColor ) {
						// Retain the color.
						return find( colors, color => color.colorVar === colorVar ).fallback
					}
					// Revert the color to the default color.
					return defaultColor.color
				} )
			} )

			updateBlockAttributes( clientId, JSON.parse( stringifiedAttributes ) )
		} else if ( name.includes( 'core/' ) ) {
			//
			/**
			 * For core blocks.
			 * If a core block uses a color palette included in the theme,
			 * it uses the slug name as its attribute (e.g. textColor: "accent").
			 * Otherwise, textColor will be undefined and instead will add a style attribute
			 * (e.g. core/heading style: { color: "#123abc"}).
			 */

		} else if ( name.includes( 'kadence/' ) ) {
			//
			/**
			 * For kadence blocks.
			 * Similar to core blocks. If a kadence block uses a
			 * color palette included in the theme or one of their
			 * global palette, it uses the slug name as its attribute
			 * (e.g. color: "kb-palette-1") and also adding a colorClass
			 * attribute which will be applied as a custom css class
			 * for that block. So in some cases, we have to set the colorClass
			 * attribute to an empty string to avoid adding it to front end.
			 */
		} else {
			// Default attributes adjustment.
		}

		// Update block attributes
		updateBlockAttributes( clientId, newAttributes )
	} )
} )

domReady( () => {
	// Mount a style in the document
	const globalStyleEl = document.createElement( 'style' )
	globalStyleEl.setAttribute( 'id', 'stackable-global-colors' )
	const editorEl = document.querySelector( '.edit-post-visual-editor' )
	if ( editorEl ) {
		editorEl.insertBefore( globalStyleEl, editorEl.firstChild )
	}

	loadPromise.then( () => {
		const settings = new models.Settings()

		settings.fetch().then( response => {
			const { stackable_global_colors: globalColors } = response
			const { colors } = select( 'core/block-editor' ).getSettings()

			if ( Array.isArray( globalColors ) ) {
				if ( globalColors.length === 0 ) {
					updateToStackableGlobalColors()
				} else {
					// Fetch stackable global settings and dispatch to the curent colors
					loadPromise.then( () => {
						const settings = new models.Settings()
						settings.fetch().then( response => {
							// Dispatch the global colors to the current colors
							dispatch( 'core/block-editor' ).updateSettings( {
								colors: response.stackable_global_colors,
								defaultColors: colors,
							} )
						} )

						doAction( 'stackable.global-settings.global-styles', globalColors )
					} )
				}
			} else {
				updateToStackableGlobalColors()
			}
		} )
	} )
} )
