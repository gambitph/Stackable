import classnames from 'classnames'
import { i18n } from 'stackable'
import { isEmpty } from 'lodash'
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
		updateContent,
	} = props

	if ( nestedHeadingList ) {
		const ListTag = listTag
		const childNodes = nestedHeadingList.map( ( childNode, index ) => {
			const {
				anchor, content, customContent, isExcluded,
			} = childNode.heading

			const btnText = <span className="screen-reader-text">
				{ isExcluded ? 'include' : 'exclude' }
			</span>

			const btnIcon = ! isExcluded ? 'visibility' : 'hidden'

			const visibility = isSelected ? <Button
				icon={ btnIcon }
				onClick={ () => toggleItemVisibility( anchor )
				}>{ btnText }</Button>
				: null

			const className = classnames( 'stk-block-table-of-contents__list-item', {
				'stk-block-table-of-contents__list-item__hidden': isExcluded && ! isSelected,
			} )

			return (
				<li key={ index } className={ className }>
					{ isEdit ? (
						<div className="stk-block-table-of-contents__list-item-inner">
							<RichText
								tagName="a"
								className={ classnames(
									'stk-block-table-of-contents__link',
									{
										'stk-block-table-of-contents__list-item__excluded': isExcluded && isSelected,
									}
								) }
								onChange={ value => updateContent( anchor, value ) }
								placeholder={ __( 'Heading', i18n ) }
								value={ ! isEmpty( customContent ) ? customContent : content }
							/>
							{ visibility }
						</div>
					) : (
						<RichText.Content
							tagName="a"
							className="stk-block-table-of-contents__link"
							href={ `#${ anchor }` }
							value={ ! isEmpty( customContent ) ? customContent : content }
						/>
					) }
					{ childNode.children ? (
						<TableOfContentsList
							{ ...props }
							nestedHeadingList={ childNode.children }
							wrapList={ true }
							listTag={ listTag }
							toggleItemVisibility={ toggleItemVisibility }
							updateContent={ updateContent }
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
				anchor, level, content, isExcluded,
			} = childNode.heading

			// Check if included in render
			if ( ! props[ `h${ level }` ] ) {
				return null
			}

			if ( isExcluded ) {
				return null
			}

			return (
				<li key={ index } className="stk-block-table-of-contents__list-item">
					<a className="stk-block-table-of-contents__link" href={ `#${ anchor }` }>
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
