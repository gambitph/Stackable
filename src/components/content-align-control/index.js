import { AlignButtonsControl, ResponsiveControl } from '@stackable/components'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { getAttrName } from '@stackable/util'

const ContentAlignControl = props => {
	const attrNamesToReset = applyFilters( 'stackable.components.content-align-control.attrNamesToReset', props.attributeNamesToReset )

	return (
		<ResponsiveControl
			attrNameTemplate="%sContentAlign"
			setAttributes={ props.setAttributes }
			blockAttributes={ props.blockAttributes }
			onChange={ ( attributeName, value, screen ) => {
				props.setAttributes( {
					[ attributeName ]: value,
					// Reset the other alignment options.
					...( attrNamesToReset.reduce( ( output, attrName ) => {
						output[ getAttrName( attrName, screen ) ] = ''
						return output
					}, {} ) ),
				} )
			} }
		>
			<AlignButtonsControl label={ __( 'Align' ) } />
		</ResponsiveControl>
	)
}

ContentAlignControl.defaultProps = {
	setAttributes: () => {},
	blockAttributes: {},
	attributeNamesToReset: [], // e.g. 'Number%sAlign'
}

export default ContentAlignControl
