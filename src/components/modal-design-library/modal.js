/**
 * Internal deprendencies
 */
import SVGViewSingle from './images/view-single.svg'
import SVGViewMany from './images/view-many.svg'
import SVGViewFew from './images/view-few.svg'
import BlockList from './block-list'
import Button from '../button'
import AdvancedToolbarControl from '../advanced-toolbar-control'
import DesignLibraryList from '~stackable/components/design-library-list'
import {
	getDesign, getDesigns, setDevModeDesignLibrary,
} from '~stackable/design-library'

/**
 * External deprendencies
 */
import { i18n, devMode } from 'stackable'
import classnames from 'classnames'
import { useLocalStorage } from '~stackable/util'

/**
 * WordPress deprendencies
 */
import {
	Modal, Spinner, TextControl, ToggleControl,
} from '@wordpress/components'
import { useEffect, useState } from '@wordpress/element'
import { sprintf, __ } from '@wordpress/i18n'

export const ModalDesignLibrary = props => {
	const [ search, setSearch ] = useState( props.search )
	const [ columns, setColumns ] = useState( 3 )
	const [ isBusy, setIsBusy ] = useState( true )
	const [ doReset, setDoReset ] = useState( false )
	const [ isMultiSelectMode, setIsMultiSelectMode ] = useState( false )
	const [ selectedDesignIds, setSelectedDesignIds ] = useState( [] )
	const [ selectedDesignData, setSelectedDesignData ] = useState( [] )
	const [ isMultiSelectBusy, setIsMultiSelectBusy ] = useState( false )
	const [ selectedId, setSelectedId ] = useState( '' )
	const [ selectedType, setSelectedType ] = useLocalStorage( 'stk__design_library__block-list__view_by', 'uikit' )
	const [ isDevMode, setIsDevMode ] = useLocalStorage( 'stk__design_library_dev_mode', false )
	// The sidebar designs are used to update the list of blocks in the sidebar.
	const [ sidebarDesigns, setSidebarDesigns ] = useState( [] )
	// The display designs are used to list the available designs the user can choose.
	const [ displayDesigns, setDisplayDesigns ] = useState( [] )

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

	// Update the designs on the sidebar. (this will trigger the display designs update next)
	useEffect( () => {
		if ( doReset ) {
			setSidebarDesigns( [] )
			setDisplayDesigns( [] )
		}
		getDesigns( {
			search: searchDebounced,
			reset: doReset,
			apiVersion: props.apiVersion,
		} ).then( designs => {
			setSidebarDesigns( designs )
		} ).finally( () => {
			setDoReset( false )
		} )
	}, [ searchDebounced, doReset, props.apiVersion ] )

	// This updates the displayed designs the user can pick.
	useEffect( () => {
		setIsBusy( true )
		getDesigns( {
			apiVersion: props.apiVersion,
			search: searchDebounced,
			uikit: selectedType === 'wireframe' ? 'Wireframes' : ( selectedType === 'uikit' ? selectedId : '' ),
			categories: [ 'category', 'wireframe' ].includes( selectedType ) && selectedId !== 'all' ? [ selectedId ] : [],
		} ).then( designs => {
			setDisplayDesigns( designs )
		} ).finally( () => {
			setIsBusy( false )
		} )
	}, [ selectedId, selectedType, doReset, searchDebounced, props.apiVersion ] )

	return (
		<Modal
			title={ (
				<>
					{ __( 'Stackable Design Library', i18n ) }
					<AdvancedToolbarControl
						className="stk-design-library-tabs"
						controls={ [
							{
								value: 'category',
								title: __( 'Block Designs', i18n ),
							},
							{
								value: 'uikit',
								title: __( 'UI Kits', i18n ),
							},
							{
								value: 'wireframe',
								title: __( 'Wireframes', i18n ),
							},
						] }
						value={ selectedType }
						onChange={ setSelectedType }
						fullwidth={ false }
						isToggleOnly={ true }
						allowReset={ false }
					/>
					{ props.hasVersionSwitcher && (
						<AdvancedToolbarControl
							controls={ [
								{
									value: '',
									title: __( 'Latest Design Library', i18n ),
								},
								{
									value: 'v2',
									title: __( 'V2 Design Library', i18n ),
								},
							] }
							value={ props.apiVersion }
							onChange={ props.onChangeApiVersion }
							isSmall={ true }
							fullwidth={ false }
							isToggleOnly={ true }
							allowReset={ false }
						/>
					) }
				</>
			) }
			className={ classnames( 'ugb-modal-design-library', { 'ugb-modal-design-library--is-multiselect': isMultiSelectMode } ) }
			onRequestClose={ props.onClose }
		>
			<div className="ugb-modal-design-library__wrapper">
				<aside className="ugb-modal-design-library__sidebar">
					<TextControl
						className="ugb-modal-design-library__search"
						placeholder={ __( 'E.g. light, dark, red, minimalist…', i18n ) }
						value={ search }
						onChange={ search => setSearch( search ) }
						data-testid="input-search"
						type="search"
					/>
					<div className="ugb-modal-design-library__filters">
						<BlockList
							apiVersion={ props.apiVersion }
							designs={ sidebarDesigns }
							viewBy={ selectedType }
							onSelect={ id => setSelectedId( id ) }
						/>
					</div>
				</aside>

				<aside className="ugb-modal-design-library__topbar">

					<Button
						label={ __( 'Select Multiple', i18n ) }
						className={
							classnames(
								'ugb-modal-design-library__select',
								'stk-circular-button',
								{ 'stk--is-active': isMultiSelectMode }
							)
						}
						onClick={ () => setIsMultiSelectMode( ! isMultiSelectMode ) }
					>
						{ __( 'Select', i18n ) }
					</Button>

					{ isMultiSelectMode && <Button
						label={ __( 'Deselect All', i18n ) }
						className="ugb-modal-design-library__deselect stk-circular-button"
						disabled={ ! selectedDesignIds.length }
						onClick={ () => setSelectedDesignIds( [] ) }
					>
						{ __( 'Deselect All', i18n ) }
					</Button> }

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
						className={ `stk-design-library__item-${ selectedType }` }
						columns={ columns }
						onSelect={ props.onSelect }
						isBusy={ isBusy }
						designs={ displayDesigns }
						apiVersion={ props.apiVersion }
						isMultiSelectMode={ isMultiSelectMode }
						selectedDesigns={ selectedDesignIds }
						onSelectMulti={ designId => {
							const newSelectedDesigns = [ ...selectedDesignIds ]
							// We also get the design data from displayDesigns
							// already instead of after clicking the "Add
							// Designs" button since displayDesigns can change
							// when the user is switching tabs (block/ui
							// kits/wireframes) and the data can be lost.
							const newSelectedDesignData = [ ...selectedDesignData ]

							if ( newSelectedDesigns.includes( designId ) ) {
								const i = newSelectedDesigns.indexOf( designId )
								newSelectedDesigns.splice( i, 1 )
								setSelectedDesignIds( newSelectedDesigns )
								newSelectedDesignData.splice( i, 1 )
								setSelectedDesignData( newSelectedDesignData )
							} else {
								newSelectedDesigns.push( designId )
								setSelectedDesignIds( newSelectedDesigns )
								newSelectedDesignData.push( displayDesigns.find( design => design.id === designId ) )
								setSelectedDesignData( newSelectedDesignData )

								// Pre-cache the selected design so that when
								// the user decides to add it, it won't take too
								// long to get.
								getDesign( designId, props.apiVersion )
							}
						} }
					/>
				</div>

				{ isMultiSelectMode && <aside className="ugb-modal-design-library__footer">
					<div>{ sprintf( __( `(%d) Selected`, i18n ), selectedDesignIds.length ) }</div>
					<Button
						label={ __( 'Add Designs', i18n ) }
						className="ugb-modal-design-library__add-multi"
						disabled={ ! selectedDesignIds.length || isMultiSelectBusy }
						onClick={ () => {
							setIsMultiSelectBusy( true )
							const promises = selectedDesignIds.map( designId => {
								return getDesign( designId, props.apiVersion )
							} )
							Promise.all( promises ).then( designData => {
								// Put this in another thread so the UI doesn't freeze.
								setTimeout( () => {
									const cb = () => setIsMultiSelectBusy( false )
									props.onSelect( designData, selectedDesignData, cb )
								} )
							} )
						} }
					>
						{ __( 'Add Designs', i18n ) }
						{ isMultiSelectBusy && <Spinner /> }
					</Button>
				</aside> }
			</div>
		</Modal>
	)
}

ModalDesignLibrary.defaultProps = {
	search: '',
	onClose: () => {},
	onSelect: () => {},

	hasVersionSwitcher: false,
	apiVersion: '',
	onChangeApiVersion: () => {},
}
