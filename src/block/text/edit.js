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
} from '~stackable/block-components'
import { descriptionPlaceholder } from '~stackable/util'
import { version as VERSION } from 'stackable'
import classnames from 'classnames'
import { InspectorTabs } from '~stackable/components'
import { useBlockHoverClass } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
import { RichText } from '@wordpress/block-editor'

const Edit = props => {
	const {
		className, setAttributes,
	} = props

	const {
		text,
	} = props.attributes

	const blockHoverClass = useBlockHoverClass()
	const blockClassNames = classnames( [
		className,
		'stk-advanced-text',
		blockHoverClass,
	] )

	const [ , textClasses ] = getTypographyClasses( props.attributes )

	const textClassNames = classnames( [
		'stk-advanced-text__text',
		textClasses,
	] )

	return (
		<Fragment>

			<InspectorTabs />

			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Typography.InspectorControls enableTextTag={ false } />
			<CustomCSS.InspectorControls mainBlockClass="stk-advanced-text" />
			<Responsive.InspectorControls />

			<TextStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-advanced-text__text" />

			<BlockDiv className={ blockClassNames }>
				<RichText
					tagName="p"
					placeholder={ descriptionPlaceholder( 'medium' ) }
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
