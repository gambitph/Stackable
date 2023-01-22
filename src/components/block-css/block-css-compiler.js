/**
 * Component to be used to contain all the BlockCss components for save style
 * rendering.
 *
 * This Component acceps BlockCss as children, and then outputs a style tag with
 * the rendered CSS as the content.
 */

import CssSaveCompiler from './css-save-compiler'
import { Children, cloneElement } from '@wordpress/element'

/**
 * This component compiles all BlockCss
 *
 * @param {Object} props
 */
export const BlockCssCompiler = props => {
	// We initialize a single css object, all styles will be saved in this.
	const css = new CssSaveCompiler()

	// The css object is passed through all BlockCss children, then the children
	// populates the object.  Afterwards, the css object is compiled and is
	// printed in a style tag.  This works because each child is rendered, and
	// the css object is filled up by each child component, then at the last
	// step, the compiler component gets the completely filled up css object and
	// renders it.
	return <>
		{ Children.toArray( props.children ).map( child => {
			return cloneElement( child, { compileCssTo: css } )
		} ) }
		<BlockCssCompiler_ cssObject={ css } />
	</>
}

/**
 * Prints the compiled css object in a style tag.
 *
 * @param {Object} props
 */
const BlockCssCompiler_ = props => {
	const css = props.cssObject.compile()
	return css ? <style>{ css }</style> : null
}
