<?php
/**
 * Posts item markup: title escaping, untitled fallback, empty image.
 *
 * @package Stackable
 */

use Brain\Monkey\Functions;

class PostsRenderTest extends Stackable_TestCase {

	protected function set_up() {
		parent::set_up();
		$this->require_plugin_file( 'src/block/posts/index.php' );
	}

	private function attributes() {
		return array(
			'imageSize' => 'full',
			'excerptLength' => 55,
			'readmoreText' => 'Continue',
			'metaSeparator' => 'dot',
			'categoryHighlighted' => false,
		);
	}

	public function test_script_in_title_is_escaped() {
		Functions\when( 'get_the_post_thumbnail' )->justReturn( '' );
		$html = generate_render_item_from_stackable_posts_block(
			array(
				'ID' => 1,
				'post_title' => '<script>alert(1)</script>',
			),
			$this->attributes(),
			'<h3>!#title!#</h3>'
		);
		$this->assertStringNotContainsString( '<script>', $html );
		$this->assertStringContainsString( '&lt;script&gt;', $html );
	}

	public function test_empty_title_uses_untitled() {
		Functions\when( 'get_the_post_thumbnail' )->justReturn( '' );
		$html = generate_render_item_from_stackable_posts_block(
			array(
				'ID' => 1,
				'post_title' => '',
			),
			$this->attributes(),
			'<h3>!#title!#</h3>'
		);
		$this->assertStringContainsString( '(Untitled)', $html );
	}

	public function test_readmore_html_passes_through_kses() {
		Functions\when( 'get_the_post_thumbnail' )->justReturn( '' );
		$attrs = $this->attributes();
		$attrs['readmoreText'] = 'Read <em>more</em><script>x</script>';
		$html = generate_render_item_from_stackable_posts_block(
			array(
				'ID' => 1,
				'post_title' => 'A',
			),
			$attrs,
			'<a>!#readmoreText!#</a>'
		);
		$this->assertStringContainsString( '<em>more</em>', $html );
		$this->assertStringNotContainsString( '<script>', $html );
	}

	public function test_missing_thumbnail_removes_figure() {
		Functions\when( 'get_the_post_thumbnail' )->justReturn( '' );
		$html = generate_render_item_from_stackable_posts_block(
			array(
				'ID' => 1,
				'post_title' => 'A',
			),
			$this->attributes(),
			'<figure class="stk"><img src="x" /></figure><h3>!#title!#</h3>'
		);
		$this->assertStringNotContainsString( '<figure', $html );
		$this->assertStringContainsString( '<h3>A</h3>', $html );
	}
}
