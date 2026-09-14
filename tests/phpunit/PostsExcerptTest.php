<?php
/**
 * Posts excerpt: custom excerpt, trim, and tag stripping.
 *
 * @package Stackable
 */

use Brain\Monkey\Functions;

class PostsExcerptTest extends Stackable_TestCase {

	protected function set_up() {
		parent::set_up();
		$this->require_plugin_file( 'src/block/posts/index.php' );
	}

	public function test_custom_excerpt_is_used_when_present() {
		Functions\when( 'get_post_field' )->alias( function( $field ) {
			return 'post_excerpt' === $field ? 'Custom excerpt here' : '';
		} );

		$excerpt = Stackable_Posts_Block::get_excerpt_by_post_id( 1, array(), 55 );
		$this->assertSame( 'Custom excerpt here', $excerpt );
	}

	public function test_content_is_trimmed_when_no_excerpt() {
		Functions\when( 'get_post_field' )->justReturn( '' );
		$words = implode( ' ', array_fill( 0, 20, 'word' ) );
		$excerpt = Stackable_Posts_Block::get_excerpt_by_post_id( 1, array(
			'post_content' => $words,
		), 5 );
		$this->assertLessThan( strlen( $words ), strlen( $excerpt ) );
		$this->assertStringStartsWith( 'word word word word word', $excerpt );
	}

	public function test_anchor_tags_are_not_left_in_excerpt() {
		Functions\when( 'get_post_field' )->justReturn( '' );
		$excerpt = Stackable_Posts_Block::get_excerpt_by_post_id( 1, array(
			'post_content' => '<a href="https://evil.example">click</a> more words here please',
		), 10 );
		$this->assertStringNotContainsString( '<a', $excerpt );
	}

	public function test_cjk_without_spaces_is_one_word_today() {
		Functions\when( 'get_post_field' )->justReturn( '' );
		$chinese = '这是一段没有空格的中文内容用于测试摘要长度';
		$excerpt = Stackable_Posts_Block::get_excerpt_by_post_id( 1, array(
			'post_content' => $chinese,
		), 5 );
		$this->assertSame( $chinese, $excerpt );
	}
}
