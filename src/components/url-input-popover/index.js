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
	TextControl,
	Button,
} from '@wordpress/components'
import {
	URLInput, __experimentalLinkControl as LinkControl,
} from '@wordpress/block-editor'
import { keyboardReturn } from '@wordpress/icons'
import { __ } from '@wordpress/i18n'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import classnames from 'classnames'
import _ from 'lodash'

const ariaClosed = __( 'Show more tools & options', i18n )
const ariaOpen = __( 'Hide more tools & options', i18n )

const urlLabels = [
	{
		id: 'opensInNewTab',
		title: 'Opens in new tab',
	},
	{
		id: 'noFollowLink',
		title: 'Nofollow link',
	},
]

const UrlInputPopover = withState( {
	openAdvanced: false,
} )( props => {
	const {
		openAdvanced,
		value,
		newTab,
		noFollow,
		setState,
	} = props

	const urlOptions = {
		url: value,
		opensInNewTab: newTab,
		noFollowLink: noFollow,
	}

	if ( ! props.onChange && ! props.onChangeNewTab && ! props.onChangeNoFollow ) {
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
		'ugb--active': props.newTab || props.noFollow,
	} )

	const i18nUrlOptions = urlLabels.map( ( { id, title } ) => ( {
		id,
		title: __( title, i18n ), // eslint-disable-line no-restricted-syntax
	} ) )

	if ( ! LinkControl ) {
		return (
			<Popover
				className={ mainClassName }
				focusOnMount={ false }
				position={ props.position }
			>
				<PanelBody>
					<div className="ugb-url-input-popover__input-wrapper">
						<Dashicon className="ugb-url-input-control__icon" icon="admin-links" />
						{ props.onChange && ! props.disableSuggestions && // Auto-suggestions for inputting url.
						<URLInput
							className="ugb-url-input-control__input"
							value={ props.value }
							onChange={ props.onChange }
							autoFocus={ false } // eslint-disable-line
						/>
						}
						{ props.onChange && props.disableSuggestions && // Plain text control for inputting url.
						<TextControl
							className="ugb-url-input-control__input ugb-url-input-control__input--plain"
							value={ props.value }
							onChange={ props.onChange }
							autoFocus={ false } // eslint-disable-line
							placeholder={ __( 'Paste or type URL', i18n ) }
						/>
						}
						{ ( props.onChangeNewTab || props.onChangeNoFollow ) &&
						<IconButton
							className={ moreButtonClasses }
							icon="ellipsis"
							label={ openAdvanced ? ariaOpen : ariaClosed }
							onClick={ () => setState( { openAdvanced: ! openAdvanced } ) }
							aria-expanded={ openAdvanced }
						/>
						}
					</div>
					{ props.onChangeNewTab && openAdvanced &&
					<ToggleControl
						label={ __( 'Open link in new tab', i18n ) }
						checked={ props.newTab }
						onChange={ props.onChangeNewTab }
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
	}

	return (
		<Popover
			className={ mainClassName }
			focusOnMount={ false }
			position={ props.position }>
			<LinkControl
				value={ urlOptions }
				settings={ i18nUrlOptions }
				onChange={
					option => {
						const onChangeKeys = {
							url: props.onChange,
							opensInNewTab: props.onChangeNewTab,
							noFollowLink: props.onChangeNoFollow,

						}
						// Gets only the changed values to update
						 const changedValues = _.omitBy( _.omit( option, 'id', 'title', 'type' ), ( value, key ) => {
							return urlOptions[ key ] === value
						} )

						// Trigger onChange only to changed values
						_.keys( changedValues ).map( value => (
							onChangeKeys[ value ]( changedValues[ value ] )
						) )
					}
				}
			>
				<form>
					<input placeholder={ __( 'Search or type url', i18n ) } value={ value } />
					<Button
						icon={ keyboardReturn }
						type="submit"
					/>
				</form>
			</LinkControl>
		</Popover>
	)
} )

UrlInputPopover.defaultProps = {
	value: '',
	disableSuggestions: false,
	onChange: null,
	position: 'bottom center',

	newTab: false,
	noFollow: false,
	onChangeNewTab: null,
	onChangeNoFollow: null,
}

export default UrlInputPopover
