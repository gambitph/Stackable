/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { camelCase, upperFirst } from 'lodash'
import { AdvancedToolbarControl } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'
import { useSelect, useDispatch } from '@wordpress/data'
import { __, sprintf } from '@wordpress/i18n'
import { BaseControl } from '@wordpress/components'

export const Edit = props => {
	const { clientId } = useBlockEditContext()

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )
	const { attributes } = useSelect(
		select => {
			const { getBlockAttributes } = select( 'core/block-editor' )
			return {
				attributes: getBlockAttributes( clientId ),
			}
		},
		[ clientId ]
	)

	const {
		attrNameTemplate,
	} = props

	const getAttrName = attrName => camelCase( sprintf( attrNameTemplate, upperFirst( attrName ) ) )
	const getAttribute = attrName => attributes[ getAttrName( attrName ) ]
	const updateAttributes = attrName => value => updateBlockAttributes( clientId, { [ getAttrName( attrName ) ]: value } )

	return (
		<BaseControl
			id="ugb-background-color-type"
			className="ugb--help-tip-background-color-type"
		>
			<AdvancedToolbarControl
				controls={ [
					{
						value: '',
						title: __( 'Single', i18n ),
					},
					{
						value: 'gradient',
						title: __( 'Gradient', i18n ),
					},
				] }
				value={ getAttribute( 'backgroundColorType' ) }
				onChange={ updateAttributes( 'backgroundColorType' ) }
				fullwidth={ false }
				isSmall={ true }
			/>
			{ /* TODO: Add more! */ }
		</BaseControl>
	)
}

Edit.defaultProps = {
	attrNameTemplate: '%s',
}
