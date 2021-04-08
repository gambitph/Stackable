import classnames from 'classnames'
import { i18n } from 'stackable'
import { useLinking } from '~stackable/hooks'

import { Dashicon, Tooltip } from '@wordpress/components'
import { __ } from '@wordpress/i18n'

export const Linking = () => {
	const [ isLinked, setIsLinked ] = useLinking()

	const classNames = classnames( [
		'stk-linking-wrapper__tooltip',
	], {
		'stk--is-unlinked': ! isLinked,
	} )

	return <div
		className="stk-linking-wrapper"
	>
		<Tooltip position="bottom" text={
			<span className="stk-linking__tooltip">
				{ __( 'When linked, styling this block would also style other linked blocks in adjacent columns.', i18n ) }
				<br />
				<a href="https://docs.wpstackable.com/article/452-how-to-use-linking/?utm_source=wp-linking-tooltip&utm_campaign=learnmore&utm_medium=gutenberg" target="_blank" rel="noopener noreferrer">{ __( 'Learn more about linking', i18n ) }</a>
			</span>
		}
		>
			<div
				className={ classNames }
				onClick={ () => setIsLinked( ! isLinked ) }
				onKeyDown={ event => {
					if ( event.keyCode === 13 ) {
						setIsLinked( ! isLinked )
					}
				} }
				role="button"
				tabIndex="0"
			>
				<Dashicon
					icon={ isLinked ? 'admin-links' : 'editor-unlink' }
				/>
			</div>
		</Tooltip>
	</div>
}

Linking.defaultProps = {
	show: true,
}

Linking.Content = () => null
