/**
 * Internal dependencies
 */
import DesignLibraryListItem from './design-library-list-item'
import { useDesignLibraryContext } from '../context'

/**
 * External dependencies
 */
import { i18n, isPro } from 'stackable'
import { usePresetControls } from '~stackable/hooks'
import { ProControl } from '~stackable/components'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { Spinner } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import {
	useState, useEffect, useRef, memo, useMemo,
} from '@wordpress/element'

const DesignLibraryList = memo( props => {
	const {
		className = '',
		designs,
		isBusy,
		selectedTab,
		selectedCategory,
		errors,
	} = props
	const containerRef = useRef( null )
	const canManageUserPatterns = useDesignLibraryContext()[ 8 ]

	const isEmpty = ! ( designs || [] ).length
	const isSavedTabEmpty = selectedTab === 'saved' && isEmpty

	const listClasses = classnames( [
		'ugb-design-library-items',
		className,
		{
			'ugb-design-library-items--empty': isSavedTabEmpty,
		},
	] )

	useEffect( () => {
		containerRef.current.scrollTop = 0
	}, [ selectedTab, selectedCategory ] )

	return <div
		className="ugb-modal-design-library__designs"
		ref={ containerRef }
	>
		{ selectedTab === 'saved' && ! isPro
			? <ProControl type="design-library-saved-patterns" />
			: <>
				{ isBusy && <Spinner style={ { display: 'block', margin: '0 auto' } } /> }
				{ ! isBusy && <div className={ listClasses }>
					{ ( designs || [] ).map( ( design, i ) => {
						return (
							<DesignLibraryItem
								design={ design }
								key={ design.id || design.designId }
								designIndex={ i }
							/>
						)
					} ) }

					{ isSavedTabEmpty &&
						<p className="components-base-control__help stk-no-saved-designs" data-testid="nothing-found-note">
							{ __( 'No designs saved yet', i18n ) }
							{ canManageUserPatterns && <>
								<br />
								<span>
									{ __( 'Tip: You can save your own section layouts to reuse them in your Stackable design library. Just click the "•••" (More) menu on a Stackable Columns block and choose "Save to Design Library".', i18n ) }
								</span>
							</> }
						</p>

					}
					{ typeof errors === 'object' && errors && Object.keys( errors ).length &&
						<p className="components-base-control__help">
							<strong>{ __( 'An error has occurred:', i18n ) }</strong>
							<br />
							{ Object.values( errors ).join( '; ' ) }
						</p> }
				</div> }
			</>
		}
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
	const hasRenderedRef = useRef( designIndex < 9 )
	const [ shouldRender, setShouldRender ] = useState( designIndex < 9 )

	const [ selectedTab,
		selectedDesignIds,
		selectedDesignData,
		onSelectDesign,
		isMultiSelectBusy,
		containerScheme,
		backgroundScheme,
		enableBackground,
		canManageUserPatterns,
	] = useDesignLibraryContext()

	const { selectedNum, selectedData } = useMemo( () => {
		const selectedNum = selectedDesignIds.indexOf( design.id || design.designId ) + 1
		const selectedData = selectedNum ? selectedDesignData[ selectedNum - 1 ] : null

		return { selectedNum, selectedData }
	}, [ selectedDesignIds, selectedDesignData ] )

	const previewProps = useMemo( () => ( {
		designId: design.id || design.designId,
		template: design.template || design.content,
		modified: design.modified,
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
		canManageUserPatterns,
	} ), [
		// Track modified date so same-slug saved patterns rerender after content changes.
		design.id || design.designId,
		design.modified,
		containerScheme,
		backgroundScheme,
		enableBackground,
		selectedTab,
		// selectedNum and selectedData are always in sync; updating selectedNum also updates selectedData
		selectedNum,
		onSelectDesign,
		canManageUserPatterns,
	] )

	const { getPresetMarks } = usePresetControls( 'spacingSizes' )

	// Intentionally no dependencies: presetMarks won't change while the design library is open
	const presetMarks = useMemo( () => getPresetMarks() || null, [] )

	useEffect( () => {
		const rootEl = document.querySelector( '.ugb-modal-design-library__designs' )
		if ( ! wrapperRef.current || ! rootEl ) {
			return
		}

		const observer = new IntersectionObserver( ( [ entry ] ) => {
			if ( entry.isIntersecting || entry.intersectionRatio > 0 ) {
				hasRenderedRef.current = true
				setShouldRender( true )
				return
			}

			if ( ! hasRenderedRef.current ) {
				setShouldRender( false )
			}
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
