<?php
/**
 * Website settings collector for Site Kit exports.
 *
 * @package Stackable
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Site_Kit_Site_Collector' ) ) {
	class Stackable_Site_Kit_Site_Collector {

		public function collect( $context = array() ) {
			$show_on_front = get_option( 'show_on_front', 'posts' );
			$show_on_front = 'page' === $show_on_front ? 'page' : 'posts';

			return array(
				'showOnFront' => $show_on_front,
				'frontPage' => $this->page_slug( get_option( 'page_on_front', 0 ) ),
				'postsPage' => $this->page_slug( get_option( 'page_for_posts', 0 ) ),
			);
		}

		private function page_slug( $post_id ) {
			if ( ! $post_id ) {
				return null;
			}

			$slug = get_post_field( 'post_name', (int) $post_id );
			return $slug ? sanitize_title( $slug ) : null;
		}
	}
}
