import { addFilter, doAction } from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'
import { PanelBody } from '@wordpress/components'
import { ProControl } from '@stackable/components'
import { showProNotice } from 'stackable'

const customCSSProPanel = output => {
	return (
		<Fragment>
			{ output }
			<PanelBody
				initialOpen={ false }
				title={ __( 'Custom CSS' ) }
			>
				<ProControl
					title={ __( 'Say Hello to Custom CSS 👋' ) }
					description={ __( 'Further tweak this block by adding guided custom CSS rules. This feature is only available on Stackable Premium' ) }
				/>
			</PanelBody>
		</Fragment>
	)
}

const addAttributes = attributes => {
	return {
		...attributes,
		customCSS: {
			type: 'string',
			default: '',
		},
		// Dynamic blocks may need to have JS write their CSS.
		customCSSCompiled: {
			type: 'string',
			default: '',
		},
		customCSSUniqueID: {
			type: 'string',
			default: '',
		},
	}
}

const customCSS = blockName => {
	if ( showProNotice ) {
		addFilter( `stackable.${ blockName }.edit.inspector.advanced.after`, `stackable/${ blockName }/custom-css`, customCSSProPanel, 20 )
	}
	addFilter( `stackable.${ blockName }.attributes`, `stackable/${ blockName }/custom-css`, addAttributes )
	doAction( `stackable.module.custom-css`, blockName )
}

export default customCSS
