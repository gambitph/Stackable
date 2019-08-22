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
		blockProps, render, mainClass, ...containerProps
	} = props
	const { blockName } = blockProps
	const design = blockProps.attributes.design

	const mainClasses = classnames( [
		props.className,
	], applyFilters( `stackable.${ blockName }.main-block.classes`, {
		'ugb-main-block': mainClass,
	}, blockProps ) )

	// TODO Remove `design` from the filters below.
	return (
		<div { ...containerProps } className={ mainClasses }>
			{ blockProps.styles }
			{ applyFilters( `stackable.${ blockName }.edit.output.outer`, null, design, blockProps ) }
			<div className="ugb-inner-block">
				{ applyFilters( `stackable.${ blockName }.edit.output.before`, null, design, blockProps ) }
				<div className="ugb-block-content">
					{ render( blockProps ) }
				</div>
				{ applyFilters( `stackable.${ blockName }.edit.output.after`, null, design, blockProps ) }
			</div>
		</div>
	)
}

BlockContainer.Edit.defaultProps = {
	styles: null, // provided by `withBlockStyles`
	mainClass: true,
}

BlockContainer.Save = props => {
	const {
		blockProps, render, mainClass, ...containerProps
	} = props
	const { blockName } = blockProps
	const design = blockProps.attributes.design

	const mainClasses = classnames( [
		props.className,
	], applyFilters( `stackable.${ blockName }.main-block.classes`, {
		'ugb-main-block': mainClass,
	}, blockProps ) )

	// TODO Remove `design` from the filters below.
	return (
		<div { ...containerProps } className={ mainClasses }>
			{ blockProps.styles }
			{ applyFilters( `stackable.${ blockName }.save.output.outer`, null, design, blockProps ) }
			<div className="ugb-inner-block">
				{ applyFilters( `stackable.${ blockName }.save.output.before`, null, design, blockProps ) }
				<div className="ugb-block-content">
					{ render( blockProps ) }
				</div>
				{ applyFilters( `stackable.${ blockName }.save.output.after`, null, design, blockProps ) }
			</div>
		</div>
	)
}

BlockContainer.Save.defaultProps = {
	styles: null, // provided by `withBlockStyles`
	mainClass: true,
}

export default BlockContainer
