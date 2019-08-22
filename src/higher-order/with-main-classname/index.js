/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { Component } from '@wordpress/element'
import { createHigherOrderComponent } from '@wordpress/compose'

const withMainClassname = registeredBlockName => createHigherOrderComponent(
	WrappedComponent => class extends Component {
		render() {
			const blockName = registeredBlockName.replace( /^\w+\//g, '' )
			const classNameFromBlockName = registeredBlockName.replace( /\//g, '-' )
			const mainClassName = applyFilters( `stackable.${ blockName }.mainClassName`, classNameFromBlockName, registeredBlockName )

			const className = classnames( [
				( this.props.className || '' ).split( ' ' ).filter( name => name !== classNameFromBlockName ), // Remove the default block name.
				mainClassName, // Add itas the main class name.
			] )

			return (
				<WrappedComponent
					{ ...this.props }
					className={ className }
					mainClassName={ mainClassName }
					blockName={ blockName }
				/>
			)
		}
	},
	'withMainClassname'
)

export default withMainClassname
