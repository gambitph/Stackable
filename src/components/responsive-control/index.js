import { Children, cloneElement, Fragment } from '@wordpress/element'
import { camelCase } from 'lodash'
import { sprintf } from '@wordpress/i18n'
import { WhenResponsiveScreen } from '@stackable/components'

const ResponsiveControl = props => {
	const getAttrName = ( attrName = '' ) => camelCase( sprintf( props.attrNameTemplate, attrName ) )
	const getValue = ( attrName = '', defaultValue = '' ) => props.blockAttributes[ getAttrName( attrName ) ] || defaultValue

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
								props.onChange( getAttrName( 'Tablet' ), value, 'tablet' )
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
								props.onChange( getAttrName( 'Mobile' ), value, 'mobile' )
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
