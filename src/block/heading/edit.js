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
	MarginBottom,
	CustomAttributes,
} from '~stackable/block-components'
import { version as VERSION, i18n } from 'stackable'
import classnames from 'classnames'
import { InspectorTabs } from '~stackable/components'
import { useBlockHoverClass } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { createBlock } from '@wordpress/blocks'

const Edit = props => {
	const {
		className,
		onReplace,
		clientId,
	} = props

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

	return (
		<Fragment>

			<InspectorTabs />

			<Alignment.InspectorControls />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Typography.InspectorControls hasRemoveMargins={ true } hasTopBottomLine={ true } />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-heading" />
			<Responsive.InspectorControls />

			<HeadingStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-heading__text" />

			<BlockDiv className={ blockClassNames }>
				<Typography
					defaultTag="h2"
					placeholder={ __( 'Title for This Block', i18n ) }
					keepPlaceholderOnFocus
					className={ textClassNames }
					onReplace={ onReplace }
					onSplit={ ( value, isOriginal ) => {
						let block

						if ( isOriginal || value ) {
							block = createBlock( 'stackable/heading', {
								...props.attributes,
								text: value,
							} )
						} else {
							block = createBlock( 'stackable/text' )
						}

						if ( isOriginal ) {
							block.clientId = clientId
						}

						return block
					} }
				/>
				<MarginBottom />
			</BlockDiv>
		</Fragment>
	)
}

export default Edit
