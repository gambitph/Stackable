
/**
 * Internal dependencies
 */
import './store'

/**
 * External dependencies
 */
import {
	i18n, isPro, showProNotice,
} from 'stackable'
import {
	PanelAdvancedSettings,
	ProControl,
} from '~stackable/components'

/**
 * WordPress dependencies
 */
import { addFilter, applyFilters } from '@wordpress/hooks'
import { Fragment, useState } from '@wordpress/element'
import { useSelect } from '@wordpress/data'
import { __ } from '@wordpress/i18n'

export { GlobalBlockStyles } from './editor-loader'

if ( showProNotice || isPro ) {
	addFilter( 'stackable.global-settings.inspector', 'stackable/global-block-styles', output => {
		const [ isOpen, setIsOpen ] = useState( false )
		const hasBlockStyles = useSelect( select => {
			const blockStyles = select( 'stackable/global-block-styles' ).getAllBlockStyles()

			return Object.keys( blockStyles ).length > 0
		}, [] )

		return (
			<Fragment>
				{ output }
				<PanelAdvancedSettings
					title={ __( 'Global Block Styles', i18n ) }
					className="ugb-global-block-styles__panel"
					isPremiumPanel={ ! isPro }
					showModifiedIndicator={ isPro && hasBlockStyles }
					onToggle={ isOpen => setIsOpen( isOpen ) }
				>
					{ ! isPro && <ProControl type="global-block-styles" /> }
					{ isPro && applyFilters( 'stackable.global-settings.inspector.global-block-styles.control', Fragment, isOpen ) }

				</PanelAdvancedSettings>
			</Fragment>
		)
	}, 8 )
}
