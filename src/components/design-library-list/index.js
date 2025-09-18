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
				{ ( designs?.[ 0 ] ? [ designs[ 0 ] ] : [] ).map( ( design, i ) => {
					const selectedNum = selectedDesigns.indexOf( design.id || design.designId ) + 1
					const selectedData = selectedNum ? selectedDesignData[ selectedNum - 1 ] : null

					const previewProps = {
						designId: design.id || design.designId,
						template: design.template || design.content,
						category: design.category,
						containerScheme: props.containerScheme,
						backgroundScheme: props.backgroundScheme,
						enableBackground: props.enableBackground,
						onClick: onSelectMulti,
					}

					return (
						<DesignLibraryItem
							key={ i }
							plan={ design.plan }
							label={ design.label || design.title }
							previewProps={ previewProps }
							selectedNum={ selectedNum }
							selectedData={ selectedData }
							selectedTab={ props.selectedTab }
							scrollTop={ scrollTop }
							designKey={ i }
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
	const {
		scrollTop, previewProps: _previewProps, ...propsToPass
	} = props

	const itemRef = useRef( null )
	const [ cardHeight, setCardHeight ] = useState( {} )
	const [ previewSize, setPreviewSize ] = useState( {} )
	const [ shouldRender, setShouldRender ] = useState( props.designKey < 9 )

	const previewProps = {
		..._previewProps,
		setPreviewSize: previewSize => setPreviewSize( previewSize ),
		setCardHeight: height => setCardHeight( height ),
		cardHeight,
	}

	useEffect( () => {
		// Use a timeout to ensure designs have finished rendering before calculating visibility.
		const timeoutRef = setTimeout( () => {
			const itemEl = itemRef.current
			const containerEl = itemEl?.closest( '.ugb-modal-design-library__designs' ) || document.querySelector( '.ugb-modal-design-library__designs' )

			if ( ! itemEl || ! containerEl ) {
				return
			}

			const containerRect = containerEl.getBoundingClientRect()
			const itemRect = itemEl.getBoundingClientRect()

			const BOUNDARY = 250

			const render = itemRect.bottom >= containerRect.top - BOUNDARY && itemRect.top <= containerRect.bottom + BOUNDARY

			setShouldRender( render )
		}, 250 )

		return () => {
			clearTimeout( timeoutRef )
		}
	}, [ scrollTop, _previewProps.enableBackground, _previewProps.designId ] )

	const getCardHeight = () => {
		const key = _previewProps.enableBackground ? 'background' : 'noBackground'
		return props.selectedTab === 'pages' ? 472 : cardHeight?.[ key ] || 250
	}

	if ( ! shouldRender && ! props.selectedNum ) {
		return <div ref={ itemRef } style={ { height: `${ getCardHeight() }px` } } />
	}

	return <DesignLibraryListItem
		ref={ itemRef }
		previewSize={ previewSize }
		previewProps={ previewProps }
		{ ...propsToPass }
	/>
}
