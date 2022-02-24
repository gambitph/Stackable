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

			const visibility = <Button
				className="stk-block-table-of-contents__list-item__exclude-button"
				icon={ ! isExcluded ? 'visibility' : 'hidden' }
				onClick={ () => toggleItemVisibility( anchor ) }
				isSmall
				label={ isExcluded ? __( 'Include heading', i18n ) : __( 'Exclude heading', i18n ) }
				showTooltip
				tooltipPosition="right middle"
			/>

			const className = classnames( 'stk-block-table-of-contents__list-item', {
				'stk-block-table-of-contents__list-item__hidden': isExcluded && ! isSelected,
				'stk-block-table-of-contents__list-item__excluded': isExcluded,
			} )

			return (
				<li key={ index } className={ className }>
					{ isEdit ? (
						<div className="stk-block-table-of-contents__list-item-inner">
							<span className="stk-block-table-of-contents__link-wrapper">
								<RichText
									tagName="a"
									className="stk-block-table-of-contents__link"
									onChange={ value => updateContent( anchor, value ) }
									placeholder={ __( 'Heading', i18n ) }
									value={ ! isEmpty( customContent ) ? customContent : content }
								/>
								{ visibility }
							</span>
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
