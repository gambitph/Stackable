<?php
/**
 * Multisite fixes
 *
 * @since 	2.10.0
 * @package Stackable
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_allow_safe_style_css' ) ) {

	/**
	 * Fix block saving for Non-Super-Admins (no unfiltered_html capability).
	 * For Non-Super-Admins, some styles & HTML tags/attributes are removed upon saving,
	 * this allows Stackable styles from being saved.
	 *
	 * For every Stackable block, add the styles used here.
	 * Inlined styles are the only ones filtered out. Styles inside
	 * <style> tags are okay.
	 *
	 * @see The list of style rules allowed: https://core.trac.wordpress.org/browser/tags/5.2/src/wp-includes/kses.php#L2069
	 * @see https://github.com/gambitph/Stackable/issues/184
	 *
	 * @param array $styles Allowed CSS style rules.
	 *
	 * @return array Modified CSS style rules.
	 */
	function stackable_allow_safe_style_css( $styles ) {
		return array_merge( $styles, array(
			'border-radius',
			'opacity',
			'justify-content',
			'display',
			// SVG gradients use this.
			'stop-opacity',
			'stop-color',
		) );
	}
	add_filter( 'safe_style_css', 'stackable_allow_safe_style_css' );
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

if ( ! function_exists( 'stackable_fix_gt_style_errors' ) ) {

	/**
	 * Fix block saving for Non-Super-Admins (no unfiltered_html capability).
	 * For Non-Super-Admins, style tags with the ">" symbol are replaced with
	 * "&gt;", ">" is used across a lot of Stackable block styles. When these
	 * are replaced, the blocks may show an error, and the blocks styles will
	 * not take effect in the frontend.
	 *
	 * This function checks the page content for Stackable blocks that use the
	 * "&gt;" in styles, then replaces them with the correct ">" symbol.
	 *
	 * We do the replacement upon post saving and not on `render_block` so that
	 * we don't need to do any processing for the frontend.
	 *
	 * Only affects multisite.
	 *
	 * @see Issue: https://core.trac.wordpress.org/ticket/48873#ticket
	 * @see https://github.com/gambitph/Stackable/issues/510
	 *
	 * @param array $data Post data
	 *
	 * @return array Post data to save
	 */
	function stackable_fix_gt_style_errors( $data ) {
		if ( ! is_multisite() ) {
			return $data;
		}
		if ( empty( $data['post_content'] ) ) {
			return $data;
		}

		// Check whether there are any "&gt;" symbols inside <style> tags of
		// Stackable blocks.
		if ( ! stripos( $data['post_content'], '&gt; .stk-' ) &&
		     ! stripos( $data['post_content'], '&gt; .ugb-' ) && // Support for v2 blocks that start with ugb/
			 ! stripos( $data['post_content'], 'wp:stackable' ) &&
			 ! stripos( $data['post_content'], 'wp:ugb' ) && // Support for v2 blocks that start with ugb/
			 ! stripos( $data['post_content'], '<style' ) ) {
			return $data;
		}

		// Go through each block's "&gt;" and replace them with ">", only do
		// this for Stackable blocks. Also support v2 blocks with ugb/ prefix.
		$data['post_content'] = preg_replace_callback( '%wp:(stackable|ugb)/\w+(.*)?/wp:(stackable|ugb)/\w+%s', function( $matches ) {
			return preg_replace_callback( '%<style>(.*)?</style>%s', function( $matches ) {
				return '<style>' . preg_replace( '%&gt;%', '>', $matches[1] ) . '</style>';
			}, $matches[0] );
			return $content;
		}, $data['post_content'] );

		return $data;
	}

	add_filter( 'wp_insert_post_data' , 'stackable_fix_gt_style_errors' , 99, 1 );
}
