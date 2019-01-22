# DisplayLogic

Used within inspector settings to show/hide settings depending on a given condition.

## Usage

```
export const edit = ( props ) => {
    const { design } = props.attributes

    return (
        <InspectorControls>
            <DisplayLogic condition={ design === 'basic' } >
                <PanelBody>
                    // ...
                </PanelBody>
            </DisplayLogic>
        </InspectorControls>
    )
}