/**
 * Internal deprendencies
 */
import SVGViewSingle from './images/view-single.svg'
import SVGViewMany from './images/view-many.svg'
import SVGViewFew from './images/view-few.svg'
import BlockList from './block-list'
import Button from '../button'
import AdvancedToolbarControl from '../advanced-toolbar-control'

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
	Modal, TextControl, ToggleControl,
} from '@wordpress/components'
import {
	useEffect, useState,
} from '@wordpress/element'
import { __ } from '@wordpress/i18n'

export const ModalDesignLibrary = props => {
	const [ search, setSearch ] = useState( props.search )
	const [ columns, setColumns ] = useState( 3 )
	const [ isBusy, setIsBusy ] = useState( true )
	const [ doReset, setDoReset ] = useState( false )
	const [ selectedId, setSelectedId ] = useState( '' )
	const [ selectedType, setSelectedType ] = useState( '' )
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
			uikit: selectedType === 'uikit' ? selectedId : '',
			categories: selectedType === 'category' && selectedId !== 'all' ? [ selectedId ] : [],
		} ).then( designs => {
			setDisplayDesigns( designs )
		} ).finally( () => {
			setIsBusy( false )
		} )
	}, [ selectedId, selectedType, doReset, searchDebounced ] )

	return (
		<Modal
			title={ (
				<>
					{ __( 'Stackable Design Library', i18n ) }
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
			className="ugb-modal-design-library"
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
							onSelect={ ( {
								id, type,
							} ) => {
								setSelectedId( id )
								setSelectedType( type )
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
						designs={ displayDesigns }
						apiVersion={ props.apiVersion }
					/>
				</div>
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
