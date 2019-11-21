/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

/**
 * External dependencies
 */
import classnames from 'classnames'

const BlockContainer = {}

BlockContainer.Edit = props => {
	const {
		blockProps,
		render,
		mainClass,
		blockTag: blockTagProp,
		...containerProps
	} = props
	const { blockName } = blockProps
	const {
		anchor = '',
		design,
		blockTag = 'div',
	} = blockProps.attributes

	const mainClasses = classnames( [
		props.className,
	], applyFilters( `stackable.${ blockName }.main-block.classes`, {
		'ugb-main-block': mainClass,
	}, blockProps ) )

	const BlockTag = blockTag || blockTagProp || 'div' // Allow the advanced block settings to override the HTML Tag.
	// TODO Remove `design` from the filters below.
	return (
		<BlockTag { ...containerProps } id={ anchor } className={ mainClasses }>
			{ blockProps.styles }
			{ applyFilters( `stackable.${ blockName }.edit.output.outer`, null, design, blockProps ) }
			{ render &&
				<div className="ugb-inner-block">
					{ applyFilters( `stackable.${ blockName }.edit.output.before`, null, design, blockProps ) }
					<div className="ugb-block-content">
						{ render( blockProps ) }
					</div>
					{ applyFilters( `stackable.${ blockName }.edit.output.after`, null, design, blockProps ) }
				</div>
			}
		</BlockTag>
	)
}

BlockContainer.Edit.defaultProps = {
	styles: null, // provided by `withBlockStyles`
	mainClass: true,
}

BlockContainer.Save = props => {
	const {
		blockProps,
		render,
		mainClass,
		blockTag: blockTagProp,
		...containerProps
	} = props
	const { blockName } = blockProps
	const {
		anchor = '',
		design,
		blockTag = 'div',
	} = blockProps.attributes

	const mainClasses = classnames( [
		props.className,
	], applyFilters( `stackable.${ blockName }.main-block.classes`, {
		'ugb-main-block': mainClass,
	}, blockProps ) )

	// TODO Remove `design` from the filters below.
	const BlockTag = blockTag || blockTagProp || 'div' // Allow the advanced block settings to override the HTML Tag.
	return (
		<BlockTag { ...containerProps } id={ anchor } className={ mainClasses }>
			{ blockProps.styles }
			{ applyFilters( `stackable.${ blockName }.save.output.outer`, null, design, blockProps ) }
			{ render &&
				<div className="ugb-inner-block">
					{ applyFilters( `stackable.${ blockName }.save.output.before`, null, design, blockProps ) }
					<div className="ugb-block-content">
						{ render( blockProps ) }
					</div>
					{ applyFilters( `stackable.${ blockName }.save.output.after`, null, design, blockProps ) }
				</div>
			}
		</BlockTag>
	)
}

BlockContainer.Save.defaultProps = {
	styles: null, // provided by `withBlockStyles`
	mainClass: true,
}

export default BlockContainer
