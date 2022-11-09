/**
 * External dependencies
 */
import { last } from 'lodash'
import { i18n } from 'stackable'

/**
 * Internal dependencies
 */
import fonts from './google-fonts.json'
import { ResetButton } from '../base-control2/reset-button'
import { loadGoogleFont } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import {
	FormTokenField,
	__experimentalHStack as HStack, // eslint-disable-line @wordpress/no-unsafe-wp-apis
} from '@wordpress/components'

const fontOptions = fonts.map( font => {
	return { label: font.family, value: font.family }
} )

// This is how we defined the fonts before.
const FONTS = applyFilters( 'stackable.font-family-control.options', [
	{
		id: 'system-fonts',
		title: __( 'System Fonts', i18n ),
		options: [
			{ label: __( 'Sans-Serif', i18n ), value: 'Sans-Serif' },
			{ label: __( 'Serif', i18n ), value: 'Serif' },
			{ label: __( 'Serif Alternative', i18n ), value: 'Serif-Alt' },
			{ label: __( 'Monospace', i18n ), value: 'Monospace' },
		],
	},
	{
		id: 'google-fonts',
		title: __( 'Google Fonts', i18n ),
		options: fontOptions,
	},
] )

// Transform the fonts so we can call them by value.
const FONTS_BY_VALUE = FONTS.reduce( ( fonts, category ) => {
	category.options.forEach( font => {
		fonts[ font.value ] = {
			label: font.label,
			category: category.id,
			isGoogleFont: category.id === 'google-fonts',
		}
	} )
	return fonts
}, {} )

const SUGGESTIONS = Object.keys( FONTS_BY_VALUE )

// This creates the styles necessary to simulate categories in the drop down.
const CategoryStyles = ( id, label ) => {
	return `.components-form-token-field__suggestion:has([data-stk-category="${ id }"]) + .components-form-token-field__suggestion:has([data-stk-category="${ id }"]) {
			margin-top: 0;
		}
		.components-form-token-field__suggestion:has([data-stk-category="${ id }"]) + .components-form-token-field__suggestion:has([data-stk-category="${ id }"])::before {
			display: none;
		}
		.components-form-token-field__suggestion:has([data-stk-category="${ id }"]) {
			margin-top: 32px;
			position: relative;
		}
		.components-form-token-field__suggestion:has([data-stk-category="${ id }"])::before {
			content: "${ label }";
			position: absolute;
			margin-top: -24px;
			color: #222;
			font-weight: bold;
			font-size: 0.9em;
		}`
}

const CATEGORY_LABEL_STYLES = FONTS.map( ( { id, title } ) => {
	return CategoryStyles( id, title )
} ).join( '' )

const FontFamilyControl = props => {
	return (
		<HStack align="flex-start" justify="space-between" className="stk-font-family-control">
			<style>{ CATEGORY_LABEL_STYLES }</style>
			<FormTokenField
				label={ props.label }
				maxLength={ 1 }
				__experimentalExpandOnFocus
				__experimentalShowHowTo={ false }
				suggestions={ SUGGESTIONS }
				value={ props.value ? [ props.value ] : [] }
				__experimentalRenderItem={ option => {
					const value = option.item
					return <div
						data-stk-category={ FONTS_BY_VALUE[ value ].category } // This is a workaround for categories.
					>{ FONTS_BY_VALUE[ value ].label }</div>
				} }
				onChange={ fontFamily => {
					const value = last( fontFamily )
					// Load font if it's a Google font.
					if ( FONTS_BY_VALUE[ value ].isGoogleFont ) {
						loadGoogleFont( value )
					}
					props.onChange( value )
				} }
			/>
			<ResetButton
				value={ props.value }
				default=""
				onChange={ () => props.onChange( '' ) }
			/>
		</HStack>
	)
}

FontFamilyControl.defaultProps = {
	onChange: () => {},
	label: __( 'Font Family', i18n ),
	value: '',
}

export default FontFamilyControl
