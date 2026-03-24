import type {
	UmbTreeAncestorsOfRequestArgs,
	UmbTreeChildrenOfRequestArgs,
	UmbTreeRootItemsRequestArgs,
} from '@umbraco-cms/backoffice/tree';
import { UmbTreeServerDataSourceBase } from '@umbraco-cms/backoffice/tree';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import type { TagGroup } from '../api/types.js';
import { TagManagerTreeItemModel } from './tagmanager-tree-item.model.js';
import { TagManagerRepository } from '../api/tagmanager-repository.js';

export class TagManagerTreeDataSource extends UmbTreeServerDataSourceBase<any, TagManagerTreeItemModel> {
	#repository: TagManagerRepository;

	constructor(host: UmbControllerHost) {
		super(host, {
			getRootItems: (args) => this.getRootItems(args),
			getChildrenOf: (args) => this.getChildrenOf(args),
			getAncestorsOf: (args) => this.getAncestorsOf(args),
			mapper: (item) => item,
		});
		this.#repository = new TagManagerRepository(host);
	}

	#mapGroupsToItems(tagGroups: TagGroup[]): TagManagerTreeItemModel[] {
		return tagGroups.map((group) => {
			const name = group.group || group.Group || 'default';
			return {
				unique: name,
				parent: null,
				name,
				entityType: 'tagmanager-group',
				type: 'tagmanager-group' as const,
				hasChildren: false,
				icon: 'icon-tags',
				isFolder: false,
			};
		});
	}

	async getRootItems(args: UmbTreeRootItemsRequestArgs) {
		const tagGroups = await this.#repository.getTagGroups();
		const items = this.#mapGroupsToItems(tagGroups);

		return { data: { items, total: tagGroups.length } };
	}

	async getChildrenOf(args: UmbTreeChildrenOfRequestArgs) {
		const parentType = args.parent.entityType;
		const parentUnique = args.parent.unique;

		// With hideTreeRoot, the first level is often requested as children of the virtual root.
		const isTreeRoot =
			parentType === 'tagmanager-root' ||
			(parentType == null && (parentUnique == null || parentUnique === ''));

		if (isTreeRoot) {
			const tagGroups = await this.#repository.getTagGroups();
			const items = this.#mapGroupsToItems(tagGroups);
			return { data: { items, total: tagGroups.length } };
		}

		// Tag groups are leaves in the sidebar; tags are managed in the group workspace grid only.
		if (parentType === 'tagmanager-group') {
			return { data: { items: [], total: 0 } };
		}

		return { data: { items: [], total: 0 } };
	}

	#parseTreeTagId(unique: string | null | undefined): number | null {
		if (unique == null || unique === '') return null;
		if (/^\d+$/.test(unique)) return parseInt(unique, 10);
		const parts = unique.split('-');
		for (let i = parts.length - 1; i >= 0; i--) {
			const n = parseInt(parts[i], 10);
			if (!Number.isNaN(n)) return n;
		}
		return null;
	}

	async getAncestorsOf(args: UmbTreeAncestorsOfRequestArgs) {
		if (args.treeItem.entityType !== 'tagmanager-tag') {
			return { data: { items: [], total: 0 } };
		}

		const tagGroups = await this.#repository.getTagGroups();
		const parent = args.treeItem.parent;

		if (parent?.entityType === 'tagmanager-group' && parent.unique) {
			const group = tagGroups.find((g) => (g.group || g.Group || '') === parent.unique);
			if (group) {
				const name = group.group || group.Group || 'default';
				const items = [
					{
						unique: name,
						parent: null,
						name,
						entityType: 'tagmanager-group' as const,
						type: 'tagmanager-group' as const,
						hasChildren: false,
						icon: 'icon-tags',
						isFolder: false,
					},
				];
				return { data: { items, total: 1 } };
			}
		}

		const tagId = this.#parseTreeTagId(args.treeItem.unique);
		if (tagId == null) {
			return { data: { items: [], total: 0 } };
		}

		const tag = await this.#repository.getTagById(tagId);
		if (!tag) {
			return { data: { items: [], total: 0 } };
		}

		const name = tag.group || tag.Group || 'default';
		const items = [
			{
				unique: name,
				parent: null,
				name,
				entityType: 'tagmanager-group' as const,
				type: 'tagmanager-group' as const,
				hasChildren: false,
				icon: 'icon-tags',
				isFolder: false,
			},
		];

		return { data: { items, total: 1 } };
	}
}

