/**
 * WordPress dependencies
 */
import {
	Button, Popover, PanelBody, TextControl,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { withState } from '@wordpress/compose'

/**
 * External dependencies
 */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { i18n } from 'stackable'

// Limit to 100 searches as not to stall the browser.
const MAX_SEARCH_ICONS = 100

export const searchIconName = search => {
	const lowerSearch = search && search.toLowerCase()
	const results = [
		...Object.values( fab ).filter( icon => icon.iconName.includes( lowerSearch ) ).slice( 0, MAX_SEARCH_ICONS ),
		...Object.values( far ).filter( icon => icon.iconName.includes( lowerSearch ) ).slice( 0, MAX_SEARCH_ICONS ),
		...Object.values( fas ).filter( icon => icon.iconName.includes( lowerSearch ) ).slice( 0, MAX_SEARCH_ICONS ),
	]

	return results.slice( 0, MAX_SEARCH_ICONS )
}

const IconSearchPopover = withState( {
	value: '',
} )( props => {
	const {
		value,
		setState,
	} = props
	const results = searchIconName( value )

	return (
		<Popover
			className="ugb-icon-popover"
			onClose={ props.onClose }
			onClickOutside={ props.onClickOutside }
		>
			<PanelBody>
				<div className="ugb-icon-popover__label-container">
					<TextControl
						className="ugb-icon-popover__input"
						value={ value }
						onChange={ value => {
							setState( { value } )
						} }
						placeholder={ __( 'Type to search icon', i18n ) }
					/>
					{ props.allowReset &&
						<Button
							onClick={ () => {
								props.onChange( '' )
								props.onClose()
							} }
							isSmall
							isDefault
							className="components-range-control__reset"
						>
							{ __( 'Remove', i18n ) }
						</Button>
					}
				</div>
				<div className="ugb-icon-popover__iconlist">
					{ results.map( ( { prefix, iconName }, i ) => {
						const iconValue = `${ prefix }-${ iconName }`
						return <button
							key={ i }
							className="components-button"
							onClick={ () => {
								props.onChange( iconValue )
								props.onClose()
							} }
						>
							<FontAwesomeIcon icon={ [ prefix, iconName ] } />
						</button>
					} ) }
					{ ! results.length &&
						<p className="components-base-control__help">{ __( 'No matches found', i18n ) }</p>
					}
				</div>
			</PanelBody>
		</Popover>
	)
} )

IconSearchPopover.defaultProps = {
	onChange: () => {},
	onClose: () => {},
	onClickOutside: () => {},
	allowReset: true,
}

export default IconSearchPopover
