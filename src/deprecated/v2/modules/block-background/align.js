/**
 * Since we have a special "Align" toolbar that mimics the default alignment toolbar,
 * we get rid of the alignment toolbar by removing the "supports: align" property.
 * (because this is the only way to remove the default alignment toolbar)
 *
 * BUT, since we removed the "align" support, normal alignments functionality stop working.
 * These methods bring the functionality back by mimicking "@wordpress/block-editor/src/hooks/align.js"
 */
/**
 * WordPress dependencies
 */
import { compose, createHigherOrderComponent } from '@wordpress/compose'
import { addFilter } from '@wordpress/hooks'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { includes } from 'lodash'
import { withSelect } from '@wordpress/data'

const blocksWithBlockBackgroundModule = []

const removeAlignSupport = settings => {
	return {
		...settings,
		supports: {
			...settings.supports,
			align: null,
		},
	}
}

const isValidAlignment = align => includes( [ 'center', 'wide', 'full' ], align )

export const addNewAlignFunctionality = blockName => {
	addFilter( `stackable.${ blockName }.settings`, `stackable/${ blockName }/block-background`, removeAlignSupport, 99 )
	blocksWithBlockBackgroundModule.push( `ugb/${ blockName }` )
}

export const insideSelectWithDataAlign = BlockListBlock => (
	props => {
		const { attributes, name: blockName } = props
		const { align } = attributes

		let wrapperProps = props.wrapperProps
		if ( blocksWithBlockBackgroundModule.includes( blockName ) ) {
			if ( isValidAlignment( align ) ) {
				wrapperProps = { ...wrapperProps, 'data-align': align }
			}
		}

		return <BlockListBlock { ...props } wrapperProps={ wrapperProps } />
	}
)

/**
 * Override the default block element to add alignment wrapper props.
 *
 * @param  {Function} BlockListBlock Original component
 * @return {Function}                Wrapped component
 */
export const withDataAlign = createHigherOrderComponent(
	compose( [
		withSelect(
			select => {
				const { getSettings } = select( 'core/block-editor' )
				return {
					hasWideEnabled: !! getSettings().alignWide,
				}
			}
		),
		insideSelectWithDataAlign,
	] )
)

/**
 * Override props assigned to save component to inject alignment class name if
 * block supports it.
 *
 * @param  {Object} props      Additional props applied to save element
 * @param  {Object} blockType  Block type
 * @param  {Object} attributes Block attributes
 * @return {Object}            Filtered props applied to save element
 */
export function addAssignedAlign( props, blockType, attributes ) {
	const { name: blockName } = blockType
	const { align } = attributes

	if ( ! blocksWithBlockBackgroundModule.includes( blockName ) ) {
		return props
	}

	if ( isValidAlignment( align ) ) {
		props.className = classnames( `align${ align }`, props.className )
	}
	return props
}

addFilter( 'editor.BlockListBlock', 'stackable/with-data-align', withDataAlign )
addFilter( 'blocks.getSaveContent.extraProps', 'stackable/addAssignedAlign', addAssignedAlign )
