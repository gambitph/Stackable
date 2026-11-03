import { detectIfVideo, isValidVideoUrl } from '../video-url'

describe( 'lightbox video URLs', () => {
	it.each( [
		'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10',
		'https://YOUTUBE.COM/embed/dQw4w9WgXcQ',
		'https://youtu.be/dQw4w9WgXcQ',
		'https://youtu.be/dQw4w9WgXcQ/',
		'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
		'https://vimeo.com/123456789?autoplay=1',
		'https://cdn.example.com/video.mp4?token=a%26b',
		'/uploads/video.webm?version=2',
		'https://cdn.example.com/video.ogg',
		'https://cdn.example.com/video.mov',
	] )( 'accepts %s', value => {
		expect( detectIfVideo( value ) ).toBe( true )
		expect( isValidVideoUrl( value ) ).toBe( true )
	} )

	it.each( [
		'https://youtube.com/watch?v=x"><img src=x>',
		'https://VIMEO.COM/123"><img src=x>',
		'https://cdn.example.com/video.mp4"><img src=x>',
		'https://cdn.example.com/video.mp4\t?autoplay=1',
		'https://notyoutube.com/watch?v=abc',
		'https://youtube.com.evil.test/watch?v=abc',
		'https://youtube.com/watch?v=abc/def',
		'https://youtube.com/watch?v=abc&v=def',
		'https://vimeo.com/123/extra',
		'https://cdn.example.com/video.mp4/extra',
		'javascript:youtube.com/watch?v=abc',
		'https://user:pass@cdn.example.com/video.mp4',
	] )( 'rejects %s', value => {
		expect( detectIfVideo( value ) ).toBe( true )
		expect( isValidVideoUrl( value ) ).toBe( false )
	} )
} )
