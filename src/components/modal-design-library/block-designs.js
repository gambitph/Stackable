/**
 * Internal deprendencies
 */
import Sidebar from './sidebar'
import Cover from './cover'
import ControlSeparator from '../control-separator'
import Topbar from './topbar'
import FeaturedList from './featured-list'

/**
 * External deprendencies
 */
import { i18n, isPro } from 'stackable'
import { AdvancedToolbarControl } from '~stackable/components'
import {
	getDesigns, getAllBlocks, getDesign, getUIKits,
} from '~stackable/design-library'
import { useLocalStorage } from '~stackable/util'
import {
	keys, find, last, startCase,
} from 'lodash'

/**
 * WordPress deprendencies
 */
import { __, sprintf } from '@wordpress/i18n'
import {
	Fragment, useState, useEffect, useCallback,
} from '@wordpress/element'
import { select } from '@wordpress/data'

/**
 * WordPress deprendencies
 */

const BlockDesigns = props => {
	const [ columns, setColumns ] = useState( 3 )
	const [ plan, setPlan ] = useState( '' )
	const [ block, setBlock ] = useState( props.selectedBlock )
	const [ mood, setMood ] = useState( '' )
	const [ search, setSearch ] = useState( props.search )
	const [ isBusy, setIsBusy ] = useState( true )
	const [ blockList, setBlockList ] = useState( [] )
	const [ designs, setDesigns ] = useState( [] )
	const [ doReset, setDoReset ] = useState( false )
	const [ itemIsBusy, setIsItemBusy ] = useState( false )

	const [ searchDebounced, setSearchDebounced ] = useState( search )
	const [ debounceTimeout, setDebounceTimeout ] = useState( null )
	const [ isDevMode, setIsDevMode ] = useLocalStorage( 'stk__design_library_dev_mode', false )

	const contentTitle = search !== '' ? sprintf( __( 'Search result for: "%s"', i18n ), search ) :
		plan !== '' || block !== '' ? sprintf( __( '%s %s Block Designs', i18n ), startCase( plan || '' ), startCase( last( block.split( '/' ) ) || '' ) ).trim() : __( 'All Block Designs', i18n )

	const itemProps = useCallback( option => {
		const showLock = ! isPro && option.plan !== 'free'
		const button1 = showLock ? undefined :
			(	props.selectedBlock ? __( 'Switch Design', i18n ) : __( 'Add Block', i18n ) )
		const button2 = showLock ? __( 'Learn More', i18n ) :
			( props.selectedBlock ? undefined : __( 'View UI Kit', i18n ) )
		const onClickButton1 = showLock ?
			undefined :
			onDesignSelect
		const button2Href = showLock ? 'https://wpstackable.com/upgrade/?utm_source=design-library-learn-more&utm_campaign=learnmore&utm_medium=gutenberg' : undefined
		const onClickButton2 = showLock ?
			undefined :

		/**
		 * ACCESS UI KIT PROPS AND OPEN THE UI KIT
		 */
			_option => {
				setIsItemBusy( true )
				getUIKits().then( _UIKits => {
					const newPreviewMode = {
						...( find( _UIKits, UIKit => last( _option.categories ) === UIKit.category ) || {} ),
						fromBlockDesigns: true,
					}

					setIsItemBusy( false )
					props.cache.uiKits.preview = newPreviewMode || null
					props.setActiveTab( 'ui-kits' )
				} )
			}

		return {
			showLock,
			button1,
			button2,
			onClickButton1,
			onClickButton2,
			button2Href,
		}
	}, [ props.uiKitsModuleProps, props.setActiveTab ] )

	const onDesignSelect = useCallback( design => {
		if ( ! isPro && design.plan !== 'free' ) {
			return
		}

		setIsItemBusy( true )

		getDesign( design.id ).then( designData => {
			setIsItemBusy( false )
			props.onSelect( designData )
		} )
	}, [ props.onSelect ] )

	useEffect( () => {
		if ( doReset ) {
			setDesigns( [] )
			setIsBusy( true )
		}

		getDesigns( {
			type: 'block',
			block,
			plan,
			mood,
			search: searchDebounced,
			reset: doReset,
		} ).then( _designs => {
			setDesigns( _designs )
		} ).finally( () => {
			setIsBusy( false )
			setDoReset( false )
		} )
	}, [ block, mood, plan, searchDebounced, doReset ] )

	useEffect( () => {
		if ( debounceTimeout ) {
			clearTimeout( debounceTimeout )
			setDebounceTimeout( null )
		}
		setDebounceTimeout( setTimeout( () => {
			setSearchDebounced( search )
		}, 500 ) )
	}, [ search ] )

	useEffect( () => {
		getAllBlocks().then( blocks => {
			const _blockList = blocks.reduce( ( blocks, name ) => {
				if ( ! blocks[ name ] ) {
					// Ignore if block is hidden from the Block Manager.
					if ( select( 'core/edit-post' ).getPreference( 'hiddenBlockTypes' ).includes( name ) ) {
						return blocks
					}

					// Ignore if block is not implemented (probably a new block).
					if ( ! select( 'core/blocks' ).getBlockType( name ) ) {
						return blocks
					}

					blocks[ name ] = {
						value: name,
						label: name ? select( 'core/blocks' ).getBlockType( name ).title : '',
					}
				}

				return blocks
			}, {} )

			setBlockList( [
				{ label: __( 'All', i18n ), value: '' },
				...keys( _blockList ).map( key => ( { label: _blockList[ key ].label, value: key } ) ),
			] )
		} )
	}, [] )
	return (
		<Fragment>
			<aside className="ugb-modal-design-library__sidebar">
				<Sidebar
					options={ [
						{
							label: __( 'All Block Designs', i18n ),
							value: '',
						},
						{
							label: __( 'Free Designs', i18n ),
							value: 'free',
						},
						{
							label: __( 'Premium Designs', i18n ),
							value: 'premium',
						},
					] }
					value={ plan }
					onSelect={ plan => {
						setSearch( '' )
						setPlan( plan )
					} }
					forceDisabledExcept={ props.selectedBlock ? [ 'free', 'premium' ] : null }
				/>

				<ControlSeparator />

				<Sidebar
					title={ __( 'Browse By Block', i18n ) }
					options={ blockList }
					value={ block }
					onSelect={ block => {
						setSearch( '' )
						setBlock( block )
					} }
					forceDisabledExcept={ props.selectedBlock ? props.selectedBlock : null }
				/>
			</aside>

			<aside className="ugb-modal-design-library__content">

				<Cover
					title={ __( 'Stackable Block Designs', i18n ) }
					description={ __( 'Choose from over 200 predesigned templates you can customize with Stackable.', i18n ) }
					placeholder={ __( 'Ex: Corporate, Minimalist, Header, etc.', i18n ) }
					value={ search }
					onChange={ setSearch }
				/>

				<div className="ugb-modal-design-library__content-body">
					<Topbar
						setColumns={ setColumns }
						columns={ columns }
						setIsDevMode={ setIsDevMode }
						isDevMode={ isDevMode }
						setDoReset={ setDoReset }
					>
						<AdvancedToolbarControl
							className="ugb-modal-design-library__mood-toolbar"
							controls={ [
								{
									value: '',
									title: __( 'All', i18n ),
								},
								{
									value: 'light',
									title: __( 'Light', i18n ),
								},
								{
									value: 'dark',
									title: __( 'Dark', i18n ),
								},
							] }
							value={ mood }
							onChange={ setMood }
						/>
					</Topbar>

					<FeaturedList
						title={ contentTitle }
						columns={ columns }
						isBusy={ isBusy }
						onSelect={ onDesignSelect }
						options={ designs }
						itemProps={ itemProps }
						itemIsBusy={ itemIsBusy }
					/>
				</div>

			</aside>

		</Fragment>
	)
}

BlockDesigns.defaultProps = {
	moduleProps: {},
}

export default BlockDesigns
