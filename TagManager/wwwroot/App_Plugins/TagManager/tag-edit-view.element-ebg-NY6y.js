var m = Object.defineProperty;
var h = (i, e, t) => e in i ? m(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var u = (i, e, t) => h(i, typeof e != "symbol" ? e + "" : e, t);
import { LitElement as v, html as r, css as f, state as g, customElement as _ } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as b } from "@umbraco-cms/backoffice/element-api";
import { UMB_NOTIFICATION_CONTEXT as l } from "@umbraco-cms/backoffice/notification";
import { UMB_MODAL_MANAGER_CONTEXT as y, UMB_CONFIRM_MODAL as x } from "@umbraco-cms/backoffice/modal";
import { T } from "./tagmanager-repository-BvW2JE0F.js";
var p = Object.defineProperty, I = Object.getOwnPropertyDescriptor, $ = (i, e, t) => e in i ? p(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t, d = (i, e, t, o) => {
  for (var a = o > 1 ? void 0 : o ? I(e, t) : e, s = i.length - 1, c; s >= 0; s--)
    (c = i[s]) && (a = (o ? c(e, t, a) : c(a)) || a);
  return o && a && p(e, t, a), a;
}, w = (i, e, t) => $(i, e + "", t);
let n = class extends b(v) {
  constructor() {
    super();
    u(this, "_repository");
    u(this, "_tag", null);
    u(this, "_loading", !0);
    u(this, "_saving", !1);
    u(this, "_tagId");
    this._repository = new T(this);
  }
  async connectedCallback() {
    super.connectedCallback();
    const t = window.location.pathname.match(/\/tagmanager-tag\/edit\/(\d+)/);
    t && t[1] ? (this._tagId = parseInt(t[1]), await this._loadTag()) : this._loading = !1;
  }
  async _loadTag() {
    if (!this._tagId) return;
    this._loading = !0;
    const e = await this._repository.getTagById(this._tagId);
    if (e) {
      const t = e.tagsInGroup || e.TagsInGroup, o = {
        selectedItem: (t == null ? void 0 : t.selectedItem) || (t == null ? void 0 : t.SelectedItem) || { id: 0, tag: "", Id: 0, Tag: "" },
        options: ((t == null ? void 0 : t.options) || (t == null ? void 0 : t.Options) || []).map((a) => ({
          id: a.id || a.Id || 0,
          tag: a.tag || a.Tag || ""
        }))
      };
      this._tag = {
        id: e.id || e.Id || 0,
        tag: e.tag || e.Tag || "",
        group: e.group || e.Group || "",
        noTaggedNodes: e.noTaggedNodes || e.NoTaggedNodes || 0,
        taggedDocuments: (e.taggedDocuments || e.TaggedDocuments || []).map((a) => ({
          documentId: a.documentId || a.DocumentId || 0,
          documentName: a.documentName || a.DocumentName || "",
          documentUrl: a.documentUrl || a.DocumentUrl || ""
        })),
        taggedMedia: (e.taggedMedia || e.TaggedMedia || []).map((a) => ({
          documentId: a.documentId || a.DocumentId || 0,
          documentName: a.documentName || a.DocumentName || "",
          documentUrl: a.documentUrl || a.DocumentUrl || ""
        })),
        tagsInGroup: o
      };
    } else
      this._tag = null;
    this._loading = !1, this.requestUpdate();
  }
  async _save() {
    if (!this._tag) return;
    this._saving = !0;
    const e = await this._repository.save(this._tag);
    this._saving = !1;
    const t = await this.getContext(l);
    e ? t == null || t.peek("positive", {
      data: {
        headline: "Tag Saved",
        message: `"${this._tag.tag}" has been saved successfully`
      }
    }) : t == null || t.peek("danger", {
      data: {
        headline: "Save Failed",
        message: "Failed to save the tag. Please try again."
      }
    });
  }
  async _delete() {
    if (this._tag)
      try {
        const e = await this.getContext(y);
        if (!e) {
          const s = await this.getContext(l);
          s == null || s.peek("danger", {
            data: {
              headline: "Error",
              message: "Unable to open confirmation dialog. Please try again."
            }
          });
          return;
        }
        const t = e.open(this, x, {
          data: {
            headline: "Delete Tag",
            content: `Are you sure you want to delete the tag "${this._tag.tag}"?`,
            color: "danger",
            confirmLabel: "Delete"
          }
        });
        if (!t) {
          const s = await this.getContext(l);
          s == null || s.peek("danger", {
            data: {
              headline: "Error",
              message: "Unable to open confirmation dialog. Please try again."
            }
          });
          return;
        }
        try {
          await t.onSubmit();
        } catch {
          return;
        }
        this._saving = !0;
        const o = await this._repository.deleteTag(this._tag);
        this._saving = !1;
        const a = await this.getContext(l);
        o ? (a == null || a.peek("positive", {
          data: {
            headline: "Tag Deleted",
            message: `"${this._tag.tag}" has been deleted successfully`
          }
        }), setTimeout(() => {
          history.back();
        }, 500)) : a == null || a.peek("danger", {
          data: {
            headline: "Delete Failed",
            message: "Failed to delete the tag. Please try again."
          }
        });
      } catch {
        this._saving = !1;
        const t = await this.getContext(l);
        t == null || t.peek("danger", {
          data: {
            headline: "Error",
            message: "An error occurred while deleting the tag. Please try again."
          }
        });
      }
  }
  _onTagNameChange(e) {
    if (!this._tag) return;
    const t = e.target;
    this._tag = { ...this._tag, tag: t.value };
  }
  _onMergeTagChange(e) {
    if (!this._tag) return;
    const t = e.target, o = parseInt(t.value), a = this._tag.tagsInGroup.options.find((s) => s.id === o);
    a && (this._tag = {
      ...this._tag,
      tagsInGroup: {
        ...this._tag.tagsInGroup,
        selectedItem: a
      }
    });
  }
  render() {
    return this._loading ? r`<div class="loader-container"><uui-loader></uui-loader></div>` : this._tag ? r`
			<div class="tag-editor">
				<uui-box class="editor-header-box">
					<div class="editor-header">
						<div class="header-content">
							<h2>${this._tag.tag}</h2>
							<div class="header-meta">
								<span class="group-badge">
									<uui-icon name="icon-folder"></uui-icon>
									${this._tag.group}
								</span>
								<span class="usage-badge">
									<uui-icon name="icon-files"></uui-icon>
									${this._tag.noTaggedNodes} uses
								</span>
							</div>
						</div>
						<div class="header-actions">
							<uui-button
								label="Delete"
								look="outline"
								color="danger"
								@click=${this._delete}
								?disabled=${this._saving}>
								<uui-icon name="icon-delete"></uui-icon>
								Delete
							</uui-button>
							<uui-button
								label="Save"
								look="primary"
								color="positive"
								@click=${this._save}
								?disabled=${this._saving}>
								${this._saving ? r`<uui-loader></uui-loader>` : r`<uui-icon name="icon-save"></uui-icon>`}
								Save
							</uui-button>
						</div>
					</div>
				</uui-box>

				<div class="editor-content">
					<div class="left-column">
						<uui-box headline="Tag Details">
							<div class="form-section">
								<uui-form-layout-item>
									<uui-label slot="label" for="tagName" required>Tag Name</uui-label>
									<uui-input
										id="tagName"
										label="Tag Name"
										.value=${this._tag.tag}
										@input=${this._onTagNameChange}
										?disabled=${this._saving}>
									</uui-input>
								</uui-form-layout-item>

								${this._tag.tagsInGroup && this._tag.tagsInGroup.options && this._tag.tagsInGroup.options.length > 1 ? (() => {
      var t, o;
      const e = ((o = (t = this._tag.tagsInGroup) == null ? void 0 : t.selectedItem) == null ? void 0 : o.id) ?? 0;
      return r`
											<uui-form-layout-item>
												<uui-label slot="label" for="mergeTag">Merge with Tag</uui-label>
												<select
													id="mergeTag"
													class="merge-select"
													.value=${e.toString()}
													@change=${this._onMergeTagChange}
													?disabled=${this._saving}>
													${this._tag.tagsInGroup.options.map(
        (a) => r`
															<option 
																value="${a.id}"
																?selected=${a.id === e}>
																${a.tag}
															</option>
														`
      )}
												</select>
												<div slot="description">
													Select a tag to merge this tag into. All content using this tag will be reassigned.
												</div>
											</uui-form-layout-item>
										`;
    })() : ""}
							</div>
						</uui-box>
					</div>

					<div class="right-column">
						${this._tag.taggedDocuments && this._tag.taggedDocuments.length > 0 ? r`
									<uui-box headline="Tagged Content (${this._tag.taggedDocuments.length})">
										<div class="content-list">
											${this._tag.taggedDocuments.map(
      (e) => r`
													<uui-ref-node
														name="${e.documentName || e.DocumentName}"
														href="${e.documentUrl || e.DocumentUrl}">
														<uui-icon slot="icon" name="icon-document"></uui-icon>
													</uui-ref-node>
												`
    )}
										</div>
									</uui-box>
							  ` : r`
									<uui-box headline="Tagged Content">
										<div class="empty-state">
											<uui-icon name="icon-document"></uui-icon>
											<p>No content tagged with this tag</p>
										</div>
									</uui-box>
							  `}

						${this._tag.taggedMedia && this._tag.taggedMedia.length > 0 ? r`
									<uui-box headline="Tagged Media (${this._tag.taggedMedia.length})">
										<div class="content-list">
											${this._tag.taggedMedia.map(
      (e) => r`
													<uui-ref-node
														name="${e.documentName || e.DocumentName}"
														href="${e.documentUrl || e.DocumentUrl}">
														<uui-icon slot="icon" name="icon-picture"></uui-icon>
													</uui-ref-node>
												`
    )}
										</div>
									</uui-box>
							  ` : ""}
					</div>
				</div>
			</div>
		` : r`<p>Tag not found</p>`;
  }
};
w(n, "styles", f`
		:host {
			display: block;
			height: 100%;
			overflow: auto;
		}

		.loader-container {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 200px;
		}

		.tag-editor {
			display: flex;
			flex-direction: column;
			height: 100%;
			padding: var(--uui-size-space-6);
			gap: var(--uui-size-space-5);
		}

		.editor-header-box {
			background: linear-gradient(135deg, var(--uui-color-surface) 0%, var(--uui-color-surface-alt) 100%);
		}

		.editor-header {
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			gap: var(--uui-size-space-4);
			padding: var(--uui-size-space-5);
		}

		.header-content {
			flex: 1;
		}

		.header-content h2 {
			margin: 0 0 var(--uui-size-space-3) 0;
			font-size: 24px;
			font-weight: 700;
			color: var(--uui-color-text);
		}

		.header-meta {
			display: flex;
			gap: var(--uui-size-space-3);
			align-items: center;
		}

		.group-badge,
		.usage-badge {
			display: inline-flex;
			align-items: center;
			gap: var(--uui-size-space-2);
			padding: var(--uui-size-space-2) var(--uui-size-space-3);
			background: var(--uui-color-surface);
			border: 1px solid var(--uui-color-border);
			border-radius: var(--uui-border-radius);
			font-size: 13px;
			font-weight: 600;
			color: var(--uui-color-text);
		}

		.group-badge uui-icon,
		.usage-badge uui-icon {
			font-size: 14px;
		}

		.header-actions {
			display: flex;
			gap: var(--uui-size-space-3);
		}

		.editor-content {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: var(--uui-size-space-5);
			flex: 1;
			overflow: hidden;
		}

		.left-column,
		.right-column {
			display: flex;
			flex-direction: column;
			gap: var(--uui-size-space-4);
			overflow: auto;
		}

		.form-section {
			display: flex;
			flex-direction: column;
			gap: var(--uui-size-space-4);
			padding: var(--uui-size-space-4);
		}

		.merge-select {
			width: 100%;
			padding: var(--uui-size-space-3);
			border: 1px solid var(--uui-color-border);
			border-radius: var(--uui-border-radius);
			background: var(--uui-color-surface);
			color: var(--uui-color-text);
			font-family: inherit;
			font-size: 14px;
			cursor: pointer;
			outline: none;
			transition: all 0.2s;
		}

		.merge-select:hover {
			border-color: var(--uui-color-border-emphasis);
		}

		.merge-select:focus {
			border-color: var(--uui-color-selected);
			box-shadow: 0 0 0 2px var(--uui-color-selected-emphasis);
		}

		.merge-select:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}

		.content-list {
			display: flex;
			flex-direction: column;
			gap: var(--uui-size-space-2);
			padding: var(--uui-size-space-4);
			max-height: 400px;
			overflow-y: auto;
		}

		.empty-state {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: var(--uui-size-space-6);
			color: var(--uui-color-text-alt);
			text-align: center;
		}

		.empty-state uui-icon {
			font-size: 48px;
			opacity: 0.3;
			margin-bottom: var(--uui-size-space-3);
		}

		.empty-state p {
			margin: 0;
			font-size: 14px;
		}

		@media (max-width: 1200px) {
			.editor-content {
				grid-template-columns: 1fr;
			}
		}
	`);
d([
  g()
], n.prototype, "_tag", 2);
d([
  g()
], n.prototype, "_loading", 2);
d([
  g()
], n.prototype, "_saving", 2);
d([
  g()
], n.prototype, "_tagId", 2);
n = d([
  _("tag-edit-view")
], n);
const O = n;
export {
  n as TagEditViewElement,
  O as default
};
//# sourceMappingURL=tag-edit-view.element-ebg-NY6y.js.map
