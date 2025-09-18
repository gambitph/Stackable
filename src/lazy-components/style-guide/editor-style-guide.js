import { default as StyleGuide } from '.'
import { useDesignSystem } from './use-design-system'

const EditorStyleGuide = props => {
	const designSystem = useDesignSystem()

	return <StyleGuide { ...props } designSystem={ designSystem } />
}

export default EditorStyleGuide
