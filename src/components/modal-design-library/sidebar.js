
/**
 * External dependencies
 */
import { orderBy } from 'lodash'
import { getAllBlocks, getDesigns } from '~stackable/design-library'
import { i18n } from 'stackable'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element'
import { select } from '@wordpress/data'
import { __ } from '@wordpress/i18n'

const Sidebar = props => {
	return (
		<ul className="ugb-sidebar">
			<li>
				<div
					className="is-active"
					role="button"
					data-count={ 100 }
					tabIndex={ 0 }
					aria-pressed="true"
				>
					{ __( 'All Block Designs', i18n ) }
					<span
						className="ugb-sidebar__count"
						data-testid="all-count"
					>
								100
					</span>
				</div>
			</li>
			<li>
				<div
					role="button"
					data-count={ 100 }
					tabIndex={ 0 }
					aria-pressed="false"
				>
					{ __( 'All Block Designs', i18n ) }
					<span
						className="ugb-sidebar__count"
						data-testid="all-count"
					>
								100
					</span>
				</div>
			</li>
			<li>
				<div
					role="button"
					data-count={ 100 }
					tabIndex={ 0 }
					aria-pressed="false"
				>
					{ __( 'All Block Designs', i18n ) }
					<span
						className="ugb-sidebar__count"
						data-testid="all-count"
					>
								100
					</span>
				</div>
			</li>
		</ul>

	)
}

export default Sidebar
