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
} from '~stackable/block-components'
import { version as VERSION, i18n } from 'stackable'
import classnames from 'classnames'
import { InspectorTabs } from '~stackable/components'
import { useBlockHoverClass } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { Fragment, useCallback } from '@wordpress/element'
import { RichText } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import { createBlock } from '@wordpress/blocks'

const Edit = props => {
	const {
		className,
		setAttributes,
		onReplace,
		clientId,
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

	const onChange = useCallback( text => setAttributes( { text } ), [ setAttributes ] )

	return (
		<Fragment>

			<InspectorTabs />

			<Alignment.InspectorControls />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Typography.InspectorControls hasRemoveMargins={ true } hasColumns={ false } />
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
					onChange={ onChange }
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
