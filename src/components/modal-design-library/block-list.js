import { useEffect, useState } from '@wordpress/element'
import { select } from '@wordpress/data'
import { orderBy } from 'lodash'
import { getAllBlocks, getDesigns } from '~stackable/design-library'
import { __ } from '@wordpress/i18n'
import { i18n } from 'stackable'

const BlockList = props => {
	const [ blockDesignList, setBlockDesignList ] = useState( [] )
	const [ blockList, setBlockList ] = useState( {} )
	const [ totalDesigns, setTotalDesigns ] = useState( 0 )
	const [ totalFree, setTotalFree ] = useState( 0 )
	const [ selected, setSelected ] = useState( '' )

	// Create our block list.
	useEffect( () => {
		getAllBlocks().then( blocks => {
			const blockList = blocks.reduce( ( blocks, name ) => {
				if ( ! blocks[ name ] ) {
					blocks[ name ] = {
						count: 0,
						name,
						label: select( 'core/blocks' ).getBlockType( name ).title,
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
			type: props.type,
			search: props.search,
			mood: props.mood,
			colors: props.colors,
		} ).then( designs => {
			// We need to create a blank list first.
			const initBlocks = Object.keys( blockList ).reduce( ( blocks, name ) => {
				blocks[ name ] = { ...blockList[ name ] }
				return blocks
			}, {} )

			// Count the number of designs per block.
			let freeDesigns = 0
			const blocks = designs.reduce( ( blocks, design ) => {
				const {
					block, type, plan,
				} = design
				if ( type === 'block' && blocks[ block ] ) {
					blocks[ block ].count++
				}
				if ( plan === 'free' ) {
					freeDesigns++
				}
				return blocks
			}, { ...initBlocks } )

			setTotalDesigns( designs.length )
			setTotalFree( freeDesigns )
			setBlockDesignList( orderBy( blocks, [ 'title' ], [ 'asc' ] ) )
		} )
	}, [ blockList, props.type, props.search, props.mood, props.colors ] )

	// useEffect( () => {
	// 	if ( ! Object.keys( blockList ).length || ! props.designs.length ) {
	// 		return
	// 	}

	// 	// We need to create a blank list first.
	// 	const initBlocks = Object.keys( blockList ).reduce( ( blocks, name ) => {
	// 		blocks[ name ] = { ...blockList[ name ] }
	// 		return blocks
	// 	}, {} )

	// 	// Count the number of designs per block.
	// 	const blocks = props.designs.reduce( ( blocks, design ) => {
	// 		const { block, type } = design
	// 		if ( type === 'block' && blocks[ block ] ) {
	// 			blocks[ block ].count++
	// 		}
	// 		return blocks
	// 	}, { ...initBlocks } )

	// 	setBlockDesignList( orderBy( blocks, [ 'title' ], [ 'asc' ] ) )
	// }, [ blockList, props.designs ] )

	return (
		<ul className="ugb-block-list">
			<li>
				<div
					className={ selected === '' ? 'is-active' : '' }
					onClick={ () => {
						setSelected( '' )
						props.onSelect( { block: '', plan: '' } )
					} }
					onKeyPress={ e => {
						if ( e.keyCode === 13 ) {
							this.click()
						}
					} }
					role="button"
					tabIndex={ 0 }
				>
					<span>{ __( 'All Block Designs', i18n ) }</span>
					<span className="ugb-block-list__count" data-count={ totalDesigns }>{ totalDesigns }</span>
				</div>
			</li>
			{ props.showFree &&
				<li>
					<div
						className={ selected === 'free' ? 'is-active' : '' }
						onClick={ () => {
							setSelected( 'free' )
							props.onSelect( { block: '', plan: 'free' } )
						} }
						onKeyPress={ e => {
							if ( e.keyCode === 13 ) {
								this.click()
							}
						} }
						role="button"
						tabIndex={ 0 }
					>
						<span>{ __( 'Free Designs', i18n ) }</span>
						<span className="ugb-block-list__count" data-count={ totalFree }>{ totalFree }</span>
					</div>
				</li>
			}
			{ blockDesignList.map( ( block, i ) => {
				return (
					<li key={ i }>
						<div
							className={ selected === block.name ? 'is-active' : '' }
							onClick={ () => {
								setSelected( block.name )
								props.onSelect( { block: block.name, plan: '' } )
						 } }
							onKeyPress={ e => {
							 if ( e.keyCode === 13 ) {
								 this.click()
							 }
						 } }
							role="button"
							tabIndex={ 0 }
						>
							<span>{ block.label }</span>
							<span className="ugb-block-list__count" data-count={ block.count }>{ block.count }</span>
						</div>
					</li>
				)
			} ) }
		</ul>
	)
}

BlockList.defaultProps = {
	// designs: [],
	type: 'block',
	search: '',
	mood: '',
	plan: '',
	colors: [],
	onSelect: () => {},
	showFree: true,
}

export default BlockList
