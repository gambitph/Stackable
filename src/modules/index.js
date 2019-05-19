import advancedResponsive from './advanced-responsive'
import advancedSpacing from './advanced-spacing'
import blockBackground from './block-background'
import customCSS from './custom-css'
export { getModule, initBlockModule } from './modules'

export const modules = [
	{ name: 'advanced-responsive', module: advancedResponsive },
	{ name: 'advanced-spacing', module: advancedSpacing },
	{ name: 'block-background', module: blockBackground },
	{ name: 'custom-css', module: customCSS },
]
