import classnames from 'classnames'
import { i18n } from 'stackable'
import { useLinking } from '~stackable/hooks'
import { useClosestLinkableBlock } from '~stackable/plugins/block-linking'
import { Tooltip } from '~stackable/components'

import { Dashicon } from '@wordpress/components'
import { useBlockEditContext } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import { getPlugin } from '@wordpress/plugins'
import { useSelect } from '@wordpress/data'

// We split this off because we use hooks that won't allow conditional rendering
// for the Linking component.
export const Linking = props => {
	const isEnabled = !! getPlugin( 'stackable-block-linking' )
	return isEnabled ? <_Linking { ...props } /> : null
}

export const _Linking = () => {
	const [ isLinked, setIsLinked ] = useLinking()

	const { clientId } = useBlockEditContext()
	const { isOnlyBlock } = useSelect( select => {
		const { getBlockRootClientId, getBlock } = select( 'core/block-editor' )
		const parentClientId = getBlockRootClientId( clientId )
		return {
			isOnlyBlock: getBlock( parentClientId ).innerBlocks.length === 1,
		}
	}, [ clientId ] )

	const closestLinkableBlock = useClosestLinkableBlock( clientId )

	if ( isOnlyBlock || ! closestLinkableBlock ) {
		return null
	}

	const classNames = classnames( [
		'stk-linking-wrapper__tooltip',
	], {
		'stk--is-unlinked': ! isLinked,
	} )

	return <div
		className="stk-linking-wrapper"
	>
		<Tooltip position="bottom" text={
			<>
				{ __( 'When linked, styling this block would also style other linked blocks in adjacent columns.', i18n ) }
				<br />
				<a href="https://docs.wpstackable.com/article/452-how-to-use-linking/?utm_source=wp-linking-tooltip&utm_campaign=learnmore&utm_medium=gutenberg" target="_blank" rel="noopener noreferrer">{ __( 'Learn more about linking', i18n ) }</a>
			</>
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

Linking.Content = () => null
