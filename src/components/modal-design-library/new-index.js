/**
 * Internal deprendencies
 */
import Sidebar from './sidebar'
import Cover from './cover'
import ControlSeparator from '../control-separator'
import Topbar from './topbar'
import BlockList from './block-list-new'

/**
 * External deprendencies
 */
import DesignLibraryList from '~stackable/components/design-library-list'
import { i18n } from 'stackable'

/**
 * WordPress deprendencies
 */
import {
	Modal,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import ColorList from './color-list'

const ModalDesignLibrary = props => {
	return (
		<Modal
			title={ __( 'Stackable Design Library', i18n ) }
			className="ugb-modal-design-library"
			onRequestClose={ props.onClose }
		>

			<div className="ugb-modal-design-library__wrapper">
				<aside className="ugb-modal-design-library__sidebar">
					<div className="ugb-modal-design-library__filters">
						<Sidebar />
						<ControlSeparator />
						<Sidebar />
					</div>
				</aside>

				<aside className="ugb-modal-design-library__content">
					<Cover />

					<Topbar>
						<ColorList />
					</Topbar>

					<BlockList />
					<DesignLibraryList />
				</aside>

			</div>

		</Modal>
	)
}

ModalDesignLibrary.defaultProps = {
	onClose: () => {},
}

export default ModalDesignLibrary
