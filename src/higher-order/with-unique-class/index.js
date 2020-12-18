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
				attributes, setAttributes, clientId,
			} = this.props
			const newUniqueClass = createUniqueClass( clientId )

			if ( typeof attributes.uniqueClass === 'undefined' || attributes.uniqueClass !== newUniqueClass ) {
				setAttributes( { uniqueClass: newUniqueClass } )
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
