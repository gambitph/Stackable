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

if ( is_multisite() && ! function_exists( 'stackable_fix_gt_style_errors' ) ) {

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
