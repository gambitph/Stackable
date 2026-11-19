/**
 * External dependencies
 */
import { loadGoogleFontInAttributes } from '~stackable/util'
import { getPropsWithDefaults } from '../../../../util/props'

/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element'
import { createHigherOrderComponent } from '@wordpress/compose'
import { useSelect } from '@wordpress/data'

const withGoogleFont = createHigherOrderComponent(
	WrappedComponent => {
		const NewComponent = incomingProps => {
			const props = getPropsWithDefaults( incomingProps, NEW_COMPONENT_DEFAULT_PROPS )
			const isEditingTemplate = useSelect( select =>
				select( 'core/editor' )?.getCurrentPostType?.() === 'wp_template' || false
			)

			// Reload the Google Fonts in the editor when switching to and from page template editing.
			useEffect( () => {
				loadGoogleFontInAttributes( props.attributes )
			}, [ isEditingTemplate ] )

			return <WrappedComponent { ...props } />
		}

		const NEW_COMPONENT_DEFAULT_PROPS = {
			attributes: {},
		}

		return NewComponent
	},
	'withGoogleFont'
)

export default withGoogleFont
