import {
	i18n, usefulPlugins, ajaxUrl, installerNonce, activateNonce,
} from 'stackable'

import { Button, Spinner } from '@wordpress/components'
import { useState } from '@wordpress/element'
import apiFetch from '@wordpress/api-fetch'
import { __ } from '@wordpress/i18n'

// List of plugins to display in the Useful Plugins section
const PLUGINS = [ {
	id: 'interactions',
	title: __( 'Interactions', i18n ),
	description: __( 'Easily add animations and interactive experiences to your web pages using the block editor. Craft interactions from subtle hover effects to attention-grabbing story-telling animations.', i18n ),
}, {
	id: 'cimo-image-optimizer',
	title: __( 'Cimo - Image Optimizer', i18n ),
	description: __( 'A game-changer for image optimization. Cimo optimizes and converts your images instantly as you upload — even before the files are added to your Media Library.', i18n ),
} ]

const PLUGIN_STATUS = {
	NOT_INSTALLED: 'not_installed',
	INSTALLING: 'installing',
	INSTALLED: 'installed',
	ACTIVATING: 'activating',
	ACTIVATED: 'activated',
}

const BUTTON_LABELS = {
	[ PLUGIN_STATUS.NOT_INSTALLED ]: __( 'Install', i18n ),
	[ PLUGIN_STATUS.INSTALLING ]: __( 'Installing', i18n ),
	[ PLUGIN_STATUS.INSTALLED ]: __( 'Activate', i18n ),
	[ PLUGIN_STATUS.ACTIVATING ]: __( 'Activating', i18n ),
	[ PLUGIN_STATUS.ACTIVATED ]: __( 'Activated', i18n ),
}

const PluginCard = ( { plugin } ) => {
	const pluginData = usefulPlugins?.[ plugin.id ] ?? null
	const [ status, setStatus ] = useState( pluginData?.status ?? PLUGIN_STATUS.ACTIVATED )

	if ( ! pluginData ) {
		return null
	}
	const onClickAction = () => {
		if ( status === PLUGIN_STATUS.ACTIVATED ||
			status === PLUGIN_STATUS.INSTALLING ||
			status === PLUGIN_STATUS.ACTIVATING
		 ) {
			return
		}

		const prevStatus = status // Remember previous status to revert on error
		let successStatus = status // Will be set for next success state
		const formData = new window.FormData()
		setStatus( prev => {
			let newStatus = prev
			if ( prev === PLUGIN_STATUS.NOT_INSTALLED ) {
				formData.append( 'action', 'stackable_useful_plugins_install' )
				formData.append( '_ajax_nonce', installerNonce )
				formData.append( 'slug', plugin.id )
				newStatus = PLUGIN_STATUS.INSTALLING
				successStatus = PLUGIN_STATUS.INSTALLED
			} else if ( prev === PLUGIN_STATUS.INSTALLED ) {
				formData.append( 'action', 'stackable_useful_plugins_activate' )
				formData.append( 'nonce', activateNonce )
				formData.append( 'slug', plugin.id )
				formData.append( 'full_slug', pluginData.fullSlug )
				newStatus = PLUGIN_STATUS.ACTIVATING
				successStatus = PLUGIN_STATUS.ACTIVATED
			}
			return newStatus
		} )

		// formData is empty
		if ( formData.entries().next().done ) {
			setStatus( prevStatus )
			return
		}

		// Perform Ajax request to install or activate plugin
		apiFetch( {
			url: ajaxUrl,
			method: 'POST',
			body: formData,
		} ).then( response => {
			setTimeout( () => {
				// Mark as succeeded if operation successful or folder already exists after install
				if ( response.success || response.data?.errorCode === 'folder_exists' ) {
					pluginData.status = successStatus
					setStatus( successStatus )
				} else {
					pluginData.status = prevStatus
					setStatus( prevStatus )
				}
			}, 1000 ) // Add small delay to avoid race conditions with plugin activation/installation
		} ).catch( e => {
			// eslint-disable-next-line no-console
			console.error( 'Stackable: ', e )
			pluginData.status = prevStatus
			setStatus( prevStatus )
		} )
	}

	// Validate URL before using
	const isValidUrl = url => {
		try {
			const parsed = new URL( url )
			return [ 'http:', 'https:' ].includes( parsed.protocol )
		} catch {
			return false
		}
	}

	return <div key={ plugin.id } className="s-card">
		<div className="s-plugin-title">
			{ pluginData.icon && isValidUrl( pluginData.icon ) && (
				<img className="s-plugin-icon" src={ pluginData.icon } alt={ __( 'Plugin icon', i18n ) } />
			) }
			<h3 className="s-card-title">{ plugin.title }</h3>
		</div>
		<p>{ plugin.description }</p>
		<Button
			className={ `s-button s-button--ghost ${ status === PLUGIN_STATUS.INSTALLING || status === PLUGIN_STATUS.ACTIVATING ? 'pending' : '' }` }
			variant="secondary"
			onClick={ onClickAction }
			disabled={ status === PLUGIN_STATUS.INSTALLING || status === PLUGIN_STATUS.ACTIVATING || status === PLUGIN_STATUS.ACTIVATED }
		>
			{ BUTTON_LABELS[ status ] }
			{ /* Show spinner if in installing/activating states */ }
			{ ( status === PLUGIN_STATUS.INSTALLING || status === PLUGIN_STATUS.ACTIVATING ) && <span className="s-spinner"><Spinner /></span> }
		</Button>
	</div>
}

export const UsefulPlugins = () => {
	return <div className="s-useful-plugin-list">
		{ PLUGINS.map( ( plugin, i ) => {
			return <PluginCard key={ i } plugin={ plugin } />
		} ) }
	</div>
}
