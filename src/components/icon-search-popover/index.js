/**
 * Internal dependencies
 */
import SVGDrop from './images/drop.svg'
import { searchFontAwesomeIconName } from './search'

/**
 * WordPress dependencies
 */
import {
	Button, Popover, PanelBody, TextControl, Spinner,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import {
	useState, useEffect,
} from '@wordpress/element'

/**
 * External dependencies
 */
import {
	i18n, isPro, settingsUrl,
} from 'stackable'
import { FontAwesomeIcon } from '~stackable/components'
import { faGetSVGIcon } from '~stackable/util'
import { FileDrop } from 'react-file-drop'
import classnames from 'classnames'

let searchTimeout = null
let tempMediaUpload = null

/**
 * Adds a new class "ugb-custom-icon" to an SVG string.
 *
 * @param {string} svgString The SVG in string form
 * @param {string} customClass Class to add
 *
 * @return {string} The modified SVG
 */
export const addCustomIconClass = ( svgString, customClass = 'ugb-custom-icon' ) => {
	if ( svgString.match( /(<svg[^>]*class=["'])/ ) ) {
		// Svg with an existing class attribute.
		return svgString.replace( /(<svg[^>]*class=["'])/, `$1${ customClass } ` )
	} else if ( svgString.match( /(<svg)/ ) ) {
		// Svg without a class attribute.
		return svgString.replace( /(<svg)/, `$1 class="${ customClass }"` )
	}
	return svgString
}

/**
 * Cleans up the SVG, removes the <?xml> tag and comments
 *
 * @param {string} svgString The SVG in string form
 */
export const cleanSvgString = svgString => {
	// Get the SVG only
	let newSvg = svgString.replace( /(^[\s\S]*?)(<svg)/gm, '$2' )
		.replace( /(<\/svg>)([\s\S]*)/g, '$1' )

	// Remove simple grouping so that we can color SVGs.
	for ( let i = 0; i < 2; i++ ) {
		newSvg = newSvg.replace( /\s*<g\s*>([\s\S]*?)<\/g>\s*/gm, '$1' )
	}

	return newSvg
}

const IconSearchPopover = props => {
	const [ value, setValue ] = useState( '' )
	const [ results, setResults ] = useState( [] )
	const [ isBusy, setIsBusy ] = useState( false )
	const [ isDropping, setIsDropping ] = useState( false )

	const allowSVGUpload = props.returnSVGValue

	// Debounce search.
	useEffect( () => {
		let isMounted = true
		clearTimeout( searchTimeout )
		searchTimeout = setTimeout( () => {
			if ( ! isMounted ) {
				return
			}
			setIsBusy( true )
			searchFontAwesomeIconName( value )
				.then( results => {
					if ( isMounted ) {
						setResults( results )
					}
				} )
				.finally( () => {
					if ( isMounted ) {
						setIsBusy( false )
					}
				} )
		}, 500 )

		return () => {
			isMounted = false
			clearTimeout( searchTimeout )
		}
	}, [ value ] )

	// Workaround for Gutenberg. When dropping files on the editor, even
	// if dragging on a popup, the editor thinks you're dropping a file
	// to insert it. A workaround is to temporarily disable media uploading
	// to trick the DropZone into doing nothing when the file is dropped.
	useEffect( () => {
		if ( ! tempMediaUpload ) {
			tempMediaUpload = wp.data.select( 'core/block-editor' ).getSettings().mediaUpload
		}
		if ( isDropping ) {
			wp.data.dispatch( 'core/block-editor' ).updateSettings( { mediaUpload: null } )
		} else if ( wp.data.select( 'core/block-editor' ).getSettings().mediaUpload !== tempMediaUpload ) {
			wp.data.dispatch( 'core/block-editor' ).updateSettings( { mediaUpload: tempMediaUpload } )
		}
	}, [ isDropping ] )

	// Open the upload dialog and let the user pick an SVG.
	const uploadSvg = event => {
		event.preventDefault()

		const input = document.createElement( 'input' )
		input.accept = 'image/svg+xml'
		input.type = 'file'
		input.onchange = e => {
			const files = e.target.files
			if ( ! files.length ) {
				setIsDropping( false )
				return
			}

			// Read the SVG,
			const fr = new FileReader()
			fr.onload = function( e ) {
				setIsDropping( false )
				const svgString = cleanSvgString( addCustomIconClass( e.target.result ) )
				props.onChange( svgString )
				props.onClose()
			}

			fr.readAsText( files[ 0 ] )
		}
		input.click()
	}

	const labelContainerClasses = classnames( [
		'ugb-icon-popover__label-container',
	], {
		'ugb-icon--has-settings': isPro,
		'ugb-icon--has-upload': allowSVGUpload,
		'ugb-icon--has-reset': props.allowReset,
	} )

	return (
		<Popover
			className="ugb-icon-popover"
			onClose={ props.onClose }
			onClickOutside={ props.onClickOutside }
			position={ props.position }
			anchorRef={ props.anchorRef }
		>
			<PanelBody>
				<FileDrop
					onFrameDragEnter={ () => setIsDropping( true ) }
					onFrameDragLeave={ () => setIsDropping( false ) }
					onFrameDrop={ () => setIsDropping( false ) }
					onDrop={ files => {
						if ( ! allowSVGUpload || ! files.length ) {
							setIsDropping( false )
							return
						}

						// Only SVGs are allowed.
						if ( files[ 0 ].type !== 'image/svg+xml' ) {
							setIsDropping( false )
							return
						}

						// Read the SVG,
						const fr = new FileReader()
						fr.onload = function( e ) {
							setIsDropping( false )
							const svgString = cleanSvgString( addCustomIconClass( e.target.result ) )
							props.onChange( svgString )
							props.onClose()
						}

						fr.readAsText( files[ 0 ] )
					} }
				>
					<div className={ labelContainerClasses }>
						<TextControl
							className="ugb-icon-popover__input"
							value={ value }
							onChange={ setValue }
							placeholder={ __( 'Type to search icon', i18n ) }
						/>
						{ isPro &&
							<Button
								className="ugb-icon-popover__settings-button"
								icon="admin-generic"
								href={ settingsUrl + '#icon-settings' }
								target="_settings"
								iconSize="16"
								label={ __( 'Icon Settings', i18n ) }
								showTooltip={ true }
								isSmall
								isSecondary
							/>
						}
						{ allowSVGUpload &&
							<Button
								onClick={ uploadSvg }
								isSmall
								isPrimary
								className="components-range-control__upload"
							>
								{ __( 'Upload SVG', i18n ) }
							</Button>
						}
						{ props.allowReset &&
							<Button
								onClick={ () => {
									props.onChange( '' )
									props.onClose()
								} }
								isSmall
								isSecondary
								className="components-range-control__reset"
							>
								{ __( 'Clear icon', i18n ) }
							</Button>
						}
					</div>
					<div className="ugb-icon-popover__iconlist">
						{ isBusy && <Spinner /> }
						{ ! isBusy && results.map( ( { prefix, iconName }, i ) => {
							const iconValue = `${ prefix }-${ iconName }`
							return <button
								key={ i }
								className={ `components-button ugb-prefix--${ prefix } ugb-icon--${ iconName }` }
								onClick={ () => {
									if ( props.returnSVGValue ) {
										props.onChange( cleanSvgString( faGetSVGIcon( prefix, iconName ) ) )
									} else {
										props.onChange( iconValue, prefix, iconName )
									}
									props.onClose()
								} }
							>
								<FontAwesomeIcon prefix={ prefix } iconName={ iconName } />
							</button>
						} ) }
						{ ! isBusy && ! results.length &&
						<p className="components-base-control__help">{ __( 'No matches found', i18n ) }</p>
						}
					</div>
					{ allowSVGUpload && isDropping &&
						<div className="ugb-icon-popover__drop-indicator">
							<SVGDrop height="40" width="40" />
							{ __( 'Drop your SVG here', i18n ) }
						</div>
					}
				</FileDrop>
			</PanelBody>
		</Popover>
	)
}

IconSearchPopover.defaultProps = {
	onChange: () => {},
	onClose: () => {},
	onClickOutside: () => {},
	returnSVGValue: true, // If true, the value provided in onChange will be the SVG markup of the icon. If false, the value will be a prefix-iconName value.
	allowReset: true,
	anchorRef: undefined,
	position: 'center',
}

export default IconSearchPopover
