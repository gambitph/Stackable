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
		selectedTab,
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
				{ ( designs || [] ).map( design => {
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
							key={ design.id || design.designId }
							plan={ design.plan }
							label={ design.label || design.title }
							selectedNum={ selectedNum }
							selectedData={ selectedData }
							selectedTab={ selectedTab }
							{ ...previewProps }
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
	const wrapperRef = useRef( null )
	const [ shouldRender, setShouldRender ] = useState( false )

	useEffect( () => {
		const rootEl = document.querySelector( '.ugb-modal-design-library__designs' )
		if ( ! wrapperRef.current || ! rootEl ) {
			return
		}

		const observer = new IntersectionObserver( ( [ entry ] ) => {
			// reduce flicker during rapid scrolls
			requestAnimationFrame( () => {
				requestAnimationFrame( () => setShouldRender( entry.isIntersecting ) )
			} )
		}, {
			root: rootEl,
			rootMargin: '500px 0px',
			threshold: 0,
		} )

		observer.observe( wrapperRef.current )
		return () => observer.disconnect()
	}, [] )

	return (
		<div ref={ wrapperRef }>
			<DesignLibraryListItem { ...props } shouldRender={ shouldRender } />
		</div>
	)
}
