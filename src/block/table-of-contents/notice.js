import {
	Button,
	Card,
	CardBody,
} from '@wordpress/components'

import { i18n } from 'stackable'
import { __ } from '@wordpress/i18n'

const Notice = ( { autoGenerateAnchors } ) => {
	return (
		<Card className="stk-table-of-contents__empty-anchor">
			<CardBody isShady>
				{ __(
					'You have one or more headings without an anchor id. Anchor ids are required for the Table of Contents block to work.',
					i18n
				) }
				<br />
				<br />
				<Button
					isPrimary
					onClick={ autoGenerateAnchors }
				>
					{ __( 'Auto-generate missing anchor ids', i18n ) }
				</Button>
			</CardBody>
		</Card>
	)
}

export default Notice
