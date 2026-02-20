import { UmbModalToken } from '@umbraco-cms/backoffice/modal';

export interface TagCreateModalData {
	groupName: string;
}

export interface TagCreateModalValue {
	tag: string;
	group: string;
}

export const TAG_CREATE_MODAL_TOKEN = new UmbModalToken<TagCreateModalData, TagCreateModalValue>(
	'TagManager.Modal.CreateTag',
	{
		modal: {
			type: 'sidebar',
			size: 'small',
		},
	}
);



