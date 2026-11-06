import { detectIfVideo, isValidVideoUrl } from '../video-url'

describe( 'lightbox video URLs', () => {
	it.each( [
		'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10',
		'https://YOUTUBE.COM/embed/dQw4w9WgXcQ',
		'https://www.youtube.com/shorts/dQw4w9WgXcQ',
		'https://m.youtube.com/watch?v=dQw4w9WgXcQ',
		'https://music.youtube.com/watch?v=dQw4w9WgXcQ',
		'https://youtu.be/dQw4w9WgXcQ',
		'https://youtu.be/dQw4w9WgXcQ/',
		'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
		'https://vimeo.com/123456789?autoplay=1',
		'https://vimeo.com/123456789/abcdef1234',
		'https://cdn.example.com/video.mp4?token=a%26b',
		'https://cdn.example.com/clip.MP4',
		'/uploads/video.webm?version=2',
		'https://cdn.example.com/video.ogg',
		'https://cdn.example.com/video.mov',
		'https://youtube.com/watch?v=x"><img src=x>',
	] )( 'accepts %s', value => {
		expect( detectIfVideo( value ) ).toBe( true )
		expect( isValidVideoUrl( value ) ).toBe( true )
	} )

	it.each( [
		'javascript:youtube.com/watch?v=abc',
		'data:video/mp4;base64,AAAA',
		'https://user:pass@cdn.example.com/video.mp4',
	] )( 'rejects unsafe URL schemes or credentials in %s', value => {
		expect( isValidVideoUrl( value ) ).toBe( false )
	} )

	it.each( [
		'https://notyoutube.com/watch?v=abc',
		'https://youtube.com.evil.test/watch?v=abc',
		'https://example.com/photo.jpg?next=youtube.com',
		'https://example.com/page?ref=vimeo.com',
		'https://example.com/page?file=video.mp4',
	] )( 'does not detect video URLs from unrelated hostnames or query strings: %s', value => {
		expect( detectIfVideo( value ) ).toBe( false )
	} )

	it.each( [
		'https://VIMEO.COM/123"><img src=x>',
		'https://cdn.example.com/video.mp4"><img src=x>',
		'https://cdn.example.com/video.mp4\t?autoplay=1',
	] )( 'safely accepts unusual HTTP URL forms for escaping at the HTML sink: %s', value => {
		expect( detectIfVideo( value ) ).toBe( true )
		expect( isValidVideoUrl( value ) ).toBe( true )
	} )

	it( 'does not classify a malformed URL as a video', () => {
		expect( detectIfVideo( 'http://[invalid/video.mp4' ) ).toBe( false )
	} )
} )
