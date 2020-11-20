
/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n'

const PreviewInfo = ( { typography, colors } ) => {
	const stringifiedTypography = ( typography || [] ).join( ', ' )

	return (
		<div className="ugb-modal-design-library__preview-info">
			{ Array.isArray( colors ) && !! colors.length && (
				<div className="ugb-modal-design-library__preview-info-item">
					<h4>{ __( 'Colors', i18n ) }</h4>
					<div className="ugb-modal-design-library__preview-info-colors">

						{	( colors || [] ).map( color => (
							<div
								key={ color }
								className="components-circular-option-picker__option-wrapper"
							>
								<div
									className="components-circular-option-picker__option"
									style={ { backgroundColor: color, color } }
								/>
							</div>
						) ) }

					</div>
				</div>
			) }

			{ stringifiedTypography && (
				<div className="ugb-modal-design-library__preview-info-item">

					<h4>{ __( 'Typography', i18n ) }</h4>

					<p className="ugb-modal-design-library__preview-info-typography">
						{ stringifiedTypography }
					</p>

				</div>
			) }

		</div>
	)
}

PreviewInfo.defaultProps = {
	typography: [],
	colors: [],
}

export default PreviewInfo
