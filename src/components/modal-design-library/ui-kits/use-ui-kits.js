/**
 * UI Kits tab books.
 */

/**
 * External deprendencies
 */
import {
	getAllCategories,
} from '~stackable/design-library'
import { startCase } from 'lodash'
import { i18n } from 'stackable'

/**
 * WordPress deprendencies
 */
import { useState, useEffect } from '@wordpress/element'
import { __, sprintf } from '@wordpress/i18n'

const useUIKits = props => { //eslint-disable-line
	const [ styleList, setStyleList ] = useState( [] )
	const [ style, _setStyle ] = useState( '' )
	const [ plan, _setPlan ] = useState( '' )
	const [ search, _setSearch ] = useState( props.search )
	const [ mood, setMood ] = useState( '' )
	const [ columns, setColumns ] = useState( 4 )
	const [ contentTitle, setContentTitle ] = useState( __( 'All UI Kits', i18n ) )

	const options = [
		{
			label: __( 'All UI Kits', i18n ),
			value: '',
		},
		{
			label: __( 'Free UI Kits', i18n ),
			value: 'free',
		},
		{
			label: __( 'Premium UI Kits', i18n ),
			value: 'premium',
		},
	]

	const setPlan = plan => {
		setContentTitle( options.find( option => option.value === plan ).label )
		_setSearch( '' )
		_setPlan( plan )
	}

	const setStyle = block => {
		setContentTitle( styleList.find( option => option.value === block ).label )
		_setSearch( '' )
		_setStyle( block )
	}

	const setSearch = search => {
		setContentTitle( sprintf( __( 'Search result for: "%s"', i18n ), search ) )
		if ( search === '' ) {
			setContentTitle( options.find( option => option.value === plan ).label )
		}
		_setSearch( search )
	}

	useEffect( () => {
		getAllCategories().then( styles => {
			const _styleList = styles.map( style => ( {
				label: startCase( style ),
				value: style,
			} ) )
			setStyleList( _styleList )
		} )
	}, [] )

	return {
		styleList,
		style,
		setStyle,
		search,
		setSearch,
		setPlan,
		plan,
		contentTitle,
		options,
		mood,
		setMood,
		columns,
		setColumns,
	}
}

export default useUIKits
