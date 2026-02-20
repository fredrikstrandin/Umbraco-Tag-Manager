import { html, css, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbModalBaseElement } from '@umbraco-cms/backoffice/modal';
import { UMB_NOTIFICATION_CONTEXT } from '@umbraco-cms/backoffice/notification';
import type { TagCreateModalData, TagCreateModalValue } from './tag-create-modal.token.js';
import { TagManagerRepository } from '../api/tagmanager-repository.js';
import type { CmsTag } from '../api/types.js';

@customElement('tag-create-modal')
export class TagCreateModalElement extends UmbModalBaseElement<TagCreateModalData, TagCreateModalValue> {
	private _repository: TagManagerRepository;

	@state()
	private _tagName: string = '';

	@state()
	private _saving: boolean = false;

	constructor() {
		super();
		this._repository = new TagManagerRepository(this);
	}

	connectedCallback() {
		super.connectedCallback();
	}

	private async _handleSubmit(event: Event) {
		event.preventDefault();
		
		if (!this._tagName.trim()) {
			return;
		}

		this._saving = true;

		const newTag: CmsTag = {
			id: 0,
			tag: this._tagName.trim(),
			group: this.data?.groupName || 'default',
			noTaggedNodes: 0,
			taggedDocuments: [],
			taggedMedia: [],
			tagsInGroup: {
				selectedItem: { id: 0, tag: '' },
				options: [],
			},
		};

		try {
			const success = await this._repository.save(newTag);
			
			const notificationContext = await this.getContext(UMB_NOTIFICATION_CONTEXT);
			
			if (success) {
				notificationContext?.peek('positive', {
					data: {
						headline: 'Tag Created',
						message: `"${this._tagName}" has been created successfully`,
					},
				});

				this.modalContext?.setValue({
					tag: newTag.tag,
					group: newTag.group,
				});
				this.modalContext?.submit();
			} else {
				notificationContext?.peek('danger', {
					data: {
						headline: 'Create Failed',
						message: 'Failed to create the tag. Please try again.',
					},
				});
				this._saving = false;
			}
		} catch (error) {
			const notificationContext = await this.getContext(UMB_NOTIFICATION_CONTEXT);
			if (notificationContext) {
				notificationContext.peek('danger', {
					data: {
						headline: 'Create Failed',
						message: 'An error occurred while creating the tag.',
					},
				});
			}
		} finally {
			this._saving = false;
		}
	}

	private _handleCancel() {
		this.modalContext?.reject();
	}

	override render() {
		return html`
			<umb-modal-layout headline="Create Tag">
				<form @submit=${this._handleSubmit}>
					<uui-box>
						<umb-property-layout label="Tag Name" description="Enter the name for the new tag">
							<uui-input
								slot="editor"
								.value=${this._tagName}
								@input=${(e: any) => {
									this._tagName = e.target.value || '';
									this.requestUpdate();
								}}
								placeholder="Enter tag name"
								required
								autofocus>
							</uui-input>
						</umb-property-layout>

						<umb-property-layout label="Group" description="The tag group this tag belongs to">
							<uui-input
								slot="editor"
								.value=${this.data?.groupName || 'default'}
								disabled>
							</uui-input>
						</umb-property-layout>
					</uui-box>

					<div slot="actions">
						<uui-button
							label="Cancel"
							look="secondary"
							@click=${this._handleCancel}
							?disabled=${this._saving}>
							Cancel
						</uui-button>
						<uui-button
							type="submit"
							look="primary"
							color="positive"
							label="Create"
							?disabled=${this._saving || !this._tagName || this._tagName.trim().length === 0}
							.state=${this._saving ? 'waiting' : undefined}>
							${this._saving ? 'Creating...' : 'Create'}
						</uui-button>
					</div>
				</form>
			</umb-modal-layout>
		`;
	}

	static styles = css`
		form {
			display: flex;
			flex-direction: column;
			gap: var(--uui-size-space-4);
		}

		uui-box {
			margin-bottom: var(--uui-size-space-4);
		}

		[slot='actions'] {
			display: flex;
			justify-content: flex-end;
			gap: var(--uui-size-space-3);
		}
	`;
}

export default TagCreateModalElement;

