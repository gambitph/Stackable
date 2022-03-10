import classnames from 'classnames'
import { i18n } from 'stackable'
import { isEmpty, omit } from 'lodash'
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
		const childNodes = nestedHeadingList.map( childNode => {
			const {
				anchor, content, customContent, isExcluded, clientId,
			} = childNode.heading
			const { index } = childNode

			// Only render the visiblitiy icons when the block isSelected.
			// This makes it appear that there is no such interactive element
			// in the resulting toc.

			const visibility = isSelected ? <Button
				className="stk-block-table-of-contents__list-item__exclude-button"
				icon={ ! isExcluded ? 'visibility' : 'hidden' }
				onClick={ () => toggleItemVisibility( index ) }
				isSmall
				label={ isExcluded ? __( 'Include heading', i18n ) : __( 'Exclude heading', i18n ) }
				showTooltip
				tooltipPosition="right middle"
			/> : null

			const className = classnames(
				'stk-block-table-of-contents__list-item', {
					'stk-block-table-of-contents__list-item__hidden': isExcluded && ! isSelected,
					'stk-block-table-of-contents__list-item__excluded': isExcluded,
				} )

			return (
				<li key={ clientId } className={ className }>
					{ isEdit ? (
						<div className="stk-block-table-of-contents__list-item-inner">
							<span className="stk-block-table-of-contents__link-wrapper">
								<RichText
									tagName="a"
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
							href={ `#${ anchor }` }
							value={ ! isEmpty( customContent ) ? customContent : content }
						/>
					) }
					{ childNode.children ? (
						<TableOfContentsList
							{ ...omit( props, [ 'className' ] ) }
							nestedHeadingList={ childNode.children }
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
			<ListTag className={ props.className }>
				{ childNodes }
			</ListTag>
		)
	}
}

TableOfContentsList.Content = props => {
	const {
		nestedHeadingList,
		listTag = 'ul',
	} = props

	if ( nestedHeadingList ) {
		const ListTag = listTag
		const childNodes = nestedHeadingList.map( childNode => {
			const {
				anchor, level, content, customContent, isExcluded, clientId,
			} = childNode.heading

			// Check if included in render
			if ( ! props[ `h${ level }` ] ) {
				return null
			}

			if ( isExcluded ) {
				return null
			}

			return (
				<li key={ clientId } className="stk-block-table-of-contents__list-item">
					<a href={ `#${ anchor }` }>
						{ ! isEmpty( customContent ) ? customContent : content }
					</a>
					{ childNode.children ? (
						<TableOfContentsList.Content
							{ ...omit( props, [ 'className' ] ) }
							nestedHeadingList={ childNode.children }
							listTag={ listTag }
							isEdit={ false }
						/>
					) : null }
				</li>
			)
		} )

		return (
			<ListTag className={ props.className }>
				{ childNodes }
			</ListTag>
		)
	}
}

export default TableOfContentsList
