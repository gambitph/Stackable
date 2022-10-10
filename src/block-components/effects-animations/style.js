/**
 * External dependencies
 */
import { useStyles, getStyles } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'

/**
 * Internal dependencies
 */
import { applyFilters } from '@wordpress/hooks'

const getStyleParams = options => {
	return applyFilters( 'stackable.block-component.effects-animations.get-style-params', [], options )
}

export const Style = props => {
	const styles = useStyles( getStyleParams( props ) )

	return (
		<Fragment>
			{ applyFilters( 'stackable.block-component.effects-animations.style', null, styles, props ) }
		</Fragment>
	)
}

Style.Content = props => {
	const {
		attributes,
		...propsToPass
	} = props

	const styles = getStyles( attributes, getStyleParams( propsToPass.options ) )

	return (
		<Fragment>
			{ applyFilters( 'stackable.block-component.effects-animations.style.content', null, styles, propsToPass ) }
		</Fragment>
	)
}
