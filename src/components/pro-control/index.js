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
		title: __( 'Make Images Stand Out', i18n ),
		description: __( 'Mask photos with unique blob shapes to create memorable visuals that feel custom-designed.', i18n ),
	},
	'dynamic-attributes': {
		title: __( 'Build Smarter, Faster Sites', i18n ),
		description: __( 'Pull live content from posts, ACF, Meta Box, and more so pages update automatically without manual edits.', i18n ),
	},
	separator: {
		title: __( 'Create Depth Between Sections', i18n ),
		description: __( 'Layer colors and opacities on separators to craft richer section transitions that feel polished and intentional.', i18n ),
	},
	'icon-colors': {
		title: __( 'Make Icons Unforgettable', i18n ),
		description: __( 'Add gradients, multi-color fills, and background shapes so icons look premium and draw attention.', i18n ),
	},
	'icon-background-shape': {
		title: __( 'Give Icons More Presence', i18n ),
		description: __( 'Frame icons with distinctive background shapes to make features and lists clearer and more visually engaging.', i18n ),
	},
	transforms: {
		title: __( 'Add Delightful Hover Moments', i18n ),
		description: __( 'Move, scale, and rotate blocks on hover to create interactive effects that make your site feel alive.', i18n ),
	},
	'motion-effects': {
		title: __( 'Bring Your Pages to Life', i18n ),
		description: __( 'Create polished websites with elegant animations that naturally guide visitors through your content.', i18n ),
	},
	'conditional-display': {
		title: __( 'Show the Right Content', i18n ),
		description: __( 'Reveal or hide blocks by role, time, meta, and more to personalize pages for each visitor.', i18n ),
	},
	'custom-css': {
		title: __( 'Fine-Tune Every Detail', i18n ),
		description: __( 'Add per-block CSS with media queries to perfect layouts and polish designs beyond the inspector controls.', i18n ),
	},
	'column-arrangement': {
		title: __( 'Perfect Layouts on Mobile', i18n ),
		description: __( 'Reorder columns for tablet and mobile so content stays clear, scannable, and easy to read on every device.', i18n ),
	},
	'design-library': {
		title: __( 'Launch Beautiful Pages Faster', i18n ),
		description: __( 'Unlock premium designs you can drop in and customize, so every page looks professional from the start.', i18n ),
	},
	posts: {
		title: __( 'Display Posts Your Way', i18n ),
		description: __( 'Filter by custom post types, offset, include, or exclude posts to build flexible listings that fit any layout.', i18n ),
	},
	'icon-library': {
		title: __( 'Use Your Brand Icons', i18n ),
		description: __( 'Upload custom SVGs once and reuse them anywhere, so your icons stay consistent across the entire site.', i18n ),
	},
	'font-pairs': {
		title: __( 'Look Professionally Designed', i18n ),
		description: __( 'Apply curated font combinations instantly, or create your own, for typography that feels cohesive and on-brand.', i18n ),
	},
	'color-schemes': {
		title: __( 'Keep Your Brand Consistent', i18n ),
		description: __( 'Set site-wide color schemes that apply automatically, so every block stays on-brand without redoing colors by hand.', i18n ),
	},
	'preset-controls': {
		title: __( 'Design Faster With Consistency', i18n ),
		description: __( 'Define reusable size presets so spacing and typography stay balanced across blocks without guessing values.', i18n ),
	},
	'global-block-styles': {
		title: __( 'Design Once, Update Everywhere', i18n ),
		description: __( 'Sync block styles site-wide so one change updates every instance—no more copy-paste or hunting down inconsistencies.', i18n ),
	},
	'design-library-saved-patterns': {
		title: __( 'Design Library Saved Patterns', i18n ),
		description: <ul>
			<li>{ __( 'Save entire block layouts in a click', i18n ) }</li>
			<li>{ __( 'Apply styling options to each saved pattern', i18n ) }</li>
			<li>{ __( 'Import and export your custom patterns across sites', i18n ) }</li>
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
						{ props.button || LABELS[ props.type ]?.button || __( 'Get Premium', i18n ) }
					</a>
					{ props.learnMoreUrl && (
						<a href={ props.learnMoreUrl } target="_premium" className="button button-tertiary">
							{ __( 'Learn More', i18n ) }
						</a>
					) }
				</div>
			) }
			{ props.demoUrl && (
				<p className="ugb-design-control-pro-note__demo-link">
					<a href={ props.demoUrl } target="_premium" className="button button-secondary">{ __( 'View Demo', i18n ) }</a>
				</p>
			) }
			<p className="ugb-design-control-pro-note__notice">{ __( 'Part of the complete website builder in Stackable Premium.', i18n ) }</p>
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
