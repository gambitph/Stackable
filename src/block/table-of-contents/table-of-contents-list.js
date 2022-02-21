import classnames from 'classnames'
// import IconHide from './images/eye-slashed.svg'
// import IconShow from './images/eye.svg'

import { FontAwesomeIcon, SvgIcon } from '~stackable/components'

const IconShow = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" class="svg-inline--fa fa-eye fa-w-18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="32" height="32"><path fill="currentColor" d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"></path></svg>'
const IconHide = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye-slash" class="svg-inline--fa fa-eye-slash fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z"></path></svg>'

const VisibilityIcon = ( { isVisible, toggleItemVisibility } ) => {
	const classNames = classnames(
		[ 'components-button', 'stk-block-table-of-contents__visibility-icon' ],
		{
			'stk-block-table-of-contents__visibility-icon__on': isVisible,
			'stk-block-table-of-contents__visibility-icon__off': ! isVisible,
		} )
	const icon = <SvgIcon size="10" value="fa-eye" />

	return (
		<button onClick={ toggleItemVisibility }className={ classNames } >
			{ icon } <span className="screen-reader-text">{ isVisible ? 'Hide' : 'Show' }</span>
		</button>
	)
}

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
				anchor, content, isExcluded,
			} = childNode.heading

			const listItemText = anchor ? (
				// TODO: rich text. How do we identify which heading is which?
				<a className="stk-block-table-of-contents__link" href={ anchor }>
					{ content }
				</a>
			) : (
				<a className="stk-block-table-of-contents__link" href="#placeholder">
					{ content }
				</a>
			)

			const listItemVisibility = (
				isSelected ? <VisibilityIcon toggleItemVisibility={ toggleItemVisibility } isVisible={ ! isExcluded } />
						   : null
			)

			const className = classnames( 'stk-block-table-of-contents__list-item', {
				'stk-block-table-of-contents__list-item__excluded': isExcluded && isSelected,
				'stk-block-table-of-contents__list-item__hidden': isExcluded && ! isSelected,
			} )

			return (
				<li key={ index } className={ className }>
					<div className="stk-block-table-of-contents__list-item-inner">{ listItemText }{ listItemVisibility }</div>
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
