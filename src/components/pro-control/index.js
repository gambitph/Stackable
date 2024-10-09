/**
 * Internal dependencies
 */
import SVGDiamond from './images/diamond.svg'
import ImageProIcon from './images/pro-icon.png'
import Button from '../button'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

/**
 * External dependencies
 */
import { srcUrl, i18n } from 'stackable'
import classnames from 'classnames'

const prependBaseUrl = src => `${ srcUrl }/${ src }`

const LABELS = {
	image: {
		title: __( 'Get More Image Shapes', i18n ),
		description: <ul>
			<li>{ __( 'Mask images with a variety of blob-like shapes', i18n ) }</li>
			<li>{ __( 'Choose from over 50 different shapes', i18n ) }</li>
			<li>{ __( 'Enhances the overall aesthetic of images', i18n ) }</li>
		</ul>,
	},
	'dynamic-attributes': {
		title: __( 'Use Dynamic Content', i18n ),
		description: <ul>
			<li>{ __( 'Add dynamic content from posts or post meta', i18n ) }</li>
			<li>{ __( 'Use third-party plugins as dynamic sources such as ACF, Meta Box, Toolset, and more', i18n ) }</li>
			<li>{ __( 'Build custom loop design with the Native Query Loop', i18n ) }</li>
		</ul>,
	},
	separator: {
		title: __( 'Separator Layers', i18n ),
		description: <ul>
			<li>{ __( 'Add a second and third layer to separators', i18n ) }</li>
			<li>{ __( 'Change layer color, size and opacity', i18n ) }</li>
			<li>{ __( 'Greater creativity in designing separators', i18n ) }</li>
		</ul>,
	},
	'icon-colors': {
		title: __( 'Elevate Your Icons', i18n ),
		description: <ul>
			<li>{ __( 'Liven up icons with gradient fills, multiple colors and background shapes', i18n ) }</li>
			<li>{ __( 'More design options and customization for icons', i18n ) }</li>
			<li>{ __( 'Choose from over 50 background shapes', i18n ) }</li>
			<li>{ __( 'Greater visual interest and variety for your icons', i18n ) }</li>
		</ul>,
	},
	'icon-background-shape': {
		description: <ul>
			<li>{ __( 'Liven up icons with background shapes', i18n ) }</li>
			<li>{ __( 'Choose from over 50 background shapes', i18n ) }</li>
			<li>{ __( 'Greater visual interest and variety for your icons', i18n ) }</li>
		</ul>,
	},
	transforms: {
		description: <ul>
			<li>{ __( 'Adjust timing of CSS transitions', i18n ) }</li>
			<li>{ __( 'Change X and Y position of blocks', i18n ) }</li>
			<li>{ __( 'Scale or rotate blocks', i18n ) }</li>
			<li>{ __( 'Perfect for hover animations', i18n ) }</li>
		</ul>,
	},
	'motion-effects': {
		description: <ul>
			<li>{ __( 'Entrance fade-ins and animations when scrolling to blocks', i18n ) }</li>
			<li>{ __( 'Smooth scroll animations based on scrolling position', i18n ) }</li>
			<li>{ __( 'Create a more visually engaging and interactive experience', i18n ) }</li>
		</ul>,
	},
	'conditional-display': {
		description: <ul>
			<li>{ __( 'Show or hide blocks based on conditions', i18n ) }</li>
			<li>{ __( 'Display blocks based on time, role, meta, custom PHP, option, taxonomy and more', i18n ) }</li>
			<li>{ __( 'Use multiple conditions', i18n ) }</li>
			<li>{ __( 'Show targeted content and personalization', i18n ) }</li>
			<li>{ __( 'Greater control over the visibility of content', i18n ) }</li>
		</ul>,
	},
	'custom-css': {
		description: <ul>
			<li>{ __( 'Add custom CSS rules specific for each block', i18n ) }</li>
			<li>{ __( 'Support for media queries', i18n ) }</li>
			<li>{ __( 'Fine-tune styling on a per block basis', i18n ) }</li>
		</ul>,
	},
	'column-arrangement': {
		title: __( 'Adjust Column Arrangement', i18n ),
		description: <ul>
			<li>{ __( 'Adjust the arrangement of columns when collapsed on tablet and mobile', i18n ) }</li>
			<li>{ __( 'Ensure that content remains organized and easily readable on mobile', i18n ) }</li>
		</ul>,
	},
	'design-library': {
		title: __( 'This is a Premium Design', i18n ),
		description: __( 'Unlock access to the entire design library and set your website apart from the rest.', i18n ),
	},
	posts: {
		title: __( 'Get More Post Options', i18n ),
		description: <ul>
			<li>{ __( 'New Custom Post Type option', i18n ) }</li>
			<li>{ __( 'Offset, exclude, include specific posts', i18n ) }</li>
			<li>{ __( 'Hide the current post - great for synced patterns', i18n ) }</li>
		</ul>,
	},
	'icon-library': {
		title: __( 'Unlock Your Icon Library', i18n ),
		description: <ul>
			<li>{ __( 'Add your custom SVG icons', i18n ) }</li>
			<li>{ __( 'Easily access your custom icons in the icon picker', i18n ) }</li>
			<li>{ __( 'Organize your custom icons in your library', i18n ) }</li>
		</ul>,
	},
}

const ProControl = props => {
	const classNames = classnames( [ 'ugb-design-control-pro-note', props.className ] )
	const description = props.description || LABELS[ props.type ]?.description

	return (
		<div className={ classNames }>
			{ props.isDismissible && <Button className="ugb-design-control-pro-note__close" icon="no-alt" isTertiary onClick={ props.onClose } /> }
			{ props.showImage && <img src={ prependBaseUrl( ImageProIcon ) } className="ugb-design-control-pro-note__logo" alt="" /> }
			<h4>{ props.title || LABELS[ props.type ]?.title || __( 'This Is a Premium Feature', i18n ) }</h4>
			{ description && (
				<div className="ugb-design-control-pro-note__description">{ description }</div>
			) }
			{ props.showButton && (
				<div>
					<a href="https://wpstackable.com/premium/?utm_source=editor-learn-more&utm_campaign=learnmore&utm_medium=gutenberg" target="_premium" className="button button-secondary">
						<SVGDiamond />
						{ props.button || LABELS[ props.type ]?.button || __( 'Learn More', i18n ) }
					</a>
				</div>
			) }
			{ props.demoUrl && (
				<p className="ugb-design-control-pro-note__demo-link">
					<a href={ props.demoUrl } target="_premium" className="button button-secondary">{ __( 'View Demo', i18n ) }</a>
				</p>
			) }
			{ props.showHideNote && <p className="ugb-design-control-pro-note__notice">{ __( 'You can hide premium hints in the settings', i18n ) }</p> }
		</div>
	)
}

ProControl.defaultProps = {
	className: '',
	type: '',
	title: '',
	description: '',
	button: '',
	showImage: true,
	showButton: true,
	showHideNote: true,
	demoUrl: '',
	buttonUtmSource: undefined,

	isDismissible: false,
	onClose: () => {},
}

export default ProControl
