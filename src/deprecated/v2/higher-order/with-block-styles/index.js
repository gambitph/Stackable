/**
 * External dependencies
 */
import { BlockStyles } from '../../components'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'

const withBlockStyles = ( styleFunction, options = {} ) => WrappedComponent => {
	const NewComp = props => {
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

	NewComp.defaultProps = {
		...( WrappedComponent.defaultProps || {} ),
		attributes: {},
		blockName: '',
		className: '',
		mainClassName: '',
	}

	return NewComp
}

export default withBlockStyles
