/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	AdvancedToolbarControl,
	InspectorLayoutControls,
} from '~stackable/components'
import { useBlockAttributesContext } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const Controls = () => {
	const attributes = useBlockAttributesContext( attributes => {
		return {
			align: attributes.align,
			columnFit: attributes.columnFit,
		}
	} )

	return (
		<>
			<AdvancedToolbarControl
				label={ __( 'Block Width', i18n ) }
				attribute="align"
				default=""
				controls={ [
					{
						value: '',
						title: __( 'Align Center', i18n ),
						icon: 'align-center',
					},
					{
						value: 'wide',
						title: __( 'Align Wide', i18n ),
						icon: 'align-wide',
					},
					{
						value: 'full',
						title: __( 'Align Full', i18n ),
						icon: 'align-full-width',
					},
				] }
				blockHighlight={ { highlight: 'outline' } }
			/>
			<AdvancedToolbarControl
				label={ __( 'Content Width', i18n ) }
				attribute="innerBlockContentAlign"
				default={ attributes.align ? `align${ attributes.align }` : '' }
				controls={ [
					{
						value: '',
						title: __( 'Align Center', i18n ),
						icon: 'align-center',
					},
					{
						value: 'alignwide',
						title: __( 'Align Wide', i18n ),
						icon: 'align-wide',
					},
					{
						value: 'alignfull',
						title: __( 'Align Full', i18n ),
						icon: 'align-full-width',
					},
				] }
				help={ __( 'Set the content to be smaller than the block width', i18n ) }
				blockHighlight={ {
					selector: ', .stk-%s-column',
					highlight: 'outline-first-offset',
				} }
			/>
		</>
	)
}

export const Edit = props => {
	return (
		<InspectorLayoutControls>
			<Controls { ...props } />
		</InspectorLayoutControls>
	)
}

Edit.Controls = Controls
