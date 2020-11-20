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

/**
 * WordPress deprendencies
 */
import { useState, useEffect } from '@wordpress/element'

const useUIKits = props => { //eslint-disable-line
	const [ styleList, setStyleList ] = useState( [] )
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
	}
}

export default useUIKits
