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
	useState, useEffect, useRef, memo, useMemo,
} from '@wordpress/element'
import { usePresetControls } from '~stackable/hooks'
import { useDesignLibraryContext } from '../modal-design-library/modal'

const DesignLibraryList = memo( props => {
	const {
		className = '',
		designs,
		isBusy,
	} = props
	const containerRef = useRef( null )

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
	>
		{ isBusy && <Spinner style={ { display: 'block', margin: '0 auto' } } /> }
		{ ! isBusy && <>
			<div className={ listClasses }>
				{ ( designs || [] ).map( ( design, i ) => {
					return (
						<DesignLibraryItem
							design={ design }
							key={ design.id || design.designId }
							designIndex={ i }
						/>
					)
				} ) }

				{ ! ( designs || [] ).length &&
					<p className="components-base-control__help" data-testid="nothing-found-note">{ __( 'No designs found', i18n ) }</p>
				}
			</div>
		</> }
	</div>
} )

DesignLibraryList.defaultProps = {
	designs: [],
	columns: 3,
	onSelect: () => {},
	isBusy: false,
}

export default DesignLibraryList

const DesignLibraryItem = memo( props => {
	const { design, designIndex } = props
	const wrapperRef = useRef( null )
	const [ shouldRender, setShouldRender ] = useState( designIndex < 9 )

	const [ selectedTab,
		selectedDesignIds,
		selectedDesignData,
		onSelectDesign,
		isMultiSelectBusy,
		containerScheme,
		backgroundScheme,
		enableBackground,
	] = useDesignLibraryContext()

	const { selectedNum, selectedData } = useMemo( () => {
		const selectedNum = selectedDesignIds.indexOf( design.id || design.designId ) + 1
		const selectedData = selectedNum ? selectedDesignData[ selectedNum - 1 ] : null

		return { selectedNum, selectedData }
	}, [ selectedDesignIds, selectedDesignData ] )

	const previewProps = useMemo( () => ( {
		designId: design.id || design.designId,
		template: design.template || design.content,
		category: design.category,
		plan: design.plan,
		label: design.label,
		containerScheme,
		backgroundScheme,
		enableBackground: selectedTab !== 'pages' ? enableBackground : true,
		selectedTab,
		selectedNum,
		selectedData,
		onClick: onSelectDesign,
	} ), [
		// Only track designId for memoization; other design properties will update when designId changes
		design.id || design.designId,
		containerScheme,
		backgroundScheme,
		enableBackground,
		selectedTab,
		// selectedNum and selectedData are always in sync; updating selectedNum also updates selectedData
		selectedNum,
		onSelectDesign,
	] )

	const { getPresetMarks } = usePresetControls( 'spacingSizes' )

	// Intentionally no dependencies: presetMarks won't change while the design library is open
	const presetMarks = useMemo( () => getPresetMarks() || null, [] )

	useEffect( () => {
		if ( selectedTab !== 'pages' ) {
			return
		}
		let id
		if ( typeof requestIdleCallback !== 'undefined' ) {
			id = requestIdleCallback( () => ! shouldRender ? setShouldRender( true ) : {} )
		} else {
			// fallback
			id = setTimeout( () => setShouldRender( true ), designIndex * 20 )
		}

		return () => {
			if ( typeof cancelIdleCallback !== 'undefined' ) {
				cancelIdleCallback( id )
			} else {
				clearTimeout( id )
			}
		}
	}, [ selectedTab ] )

	useEffect( () => {
		if ( selectedTab === 'pages' ) {
			return
		}

		const rootEl = document.querySelector( '.ugb-modal-design-library__designs' )
		if ( ! wrapperRef.current || ! rootEl ) {
			return
		}

		const observer = new IntersectionObserver( ( [ entry ] ) => {
			// reduce flicker during rapid scrolls
			requestAnimationFrame( () => {
				requestAnimationFrame( () => setShouldRender( entry.isIntersecting || entry.intersectionRatio > 0 ) )
			} )
		}, {
			root: rootEl,
			rootMargin: '500px',
			scrollMargin: '500px',
			threshold: 0,
		} )

		observer.observe( wrapperRef.current )

		return () => observer.disconnect()
	}, [ selectedTab ] )

	return (
		<div ref={ wrapperRef }>
			<DesignLibraryListItem
				previewProps={ previewProps }
				isMultiSelectBusy={ isMultiSelectBusy }
				shouldRender={ shouldRender }
				presetMarks={ presetMarks } />
		</div>
	)
} )
