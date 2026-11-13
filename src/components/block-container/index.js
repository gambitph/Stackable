/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { getPropsWithDefaults } from '../../util/props'

const BlockContainer = {}

BlockContainer.Edit = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, BLOCK_CONTAINER_EDIT_DEFAULT_PROPS )
	const {
		blockProps,
		render,
		mainClass,
		blockTag: blockTagProp,
		..._containerProps
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

	const innerClasses = classnames( [
		'ugb-inner-block',
	], applyFilters( `stackable.${ blockName }.main-block.inner-classes`, {}, blockProps ) )

	const containerProps = applyFilters( `stackable.${ blockName }.main-block.extraProps`, _containerProps, blockProps )

	// If anchor is not defined, force id to be undefined.
	const id = anchor !== '' ? anchor : undefined

	const BlockTag = blockTag || blockTagProp || 'div' // Allow the advanced block settings to override the HTML Tag.
	// TODO Remove `design` from the filters below.
	return (
		<BlockTag { ...containerProps } id={ id } className={ mainClasses }>
			{ blockProps.styles }
			{ applyFilters( `stackable.${ blockName }.edit.output.outer`, null, design, blockProps ) }
			{ render &&
				<div className={ innerClasses }>
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

const BLOCK_CONTAINER_EDIT_DEFAULT_PROPS = {
	styles: null, // provided by `withBlockStyles`
	mainClass: true,
}

BlockContainer.Save = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, BLOCK_CONTAINER_SAVE_DEFAULT_PROPS )
	const {
		blockProps,
		render,
		mainClass,
		blockTag: blockTagProp,
		..._containerProps
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

	const innerClasses = classnames( [
		'ugb-inner-block',
	], applyFilters( `stackable.${ blockName }.main-block.inner-classes`, {}, blockProps ) )

	const containerProps = applyFilters( `stackable.${ blockName }.main-block.extraProps`, _containerProps, blockProps )

	// If anchor is not defined, force id to be undefined.
	const id = anchor !== '' ? anchor : undefined

	// TODO Remove `design` from the filters below.
	const BlockTag = blockTag || blockTagProp || 'div' // Allow the advanced block settings to override the HTML Tag.
	return (
		<BlockTag { ...containerProps } id={ id } className={ mainClasses }>
			{ blockProps.styles }
			{ applyFilters( `stackable.${ blockName }.save.output.outer`, null, design, blockProps ) }
			{ render &&
				<div className={ innerClasses }>
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

const BLOCK_CONTAINER_SAVE_DEFAULT_PROPS = {
	styles: null, // provided by `withBlockStyles`
	mainClass: true,
}

export default BlockContainer
