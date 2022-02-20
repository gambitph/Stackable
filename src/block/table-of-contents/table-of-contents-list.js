import classnames from 'classnames'

const TableOfContentsList = ( {
	nestedHeadingList,
	listTag = 'ul',
	isSelected,
	toggleItemVisibility,
} ) => {
	if ( nestedHeadingList ) {
		const ListTag = listTag
		const childNodes = nestedHeadingList.map( ( childNode, index ) => {
			const {
				anchor, content, blockId, isExcluded,
			} = childNode.heading

			const entry = anchor ? (
				// TODO: rich text. How do we identify which heading is which?
				<a className="stk-block-table-of-contents__link" href={ anchor }>
					{ content }
				</a>
			) : (
				<a className="stk-block-table-of-contents__link" href="#placeholder">
					{ content }
				</a>
			)

			const visibility = (
				isSelected ? <button className="stk-block-table-of-contents__button" onClick={ () => toggleItemVisibility( blockId ) }>{ isExcluded ? 'include' : 'exclude' }</button>
						   : null
			)

			const className = classnames( 'stk-block-table-of-contents__list-item', {
				'stk-block-table-of-contents__list-item__excluded': isExcluded && isSelected,
				'stk-block-table-of-contents__list-item__hidden': isExcluded && ! isSelected,
			} )

			return (
				<li key={ index } className={ className }>
					{ entry } { visibility }
					{ childNode.children ? (
						<TableOfContentsList
							nestedHeadingList={ childNode.children }
							wrapList={ true }
							listTag={ listTag }
							toggleItemVisibility={ toggleItemVisibility }
							isSelected={ isSelected }
						/>
					) : null }
				</li>
			)
		} )

		return (
			<ListTag className="stk-block-table-of-contents__sub-list">
				{ childNodes }
			</ListTag>
		)
	}
}

TableOfContentsList.Content = ( {
	nestedHeadingList,
	wrapList = true,
	listTag = 'ul',
} ) => {
	if ( nestedHeadingList ) {
		const ListTag = listTag
		const childNodes = nestedHeadingList.map( ( childNode, index ) => {
			const { anchor, content } = childNode.heading

			const entry = anchor ? (
				<a className="stk-block-table-of-contents__link" href={ anchor }>
					{ content }
				</a>
			) : (
				<a className="stk-block-table-of-contents__link" href="#placeholder">
					{ content }
				</a>
			)

			return (
				<li key={ index } className="stk-block-table-of-contents__list-item">
					{ entry }
					{ childNode.children ? (
						<TableOfContentsList
							nestedHeadingList={ childNode.children }
							wrapList={ true }
							listTag={ listTag }
						/>
					) : null }
				</li>
			)
		} )

		return wrapList ? (
			<ListTag className="stk-block-table-of-contents__sub-list">
				{ childNodes }
			</ListTag>
		) : (
			childNodes
		)
	}
}

export default TableOfContentsList
