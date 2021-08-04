/**
 * External dependencies
 */
import { camelCase } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter, hasFilter } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'
import { sprintf } from '@wordpress/i18n'
import striptags from 'striptags'

if ( ! hasFilter( 'stackable.div-background.output.after', 'stackable/container-link' ) ) {
	addFilter( 'stackable.div-background.output.after', 'stackable/container-link', ( output, props, blockProps ) => {
		const {
			index = 1,
			className,
		} = props

		if ( ! className.match( /ugb-container-link/ ) ) {
			return output
		}

		const {
			showContainerLink = false,
		} = blockProps.attributes

		const getAttrName = attrName => camelCase( sprintf( `container%d%s`, index, attrName ) )
		const getAttrValue = ( attrName, defaultValue = '' ) => {
			const value = blockProps.attributes[ getAttrName( attrName ) ]
			return value === '' ? value : ( value || defaultValue )
		}

		const newTab = getAttrValue( 'NewTab' )
		const noFollow = getAttrValue( 'NoFollow' )
		const sponsored = getAttrValue( 'Sponsored' )
		const ugc = getAttrValue( 'Ugc' )
		const title = getAttrValue( 'Title' )
		const url = getAttrValue( 'Url' )

		const rel = []
		if ( newTab ) {
			rel.push( 'noopener' )
			rel.push( 'noreferrer' )
		}

		if ( noFollow ) {
			rel.push( 'nofollow' )
		}

		if ( sponsored ) {
			rel.push( 'sponsored' )
		}

		if ( ugc ) {
			rel.push( 'ugc' )
		}

		return (
			<Fragment>
				{ output }
				{ showContainerLink && url && (
					<a // eslint-disable-line react/jsx-no-target-blank
						tabIndex="-1"
						aria-hidden="true"
						href={ url }
						target={ newTab ? '_blank' : undefined }
						rel={ rel.join( ' ' ) || undefined }
						title={ striptags( title ) || undefined }
					>
						{ null }
					</a>
				) }
			</Fragment>
		)
	} )
}
