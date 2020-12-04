/**
 * Internal deprendencies
 */
import SVGViewSingle from './images/view-single.svg'
import SVGViewMany from './images/view-many.svg'
import SVGViewFew from './images/view-few.svg'
import BlockList from './block-list'
// import ColorList from './color-list'

/**
 * External deprendencies
 */
import DesignLibraryList from '~stackable/components/design-library-list'
import { getDesigns, setDevModeDesignLibrary } from '~stackable/design-library'
import { i18n, devMode } from 'stackable'
import { useLocalStorage } from '~stackable/util'

/**
 * WordPress deprendencies
 */
import {
	Modal, TextControl, Button, ToggleControl,
} from '@wordpress/components'
import {
	useEffect, useState,
} from '@wordpress/element'
import { __ } from '@wordpress/i18n'

const ModalDesignLibrary = props => {
	const [ search, setSearch ] = useState( props.search )
	const [ block, setBlock ] = useState()
	const [ plan, setPlan ] = useState( '' )
	const [ categories, setCategories ] = useState( [] )
	const [ columns, setColumns ] = useState( 3 )
	const [ designs, setDesigns ] = useState( [] )
	const [ isBusy, setIsBusy ] = useState( true )
	const [ doReset, setDoReset ] = useState( false )
	const [ isDevMode, setIsDevMode ] = useLocalStorage( 'stk__design_library_dev_mode', false )

	useEffect( () => setBlock( props.selectedBlock ), [ props.selectedBlock ] )

	const [ searchDebounced, setSearchDebounced ] = useState( search )
	const [ debounceTimeout, setDebounceTimeout ] = useState( null )

	useEffect( () => {
		if ( debounceTimeout ) {
			clearTimeout( debounceTimeout )
			setDebounceTimeout( null )
		}
		setDebounceTimeout( setTimeout( () => {
			setSearchDebounced( search )
		}, 500 ) )
	}, [ search ] )

	// Select the input field on open.
	// Use this method since useRef isn't working.
	useEffect( () => {
		const input = document.querySelector( '.ugb-modal-design-library__search input' )
		if ( input ) {
			input.focus()
		}
	}, [] )

	useEffect( () => {
		if ( doReset ) {
			setDesigns( [] )
			setIsBusy( true )
		}
		getDesigns( {
			type: 'block',
			block,
			plan,
			categories,
			search: searchDebounced,
			reset: doReset,
		} ).then( designs => {
			setDesigns( designs )
		} ).finally( () => {
			setIsBusy( false )
			setDoReset( false )
		} )
	}, [ block, plan, categories, searchDebounced, doReset ] )

	return (
		<Modal
			title={ __( 'Stackable Design Library', i18n ) }
			className="ugb-modal-design-library"
			onRequestClose={ props.onClose }
		>
			<div className="ugb-modal-design-library__wrapper">
				<aside className="ugb-modal-design-library__sidebar">
					<TextControl
						className="ugb-modal-design-library__search"
						placeholder={ __( 'E.g. light, dark, red, minimalist...', i18n ) }
						value={ search }
						onChange={ search => setSearch( search ) }
						data-testid="input-search"
						type="search"
					/>
					<div className="ugb-modal-design-library__filters">
						<BlockList
							search={ search }
							categories={ categories }
							forceBlock={ props.selectedBlock }
							onSelect={ ( {
								block, plan, categories,
							} ) => {
								setBlock( block )
								setPlan( plan )
								setCategories( categories )
							} }
						/>
					</div>
				</aside>

				<aside className="ugb-modal-design-library__topbar">
					{ devMode &&
						<ToggleControl
							className="ugb-modal-design-library__dev-mode"
							label="Dev Mode"
							checked={ isDevMode }
							onChange={ value => {
								setDevModeDesignLibrary( value ).then( () => {
									setDoReset( true )
								} )
								setIsDevMode( value )
							} }
						/>
					}

					<Button
						icon="image-rotate"
						label={ __( 'Refresh Library', i18n ) }
						className="ugb-modal-design-library__refresh"
						onClick={ () => setDoReset( true ) }
					/>

					<Button
						icon={ <SVGViewSingle width="18" height="18" /> }
						className={ columns === 2 ? 'is-active' : '' }
						label={ __( 'Large preview', i18n ) }
						onClick={ () => setColumns( 2 ) }
					/>
					<Button
						icon={ <SVGViewFew width="18" height="18" /> }
						className={ columns === 3 ? 'is-active' : '' }
						label={ __( 'Medium preview', i18n ) }
						onClick={ () => setColumns( 3 ) }
					/>
					<Button
						icon={ <SVGViewMany width="18" height="18" /> }
						className={ columns === 4 ? 'is-active' : '' }
						label={ __( 'Small preview', i18n ) }
						onClick={ () => setColumns( 4 ) }
					/>
				</aside>

				<div className="ugb-modal-design-library__designs">
					<DesignLibraryList
						columns={ columns }
						onSelect={ props.onSelect }
						isBusy={ isBusy }
						designs={ ! props.selectedBlock ? designs : designs.filter( design => design.block === props.selectedBlock ) }
					/>
				</div>
			</div>
		</Modal>
	)
}

ModalDesignLibrary.defaultProps = {
	search: '',
	selectedBlock: '',
	onClose: () => {},
	onSelect: () => {},
}

export default ModalDesignLibrary
