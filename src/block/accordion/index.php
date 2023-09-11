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


if ( ! function_exists( 'stackable_render_block_accordion_FAQ_schema' ) ) {
	function get_answer( $block, $answer ) {
		$count_inner_blocks = count( $block[ 'innerBlocks' ] );
		if ( $count_inner_blocks == 0 ) {
			// check if it contains a text
			if ( trim( strip_tags( $block[ 'innerHTML' ] ) ) != '' ) {
				// return the text with tags
				return $answer . trim( strip_tags( $block[ 'innerHTML'], [
					"<h1>", "<h2>", "<h3>", "<h4>", "<h5>", "<h6>",
					"<p>", "<a>", "<span>", "<strong>", "<em>", "<s>",
					"<kbd>", "<code>", "<sup>", "<sub>"] ) );
			}
			return $answer;
		}

		for ( $i = 0; $i < $count_inner_blocks; $i++ ) {
			$partial_answer = get_answer( $block[ 'innerBlocks' ][ $i ], $answer );
			$answer = $partial_answer;
		}

		return $answer;
	}

	function stackable_render_block_accordion_FAQ_schema( $block_content, $block ) {
		$attributes = $block[ 'attrs' ];

		if ( isset($attributes[ 'enableFAQ' ] ) && $attributes[ 'enableFAQ' ] ) {
			// innerBlocks[0] is for the title
			// retrieve stackable/column -> stackable/icon-label -> stackable/heading
			$question = trim( strip_tags( $block[ 'innerBlocks' ][0][ 'innerBlocks' ][0][ 'innerBlocks' ][0][ 'innerHTML' ] ) );

			// innerBlocks[1] is for the content
			// content may have multiple blocks so we need to retrieve all texts from each block
			$answer = '';
			$answer = get_answer( $block[ 'innerBlocks' ][1], $answer );

			return $block_content .
				'<script type="application/ld+json">
				{
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
				}
				</script>';
		}

		return $block_content;
	}

	add_filter( 'render_block_stackable/accordion', 'stackable_render_block_accordion_FAQ_schema', 10, 2 );
}
