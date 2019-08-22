/**
 * External dependencies
 */
import { WhenResponsiveScreen } from '~stackable/components'

/**
 * WordPress dependencies
 */
import {
	Children, cloneElement, Fragment,
} from '@wordpress/element'
import { camelCase } from 'lodash'
import { sprintf } from '@wordpress/i18n'

const ResponsiveControl = props => {
	const getAttrName = ( attrName = '' ) => camelCase( sprintf( props.attrNameTemplate, attrName ) )
	const getValue = ( attrName = '', defaultValue = '' ) => {
		const value = typeof props.blockAttributes[ getAttrName( attrName ) ] === 'undefined' ? '' : props.blockAttributes[ getAttrName( attrName ) ]
		return value !== '' ? value : defaultValue
	}

	return (
		<Fragment>
			<WhenResponsiveScreen>
				{ Children.toArray( props.children ).map( child => {
					return cloneElement( child, {
						value: getValue(),
						onChange: value => {
							if ( props.onChange ) {
								props.onChange( getAttrName(), value, '' )
							} else {
								props.setAttributes( { [ getAttrName() ]: value } )
							}
						},
					} )
				} ) }
			</WhenResponsiveScreen>
			<WhenResponsiveScreen screen="tablet">
				{ Children.toArray( props.children ).map( child => {
					return cloneElement( child, {
						value: getValue( 'Tablet' ),
						onChange: value => {
							if ( props.onChange ) {
								props.onChange( getAttrName( 'Tablet' ), value, 'Tablet' )
							} else {
								props.setAttributes( { [ getAttrName( 'Tablet' ) ]: value } )
							}
						},
					} )
				} ) }
			</WhenResponsiveScreen>
			<WhenResponsiveScreen screen="mobile">
				{ Children.toArray( props.children ).map( child => {
					return cloneElement( child, {
						value: getValue( 'Mobile' ),
						onChange: value => {
							if ( props.onChange ) {
								props.onChange( getAttrName( 'Mobile' ), value, 'Mobile' )
							} else {
								props.setAttributes( { [ getAttrName( 'Mobile' ) ]: value } )
							}
						},
					} )
				} ) }
			</WhenResponsiveScreen>
		</Fragment>
	)
}

ResponsiveControl.defaultProps = {
	attrNameTemplate: '%s',
	setAttributes: () => {},
	blockAttributes: {},
	onChange: null,
}

export default ResponsiveControl
