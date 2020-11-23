/**
 * Block Designs tab hooks.
 */

/**
 * External deprendencies
 */
import { isPro, i18n } from 'stackable'
import {
	getDesigns, getAllBlocks, getDesign,
} from '~stackable/design-library'
import { useLocalStorage } from '~stackable/util'
import {
	keys, find, last,
} from 'lodash'

/**
 * WordPress deprendencies
 */
import {
	useState, useEffect, useMemo, useCallback,
} from '@wordpress/element'
import { select } from '@wordpress/data'
import { __, sprintf } from '@wordpress/i18n'

const useBlockDesigns = props => {
	const [ columns, setColumns ] = useState( 3 )
	const [ plan, _setPlan ] = useState( '' )
	const [ block, _setBlock ] = useState( props.selectedBlock )
	const [ mood, setMood ] = useState( '' )
	const [ search, _setSearch ] = useState( props.search )
	const [ isBusy, setIsBusy ] = useState( true )
	const [ blockList, setBlockList ] = useState( [] )
	const [ designs, setDesigns ] = useState( [] )
	const [ doReset, setDoReset ] = useState( false )
	const [ isApplyingDesign, setIsApplyingDesign ] = useState( false )
	const [ contentTitle, setContentTitle ] = useState( props.selectedBlock ? __( 'Switch Design', i18n ) : __( 'All Block Designs', i18n ) )

	const [ searchDebounced, setSearchDebounced ] = useState( search )
	const [ debounceTimeout, setDebounceTimeout ] = useState( null )
	const [ isDevMode, setIsDevMode ] = useLocalStorage( 'stk__design_library_dev_mode', false )

	const options = useMemo( () => [
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
	], [] )

	const setPlan = useCallback( plan => {
		setContentTitle( options.find( option => option.value === plan ).label )
		_setSearch( '' )
		_setPlan( plan )
	}, [ JSON.stringify( options ) ] )

	const setBlock = useCallback( block => {
		setContentTitle( sprintf( __( '%s Block Designs', i18n ),
			blockList.find( option => option.value === block ).label ) )
		_setSearch( '' )
		_setBlock( block )
	}, [ JSON.stringify( blockList ) ] )

	const setSearch = useCallback( search => {
		setContentTitle( sprintf( __( 'Search result for: "%s"', i18n ), search ) )
		if ( search === '' ) {
			setContentTitle( options.find( option => option.value === plan ).label )
		}
		_setSearch( search )
	}, [ JSON.stringify( options ) ] )

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
				// Open UI Kit Preview when uiKitsModuleProps is defined.
				if ( props.uiKitsModuleProps ) {
					const {
						setPreviewMode = () => {},
						UIKits = {},
					} = props.uiKitsModuleProps

					const newPreviewMode = {
						...( find( UIKits, UIKit => last( _option.categories ) === UIKit.category ) || {} ),
						fromBlockDesigns: true,
					}

					setPreviewMode( newPreviewMode || null )

					props.setActiveTab( 'ui-kits' )
				}
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

		setIsApplyingDesign( true )

		getDesign( design.id ).then( designData => {
			setIsApplyingDesign( false )
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

	return {
		itemProps,
		contentTitle,
		options,
		columns,
		plan,
		block,
		mood,
		search,
		isBusy,
		blockList,
		designs,
		doReset,
		isDevMode,
		onDesignSelect,
		setIsDevMode,
		setColumns,
		setPlan,
		setBlock,
		setMood,
		setSearch,
		setDoReset,
		isApplyingDesign,
	}
}

export default useBlockDesigns
