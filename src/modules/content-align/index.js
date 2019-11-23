/**
 * External dependencies
 */
import { createAllCombinationAttributes, __getValue } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { addFilter, doAction } from '@wordpress/hooks'
import { AlignmentToolbar, BlockControls } from '@wordpress/block-editor'
import deepmerge from 'deepmerge'
import { Fragment } from '@wordpress/element'

// Add contentAlign attributes
const addAttributes = attributes => {
	return {
		...attributes,
		...createAllCombinationAttributes(
			'%sContentAlign', {
				type: 'string',
				default: '',
			},
			[ '', 'Tablet', 'Mobile' ]
		),
	}
}

// Align all the block contents, including block titles.
const addStyles = ( styleObject, props ) => {
	const getValue = __getValue( props.attributes )

	const styles = [ styleObject ]
	styles.push( {
		'.ugb-inner-block': {
			textAlign: getValue( 'contentAlign' ),
		},
		tablet: {
			'.ugb-inner-block': {
				textAlign: getValue( 'tabletContentAlign' ),
			},
		},
		mobile: {
			'.ugb-inner-block': {
				textAlign: getValue( 'mobileContentAlign' ),
			},
		},
	} )

	return deepmerge.all( styles )
}

const addAlignToolbar = ( output, props ) => {
	const { setAttributes } = props
	const {
		contentAlign = '',
	} = props.attributes
	return (
		<Fragment>
			{ output }
			<BlockControls>
				<AlignmentToolbar
					value={ contentAlign }
					onChange={ contentAlign => setAttributes( { contentAlign } ) }
				/>
			</BlockControls>
		</Fragment>
	)
}

const contentAlign = blockName => {
	addFilter( `stackable.${ blockName }.edit.inspector.before`, `stackable/${ blockName }/content-align`, addAlignToolbar, 11 )
	addFilter( `stackable.${ blockName }.attributes`, `stackable/${ blockName }/content-align`, addAttributes )
	addFilter( `stackable.${ blockName }.styles`, `stackable/${ blockName }/content-align`, addStyles, 9 )
	doAction( `stackable.module.content-align`, blockName )
}

export default contentAlign
