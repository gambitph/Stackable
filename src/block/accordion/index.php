<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_load_accordion_frontend_script' ) ) {
	function stackable_load_accordion_frontend_script() {
		if ( ! is_admin() ) {
			wp_enqueue_script(
				'stk-frontend-accordion',
				plugins_url( 'dist/frontend_block_accordion.js', STACKABLE_FILE ),
				array(),
				STACKABLE_VERSION,
				true
			);
		}
	}
	add_action( 'stackable/accordion/enqueue_scripts', 'stackable_load_accordion_frontend_script' );
}

if ( ! function_exists( 'stackable_load_accordion_frontend_polyfill_script' ) ) {
	/**
	 * Adds polyfill for summary/details element that are * used in accordion blocks.
	 *
	 * TODO: confirm that this works on older browsers
	 */
	function stackable_load_accordion_frontend_polyfill_script() {

		$user_agent = ! empty( $_SERVER['HTTP_USER_AGENT'] ) ? $_SERVER['HTTP_USER_AGENT'] : '';

		if ( ! $user_agent ) {
			return;
		}

		$load_polyfill = false;

		if (
			// Safari 13.1.3
			( stripos( $user_agent, 'Version/13.' ) !== false && stripos( $user_agent, 'Safari/' ) !== false ) ||
			// Adnroid 7.0 Samsung Galaxy J5
			( stripos( $user_agent, 'Android 7.' ) !== false && stripos( $user_agent, 'Chrome/' ) !== false ) ||
			// IE 11
			stripos( $user_agent, 'Trident/7.0; rv:11.0' ) !== false
		) {
			$load_polyfill = true;
		} else if ( stripos( $user_agent, ' Edge/' ) !== false || stripos( $user_agent, ' Edg/' ) !== false ) {
			$matches = array();
			if ( preg_match( '/(Edge?)\/(\d+)/', $user_agent, $matches ) ) {
				$version = intval( $matches[2] );
				if ( $version < 79 ) {
					$load_polyfill = true;
				}
			}
		}

		if ( $load_polyfill ) {
			wp_enqueue_script(
				'stk-frontend-accordion-polyfill',
				plugins_url( 'dist/frontend_block_accordion_polyfill.js', STACKABLE_FILE ),
				array(),
				STACKABLE_VERSION
			);
		}
	}
	add_action( 'stackable/accordion/enqueue_scripts', 'stackable_load_accordion_frontend_polyfill_script' );
}


if ( ! class_exists( 'Stackable_Accordion_FAQ_Schema') ) {
	class Stackable_Accordion_FAQ_Schema {
		public static $accordion_faq_schema = [];

		function __construct() {
			add_filter( 'render_block_stackable/accordion', array( $this, 'stackable_render_block_accordion_FAQ_schema' ), 10, 2 );
		}

		public static function stackable_accordion_get_faq_schema() {
			echo '<script type="application/ld+json">' . implode( ', ', self::$accordion_faq_schema ) . '</script>';
		}

		public static function stackable_add_schema_to_footer() {
			add_filter( 'wp_footer', array( 'Stackable_Accordion_FAQ_Schema', 'stackable_accordion_get_faq_schema' ) );
		}

		public static function stackable_faq_schema_get_answer( $block, $answer ) {
			$count_inner_blocks = count( $block[ 'innerBlocks' ] );
			if ( $count_inner_blocks == 0 ) {
				// check if it contains a text
				if ( trim( wp_strip_all_tags( $block[ 'innerHTML' ], true ) ) != '' ) {
					// return the text without tags
					return $answer . trim( wp_strip_all_tags( $block[ 'innerHTML'], true ) );
				}
				return $answer;
			}

			for ( $i = 0; $i < $count_inner_blocks; $i++ ) {
				$partial_answer = self::stackable_faq_schema_get_answer( $block[ 'innerBlocks' ][ $i ], $answer );
				$answer = $partial_answer;
			}

			return $answer;
		}

		public static function stackable_render_block_accordion_FAQ_schema( $block_content, $block ) {
			$attributes = $block[ 'attrs' ];

			if ( isset($attributes[ 'enableFAQ' ] ) && $attributes[ 'enableFAQ' ] ) {
				// innerBlocks[0] is for the title
				// retrieve stackable/column -> stackable/icon-label -> stackable/heading
				$question = trim( strip_tags( $block[ 'innerBlocks' ][0][ 'innerBlocks' ][0][ 'innerBlocks' ][0][ 'innerHTML' ] ) );

				// innerBlocks[1] is for the content
				// content may have multiple blocks so we need to retrieve all texts from each block
				$answer = '';
				$answer = self::stackable_faq_schema_get_answer( $block[ 'innerBlocks' ][1], $answer );

				self::$accordion_faq_schema[] = '{
					"@context": "https://schema.org",
					"@type": "FAQPage",
					"mainEntity": [ {
						"@type": "Question",
						"name": "' . $question . '",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": \'' . $answer .'\'
							}
						}
					]
				}';

				self::stackable_add_schema_to_footer();
			}

			return $block_content;
		}
	}

	new Stackable_Accordion_FAQ_Schema();
}
