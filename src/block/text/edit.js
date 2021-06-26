/**
 * Internal dependencies
 */
import { TextStyles } from './style'

/**
 * External dependencies
k*/
import {
	BlockDiv,
	CustomCSS,
	Responsive,
	Advanced,
	Typography,
	getTypographyClasses,
	getAlignmentClasses,
	Alignment,
	MarginBottom,
} from '~stackable/block-components'
import { descriptionPlaceholder } from '~stackable/util'
import { version as VERSION } from 'stackable'
import classnames from 'classnames'
import { InspectorTabs } from '~stackable/components'
import { useBlockHoverClass } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { Fragment, useCallback } from '@wordpress/element'
import { RichText } from '@wordpress/block-editor'

const Edit = props => {
	const {
		className, setAttributes,
	} = props

	const {
		text,
	} = props.attributes

	const blockHoverClass = useBlockHoverClass()
	const textClasses = getTypographyClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-text',
		blockHoverClass,
	] )

	const textClassNames = classnames( [
		'stk-text__text',
		textClasses,
		blockAlignmentClass,
	] )

	const onChange = useCallback( text => setAttributes( { text } ), [ setAttributes ] )

	return (
		<Fragment>

			<InspectorTabs />

			<Alignment.InspectorControls />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Typography.InspectorControls hasTextTag={ false } />
			<CustomCSS.InspectorControls mainBlockClass="stk-text" />
			<Responsive.InspectorControls />

			<TextStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-text__text" />

			<BlockDiv className={ blockClassNames }>
				<RichText
					tagName="p"
					placeholder={ descriptionPlaceholder( 'medium' ) }
					keepPlaceholderOnFocus
					value={ text }
					onChange={ onChange }
					className={ textClassNames }
				/>
				<MarginBottom />
			</BlockDiv>
		</Fragment>
	)
}

export default Edit
