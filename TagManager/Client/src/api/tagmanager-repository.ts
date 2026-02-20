import type { CmsTag, TagGroup } from './types.js';
import { UmbControllerBase } from '@umbraco-cms/backoffice/class-api';
import { UMB_AUTH_CONTEXT } from '@umbraco-cms/backoffice/auth';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';

const API_BASE = '/umbraco/TagManager/api/v1/TagManager';

export class TagManagerRepository extends UmbControllerBase {
	constructor(host: UmbControllerHost) {
		super(host);
	}

	private async getAuthHeaders(): Promise<HeadersInit> {
		try {
			const authContext = await this.getContext(UMB_AUTH_CONTEXT);
			const token = await authContext?.getLatestToken();

			return {
				'Content-Type': 'application/json',
				...(token ? { 'Authorization': `Bearer ${token}` } : {}),
			};
		} catch (error) {
			return {
				'Content-Type': 'application/json',
			};
		}
	}
	async getTagById(tagId: number): Promise<CmsTag | null> {
		try {
			const headers = await this.getAuthHeaders();
			const response = await fetch(`${API_BASE}/tag/${tagId}`, {
				headers,
				credentials: 'include',
			});
			if (!response.ok) return null;
			return await response.json();
		} catch {
			return null;
		}
	}

	async getTagGroups(): Promise<TagGroup[]> {
		try {
			const headers = await this.getAuthHeaders();
			const response = await fetch(`${API_BASE}/taggroups`, {
				headers,
				credentials: 'include',
			});
			if (!response.ok) {
				return [];
			}
			return await response.json();
		} catch (error) {
			return [];
		}
	}

	async getTagsInGroup(groupName: string): Promise<CmsTag[]> {
		try {
			const headers = await this.getAuthHeaders();
			const response = await fetch(`${API_BASE}/tagsingroup/${encodeURIComponent(groupName)}`, {
				headers,
				credentials: 'include',
			});
			if (!response.ok) return [];
			return await response.json();
		} catch {
			return [];
		}
	}

	async getTags(groupName: string): Promise<CmsTag[]> {
		return this.getTagsInGroup(groupName);
	}

	async save(tag: CmsTag): Promise<boolean> {
		try {
			const headers = await this.getAuthHeaders();
			const response = await fetch(`${API_BASE}/save`, {
				method: 'POST',
				headers,
				body: JSON.stringify(tag),
				credentials: 'include',
			});

			if (!response.ok) {
				return false;
			}

			const result = await response.json().catch(() => null);

			return result !== null && result > 0;
		} catch (error) {
			return false;
		}
	}

	async deleteTag(tag: CmsTag): Promise<boolean> {
		try {
			const tagId = tag.id || tag.Id;
			if (!tagId || tagId <= 0) {
				return false;
			}

			const tagData = {
				id: tagId,
				tag: tag.tag || tag.Tag || '',
				group: tag.group || tag.Group || '',
			};

			const headers = await this.getAuthHeaders();
			const response = await fetch(`${API_BASE}/delete`, {
				method: 'POST',
				headers,
				body: JSON.stringify(tagData),
				credentials: 'include',
			});

			if (!response.ok) {
				return false;
			}

			const result = await response.json().catch(() => null);

			return result !== null && result > 0;
		} catch (error) {
			return false;
		}
	}
}