import { addFilter, doAction } from '@wordpress/hooks'
import { AlignmentToolbar, BlockControls } from '@wordpress/editor'
import { createAllCombinationAttributes } from '@stackable/util'
import deepmerge from 'deepmerge'
import { Fragment } from '@wordpress/element'
import { sprintf } from '@wordpress/i18n'

// Add contentAlign attributes
const addAttributes = attributes => {
	return {
		...attributes,
		...createAllCombinationAttributes(
			'Content%sAlign', {
				type: 'string',
				default: '',
			},
			[ '', 'Tablet', 'Mobile' ]
		),
	}
}

// Align all the block contents, including block titles.
const addStyles = ( styleObject, props ) => {
	const getValue = ( attrName, format = '' ) => {
		const value = typeof props.attributes[ attrName ] === 'undefined' ? '' : props.attributes[ attrName ]
		return value !== '' ? ( format ? sprintf( format, value ) : value ) : undefined
	}

	const styles = [ styleObject ]
	styles.push( {
		'.ugb-number-box__item': {
			textAlign: getValue( 'contentAlign' ),
		},
		'.ugb-inner-block': {
			textAlign: getValue( 'contentAlign' ),
		},
		tablet: {
			'.ugb-number-box__item': {
				textAlign: getValue( 'tabletContentAlign' ),
			},
			'.ugb-inner-block': {
				textAlign: getValue( 'tabletContentAlign' ),
			},
		},
		mobile: {
			'.ugb-number-box__item': {
				textAlign: getValue( 'mobileContentAlign' ),
			},
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
