<?php
namespace Stackable\Context\Core;

class Stackable_Context {
	/**
	 * Given the block content, parse all !#STK_CONTEXT_ field
	 * names. In most cases, there should be only 1 !#STK_CONTEXT
	 * per block.
	 *
	 * @example
	 * ```
	 * $this->stk_context_parser( '<div>!#STK_CONTEXT_postTitle!#</div>' )
	 * returns array( 'postTitle' )
	 * ```
	 */
	public static function stk_context_parser( $content ) {
		preg_match_all( '/!#STK_CONTEXT_(.*?)!#/', $content, $matches );
		return $matches[ 1 ];
	}

	/**
	 * Helper function for handling context values from the !#STK_CONTEXT_ string.
	 *
	 * @example
	 * ```
	 * $this->context_handler( 'postTitle', array( 'postId' => 1234 ) );
	 * returns the Post Title by the given post ID
	 * ```
	 *
	 * @param string $context_string
	 * @param array $context
	 *
	 * @return string|null content
	 */
	public static function context_handler( $context_string, $context ) {
		switch ( $context_string ) {
			case 'postTitle': return self::get_post_title( $context );
			default: return null;
		}
	}

	/**
	 * Get the post title.
	 *
	 * @param array $context
	 * @return string post title or null.
	 */
	public static function get_post_title( $context ) {
		if ( ! array_key_exists( 'postId', $context ) ) {
			return null;
		}

		return get_the_title( $context[ 'postId' ] );
	}

	/**
	 * Utility function to check
	 * whether the block has !#STK_CONTEXT_.
	 *
	 * @param string $content
	 * $param array $block
	 *
	 * @return bool true if exists, otherwise, false.
	 */
	public static function has_stk_context( $content, $block ) {
		return ! ( count( $block->context ) === 0 || stripos( $content, '!#STK_CONTEXT_' ) === false );
	}

	public static function render_callback( $attributes, $content, $block ) {
		if ( ! self::has_stk_context( $content, $block ) ) {
			return $content;
		}

		$parsed_fields = self::stk_context_parser( $content );

		if ( ! $parsed_fields || count( $parsed_fields ) === 0  ) {
			return $content;
		}

		foreach ( $parsed_fields as $parsed_field ) {
			$output = self::context_handler( $parsed_field, $block->context );
			if ( $output !== null ) {
				$content = preg_replace( '/!#STK_CONTEXT_' . $parsed_field . '!#/', $output, $content );
			}
		}

		return $content;
	}
}

