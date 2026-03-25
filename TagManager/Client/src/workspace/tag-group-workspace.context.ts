import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbContextBase } from '@umbraco-cms/backoffice/class-api';
import { UmbEntityContext } from '@umbraco-cms/backoffice/entity';
import {
	UMB_WORKSPACE_CONTEXT,
	UmbWorkspaceRouteManager,
} from '@umbraco-cms/backoffice/workspace';

/**
 * Routable workspace context for tag groups: drives tree selection via `edit/:unique` and exposes `unique` for views.
 */
export class TagManagerGroupWorkspaceContext extends UmbContextBase {
	#entityContext: UmbEntityContext;
	readonly routes: UmbWorkspaceRouteManager;
	/** Observable group key (same as tree item `unique`). */
	readonly unique;

	workspaceAlias = 'TagManager.GroupWorkspace';

	constructor(host: UmbControllerHost) {
		super(host, UMB_WORKSPACE_CONTEXT.toString());
		this.#entityContext = new UmbEntityContext(this);
		this.unique = this.#entityContext.unique;
		this.routes = new UmbWorkspaceRouteManager(this);
		this.routes.setRoutes([
			{
				path: 'edit/:unique',
				component: async () =>
					(await import('./tagmanager-group-workspace-shell.element.js'))
						.TagManagerGroupWorkspaceShellElement,
				setup: (_component, info) => {
					const raw = info.match.params.unique;
					const decoded = decodeURIComponent(raw);
					this.#entityContext.setUnique(decoded);
				},
			},
		]);
	}

	set manifest(manifest: { alias: string; meta: { entityType: string } }) {
		this.workspaceAlias = manifest.alias;
		this.#entityContext.setEntityType(manifest.meta.entityType);
	}

	getEntityType(): string {
		return this.#entityContext.getEntityType() ?? 'tagmanager-group';
	}
}

export { TagManagerGroupWorkspaceContext as api };
