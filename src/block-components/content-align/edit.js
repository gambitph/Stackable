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
	const align = useBlockAttributesContext( attributes => attributes.align )

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
			/>
			<AdvancedToolbarControl
				label={ __( 'Content Width', i18n ) }
				attribute="innerBlockContentAlign"
				default={ align ? `align${ align }` : '' }
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
