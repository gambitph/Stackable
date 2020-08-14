
/**
 * Wordpress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose'

// Change the icon attributes from Icon List Blocks in <=2.9.1
const withTransformOldTextAttributes = createHigherOrderComponent(
	WrappedComponent => props => {
		const {
			text,
		} = props.attributes

		if ( text ) {
			const textRegex = /<li>(.*?)<\/li>/g
			const texts = text.match( textRegex ).map( value => value.replace( /<\/?li>/g, '' ) )

			// get all texts in text attribute and store it to attributes text1-text6
			texts.forEach( ( text, index ) => {
				props.attributes[ `text${ index + 1 }` ] = text
			} )

			// Unset the text attribute
			props.attributes.text = undefined
		}

		return <WrappedComponent { ...props } />
	},
	'withTransformOldTextAttributes'
)

export default withTransformOldTextAttributes
