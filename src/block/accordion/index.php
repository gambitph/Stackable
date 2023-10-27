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

if ( ! class_exists( 'Stackable_Accordion_FAQ_Schema' ) ) {
	class Stackable_Accordion_FAQ_Schema {
		public $faq_entities = [];

		function __construct() {
			add_filter( 'render_block_stackable/accordion', array( $this, 'render_block_accordion_faq_schema' ), 10, 2 );
			add_filter( 'wp_footer', array( $this, 'print_faq_schema' ) );
		}

		public function print_faq_schema() {
			if ( count( $this->faq_entities ) ) {
				echo
				'<script type="application/ld+json">
				{
					"@context": "https://schema.org",
					"@type": "FAQPage",
					"mainEntity": [' . implode( ', ', $this->faq_entities ) . ']
				}
				</script>';
			}
		}

		public function get_faq_answer( $block, $answer ) {
			$count_inner_blocks = count( $block[ 'innerBlocks' ] );
			if ( $count_inner_blocks == 0 ) {
				if ( is_null( $block['innerHTML'] ) ) {
					return $answer;
				}

				// This regex is taken directly on how wp_strip_all_tags does
				// it, but do not remove some allowed tags.
				$text = preg_replace( '@<(script|style)[^>]*?>.*?</\\1>@si', '', $block['innerHTML'] );
				$text = trim( strip_tags( $text, '<br>' ) );

				return trim( $answer . ' ' . $text );
			}

			for ( $i = 0; $i < $count_inner_blocks; $i++ ) {
				$partial_answer = $this->get_faq_answer( $block[ 'innerBlocks' ][ $i ], $answer );
				$answer = $partial_answer;
			}

			return $answer;
		}

		public function render_block_accordion_faq_schema( $block_content, $block ) {
			$attributes = $block[ 'attrs' ];

			// If the block is malformed then we don't do anything.
			if ( count( $block[ 'innerBlocks' ] ) < 2 ) {
				return $block_content;
			}

			if ( isset( $attributes[ 'enableFAQ' ] ) && $attributes[ 'enableFAQ' ] ) {
				// innerBlocks[0] is for the title
				// retrieve stackable/column -> stackable/icon-label -> stackable/heading
				$isHeadingBlock = $block[ 'innerBlocks' ][0][ 'innerBlocks' ][0][ 'innerBlocks' ][0][ 'blockName' ] === 'stackable/heading';
				$question = '';
				if ( $isHeadingBlock ) {
					$question = trim( wp_strip_all_tags( $block[ 'innerBlocks' ][0][ 'innerBlocks' ][0][ 'innerBlocks' ][0][ 'innerHTML' ] ) );
				} else {
					$question = trim( wp_strip_all_tags( $block[ 'innerBlocks' ][0][ 'innerBlocks' ][0][ 'innerBlocks' ][1][ 'innerHTML' ] ) );
				}

				// innerBlocks[1] is for the content
				// content may have multiple blocks so we need to retrieve all texts from each block
				$answer = '';
				$answer = $this->get_faq_answer( $block[ 'innerBlocks' ][1], $answer );

				$this->faq_entities[] = '{
						"@type": "Question",
						"name": ' . json_encode( $question, JSON_UNESCAPED_UNICODE ) . ',
						"acceptedAnswer": {
							"@type": "Answer",
							"text": ' . json_encode( $answer, JSON_UNESCAPED_UNICODE ) .'
						}
					}';
			}

			return $block_content;
		}
	}

	new Stackable_Accordion_FAQ_Schema();
}
