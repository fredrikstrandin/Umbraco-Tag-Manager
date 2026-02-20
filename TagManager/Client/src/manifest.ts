import { UmbTagManagerTreeStore } from './tree/tagmanager-tree.store.js';

const UMB_TAGMANAGER_TREE_REPOSITORY_ALIAS = 'TagManager.Tree.Repository';
const UMB_TAGMANAGER_TREE_ALIAS = 'TagManager.Tree';

export const manifests = [
	{
		type: 'section',
		alias: 'TagManager.Section',
		name: 'Tag Manager Section',
		weight: 10,
		meta: {
			label: 'Tag Manager',
			pathname: 'tagmanager',
			icon: 'icon-tags',
		},
		conditions: [
			{
				alias: 'Umb.Condition.SectionUserPermission',
				match: 'TagManager.Section',
			},
		],
	},
	{
		type: 'dashboard',
		alias: 'TagManager.Section.Dashboard',
		name: 'Tag Manager Dashboard',
		elementName: 'tagmanager-dashboard',
		js: () => import('./dashboard/tagmanager-dashboard.element.js'),
		weight: -10,
		meta: {
			label: 'Dashboard',
		},
		conditions: [
			{
				alias: 'Umb.Condition.SectionAlias',
				match: 'TagManager.Section',
			},
		],
	},
	{
		type: 'sectionSidebarApp',
		kind: 'menuWithEntityActions',
		alias: 'TagManager.SectionSidebarMenu',
		name: 'Tag Manager Section Sidebar Menu',
		weight: 100,
		meta: {
			label: 'Tag Manager',
			menu: 'TagManager.Menu',
		},
		conditions: [
			{
				alias: 'Umb.Condition.SectionAlias',
				match: 'TagManager.Section',
			},
		],
	},
	{
		type: 'menu',
		alias: 'TagManager.Menu',
		name: 'Tag Manager Menu',
	},
	{
		type: 'menuItem',
		kind: 'tree',
		alias: 'TagManager.MenuItem.Tree',
		name: 'Tag Manager Tree Menu Item',
		weight: 200,
		meta: {
			label: 'Tag Groups',
			menus: ['TagManager.Menu'],
			treeAlias: UMB_TAGMANAGER_TREE_ALIAS,
			hideTreeRoot: true,
		},
	},
	{
		type: 'repository',
		alias: UMB_TAGMANAGER_TREE_REPOSITORY_ALIAS,
		name: 'Tag Manager Tree Repository',
		api: () => import('./tree/tagmanager-tree.repository.js'),
	},
	{
		type: 'treeStore',
		alias: 'TagManager.Tree.Store',
		name: 'Tag Manager Tree Store',
		api: UmbTagManagerTreeStore,
	},
	{
		type: 'tree',
		kind: 'default',
		alias: UMB_TAGMANAGER_TREE_ALIAS,
		name: 'Tag Manager Tree',
		meta: {
			repositoryAlias: UMB_TAGMANAGER_TREE_REPOSITORY_ALIAS,
		},
	},
	{
		type: 'treeItem',
		kind: 'default',
		alias: 'TagManager.TreeItem',
		name: 'Tag Manager Tree Item',
		forEntityTypes: ['tagmanager-root', 'tagmanager-group', 'tagmanager-tag'],
	},
	{
		type: 'workspace',
		kind: 'default',
		alias: 'TagManager.GroupWorkspace',
		name: 'Tag Group Workspace',
		meta: {
			entityType: 'tagmanager-group',
		},
	},
	{
		type: 'workspaceView',
		alias: 'TagManager.GroupWorkspace.Tags',
		name: 'Tag Group Tags View',
		element: () => import('./workspace/tag-group-workspace.element.js'),
		weight: 1000,
		meta: {
			label: 'Tags',
			pathname: 'tags',
			icon: 'icon-tags',
		},
		conditions: [
			{
				alias: 'Umb.Condition.WorkspaceAlias',
				match: 'TagManager.GroupWorkspace',
			},
		],
	},
	{
		type: 'workspace',
		kind: 'default',
		alias: 'TagManager.TagWorkspace',
		name: 'Tag Manager Workspace',
		element: () => import('./workspace/tag-workspace.element.js'),
		meta: {
			entityType: 'tagmanager-tag',
		},
	},
	{
		type: 'workspaceView',
		alias: 'TagManager.TagWorkspace.Edit',
		name: 'Tag Edit Workspace View',
		element: () => import('./workspace/tag-edit-view.element.js'),
		weight: 300,
		meta: {
			label: 'Edit',
			pathname: 'edit',
			icon: 'icon-edit',
		},
		conditions: [
			{
				alias: 'Umb.Condition.WorkspaceAlias',
				match: 'TagManager.TagWorkspace',
			},
		],
	},
	{
		type: 'modal',
		alias: 'TagManager.Modal.CreateTag',
		name: 'Create Tag Modal',
		js: () => import('./modal/tag-create-modal.element.js'),
	},
];

