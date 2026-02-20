import { UmbContextBase } from '@umbraco-cms/backoffice/class-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import type { UmbRoutableWorkspaceContext } from '@umbraco-cms/backoffice/workspace';

export class TagManagerGroupWorkspaceContext extends UmbContextBase<TagManagerGroupWorkspaceContext> implements UmbRoutableWorkspaceContext {
	public readonly routes = [];

	constructor(host: UmbControllerHost) {
		super(host, 'TagManager.GroupWorkspace.Context');
	}

	public getEntityId(): string {
		const urlParts = window.location.pathname.split('/');
		const groupIndex = urlParts.findIndex(part => part === 'tagmanager-group');
		if (groupIndex !== -1 && urlParts[groupIndex + 1]) {
			// Remove 'edit' if present
			const nextPart = urlParts[groupIndex + 1];
			if (nextPart === 'edit' && urlParts[groupIndex + 2]) {
				return decodeURIComponent(urlParts[groupIndex + 2]);
			}
			return decodeURIComponent(nextPart);
		}
		return 'default';
	}
}

export default TagManagerGroupWorkspaceContext;

