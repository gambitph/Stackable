/**
 * Internal dependencies
 */
import createStyles from './style'

/**
 * External dependencies
 */
import {
	BlockDiv,
	CustomCSS,
	Responsive,
	Advanced,
	Style,
	Typography,
} from '~stackable/block-components'
import { version as VERSION, i18n } from 'stackable'
import classnames from 'classnames'
import { InspectorTabs } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
import { RichText } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'

const Edit = props => {
	const {
		className, setAttributes,
	} = props

	const {
		text, textTag,
	} = props.attributes

	const blockClassNames = classnames( [
		className,
		'stk-advanced-heading',
	] )

	return (
		<Fragment>

			<InspectorTabs />

			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Typography.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-advanced-heading" />
			<Responsive.InspectorControls />

			<Style styleFunc={ createStyles( VERSION ) } />
			<CustomCSS mainBlockClass="stk-advanced-heading__text" />

			<BlockDiv className={ blockClassNames }>
				<RichText
					tagName={ textTag || 'h2' }
					placeholder={ __( 'Title for This Block', i18n ) }
					keepPlaceholderOnFocus
					value={ text }
					onChange={ text => setAttributes( { text } ) }
					className="stk-advanced-heading__text"
				/>
			</BlockDiv>
		</Fragment>
	)
}

export default Edit
