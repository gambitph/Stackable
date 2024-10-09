<?php
/**
 * Stackable KSES function.
 */

 // Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_allow_wp_kses_allowed_html' ) ) {

	/**
	 * Fix block saving for Non-Super-Admins (no unfiltered_html capability).
	 * For Non-Super-Admins, some styles & HTML tags/attributes are removed upon saving,
	 * this allows Stackable HTML tags & attributes from being saved.
	 *
	 * For every Stackable block, add the HTML tags and attributes used here.
	 *
	 * @see The list of tags & attributes currently allowed: https://core.trac.wordpress.org/browser/tags/5.2/src/wp-includes/kses.php#L61
	 * @see https://github.com/gambitph/Stackable/issues/184
	 *
	 * @param array $tags Allowed HTML tags & attributes.
	 * @param string $context The context wherein the HTML is being filtered.
	 *
	 * @return array Modified HTML tags & attributes.
	 */
	function stackable_allow_wp_kses_allowed_html( $tags, $context ) {
		// For some reason, there are server setups that can call this too early and wp_get_current_user() is not yet defined.
		if ( ! function_exists( 'wp_get_current_user' ) || ! function_exists( 'current_user_can' ) ) {
			return $tags;
		}

		// Only allow these tags if the user can edit posts.
		if ( ! current_user_can( 'edit_posts' ) ) {
			return $tags;
		}

		$tags['style'] = array(
			'id' => true,
			'class' => true,
			'type' => true,
		);

		// Used by Separators & Icons.
		$tags['svg'] = array(
			'viewbox' => true,
			'filter' => true,
			'enablebackground' => true,
			'xmlns' => true,
			'class' => true,
			'preserveaspectratio' => true,
			'aria-hidden' => true,
			'data-*' => true,
			'role' => true,
			'height' => true,
			'width' => true,
			'style' => true,
		);
		$tags['path'] = array(
			'd' => true,
		);
		$tags['circle'] = array(
			'cx' => true,
			'cy' => true,
			'r' => true,
		);
		$tags['polygon'] = array(
			'points' => true,
		);
		$tags['polyline'] = array(
			'points' => true,
		);
		$tags['rect'] = array(
			'x' => true,
			'y' => true,
			'width' => true,
			'height' => true,
			'rx' => true,
			'ry' => true,
		);
		$tags['line'] = array(
			'x1' => true,
			'x2' => true,
			'y1' => true,
			'y2' => true,
		);
		$tags['clippath'] = array();
		$tags['filter'] = array();
		$tags['g'] = array();
		$tags['use'] = array(
			'xlink:href' => true,
		);
		$tags['text'] = array(
			'font-size' => true,
			'font-family' => true,
			'font-weight' => true,
			'font-*' => true,
		);
		$tags['fegaussianblur'] = array(
			'in' => true,
			'stddeviation' => true,
		);
		$tags['fecomponenttransfer'] = array();
		$tags['fefunca'] = array(
			'type' => true,
			'slope' => true,
		);
		$tags['femerge'] = array();
		$tags['femergenode'] = array(
			'in' => true,
		);
		// SVG gradients.
		$tags['defs'] = array();
		$tags['stop'] = array(
			'offset' => true,
			'style' => true,
			'stop-color' => true,
			'stop-opacity' => true,
		);
		$tags['lineargradient'] = array( // Intentionally made this lowercase since tags do not recognize caps.
			'id' => true,
			'x1' => true,
			'x2' => true,
			'y1' => true,
			'y2' => true,
			'gradientunits' => true,
			'gradienttransform' => true,
		);

		// Used by posts block.
		$tags['time'] = array(
			'datetime' => true,
		);

		_stackable_svg_attributes( $tags, 'path' );
		_stackable_svg_attributes( $tags, 'circle' );
		_stackable_svg_attributes( $tags, 'polygon' );
		_stackable_svg_attributes( $tags, 'polyline' );
		_stackable_svg_attributes( $tags, 'line' );
		_stackable_svg_attributes( $tags, 'rect' );
		_stackable_svg_attributes( $tags, 'g' );
		_stackable_svg_attributes( $tags, 'clippath' );
		_stackable_svg_attributes( $tags, 'filter' );
		_stackable_svg_attributes( $tags, 'text' );

		_stackable_common_attributes( $tags, 'div' );
		_stackable_common_attributes( $tags, 'h1' );
		_stackable_common_attributes( $tags, 'h2' );
		_stackable_common_attributes( $tags, 'h3' );
		_stackable_common_attributes( $tags, 'h4' );
		_stackable_common_attributes( $tags, 'h5' );
		_stackable_common_attributes( $tags, 'h6' );
		_stackable_common_attributes( $tags, 'svg' );

		return $tags;
	}

	function _stackable_svg_attributes( &$tags, $tag ) {
		$tags[ $tag ]['id'] = true;
		$tags[ $tag ]['class'] = true;
		$tags[ $tag ]['style'] = true;
		$tags[ $tag ]['fill'] = true;
		$tags[ $tag ]['fill-rule'] = true;
		$tags[ $tag ]['fill-opacity'] = true;
		$tags[ $tag ]['fill-*'] = true;
		$tags[ $tag ]['clip-path'] = true;
		$tags[ $tag ]['transform'] = true;
		$tags[ $tag ]['stroke'] = true;
		$tags[ $tag ]['stroke-width'] = true;
		$tags[ $tag ]['stroke-linejoin'] = true;
		$tags[ $tag ]['stroke-miterlimit'] = true;
		$tags[ $tag ]['stroke-*'] = true;
		$tags[ $tag ]['opacity'] = true;
	}

	function _stackable_common_attributes( &$tags, $tag ) {
		$tags[ $tag ]['aria-hidden'] = true; // Used by Separators & Icons
		$tags[ $tag ]['aria-expanded'] = true; // Used by Expand block.
		$tags[ $tag ]['aria-level'] = true; // Used by Accordion block.
		$tags[ $tag ]['role'] = true; // Used by Accordion block.
		$tags[ $tag ]['tabindex'] = true; // Used by Accordion block.
	}

	add_filter( 'wp_kses_allowed_html', 'stackable_allow_wp_kses_allowed_html', 10, 2 );
}
