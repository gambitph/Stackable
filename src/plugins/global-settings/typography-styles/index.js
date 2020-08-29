/**
 * External dependencies
 */
import {
	PanelAdvancedSettings, ProControl,
} from '~stackable/components'
import {
	i18n, showProNotice, isPro,
} from 'stackable'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'

addFilter( 'stackable.global-settings.inspector', 'stackable/typography-styles', output => {
	// If not pro and not hidden, don't show the panel.
	if ( ! isPro && ! showProNotice ) {
		return output
	}

	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'Saved Typography Styles', i18n ) }
				initialOpen={ false }
			>
				<p className="components-base-control__help">
					{ __( 'Save typography styles here for easy assignment across blocks.', i18n ) }
					&nbsp;
					<a href="https://docs.wpstackable.com/stackable-guides/advanced-guides/how-to-use-typography-styles/?utm_source=wp-global-settings&utm_campaign=learnmore&utm_medium=gutenberg" target="_docs">
						{ __( 'Learn more about Typography Styles', i18n ) }
					</a>
				</p>
				{ showProNotice && <ProControl type="typographyStyles" /> }
				{ applyFilters( 'stackable.global-settings.typography-styles', null ) }
			</PanelAdvancedSettings>
		</Fragment>
	)
} )
