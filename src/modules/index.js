import advancedBlockSpacing from './advanced-block-spacing'
import advancedColumnSpacing from './advanced-column-spacing'
import advancedResponsive from './advanced-responsive'
import blockBackground from './block-background'
import blockSeparators from './block-separators'
import customCSS from './custom-css'
export { getModule, initBlockModule } from './modules'

export const modules = [
	{ name: 'advanced-responsive', module: advancedResponsive },
	{ name: 'advanced-block-spacing', module: advancedBlockSpacing },
	{ name: 'advanced-column-spacing', module: advancedColumnSpacing },
	{ name: 'block-background', module: blockBackground },
	{ name: 'block-separators', module: blockSeparators },
	{ name: 'custom-css', module: customCSS },
]
