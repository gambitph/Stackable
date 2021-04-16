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
import { descriptionPlaceholder } from '~stackable/util'
import { version as VERSION } from 'stackable'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
import { InspectorTabs } from '~stackable/components'
import { RichText } from '@wordpress/block-editor'

const Edit = props => {
	const {
		className, setAttributes,
	} = props

	const {
		text,
	} = props.attributes

	const blockClassNames = classnames( [
		className,
		'stk-advanced-text',
	] )

	return (
		<Fragment>

			<InspectorTabs />

			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Typography.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-advanced-text" />
			<Responsive.InspectorControls />

			<Style styleFunc={ createStyles( VERSION ) } />
			<CustomCSS mainBlockClass="stk-advanced-text" />

			<BlockDiv className={ blockClassNames }>
				<RichText
					tagName="p"
					placeholder={ descriptionPlaceholder( 'medium' ) }
					keepPlaceholderOnFocus
					value={ text }
					onChange={ text => setAttributes( { text } ) }
					className="stk-advanced-text__text"
				/>
			</BlockDiv>
		</Fragment>
	)
}

export default Edit
