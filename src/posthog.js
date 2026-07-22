import posthog from 'posthog-js'
import domReady from '@wordpress/dom-ready'

const STORAGE_FIRST_CONTENT = 'stk_posthog_first_stackable_content'
const STORAGE_DESIGN_LIBRARY = 'stk_posthog_has_design_library_insert'

/**
 * Shared analytics context from PHP + local flags.
 * Attached to events and synced to person properties via $set on captures.
 */
export const getAnalyticsContext = () => {
	const ctx = window.stackable?.posthogContext || {}
	const publishedPages = Number( ctx.publishedPages ) || 0

	return {
		install_id: ctx.installId || '',
		site_address: ctx.siteAddress || '',
		build: ctx.build || ( window.stackable?.isPro ? 'premium' : 'free' ),
		version: ctx.version || window.stackable?.version || '',
		stackable_published_pages: publishedPages,
		stackable_published_milestone: Number( ctx.publishedMilestone ) || 0,
		has_first_stackable_content: !! (
			ctx.hasFirstContent ||
			( typeof localStorage !== 'undefined' && localStorage.getItem( STORAGE_FIRST_CONTENT ) === '1' )
		),
		has_design_library_insert: !! (
			ctx.hasDesignLibraryInsert ||
			( typeof localStorage !== 'undefined' && localStorage.getItem( STORAGE_DESIGN_LIBRARY ) === '1' )
		),
	}
}

const getSitePersonProperties = context => ( {
	install_id: context.install_id,
	site_address: context.site_address,
	build: context.build,
	stackable_published_pages: context.stackable_published_pages,
	stackable_published_milestone: context.stackable_published_milestone,
	has_first_stackable_content: context.has_first_stackable_content,
	has_design_library_insert: context.has_design_library_insert,
} )

// Init with opaque install UUID as distinct ID. No identify() — that would send $identify.
// wp_localize_script runs before this bundle, so installId is already available.
const initialContext = getAnalyticsContext()
const initConfig = {
	// eslint-disable-next-line camelcase
	api_host: process.env.POSTHOG_HOST,
	defaults: '2026-05-30',
	// Only our explicit captureEvent() calls — no SDK automatic events.
	// eslint-disable-next-line camelcase
	capture_pageview: false,
	// eslint-disable-next-line camelcase
	capture_pageleave: false,
	// eslint-disable-next-line camelcase
	capture_dead_clicks: false,
	// eslint-disable-next-line camelcase
	capture_heatmaps: false,
	// eslint-disable-next-line camelcase
	capture_performance: false,
	autocapture: false,
	rageclick: false,
	// eslint-disable-next-line camelcase
	disable_session_recording: true,
	// eslint-disable-next-line camelcase
	disable_surveys: true,
	// eslint-disable-next-line camelcase
	advanced_disable_flags: true,
	// eslint-disable-next-line camelcase
	disable_external_dependency_loading: true,
}

if ( initialContext.install_id ) {
	initConfig.bootstrap = {
		distinctID: initialContext.install_id,
		isIdentifiedID: true,
	}
}

posthog.init( process.env.POSTHOG_TOKEN, initConfig )

/**
 * Capture an event with shared context + person property sync.
 * Does not call identify() (avoids $identify). Install id comes from bootstrap.
 *
 * @param {string} event
 * @param {Object} properties
 */
export const captureEvent = ( event, properties = {} ) => {
	const context = getAnalyticsContext()
	const {
		$set: setFromCaller,
		$set_once: setOnceFromCaller,
		...eventProps
	} = properties

	posthog.capture( event, {
		build: context.build,
		version: context.version,
		install_id: context.install_id,
		site_address: context.site_address,
		stackable_published_pages: context.stackable_published_pages,
		...eventProps,
		$set: {
			...getSitePersonProperties( context ),
			...( setFromCaller || {} ),
		},
		...( setOnceFromCaller ? { $set_once: setOnceFromCaller } : {} ),
	} )
}

/**
 * Fire activation events queued by PHP (only when present).
 */
const flushPendingEvents = () => {
	const pending = window.stackable?.posthogPendingEvents
	if ( ! Array.isArray( pending ) || ! pending.length ) {
		return
	}
	pending.forEach( item => {
		if ( typeof item === 'string' ) {
			captureEvent( item )
		} else if ( item?.event ) {
			captureEvent( item.event, item.properties || {} )
		}
	} )
	window.stackable.posthogPendingEvents = []
}

domReady( flushPendingEvents )

// Pool global settings edits: at most one event per panel per page load.
const editedGlobalSettingsPanels = new Set()

/**
 * Track a global settings edit, pooled once per panel per page load.
 *
 * @param {string} panel Panel slug, e.g. 'typography', 'color-schemes'
 */
export const trackGlobalSettingsEdited = panel => {
	if ( ! panel || editedGlobalSettingsPanels.has( panel ) ) {
		return
	}
	editedGlobalSettingsPanels.add( panel )
	captureEvent( 'global_settings_edited', { panel } )
}

/**
 * Track interest in a premium feature (Buy Now / Learn More / Unlock).
 *
 * @param {string} feature Feature slug, e.g. 'motion-effects'
 */
export const trackPremiumInterest = feature => {
	captureEvent( 'premium_interest', { feature: feature || 'unknown' } )
}

/**
 * Track the first time any Stackable block exists in the editor (once ever).
 *
 * @param {string} source e.g. 'editor' | 'design_library'
 */
export const trackFirstStackableContent = ( source = 'editor' ) => {
	if ( typeof localStorage !== 'undefined' && localStorage.getItem( STORAGE_FIRST_CONTENT ) === '1' ) {
		return
	}
	if ( window.stackable?.posthogContext?.hasFirstContent ) {
		return
	}

	if ( typeof localStorage !== 'undefined' ) {
		localStorage.setItem( STORAGE_FIRST_CONTENT, '1' )
	}
	if ( window.stackable?.posthogContext ) {
		window.stackable.posthogContext.hasFirstContent = true
	}

	persistPosthogFlag( 'first_content' )

	captureEvent( 'first_stackable_content', {
		source,
		$set: { has_first_stackable_content: true },
		$set_once: { first_stackable_content_source: source },
	} )
}

/**
 * Persist a server-side flag so person props survive across browsers.
 *
 * @param {string} flag
 */
const persistPosthogFlag = flag => {
	if ( ! window.stackable?.nonce || ! window.stackable?.ajaxUrl ) {
		return
	}
	const body = new FormData()
	body.append( 'action', 'stackable_posthog_flag' )
	body.append( 'nonce', window.stackable.nonce )
	body.append( 'flag', flag )
	fetch( window.stackable.ajaxUrl, { method: 'POST', body, credentials: 'same-origin' } ).catch( () => {} )
}

/**
 * Mark that the user has inserted from the Design Library (person prop + event).
 *
 * @param {Object} properties
 */
export const trackDesignLibraryInserted = ( properties = {} ) => {
	if ( typeof localStorage !== 'undefined' ) {
		localStorage.setItem( STORAGE_DESIGN_LIBRARY, '1' )
	}
	if ( window.stackable?.posthogContext ) {
		window.stackable.posthogContext.hasDesignLibraryInsert = true
	}

	persistPosthogFlag( 'design_library' )

	// First Stackable content often comes from the Design Library.
	trackFirstStackableContent( 'design_library' )

	captureEvent( 'design_library_inserted', {
		...properties,
		$set: { has_design_library_insert: true },
	} )
}

export default posthog
