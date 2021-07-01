/**
 * Internal dependencies
 */
import SVGImageIcon from './images/image.svg'
import AdvancedControl, { extractControlProps } from '../base-control2'
import { useAttributeName, useBlockAttributes } from '~stackable/hooks'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { Dashicon } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { Fragment, useCallback } from '@wordpress/element'
import { MediaUpload, useBlockEditContext } from '@wordpress/block-editor'
import { dispatch } from '@wordpress/data'

const ImageControl = props => {
	const { clientId } = useBlockEditContext()

	const attributes = useBlockAttributes( clientId )
	const attrNameId = useAttributeName( `${ props.attribute }Id`, props.responsive, props.hover )
	const attrNameUrl = useAttributeName( `${ props.attribute }Url`, props.responsive, props.hover )

	const imageId = attributes[ attrNameId ]
	const imageUrl = attributes[ attrNameUrl ]

	const [ _propsToPass, controlProps ] = extractControlProps( props )

	const type = imageUrl && imageUrl.match( /(mp4|webm|ogg)$/i ) ? 'video' : 'image'

	const onChange = useCallback( ( { url, id } ) => {
		dispatch( 'core/block-editor' ).updateBlockAttributes( clientId, {
			[ attrNameId ]: id,
			[ attrNameUrl ]: url,
		} )
	}, [ clientId, attrNameId, attrNameUrl ] )

	const onRemove = useCallback( () => {
		onChange( {
			url: '',
			id: '',
		} )
	}, [ onChange ] )

	return (
		<AdvancedControl
			{ ...controlProps }
			className={ classnames( 'ugb-image-control', props.className ) }
		>
			<MediaUpload
				onSelect={ onChange }
				allowedTypes={ props.allowedTypes }
				value={ imageId }
				render={ obj => {
					return (
						<Fragment>
							{ imageUrl &&
								<div className="ugb-image-preview-wrapper">
									<button className="ugb-image-preview-remove" onClick={ onRemove }>
										<Dashicon icon="no" />
									</button>
									{ type === 'video' && (
										<video
											className="ugb-image-preview"
											autoPlay
											muted
											loop
											src={ imageUrl }
											onClick={ obj.open }
											onKeyDown={ event => {
												if ( event.keyCode === 13 ) {
													obj.open()
												}
											} }
										/>
									) }
									{ type === 'image' && (
										/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */
										<img
											className="ugb-image-preview"
											src={ imageUrl }
											onClick={ obj.open }
											onKeyDown={ event => {
												if ( event.keyCode === 13 ) {
													obj.open()
												}
											} }
											alt={ __( 'preview', i18n ) }
										/>
									) }
								</div>
							}
							{ ! imageUrl && (
								<div
									className="ugb-placeholder"
									onClick={ obj.open }
									onKeyDown={ event => {
										if ( event.keyCode === 13 ) {
											obj.open()
										}
									} }
									role="button"
									tabIndex={ 0 }
								>
									<SVGImageIcon />
								</div>
							) }
						</Fragment>
					)
				} }
			/>
		</AdvancedControl>
	)
}

ImageControl.defaultProps = {
	label: '',

	attribute: '',
	allowedTypes: [ 'image' ],
	responsive: false,
	hover: false,

	value: undefined,
	onChange: undefined,
}

export default ImageControl
