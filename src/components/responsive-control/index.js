/**
 * External dependencies
 */
import { WhenResponsiveScreen } from '~stackable/components'
import { __getValue } from '~stackable/util'

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
	const getValue = __getValue( props.blockAttributes, getAttrName, '' )

	const { screens } = props

	return (
		<Fragment>
			{ screens.includes( 'desktop' ) &&
				<WhenResponsiveScreen screens={ screens }>
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
			}
			{ screens.includes( 'tablet' ) &&
				<WhenResponsiveScreen screens={ screens } screen="tablet">
					{ Children.toArray( props.children ).map( child => {
						return cloneElement( child, {
							value: getValue( 'Tablet' ),
							placeholder: getValue() || child.props.placeholder,
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
			}
			{ screens.includes( 'mobile' ) &&
				<WhenResponsiveScreen screens={ screens } screen="mobile">
					{ Children.toArray( props.children ).map( child => {
						return cloneElement( child, {
							value: getValue( 'Mobile' ),
							placeholder: getValue( 'Tablet' ) || getValue() || child.props.placeholder,
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
			}
		</Fragment>
	)
}

ResponsiveControl.defaultProps = {
	attrNameTemplate: '%s',
	setAttributes: () => {},
	blockAttributes: {},
	onChange: null,
	placeholder: '',
	screens: [ 'desktop', 'tablet', 'mobile' ],
}

export default ResponsiveControl
