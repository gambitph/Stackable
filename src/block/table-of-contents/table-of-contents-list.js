const TableOfContentsList = ( {
	nestedHeadingList,
	isSelected,
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
							isSelected={ isSelected }
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
