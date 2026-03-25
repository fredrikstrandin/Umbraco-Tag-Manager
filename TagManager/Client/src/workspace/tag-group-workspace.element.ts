import { LitElement, html, css } from '@umbraco-cms/backoffice/external/lit';
import { customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import { UMB_MODAL_MANAGER_CONTEXT } from '@umbraco-cms/backoffice/modal';
import { UMB_WORKSPACE_CONTEXT } from '@umbraco-cms/backoffice/workspace';
import { TAG_CREATE_MODAL_TOKEN } from '../modal/tag-create-modal.token.js';
import { TagManagerRepository } from '../api/tagmanager-repository.js';
import type { CmsTag } from '../api/types.js';

type WorkspaceWithUnique = {
	unique?: import('@umbraco-cms/backoffice/observable-api').Observable<string | null>;
};

@customElement('tagmanager-group-view')
export class TagManagerGroupViewElement extends UmbElementMixin(LitElement) {
	private _repository: TagManagerRepository;
	private _loadRequestId = 0;
	private _pathnamePoller: number | null = null;
	private _lastPathname = '';

	@state()
	private _tags: CmsTag[] = [];

	@state()
	private _loading = false;

	@state()
	private _groupName = '';

	constructor() {
		super();
		this._repository = new TagManagerRepository(this);
	}

	override async connectedCallback() {
		super.connectedCallback();

		this.consumeContext(UMB_WORKSPACE_CONTEXT, (workspaceCtx) => {
			const unique$ = (workspaceCtx as unknown as WorkspaceWithUnique)?.unique;
			if (unique$) {
				this.observe(unique$, (unique: string | null) => {
					void this._syncFromWorkspaceUnique(unique);
				});
				return;
			}
			this._startPathnameFallback();
		});

		// Fallback if workspace context has no `unique` (should not happen with routable workspace).
		this._lastPathname = window.location.pathname;
		void this._syncFromPathname(this._lastPathname);
	}

	override disconnectedCallback() {
		if (this._pathnamePoller !== null) {
			window.clearInterval(this._pathnamePoller);
			this._pathnamePoller = null;
		}
		super.disconnectedCallback();
	}

	private _startPathnameFallback() {
		if (this._pathnamePoller !== null) return;
		this._pathnamePoller = window.setInterval(() => {
			const current = window.location.pathname;
			if (current !== this._lastPathname) {
				this._lastPathname = current;
				void this._syncFromPathname(current);
			}
		}, 200);
	}

	private _getGroupNameFromPath(pathname: string): string | null {
		const match = pathname.match(/\/tagmanager-group\/(?:edit\/)?([^/]+)/);
		if (!match?.[1]) return null;
		return decodeURIComponent(match[1]);
	}

	private async _syncFromPathname(pathname: string) {
		const groupName = this._getGroupNameFromPath(pathname);
		if (!groupName) {
			this._groupName = '';
			this._tags = [];
			this._loading = false;
			this.requestUpdate();
			return;
		}
		if (groupName === this._groupName) return;
		this._groupName = groupName;
		await this._loadTags(groupName);
	}

	private async _syncFromWorkspaceUnique(unique: string | null) {
		if (unique == null || unique === '') {
			this._groupName = '';
			this._tags = [];
			this._loading = false;
			this.requestUpdate();
			return;
		}
		if (unique === this._groupName) return;

		this._groupName = unique;
		this._tags = [];
		this._loading = true;
		this.requestUpdate();
		await this._loadTags(unique);
	}

	private async _loadTags(groupName: string) {
		const requestId = ++this._loadRequestId;

		this._loading = true;
		this.requestUpdate();

		try {
			const tags = await this._repository.getTagsInGroup(groupName);
			if (requestId !== this._loadRequestId) return;
			const g = groupName.trim();
			this._tags = tags.filter((t) => (t.group || t.Group || '').trim() === g);
		} catch {
		} finally {
			if (requestId === this._loadRequestId) {
				this._loading = false;
				this.requestUpdate();
			}
		}
	}

	private _handleEditTag(tag: CmsTag) {
		const url = `/umbraco/section/tagmanager/workspace/tagmanager-tag/edit/${tag.id}`;
		history.pushState(null, '', url);
		window.dispatchEvent(new PopStateEvent('popstate'));
	}

	private async _createTag() {
		const modalManager = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
		if (!modalManager) return;

		const modalContext = modalManager.open(this, TAG_CREATE_MODAL_TOKEN, {
			data: {
				groupName: this._groupName,
			},
		});

		try {
			const result = await modalContext.onSubmit();
			if (result) {
				await new Promise((resolve) => setTimeout(resolve, 500));
				if (this._groupName) {
					await this._loadTags(this._groupName);
				}
			}
		} catch {
		}
	}

	override render() {
		if (this._loading) {
			return html`
				<div class="loading-container">
					<uui-loader></uui-loader>
					<p>Loading tags...</p>
				</div>
			`;
		}

		const totalUsage = this._tags.reduce((sum, tag) => sum + (tag.noTaggedNodes || tag.NoTaggedNodes || 0), 0);

		return html`
			<div class="tag-container">
				<uui-box class="header-box">
					<div class="header-content">
						<div class="header-title-section">
							<div class="header-title">
								<uui-icon name="icon-folder"></uui-icon>
								<h2>Tag Manager</h2>
							</div>
							<uui-button look="primary" label="Create Tag" @click=${this._createTag}>
								<uui-icon name="icon-add"></uui-icon>
								Create Tag
							</uui-button>
						</div>
						<div class="stats-grid">
							<div class="stat-card">
								<div class="stat-icon">
									<uui-icon name="icon-tags"></uui-icon>
								</div>
								<div class="stat-content">
									<div class="stat-value">${this._tags.length}</div>
									<div class="stat-label">Total Tags</div>
								</div>
							</div>
							<div class="stat-card">
								<div class="stat-icon">
									<uui-icon name="icon-files"></uui-icon>
								</div>
								<div class="stat-content">
									<div class="stat-value">${totalUsage}</div>
									<div class="stat-label">Total Uses</div>
								</div>
							</div>
							<div class="stat-card">
								<div class="stat-icon">
									<uui-icon name="icon-chart"></uui-icon>
								</div>
								<div class="stat-content">
									<div class="stat-value">${this._tags.length > 0 ? Math.round(totalUsage / this._tags.length) : 0}</div>
									<div class="stat-label">Avg per Tag</div>
								</div>
							</div>
						</div>
					</div>
				</uui-box>

				${this._tags.length === 0
					? html`
							<div class="empty-state">
								<uui-icon name="icon-tag"></uui-icon>
								<p>No tags in this group</p>
							</div>
					  `
					: html`
							<uui-box headline="All Tags">
								<div class="tag-grid">
									${this._tags.map(
										(tag) => html`
											<uui-card-content-node
												name="${tag.tag || tag.Tag || ''}"
												@click=${() => this._handleEditTag(tag)}>
												<uui-icon slot="icon" name="icon-tag"></uui-icon>
												<div slot="info">
													<div class="tag-info">
														<uui-icon name="icon-files"></uui-icon>
														${tag.noTaggedNodes || tag.NoTaggedNodes || 0} uses
													</div>
												</div>
												<uui-action-bar slot="actions">
													<uui-button
														label="Edit"
														@click=${(e: Event) => {
															e.stopPropagation();
															this._handleEditTag(tag);
														}}>
														<uui-icon name="icon-edit"></uui-icon>
													</uui-button>
												</uui-action-bar>
											</uui-card-content-node>
										`,
									)}
								</div>
							</uui-box>
					  `}
			</div>
		`;
	}

	static styles = css`
		:host {
			display: block;
			padding: var(--uui-size-space-6);
			height: 100%;
			box-sizing: border-box;
			overflow: auto;
		}

		.tag-container {
			display: flex;
			flex-direction: column;
			gap: var(--uui-size-space-5);
			width: 100%;
		}

		.header-box {
			background: linear-gradient(135deg, var(--uui-color-surface) 0%, var(--uui-color-surface-alt) 100%);
		}

		.header-content {
			padding: var(--uui-size-space-5);
		}

		.header-title-section {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: var(--uui-size-space-5);
			flex-wrap: wrap;
			gap: var(--uui-size-space-3);
		}

		.header-title {
			display: flex;
			align-items: center;
			gap: var(--uui-size-space-3);
		}

		.header-title uui-icon {
			font-size: 32px;
			color: var(--uui-color-selected);
		}

		.header-title h2 {
			margin: 0;
			font-size: 28px;
			font-weight: 700;
			color: var(--uui-color-text);
		}

		.header-title-section uui-button {
			white-space: nowrap;
		}

		.header-title-section uui-icon {
			margin-right: var(--uui-size-space-2);
		}

		.stats-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
			gap: var(--uui-size-space-4);
		}

		.stat-card {
			display: flex;
			align-items: center;
			gap: var(--uui-size-space-3);
			padding: var(--uui-size-space-4);
			background: var(--uui-color-surface);
			border: 1px solid var(--uui-color-border);
			border-radius: var(--uui-border-radius);
			transition: all 0.2s;
		}

		.stat-card:hover {
			border-color: var(--uui-color-border-emphasis);
			transform: translateY(-2px);
			box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		}

		.stat-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 48px;
			height: 48px;
			background: var(--uui-color-selected);
			border-radius: 50%;
		}

		.stat-icon uui-icon {
			font-size: 24px;
			color: #ffffff;
		}

		.stat-content {
			flex: 1;
		}

		.stat-value {
			font-size: 24px;
			font-weight: 700;
			color: var(--uui-color-text);
			line-height: 1.2;
		}

		.stat-label {
			font-size: 12px;
			color: var(--uui-color-text-alt);
			text-transform: uppercase;
			letter-spacing: 0.5px;
			margin-top: var(--uui-size-space-1);
		}

		.loading-container {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 300px;
			gap: var(--uui-size-space-3);
		}

		.empty-state {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 300px;
			gap: var(--uui-size-space-3);
			color: var(--uui-color-text-alt);
		}

		.empty-state uui-icon {
			font-size: 64px;
			opacity: 0.3;
		}

		.tag-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
			gap: var(--uui-size-space-4);
			padding: var(--uui-size-space-4);
		}

		.tag-info {
			display: flex;
			align-items: center;
			gap: var(--uui-size-space-2);
			font-size: 13px;
			color: var(--uui-color-text-alt);
		}

		.tag-info uui-icon {
			font-size: 14px;
		}

		uui-card-content-node {
			cursor: pointer;
			transition: all 0.2s;
		}

		uui-card-content-node:hover {
			border-color: var(--uui-color-selected);
			transform: translateY(-2px);
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		}
	`;
}

export default TagManagerGroupViewElement;
