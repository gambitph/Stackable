/**
 * External dependencies
 */
import {
	orderBy, last, startCase,
} from 'lodash'
import ControlSeparator from '../control-separator'
import AdvancedToolbarControl from '../advanced-toolbar-control'
import {
	getAllBlocks, getDesigns,
} from '~stackable/design-library'
import { isPro, i18n } from 'stackable'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import {
	useEffect, useState, useMemo,
} from '@wordpress/element'
import { select } from '@wordpress/data'
import { __ } from '@wordpress/i18n'

const BlockList = props => {
	const [ blockDesignList, setBlockDesignList ] = useState( [] )
	const [ uiKitList, setUiKitList ] = useState( {} )
	const [ blockList, setBlockList ] = useState( {} )
	const [ totalDesigns, setTotalDesigns ] = useState( 0 )
	const [ totalFree, setTotalFree ] = useState( 0 )
	const [ totalPremium, setTotalPremium ] = useState( 0 )
	const [ selected, setSelected ] = useState( '' )
	const {
		viewBy,
	} = props

	// Create our block list.
	useEffect( () => {
		getAllBlocks().then( blocks => {
			const blockList = blocks.reduce( ( blocks, name ) => {
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
						count: 0,
						name,
						label: name ? select( 'core/blocks' ).getBlockType( name ).title : '',
					}
				}

				return blocks
			}, {} )
			setBlockList( blockList )
		} )
	}, [] )

	useEffect( () => {
		if ( ! Object.keys( blockList ).length ) {
			return
		}

		getDesigns( {
			type: 'block',
			search: props.search,
			mood: props.mood,
			colors: props.colors,
		} ).then( designs => {
			// We need to create a blank list first.
			const initBlocks = Object.keys( blockList ).reduce( ( blocks, name ) => {
				blocks[ name ] = { ...blockList[ name ] }
				return blocks
			}, {} )

			// Reset all the UI Kit counts.
			const uiKits = Object.keys( uiKitList ).reduce( ( kits, kitName ) => {
				if ( typeof kits[ kitName ] !== 'undefined' ) {
					kits[ kitName ].num = 0
				}
				return kits
			}, {} )

			// Count the number of designs per block.
			let freeDesigns = 0
			let allDesigns = 0
			const blocks = designs.reduce( ( blocks, design ) => {
				const {
					block, type, plan, categories,
				} = design
				if ( type === 'block' && blocks[ block ] ) {
					blocks[ block ].count++
				}
				if ( ! props.forceBlock || props.forceBlock === design.block ) {
					allDesigns++
					if ( plan === 'free' ) {
						freeDesigns++
					}
				}

				// Gather the UI Kit categories.
				if ( categories && categories.length === 3 ) {
					const category = last( categories )
					if ( typeof uiKits[ category ] === 'undefined' ) {
						uiKits[ category ] = {
							label: startCase( last( categories ) ),
							num: 0,
							isPremium: plan !== 'free',
						}
					}
					uiKits[ category ].num++
				}

				return blocks
			}, { ...initBlocks } )

			setUiKitList( uiKits )
			setTotalDesigns( allDesigns )
			setTotalFree( freeDesigns )
			setTotalPremium( allDesigns - freeDesigns )
			setBlockDesignList( orderBy( blocks, [ 'title' ], [ 'asc' ] ) )
		} )
	}, [ blockList, props.search, props.mood ] )

	// Sort the UI Kits so that the free ones are first when in the free version.
	const uiKitListKeys = useMemo( () => {
		const list = Object.keys( uiKitList )
		if ( ! isPro ) {
			list.sort( ( a, b ) => {
				if ( ! uiKitList[ a ].isPremium && uiKitList[ b ].isPremium ) {
					return -1
				} else if ( uiKitList[ a ].isPremium && ! uiKitList[ b ].isPremium ) {
					return 1
				}
				return 0
			} )
		}
		return list
	}, [ JSON.stringify( uiKitList ) ] )

	let previousWasFree = true

	return (
		<ul className="ugb-block-list">
			<AdvancedToolbarControl
				controls={ [
					{
						value: 'ui-kits',
						title: __( 'UI Kits', i18n ),
					},
					{
						value: 'block-designs',
						title: __( 'Block Designs', i18n ),
					},
				] }
				value={ viewBy }
				onChange={ props.onChangeViewBy }
				isSmall={ true }
				fullwidth={ false }
				isToggleOnly={ true }
			/>
			{ viewBy === 'ui-kits' && uiKitListKeys.reduce( ( uiKits, uiKitCategory, i ) => {
				const isSelected = ( ( selected === '' && i === 0 ) || selected === uiKitCategory ) && ! props.forceBlock
				const classes = classnames( {
					'is-active': isSelected,
					'is-disabled': props.forceBlock,
				} )

				const uiKit = uiKitList[ uiKitCategory ].label
				const uiKitCount = uiKitList[ uiKitCategory ].num

				if ( ! isPro && previousWasFree && uiKitList[ uiKitCategory ].isPremium ) {
					uiKits.push( <ControlSeparator /> )
					previousWasFree = false
				}

				uiKits.push(
					<li key={ i }>
						<div
							className={ classes }
							data-count={ uiKitCount }
							onClick={ () => {
								if ( ! props.forceBlock ) {
									setSelected( uiKitCategory )
									props.onSelect( {
										block: '', plan: '', categories: [ uiKitCategory ],
									} )
								}
							} }
							onKeyPress={ e => {
								if ( e.keyCode === 13 ) {
									this.click()
								}
							} }
							role="button"
							tabIndex={ 0 }
							aria-pressed={ isSelected ? 'true' : 'false' }
						>
							 { uiKit }
							 <span
								className="ugb-block-list__count"
								data-testid={ `${ uiKit }-count` }
							>{ uiKitCount }</span>
						</div>
					</li>
				)

				return uiKits
			}, [] ) }

			{ viewBy === 'block-designs' &&
				<li>
					<div
						className={ selected === '' ? 'is-active' : '' }
						data-count={ totalDesigns }
						onClick={ () => {
							setSelected( '' )
							props.onSelect( {
								block: '', plan: '', categories: [],
							} )
						} }
						onKeyPress={ e => {
							if ( e.keyCode === 13 ) {
								this.click()
							}
						} }
						role="button"
						tabIndex={ 0 }
						aria-pressed={ selected === '' ? 'true' : 'false' }
					>
						{ __( 'All Block Designs', i18n ) }
						<span
							className="ugb-block-list__count"
							data-testid="all-count"
						>{ totalDesigns }</span>
					</div>
				</li>
			}
			{ viewBy === 'block-designs' && totalDesigns !== totalFree &&
				<li>
					<div
						className={ selected === 'free' ? 'is-active' : '' }
						data-count={ totalFree }
						onClick={ () => {
							setSelected( 'free' )
							props.onSelect( {
								block: '', plan: 'free', categories: [],
							} )
						} }
						onKeyPress={ e => {
							if ( e.keyCode === 13 ) {
								this.click()
							}
						} }
						role="button"
						tabIndex={ 0 }
						aria-pressed={ selected === 'free' ? 'true' : 'false' }
					>
						{ __( 'Free Designs', i18n ) }
						<span
							className="ugb-block-list__count"
							data-testid="free-count"
						>{ totalFree }</span>
					</div>
					<div
						className={ selected === 'premium' ? 'is-active' : '' }
						data-count={ totalPremium }
						onClick={ () => {
							setSelected( 'premium' )
							props.onSelect( {
								block: '', plan: 'premium', categories: [],
							} )
						} }
						onKeyPress={ e => {
							if ( e.keyCode === 13 ) {
								this.click()
							}
						} }
						role="button"
						tabIndex={ 0 }
						aria-pressed={ selected === 'premium' ? 'true' : 'false' }
					>
						{ __( 'Premium Designs', i18n ) }
						<span
							className="ugb-block-list__count"
							data-testid="premium-count"
						>{ totalPremium }</span>
					</div>
				</li>
			}
			{ viewBy === 'block-designs' && <ControlSeparator /> }
			{ viewBy === 'block-designs' && blockDesignList.map( ( block, i ) => {
				const isSelected = selected === block.name || block.name === props.forceBlock
				const classes = classnames( {
					'is-active': isSelected,
					'is-disabled': props.forceBlock && block.name !== props.forceBlock,
				} )

				return (
					<li key={ i }>
						<div
							className={ classes }
							data-count={ block.count }
							onClick={ () => {
								if ( ! props.forceBlock ) {
									setSelected( block.name )
									props.onSelect( {
										block: block.name, plan: '', categories: [],
									} )
								}
						 } }
							onKeyPress={ e => {
							 if ( e.keyCode === 13 ) {
								 this.click()
							 }
						 } }
							role="button"
							tabIndex={ 0 }
							aria-pressed={ isSelected ? 'true' : 'false' }
						>
							{ block.label }
							<span
								className="ugb-block-list__count"
								data-testid={ `${ block.name }-count` }
							>{ block.count }</span>
						</div>
					</li>
				)
			} ) }
		</ul>
	)
}

BlockList.defaultProps = {
	search: '',
	mood: '',
	colors: [],
	categories: [],
	onSelect: () => {},
	forceBlock: '',
	viewBy: '',
	onChangeViewBy: () => {},
}

export default BlockList
