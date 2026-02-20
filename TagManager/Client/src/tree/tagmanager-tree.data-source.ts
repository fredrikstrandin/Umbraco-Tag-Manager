import type {
	UmbTreeAncestorsOfRequestArgs,
	UmbTreeChildrenOfRequestArgs,
	UmbTreeRootItemsRequestArgs,
} from '@umbraco-cms/backoffice/tree';
import { UmbTreeServerDataSourceBase } from '@umbraco-cms/backoffice/tree';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
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

	async getRootItems(args: UmbTreeRootItemsRequestArgs) {
		// Fetch tag groups as root items
		const tagGroups = await this.#repository.getTagGroups();
		
		const items = tagGroups.map((group) => ({
			unique: group.group || 'default', // Use group name as unique ID
			parent: null,
			name: group.group || 'default',
			entityType: 'tagmanager-group',
			type: 'tagmanager-group' as const,
			hasChildren: false, // Don't show expand arrow - clicking opens workspace
			icon: 'icon-tags',
			isFolder: false, // Not a folder, it's a clickable item
		}));

		return { data: { items, total: tagGroups.length } };
	}

	async getChildrenOf(args: UmbTreeChildrenOfRequestArgs) {
		// Fetch tags for the specified group
		const groupId = parseInt(args.parent.unique);
		const tagGroups = await this.#repository.getTagGroups();
		const group = tagGroups.find((g) => (g.groupId || 0) === groupId);
		
		if (!group) {
			return { data: { items: [], total: 0 } };
		}

		const tags = await this.#repository.getTags(group.group || 'default');
		
		const items = tags.map((tag) => ({
			unique: `${groupId}-${tag.id}`,
			parent: { unique: args.parent.unique, entityType: 'tagmanager-group' },
			name: tag.tag || '',
			entityType: 'tagmanager-tag',
			type: 'tagmanager-tag' as const,
			hasChildren: false,
			icon: 'icon-tag',
			isFolder: false,
		}));

		return { data: { items, total: tags.length } };
	}

	async getAncestorsOf(args: UmbTreeAncestorsOfRequestArgs) {
		// For tags, return the parent group
		if (args.treeItem.entityType === 'tagmanager-tag' && args.treeItem.parent) {
			const tagGroups = await this.#repository.getTagGroups();
			const groupId = parseInt(args.treeItem.parent.unique);
			const group = tagGroups.find((g) => (g.groupId || 0) === groupId);
			
			if (group) {
				const items = [{
					unique: group.groupId?.toString() || '0',
					parent: null,
					name: group.group || 'default',
					entityType: 'tagmanager-group',
					type: 'tagmanager-group' as const,
					hasChildren: true,
					icon: 'icon-tags',
					isFolder: true,
				}];
				
				return { data: { items, total: 1 } };
			}
		}
		
		return { data: { items: [], total: 0 } };
	}
}

