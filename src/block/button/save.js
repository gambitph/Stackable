/**
 * External dependencies
 */
import { withVersion } from '~stackable/higher-order'
import { version as VERSION } from 'stackable'

export const Save = () => {
	return <div>test</div>
}

export default withVersion( VERSION )( Save )
