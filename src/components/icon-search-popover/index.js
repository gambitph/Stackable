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
import { i18n } from 'stackable'
import { FontAwesomeIcon } from '~stackable/components'

import { searchFontAwesomeIconName } from './search'

let searchTimeout = null

const IconSearchPopover = props => {
	const [ value, setValue ] = useState( '' )
	const [ results, setResults ] = useState( [] )
	const [ isBusy, setIsBusy ] = useState( false )

	// Debounce search.
	useEffect( () => {
		clearTimeout( searchTimeout )
		searchTimeout = setTimeout( () => {
			setIsBusy( true )
			searchFontAwesomeIconName( value )
				.then( results => {
					setResults( results )
				} )
				.finally( () => {
					setIsBusy( false )
				} )
		}, 500 )

		return () => clearTimeout( searchTimeout )
	}, [ value ] )

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
						onChange={ setValue }
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
					{ isBusy && <Spinner /> }
					{ ! isBusy && results.map( ( { prefix, iconName }, i ) => {
						const iconValue = `${ prefix }-${ iconName }`
						return <button
							key={ i }
							className={ `components-button ugb-prefix--${ prefix } ugb-icon--${ iconName }` }
							onClick={ () => {
								props.onChange( iconValue, prefix, iconName )
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
			</PanelBody>
		</Popover>
	)
}

IconSearchPopover.defaultProps = {
	onChange: () => {},
	onClose: () => {},
	onClickOutside: () => {},
	allowReset: true,
}

export default IconSearchPopover
