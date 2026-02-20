import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UmbTreeRepositoryBase } from '@umbraco-cms/backoffice/tree';
import { TagManagerTreeDataSource } from './tagmanager-tree.data-source.js';
import { UMB_TAGMANAGER_TREE_STORE_CONTEXT } from './tagmanager-tree.store.js';
import type { TagManagerTreeItemModel } from './tagmanager-tree-item.model.js';

export class TagManagerTreeRepository extends UmbTreeRepositoryBase<TagManagerTreeItemModel, any> {
	constructor(host: UmbControllerHost) {
		super(host, TagManagerTreeDataSource, UMB_TAGMANAGER_TREE_STORE_CONTEXT);
	}

	async requestTreeRoot() {
		const { data: treeRootData } = await this._treeSource.getRootItems({ skip: 0, take: 1 });
		const hasChildren = treeRootData ? treeRootData.total > 0 : false;

		const data = {
			unique: null,
			entityType: 'tagmanager-root',
			name: 'Tag Manager',
			hasChildren,
			isFolder: true,
		};

		return { data };
	}
}

export default TagManagerTreeRepository;

