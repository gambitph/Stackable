/**
 * Internal dependencies
 */
import { PanelAdvancedSettings } from '~stackable/components'

/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

import { addFilter } from '@wordpress/hooks'
import { Fragment, useState } from '@wordpress/element'

addFilter( 'stackable.global-settings.inspector', 'stackable/block-layout', output => {
	const [ , setIsOpen ] = useState( false )

	return (
		<>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'Global Block Layouts', i18n ) }
				onToggle={ isOpen => setIsOpen( isOpen ) }
			>
				<p className="components-base-control__help">
					{ __( 'Manage how Stackable blocks look when they\'re inserted.', i18n ) }
					&nbsp;
					<a href="https://docs.wpstackable.com/article/480-how-to-use-block-defaults?utm_source=wp-global-settings&utm_campaign=learnmore&utm_medium=gutenberg" target="_docs">
						{ __( 'Learn more about Block Defaults', i18n ) }
					</a>
				</p>

			</PanelAdvancedSettings>
		</>
	)
} )
