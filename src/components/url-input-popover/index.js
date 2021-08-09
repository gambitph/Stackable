/**
 * Internal dependencies
 */
import Button from '../button'

/**
 * WordPress dependencies
 */
import { Popover } from '@wordpress/components'
import { __experimentalLinkControl as LinkControl } from '@wordpress/block-editor' // eslint-disable-line @wordpress/no-unsafe-wp-apis
import { keyboardReturn } from '@wordpress/icons'
import { __ } from '@wordpress/i18n'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import classnames from 'classnames'
import {
	omit, omitBy, keys,
} from 'lodash'

const urlLabels = [
	{
		id: 'opensInNewTab',
		title: __( 'Opens in new tab', i18n ),
	},
	{
		id: 'noFollowLink',
		title: __( 'Nofollow link', i18n ),
	},
	{
		id: 'sponsored',
		title: __( 'Sponsored', i18n ),
	},
	{
		id: 'ugc',
		title: __( 'UGC', i18n ),
	},
]

const UrlInputPopover = props => {
	const {
		value,
		newTab,
		noFollow,
		sponsored,
		ugc,
	} = props

	const urlOptions = {
		url: value,
		opensInNewTab: newTab,
		noFollowLink: noFollow,
		sponsored,
		ugc,
	}

	if ( ! props.onChange && ! props.onChangeNewTab && ! props.onChangeNoFollow && ! props.onChangeSponsored && ! props.onChangeUgc ) {
		return null
	}

	const mainClassName = classnames( [
		'ugb-url-input-popover',
	] )

	const i18nUrlOptions = urlLabels.filter( ( { id } ) => {
		// Filters the options based on existing onChange props
		switch ( id ) {
			case 'opensInNewTab': return props.onChangeNewTab
			case 'noFollowLink': return props.onChangeNoFollow
			case 'sponsored': return props.onChangeSponsored
			case 'ugc': return props.onChangeUgc
			default: return true
		}
	} )

	return (
		<Popover
			className={ mainClassName }
			focusOnMount={ false }
			position={ props.position }
		>
			<LinkControl
				value={ urlOptions }
				settings={ i18nUrlOptions }
				showSuggestions={ ! props.disableSuggestions }
				onChange={
					option => {
						const onChangeKeys = {
							url: props.onChange,
							opensInNewTab: props.onChangeNewTab,
							noFollowLink: props.onChangeNoFollow,
							sponsored: props.onChangeSponsored,
							ugc: props.onChangeUgc,
						}

						// Gets only the changed values to update
						const changedValues = omitBy( omit( option, 'id', 'title', 'type' ), ( value, key ) => {
							return urlOptions[ key ] === value
						} )

						// Trigger onChange only to changed values
						keys( changedValues ).map( value => (
							onChangeKeys[ value ]?.( changedValues[ value ] )
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
}

UrlInputPopover.defaultProps = {
	value: '',
	disableSuggestions: false,
	onChange: null,
	position: 'bottom center',
	newTab: false,
	noFollow: false,
	sponsored: false,
	ugc: false,
	onChangeNewTab: null,
	onChangeNoFollow: null,
	onChangeSponsored: null,
	onChangeUgc: null,
}

export default UrlInputPopover
