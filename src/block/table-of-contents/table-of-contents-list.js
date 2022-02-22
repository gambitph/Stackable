import classnames from 'classnames'
import { i18n } from 'stackable'

import { __ } from '@wordpress/i18n'
import { Button } from '@wordpress/components'
import { RichText } from '@wordpress/block-editor'

const TableOfContentsList = props => {
	const {
		nestedHeadingList,
		listTag = 'ul',
		isSelected,
		toggleItemVisibility,
		isEdit = true,
	} = props

	if ( nestedHeadingList ) {
		const ListTag = listTag
		const childNodes = nestedHeadingList.map( ( childNode, index ) => {
			const {
				anchor, level, content, isExcluded,
			} = childNode.heading

			// Check if included in render
			if ( ! props[ `h${ level }` ] ) {
				return null
			}

			const visibility = (
				isSelected ? <Button icon="visibility" onClick={ () => toggleItemVisibility( anchor ) }>{ isExcluded ? 'include' : 'exclude' }</Button>
						   : null
			)

			const className = classnames( 'stk-block-table-of-contents__list-item', {
				'stk-block-table-of-contents__list-item__excluded': isExcluded && isSelected,
				'stk-block-table-of-contents__list-item__hidden': isExcluded && ! isSelected,
			} )

			return (
				<li key={ index } className={ className }>
					{ isEdit ? (
						<RichText
							tagName="a"
							className="stk-block-table-of-contents__link"
							//href={ anchor }
							onChange={ value => {
								console.log( value )
							} }
							placeholder={ __( 'Heading', i18n ) }
							value={ content }
						/>
					) : (
						<RichText.Content
							tagName="a"
							className="stk-block-table-of-contents__link"
							href={ `#${ anchor }` }
							value={ content }
						/>
					) }
					{ visibility }
					{ childNode.children ? (
						<TableOfContentsList
							{ ...props }
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

TableOfContentsList.Content = props => {
	const {
		nestedHeadingList,
		wrapList = true,
		listTag = 'ul',
	} = props

	if ( nestedHeadingList ) {
		const ListTag = listTag
		const childNodes = nestedHeadingList.map( ( childNode, index ) => {
			const {
				anchor, level, content,
			} = childNode.heading

			// Check if included in render
			if ( ! props[ `h${ level }` ] ) {
				return null
			}

			return (
				<li key={ index } className="stk-block-table-of-contents__list-item">
					<a className="stk-block-table-of-contents__link" href={ anchor }>
						{ content }
					</a>
					{ childNode.children ? (
						<TableOfContentsList
							{ ...props }
							nestedHeadingList={ childNode.children }
							wrapList={ true }
							listTag={ listTag }
							isEdit={ false }
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
