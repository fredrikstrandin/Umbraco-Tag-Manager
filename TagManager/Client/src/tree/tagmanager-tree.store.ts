import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import { UmbUniqueTreeStore } from '@umbraco-cms/backoffice/tree';

export class UmbTagManagerTreeStore extends UmbUniqueTreeStore {
	constructor(host: UmbControllerHost) {
		super(host, UMB_TAGMANAGER_TREE_STORE_CONTEXT.toString());
	}
}

export const UMB_TAGMANAGER_TREE_STORE_CONTEXT = new UmbContextToken<UmbTagManagerTreeStore>(
	'UmbTagManagerTreeStore'
);

export default UmbTagManagerTreeStore;

