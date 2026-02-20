import { html, customElement } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

@customElement('tag-workspace')
export class TagWorkspaceElement extends UmbElementMixin(UmbLitElement) {
	render() {
		return html`
			<umb-workspace-editor alias="TagManager.TagWorkspace">
			</umb-workspace-editor>
		`;
	}
}

export default TagWorkspaceElement;

