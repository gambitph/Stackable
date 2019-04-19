import { addFilter } from '@wordpress/hooks'
import { Component } from '@wordpress/element'
import { createHigherOrderComponent } from '@wordpress/compose'

const createUniqueClass = uid => `ugb-${ uid.substring( 0, 7 ) }`

const withUniqueClass = createHigherOrderComponent(
	WrappedComponent => class extends Component {
		componentDidMount() {
			const { attributes, setAttributes } = this.props
			const { uniqueClass = '' } = attributes

			if ( ! uniqueClass || document.querySelectorAll( `.${ uniqueClass }` ).length > 1 ) {
				const newUniqueClass = createUniqueClass( this.props.clientId )
				if ( uniqueClass !== newUniqueClass ) {
					setAttributes( { uniqueClass: newUniqueClass } )
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

export default withUniqueClass
