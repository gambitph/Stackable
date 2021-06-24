/**
 * Internal dependencies
 */
import { HeadingStyles } from './style'

/**
 * External dependencies
 */
import {
	BlockDiv,
	CustomCSS,
	Responsive,
	Advanced,
	Typography,
	getTypographyClasses,
	getAlignmentClasses,
	Alignment,
} from '~stackable/block-components'
import { version as VERSION, i18n } from 'stackable'
import classnames from 'classnames'
import { InspectorTabs } from '~stackable/components'
import { useBlockEl, useBlockHoverClass } from '~stackable/hooks'

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

	const blockHoverClass = useBlockHoverClass()
	const textClasses = getTypographyClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const blockClassNames = classnames( [
		className,
		'stk-heading',
		blockHoverClass,
	] )

	const textClassNames = classnames( [
		'stk-heading__text',
		textClasses,
		blockAlignmentClass,
	] )

	const blockEl = useBlockEl()

	return (
		<Fragment>

			<InspectorTabs />

			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Typography.InspectorControls blockEl={ blockEl } blockElSelector=".stk-heading__text" />
			<Alignment.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-heading" />
			<Responsive.InspectorControls />

			<HeadingStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-heading__text" />

			<BlockDiv className={ blockClassNames }>
				<RichText
					tagName={ textTag || 'h2' }
					placeholder={ __( 'Title for This Block', i18n ) }
					keepPlaceholderOnFocus
					value={ text }
					onChange={ text => setAttributes( { text } ) }
					className={ textClassNames }
				/>
			</BlockDiv>
		</Fragment>
	)
}

export default Edit
