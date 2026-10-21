/**
 * External dependencies
 */
import { BlockStyles } from '../../components'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { getPropsWithDefaults } from '../../../../util/props'

const withBlockStyles = ( styleFunction, options = {} ) => WrappedComponent => {
	const NewComp = incomingProps => {
		const props = getPropsWithDefaults( incomingProps, NEW_COMP_DEFAULT_PROPS )
		const newClassName = classnames( [
			props.className,
			props.attributes.uniqueClass,
		] )

		const { blockName } = props
		const styleObject = applyFilters( `stackable.${ blockName }.styles`, styleFunction( props ), props )

		const isEditorMode = options.editorMode || false

		const BlockStyleTag = isEditorMode ? BlockStyles : BlockStyles.Content
		const BlockStyle = (
			<BlockStyleTag
				blockUniqueClassName={ props.attributes.uniqueClass }
				blockMainClassName={ props.mainClassName }
				style={ styleObject }
				attributes={ props.attributes }
			/>
		)

		return <WrappedComponent { ...props } className={ newClassName } styles={ BlockStyle } />
	}

	const NEW_COMP_DEFAULT_PROPS = {
		...( WrappedComponent.stackableDefaultProps || WrappedComponent.defaultProps || {} ),
		attributes: {},
		blockName: '',
		className: '',
		mainClassName: '',
	}
	NewComp.stackableDefaultProps = NEW_COMP_DEFAULT_PROPS

	return NewComp
}

export default withBlockStyles
