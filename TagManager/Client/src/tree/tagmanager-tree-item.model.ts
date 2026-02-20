import type { UmbTreeItemModel } from '@umbraco-cms/backoffice/tree';

export interface TagManagerTreeItemModel extends UmbTreeItemModel {
	entityType: 'tagmanager-group' | 'tagmanager-tag';
	unique: string;
}

