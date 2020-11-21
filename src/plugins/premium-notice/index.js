/**
 * External dependencies
 */
import {
	showProNotice, isPro, i18n,
} from 'stackable'
import { ProControl } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { addFilter } from '@wordpress/hooks'
import domReady from '@wordpress/dom-ready'
import {
	Fragment, useState, useEffect,
} from '@wordpress/element'
import { loadPromise, models } from '@wordpress/api'
import { InspectorControls } from '@wordpress/block-editor'

let shouldShowPremiumNotice = null

const updateDismissSetting = () => {
	const model = new models.Settings( { stackable_inspector_premium_notice_status: 'dismissed' } ) // eslint-disable-line camelcase
	model.save()
}

addFilter( 'stackable.edit.inspector.before', 'stackable/premium-notice', output => {
	const [ showNotice, setShowNotice ] = useState( shouldShowPremiumNotice )
	useEffect( () => {
		if ( ! showNotice && shouldShowPremiumNotice ) {
			shouldShowPremiumNotice = false
			updateDismissSetting()
		}
	}, [ showNotice ] )

	useEffect( () => {
		if ( shouldShowPremiumNotice ) {
			setShowNotice( true )
		}
	}, [ shouldShowPremiumNotice ] )

	if ( ! showNotice || ! shouldShowPremiumNotice ) {
		return output
	}

	return (
		<Fragment>
			{ output }
			<InspectorControls>
				<ProControl
					className="ugb-premium-notice-inspector-popup"
					isDismissible={ true }
					showHideNote={ false }
					button={ __( 'Get Premium', i18n ) }
					title={ __( 'Achieve More with Premium', i18n ) }
					description={ __( 'If you\'re enjoying Stackable blocks, we have a Premium version that lets you do so much more. Check it out now.', i18n ) }
					onClose={ () => setShowNotice( false ) }
					buttonUtmSource="inspector-premium-notice"
				/>
			</InspectorControls>
		</Fragment>
	)
} )

// Load whether we should show the upgrade notice or not.
domReady( () => {
	loadPromise.then( () => {
		const settings = new models.Settings()
		settings.fetch().then( response => {
			const {
				stackable_inspector_premium_notice_status: noticeStatus,
			} = response
			shouldShowPremiumNotice = showProNotice && ! isPro && noticeStatus === 'show'
		} )
	} )
} )
