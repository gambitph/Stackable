/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'
import { Component } from '@wordpress/element'
import { createHigherOrderComponent } from '@wordpress/compose'

export const createUniqueClass = uid => `ugb-${ uid.substring( 0, 7 ) }`

const withUniqueClass = createHigherOrderComponent(
	WrappedComponent => class extends Component {
		static defaultProps = {
			attributes: {},
			clientId: '',
			setAttributes: () => {},
		}

		componentDidMount() {
			const {
				attributes, clientId,
			} = this.props
			const newUniqueClass = createUniqueClass( clientId )

			// When there's no unique ID yet, create one.
			if ( ! attributes.uniqueClass ) {
				this.props.attributes.uniqueClass = newUniqueClass
			// If there's one already, check whether we need to re-create one.
			// Duplicating a block or copy pasting a block may give us duplicate IDs.
			} else if ( attributes.uniqueClass !== newUniqueClass ) {
				if ( document.querySelectorAll( `.ugb-${ attributes.uniqueClass }` ).length > 1 ) {
					this.props.attributes.uniqueClass = newUniqueClass
				}
			}
		}

		render() {
			return (
				<WrappedComponent { ...this.props } />
			)
		}
	},
	'withUniqueClass'
)

/**
 * Don't include the unique class when saving designs.
 */
addFilter( 'stackable.user-design-library.save.ignore', 'stackable/unique-class', attributesToIgnore => {
	return [ ...attributesToIgnore, 'uniqueClass' ]
} )

/**
 * Always add the uniqueClass attribute to all Stackable blocks.
 */
addFilter( `stackable.block.attributes`, 'stackable/unique-class', attributes => {
	return {
		...attributes,
		uniqueClass: {
			type: 'string',
			default: '',
		},
	}
} )

export default withUniqueClass
