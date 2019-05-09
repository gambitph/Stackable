/**
 * This file only contains Premium notices and Premium panel notices.
 */
import { __ } from '@wordpress/i18n'
import { addFilter } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'
import { PanelBody } from '@wordpress/components'
import { ProControl } from '@stackable/components'
import { showProNotice } from 'stackable'

if ( showProNotice ) {
	addFilter( 'stackable.separator.edit.inspector.style.after', 'stackable/separator', output => {
		return (
			<Fragment>
				{ output }
				<PanelBody
					initialOpen={ false }
					title={ __( 'Layer 2' ) }
				>
					<ProControl
						title={ __( 'Say Hello to Gorgeous Separators 👋' ) }
						description={ __( 'Add a second layer to this separator and make it look even sweeter. This feature is only available on Stackable Premium' ) }
					/>
				</PanelBody>
				<PanelBody
					initialOpen={ false }
					title={ __( 'Layer 3' ) }
				>
					<ProControl
						title={ __( 'Say Hello to Gorgeous Separators 👋' ) }
						description={ __( 'Add a third layer to this separator and make it look even sweeter. This feature is only available on Stackable Premium' ) }
					/>
				</PanelBody>
			</Fragment>
		)
	} )
}
