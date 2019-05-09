import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'

const BlockContainer = {}

BlockContainer.Edit = props => {
	const { blockProps, render, ...containerProps } = props
	const { blockName } = blockProps
	const design = blockProps.attributes.design

	const mainClasses = classnames(
		props.className,
		applyFilters( `stackable.${ blockName }.mainclasses`, {}, blockProps )
	)

	// TODO Remove `design` from the filters below.
	return (
		<div { ...containerProps } className={ mainClasses }>
			{ blockProps.styles }
			{ applyFilters( `stackable.${ blockName }.edit.output.before`, null, design, blockProps ) }
			{ render( blockProps ) }
			{ applyFilters( `stackable.${ blockName }.edit.output.after`, null, design, blockProps ) }
		</div>
	)
}

BlockContainer.Edit.defaultProps = {
	styles: null, // provided by `withBlockStyles`
}

BlockContainer.Save = props => {
	const { blockProps, render, ...containerProps } = props
	const { blockName } = blockProps
	const design = blockProps.attributes.design

	const mainClasses = classnames(
		props.className,
		applyFilters( `stackable.${ blockName }.mainclasses`, {}, blockProps )
	)

	// TODO Remove `design` from the filters below.
	return (
		<div { ...containerProps } className={ mainClasses }>
			{ blockProps.styles }
			{ applyFilters( `stackable.${ blockName }.save.output.before`, null, design, blockProps ) }
			{ render( blockProps ) }
			{ applyFilters( `stackable.${ blockName }.save.output.after`, null, design, blockProps ) }
		</div>
	)
}

BlockContainer.Save.defaultProps = {
	styles: null, // provided by `withBlockStyles`
}

export default BlockContainer
