/**
 * External dependencies
 */
import { compileCSS, minifyCSS } from '~stackable/util'
import { ProControl } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { addFilter, doAction } from '@wordpress/hooks'
import {
	i18n, isPro, showProNotice,
} from 'stackable'
import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'
import { PanelBody } from '@wordpress/components'

const customCSSProPanel = output => {
	return (
		<Fragment>
			{ output }
			<PanelBody
				initialOpen={ false }
				title={ __( 'Custom CSS', i18n ) }
			>
				<ProControl
					title={ __( 'Say Hello to Custom CSS 👋', i18n ) }
					description={ __( 'Further tweak this block by adding guided custom CSS rules. This feature is only available on Stackable Premium', i18n ) }
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

// Mimic how the Stackable Premium renders custom CSS.
const outputStyle = ( output, design, props ) => {
	const mainClass = props.mainClassName
	const {
		customCSS = '',
		uniqueClass = props.attributes.customCSSUniqueID || '',
	} = props.attributes

	const minified = minifyCSS( compileCSS( customCSS, mainClass, uniqueClass ), true )

	return (
		<Fragment>
			{ output }
			{ minified && <style>{ minified }</style> }
		</Fragment>
	)
}

const customCSS = blockName => {
	if ( showProNotice ) {
		addFilter( `stackable.${ blockName }.edit.inspector.advanced.after`, `stackable/${ blockName }/custom-css`, customCSSProPanel, 20 )
	}
	addFilter( `stackable.${ blockName }.attributes`, `stackable/${ blockName }/custom-css`, addAttributes )

	// If there's some custom CSS, but we're in the free version (user downgraded),
	// still render the custom CSS so as not produce a block error.
	if ( ! isPro ) {
		addFilter( `stackable.${ blockName }.save.output.outer`, `stackable/pro/${ blockName }/custom-css/downgrade`, outputStyle )
	}

	doAction( `stackable.module.custom-css`, blockName )
}

export default customCSS
