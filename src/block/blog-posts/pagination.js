/**
 * External dependencies
 */
import {
	range, camelCase, clamp,
} from 'lodash'
import classnames from 'classnames'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element'
import { __, sprintf } from '@wordpress/i18n'

/**
 * Function used to create pagination array to avoid crowded buttons.
 * e.g. ( [1,2,3,"...", 11] )
 *
 * @param {number} currentPage
 * @param {number} pages
 *
 * @return {Array} generated pagination array
 */
const generatePaginationArray = ( currentPage, pages ) => {
	const offsetInBetween = 2
	const leftOffset = clamp( currentPage - offsetInBetween, 1, pages )
	const rightOffset = clamp( currentPage + offsetInBetween, 1, pages )
	const ret = [ 1, '...', ...range( leftOffset, rightOffset + 1 ), '...', pages ]
	if ( leftOffset === 1 ) {
		ret.splice( 0, 2 )
	}
	if ( rightOffset === pages ) {
		ret.splice( ret.length - 3, 2 )
	}
	return ret
}

const PaginationButton = ( {
	className, children, onClick,
} ) => {
	return <button className={ className } onClick={ onClick }>
		<span className="ugb-button--inner">
			{ children }
		</span>
	</button>
}

PaginationButton.defaultProps = {
	className: '',
	children: null,
	onClick: () => {},
}

const Pagination = props => {
	const getAttrName = attrName => camelCase( sprintf( props.attrNameTemplate, attrName ) )
	const getAttrValue = ( attrName, defaultValue = '' ) => {
		const value = props.blockAttributes[ getAttrName( attrName ) ]
		return value === 0 ? value : ( value || defaultValue )
	}

	const {
		currentPage,
		pages,
		paginate,
	} = props

	const containerClassNames = classnames( [
		'ugb-button-container',
		props.containerClassName,
	]
	)

	const mainClasses = classnames( [
		'ugb-button',
		`ugb-button--size-${ getAttrValue( 'Size', 'normal' ) }`,
	], {
		'ugb-button--ghost-to-normal-effect': getAttrValue( 'HoverGhostToNormal' ),
		[ `ugb--hover-effect-${ getAttrValue( 'HoverEffect' ) }` ]: getAttrValue( 'Design' ) !== 'link' && getAttrValue( 'HoverEffect' ),
		[ `ugb--shadow-${ getAttrValue( 'Shadow' ) }` ]: getAttrValue( 'Design', 'basic' ) === 'basic' && getAttrValue( 'Shadow' ),
		[ `ugb-button--design-${ getAttrValue( 'Design' ) }` ]: getAttrValue( 'Design', 'basic' ) !== 'basic',
	} )

	return (
		<div className={ containerClassNames }>
			{ currentPage !== 1 &&
			<PaginationButton
				className={ mainClasses }
				onClick={ () => paginate( currentPage - 1 ) }
			>
				<span className="fas fa-angle-left" />
				{ __( 'Previous', i18n ) }
			</PaginationButton> }
			{ generatePaginationArray( currentPage, pages ).map( ( page, index ) => <PaginationButton
				key={ page + index }
				onClick={ () => page !== '...' && paginate( page ) }
				className={ `${ mainClasses }${ currentPage === page ? ' is-active' : '' }` }
			>
				{ page }
			</PaginationButton>
			) }
			{ pages !== 1 && currentPage !== pages &&
				<PaginationButton
					className={ mainClasses }
					onClick={ () => paginate( currentPage + 1 ) }
				>
					{ __( 'Next', i18n ) }
					<span className="fas fa-angle-right" />
				</PaginationButton>
			}
		</div>
	)
}

Pagination.defautProps = {
	paginate: () => {},
	currentPage: 1,
	pages: 1,
	atrrNameTemplate: '',
}

Pagination.Content = props => {
	const containerClassNames = classnames( [
		'ugb-button-container',
		props.containerClassName,
	]
	)

	const getAttrName = attrName => camelCase( sprintf( props.attrNameTemplate, attrName ) )
	const getAttrValue = ( attrName, defaultValue = '' ) => {
		const value = props.blockAttributes[ getAttrName( attrName ) ]
		return value === 0 ? value : ( value || defaultValue )
	}

	const mainClasses = classnames( [
		'ugb-button',
		`ugb-button--size-${ getAttrValue( 'Size', 'normal' ) }`,
	], {
		'ugb-button--ghost-to-normal-effect': getAttrValue( 'HoverGhostToNormal' ),
		[ `ugb--hover-effect-${ getAttrValue( 'HoverEffect' ) }` ]: getAttrValue( 'Design' ) !== 'link' && getAttrValue( 'HoverEffect' ),
		[ `ugb--shadow-${ getAttrValue( 'Shadow' ) }` ]: getAttrValue( 'Design', 'basic' ) === 'basic' && getAttrValue( 'Shadow' ),
		[ `ugb-button--design-${ getAttrValue( 'Design' ) }` ]: getAttrValue( 'Design', 'basic' ) !== 'basic',
	} )

	return <div className={ containerClassNames } data-child-classes={ mainClasses } />
}

export const usePagination = ( posts, numberOfItems ) => {
	const [ pages, setPages ] = useState( 1 )
	const [ currentPage, setCurrentPage ] = useState( 1 )
	const [ currentPagePosts, setCurrentPagePosts ] = useState( [] )

	useEffect( () => {
		setCurrentPagePosts( [ ...( posts || [] ) ].splice( ( currentPage - 1 ) * numberOfItems, numberOfItems ) )
	}, [ currentPage, pages ] )

	useEffect( () => {
		setCurrentPage( 1 )
		setPages( Math.ceil( ( posts || [] ).length / numberOfItems ) )
	}, [ JSON.stringify( posts ), numberOfItems ] )

	return {
		paginate: setCurrentPage,
		currentPage,
		pages,
		currentPagePosts,
	}
}

export default Pagination
