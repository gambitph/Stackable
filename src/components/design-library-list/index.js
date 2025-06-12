/**
 * Internal dependencies
 */
import DesignLibraryListItem from './design-library-list-item'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { Spinner } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import {
	useState, useEffect, useRef,
} from '@wordpress/element'

const DesignLibraryList = props => {
	const {
		className = '',
		designs,
		isBusy,
		onSelectMulti,
		selectedDesigns = [],
		selectedDesignData = [],
	} = props
	const containerRef = useRef( null )

	const [ scrollTop, setScrollTop ] = useState( 0 )

	const listClasses = classnames( [
		'ugb-design-library-items',
		className,
	] )

	useEffect( () => {
		containerRef.current.scrollTop = 0
	}, [ designs ] )

	return <div
		className="ugb-modal-design-library__designs"
		ref={ containerRef }
		onScroll={ e => {
			setScrollTop( e.currentTarget.scrollTop )
		} }
	>
		{ isBusy && <Spinner style={ { display: 'block', margin: '0 auto' } } /> }
		{ ! isBusy && <>
			<div className={ listClasses }>
				{ ( designs || [] ).map( ( design, i ) => {
					const selectedNum = selectedDesigns.indexOf( design.designId ) + 1
					const selectedData = selectedNum ? selectedDesignData[ selectedNum - 1 ] : null
					return (
						<DesignLibraryItem
							key={ i }
							template={ design.content }
							plan={ design.plan }
							designId={ design.designId }
							label={ design.title }
							category={ design.category }
							containerScheme={ props.containerScheme }
							backgroundScheme={ props.backgroundScheme }
							enableBackground={ props.enableBackground }
							selectedNum={ selectedNum }
							selectedData={ selectedData }
							onClick={ onSelectMulti }
							scrollTop={ scrollTop }
						/>
					)
				} ) }

				{ ! ( designs || [] ).length &&
					<p className="components-base-control__help" data-testid="nothing-found-note">{ __( 'No designs found', i18n ) }</p>
				}
			</div>
		</> }
	</div>
}

DesignLibraryList.defaultProps = {
	designs: [],
	columns: 3,
	onSelect: () => {},
	isBusy: false,
}

export default DesignLibraryList

const DesignLibraryItem = props => {
	const { scrollTop, ...propsToPass } = props
	const itemRef = useRef( null )
	const [ cardHeight, setCardHeight ] = useState( {} )
	const [ previewSize, setPreviewSize ] = useState( {} )
	const [ shouldRender, setShouldRender ] = useState( props.testKey < 9 )

	useEffect( () => {
		if ( ! itemRef.current ) {
			return
		}

		const containerRect = document.querySelector( '.ugb-modal-design-library__designs' ).getBoundingClientRect()
		const itemRect = itemRef.current.getBoundingClientRect()

		const render = ( itemRect.top > containerRect.top - 250 && itemRect.top < containerRect.bottom + 250 ) ||
		( itemRect.bottom > containerRect.top - 250 && itemRect.bottom < containerRect.bottom + 250 )

		setShouldRender( render )
	}, [ scrollTop, props.enableBackground ] )

	const getCardHeight = () => {
		const key = props.enableBackground ? 'background' : 'noBackground'
		return cardHeight?.[ key ] || 250
	}

	if ( ! shouldRender && ! props.selectedNum ) {
		return <div ref={ itemRef } data-stk-design-id={ props.testId } style={ { height: `${ getCardHeight() }px` } } />
	}

	return <DesignLibraryListItem
		ref={ itemRef }
		previewSize={ previewSize }
		setPreviewSize={ previewSize => setPreviewSize( previewSize ) }
		setCardHeight={ height => setCardHeight( height ) }
		{ ...propsToPass }
	/>
}
