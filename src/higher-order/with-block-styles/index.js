/**
 * External dependencies
 */
import { BlockStyles } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { useMemo } from '@wordpress/element'

// Render the block styles, but with useMemo for caching. This is used for caching styles in the editor.
const BlockStylesWithMemo = props => {
	const {
		styleFunction,
		...blockProps
	} = props

	const { blockName } = blockProps

	// Grab all the non-content only attributes. Make sure that we only
	// re-compute the styles only when attributes that affect styles are
	// modified.
	let currentAttributes = applyFilters( `stackable.${ blockName }.design.no-text-attributes`, blockProps.attributes )
	currentAttributes = applyFilters( `stackable.${ blockName }.design.filtered-block-attributes`, currentAttributes )

	const styleObject = useMemo(
		() => applyFilters( `stackable.${ blockName }.styles`, styleFunction( blockProps ), blockProps ),
		[ Object.values( currentAttributes ).join( ',' ) + blockProps.clientId ]
	)

	return (
		<BlockStyles
			blockUniqueClassName={ blockProps.attributes.uniqueClass }
			blockMainClassName={ blockProps.mainClassName }
			style={ styleObject }
			editorMode={ true }
		/>
	)
}

const withBlockStyles = ( styleFunction, options = {} ) => WrappedComponent => {
	const NewComp = props => {
		const newClassName = classnames( [
			props.className,
			props.attributes.uniqueClass,
		] )

		const { blockName } = props

		// Render the block styles, but when in editor mode, do useMemo for caching.
		let BlockStyle
		if ( options.editorMode ) {
			BlockStyle = <BlockStylesWithMemo styleFunction={ styleFunction } { ...props } />
		} else {
			const styleObject = applyFilters( `stackable.${ blockName }.styles`, styleFunction( props ), props )

			BlockStyle = (
				<BlockStyles
					blockUniqueClassName={ props.attributes.uniqueClass }
					blockMainClassName={ props.mainClassName }
					style={ styleObject }
					editorMode={ false }
				/>
			)
		}

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
