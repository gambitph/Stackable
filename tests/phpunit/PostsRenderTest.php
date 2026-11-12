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

	/**
	 * Seam: generate_render_item_from_stackable_posts_block featured-image output.
	 * WAVE flags linked featured images when Media Library alt is empty.
	 */
	private function render_featured_image( $thumbnail, $post_title ) {
		Functions\when( 'get_the_post_thumbnail' )->justReturn( $thumbnail );
		return generate_render_item_from_stackable_posts_block(
			array(
				'ID' => 1,
				'post_title' => $post_title,
			),
			$this->attributes(),
			'<figure class="stk"><a href="/post"><img src="placeholder.jpg" /></a></figure>'
		);
	}

	public function test_empty_thumbnail_alt_falls_back_to_post_title() {
		$html = $this->render_featured_image(
			'<img src="photo.jpg" class="attachment-full" alt="" />',
			'Hello World'
		);
		$this->assertStringContainsString( 'alt="Hello World"', $html );
		$this->assertStringContainsString( 'src="photo.jpg"', $html );
	}

	public function test_existing_thumbnail_alt_is_kept() {
		$html = $this->render_featured_image(
			'<img src="photo.jpg" alt="Custom alt" />',
			'Hello World'
		);
		$this->assertStringContainsString( 'alt="Custom alt"', $html );
		$this->assertStringNotContainsString( 'alt="Hello World"', $html );
	}

	public function test_missing_alt_attribute_uses_post_title() {
		$html = $this->render_featured_image(
			'<img src="photo.jpg" class="attachment-full" />',
			'Hello World'
		);
		$this->assertStringContainsString( 'alt="Hello World"', $html );
	}

	public function test_empty_title_and_empty_alt_keeps_empty_alt() {
		$html = $this->render_featured_image(
			'<img src="photo.jpg" alt="" />',
			''
		);
		$this->assertStringContainsString( 'alt=""', $html );
		$this->assertStringContainsString( '<img', $html );
	}

	public function test_empty_alt_fallback_title_is_escaped() {
		$html = $this->render_featured_image(
			'<img src="photo.jpg" alt="" />',
			'A "quoted" title'
		);
		$this->assertStringContainsString( 'alt="A &quot;quoted&quot; title"', $html );
	}

	public function test_empty_alt_fallback_keeps_dollar_amount_in_title() {
		$html = $this->render_featured_image(
			'<img src="photo.jpg" alt="" />',
			'Save $50 today'
		);
		$this->assertStringContainsString( 'alt="Save $50 today"', $html );
	}

	public function test_empty_alt_fallback_keeps_backslash_one_in_title() {
		$html = $this->render_featured_image(
			'<img src="photo.jpg" alt="" />',
			'C:\\1drive tips'
		);
		$this->assertStringContainsString( 'alt="C:\\1drive tips"', $html );
	}

	public function test_empty_alt_fallback_keeps_dollar_brace_group_in_title() {
		$html = $this->render_featured_image(
			'<img src="photo.jpg" alt="" />',
			'Use ${1} here'
		);
		$this->assertStringContainsString( 'alt="Use ${1} here"', $html );
	}
}
