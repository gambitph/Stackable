/**
 * WordPress dependencies
 */
import { withState } from '@wordpress/compose'
import {
	Dashicon,
	IconButton,
	Popover,
	PanelBody,
	ToggleControl,
} from '@wordpress/components'
import { URLInput } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import classnames from 'classnames'

const ariaClosed = __( 'Show more tools & options', i18n )
const ariaOpen = __( 'Hide more tools & options', i18n )

const UrlInputPopover = withState( {
	openAdvanced: false,
} )( props => {
	const {
		openAdvanced,
		setState,
	} = props

	if ( ! props.onChange && ! props.onChangeNewWindow && ! props.onChangeNoFollow ) {
		return null
	}

	const mainClassName = classnames( [
		'ugb-url-input-popover',
	], {
		'ugb--show-advanced': openAdvanced,
	} )

	const moreButtonClasses = classnames( [
		'ugb-url-input-control__more-button',
	], {
		'ugb--active': props.newWindow || props.noFollow,
	} )

	return (
		<Popover
			className={ mainClassName }
			focusOnMount={ false }
			position="bottom center"
		>
			<PanelBody>
				<div className="ugb-url-input-popover__input-wrapper">
					<Dashicon className="ugb-url-input-control__icon" icon="admin-links" />
					{ props.onChange &&
						<URLInput
							className="ugb-url-input-control__input"
							value={ props.value }
							onChange={ props.onChange }
							autoFocus={ false } // eslint-disable-line
						/>
					}
					{ ( props.onChangeNewWindow || props.onChangeNoFollow ) &&
						<IconButton
							className={ moreButtonClasses }
							icon="ellipsis"
							label={ openAdvanced ? ariaOpen : ariaClosed }
							onClick={ () => setState( { openAdvanced: ! openAdvanced } ) }
							aria-expanded={ openAdvanced }
						/>
					}
				</div>
				{ props.onChangeNewWindow && openAdvanced &&
					<ToggleControl
						label={ __( 'Open link in new window', i18n ) }
						checked={ props.newWindow }
						onChange={ props.onChangeNewWindow }
					/>
				}
				{ props.onChangeNoFollow && openAdvanced &&
					<ToggleControl
						label={ __( 'Nofollow link', i18n ) }
						checked={ props.noFollow }
						onChange={ props.onChangeNoFollow }
					/>
				}
			</PanelBody>
		</Popover>
	)
} )

UrlInputPopover.defaultProps = {
	value: '',
	onChange: null,

	newWindow: false,
	noFollow: false,
	onChangeNewWindow: null,
	onChangeNoFollow: null,
}

export default UrlInputPopover
