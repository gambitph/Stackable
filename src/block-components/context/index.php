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
	 *
	 * @param string $content
	 * @return array content matches
	 */
	public static function stk_context_parser( $content ) {
		preg_match_all( '/!#STK_CONTEXT_(.*?)!#/', $content, $matches );
		return $matches[ 1 ];
	}

	/**
	 * Utility function to check
	 * whether the block has !#STK_CONTEXT_.
	 *
	 * @param string $content
	 * @param array $block
	 *
	 * @return bool true if exists, otherwise, false.
	 */
	public static function has_stk_context( $content, $block ) {
		return ! ( count( $block->context ) === 0 || stripos( $content, '!#STK_CONTEXT_' ) === false );
	}

	/**
	 * Block's render_callback function.
	 * Use this render callback to parse
	 * all `!#STK_CONTEXT_(.*?)!#` instances
	 * of the block and return its actual value.
	 *
	 * @param array $attributes
	 * @param string $content
	 * @param array $block
	 *
	 * @return string new block content.
	 */
	public static function render_callback( $attributes, $content, $block ) {
		if ( ! self::has_stk_context( $content, $block ) ) {
			return $content;
		}

		$parsed_fields = self::stk_context_parser( $content );

		if ( ! $parsed_fields || count( $parsed_fields ) === 0  ) {
			return $content;
		}

		foreach ( $parsed_fields as $parsed_field ) {
			$output = apply_filters( 'stackable.block-components.context.render-content', null, $parsed_field, $block->context );
			if ( $output !== null ) {
				$content = preg_replace( '/!#STK_CONTEXT_' . $parsed_field . '!#/', $output, $content );
			}
		}

		return $content;
	}
}
