import { html, customElement } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';

/**
 * Inner shell for the routable tag-group workspace: hosts the workspace editor and views.
 */
@customElement('tagmanager-group-workspace-shell')
export class TagManagerGroupWorkspaceShellElement extends UmbLitElement {
	override render() {
		return html`<umb-workspace-editor alias="TagManager.GroupWorkspace"></umb-workspace-editor>`;
	}
}

export default TagManagerGroupWorkspaceShellElement;
