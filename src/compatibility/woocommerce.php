<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * In WooCommerce Shop page, <style> tags are stripped out and the CSS styles are displayed in the frontend.
 * This function removes the <style> tags and CSS styles before they are stripped out.
 */
if ( ! function_exists( 'stackable_pre_kses_woocomerce_shop' ) ) {

	function stackable_pre_kses_woocomerce_shop( $content, $allowed_html, $context ) {
		$optimized_css = get_post_meta( wc_get_page_id( 'shop' ), 'stackable_optimized_css', true );

		// remove CSS before kses strips out <style> tags
		if ( ! empty( $optimized_css ) ) {
			$content = str_replace( '<style>' . $optimized_css . '</style>', '', $content );
		}

		return $content;
	}

	function is_woocommerce_shop_page() {
		// only add filter when on the WooCommerce Shop page
		if ( function_exists('is_shop' ) && is_shop() ) {
			add_filter('pre_kses', 'stackable_pre_kses_woocomerce_shop', 10, 3);
		}

	}

	add_action( 'woocommerce_before_main_content', 'is_woocommerce_shop_page' );
}

if ( ! function_exists( 'stackable_check_if_woocommerce_shop' ) ) {

	function stackable_check_if_woocommerce_shop( $optimize_css ) {
		// Load cached CSS for the WooCommerce Shop page
		// is_singular() returns false when on the Shop page so we need to use is_shop()
		return $optimize_css || ( function_exists('is_shop' ) && is_shop() );
	}

	add_filter( 'stackable/load_cached_css_for_post', 'stackable_check_if_woocommerce_shop' );
}

if ( ! function_exists( 'stackable_get_woocommerce_shop_page_id' ) ) {

	function stackable_get_woocommerce_shop_page_id( $post_id ) {
		// use wc_get_page_id() to retrieve the page ID of the Shop page
		// do this because get_the_ID() returns the product page ID when on the Shop page
		if ( function_exists('is_shop' ) && is_shop() ) {
			return wc_get_page_id( 'shop' );
		}
		return $post_id;
	}

	add_filter( 'stackable/get_post_id_for_cached_css', 'stackable_get_woocommerce_shop_page_id' );

}
