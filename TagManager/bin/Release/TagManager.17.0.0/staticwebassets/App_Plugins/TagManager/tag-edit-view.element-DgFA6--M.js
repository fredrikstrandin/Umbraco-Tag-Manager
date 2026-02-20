var _ = Object.defineProperty;
var f = (n, e, t) => e in n ? _(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var g = (n, e, t) => f(n, typeof e != "symbol" ? e + "" : e, t);
import { LitElement as b, html as l, css as x, state as c, customElement as I } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as y } from "@umbraco-cms/backoffice/element-api";
import { UMB_NOTIFICATION_CONTEXT as m } from "@umbraco-cms/backoffice/notification";
import { UMB_MODAL_MANAGER_CONTEXT as T, UMB_CONFIRM_MODAL as $ } from "@umbraco-cms/backoffice/modal";
import { t as p } from "./tagmanager-repository-Dhwzm5P2.js";
var h = Object.defineProperty, D = Object.getOwnPropertyDescriptor, N = (n, e, t) => e in n ? h(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t, d = (n, e, t, a) => {
  for (var i = a > 1 ? void 0 : a ? D(e, t) : e, u = n.length - 1, s; u >= 0; u--)
    (s = n[u]) && (i = (a ? s(e, t, i) : s(i)) || i);
  return a && i && h(e, t, i), i;
}, z = (n, e, t) => N(n, e + "", t);
let r = class extends y(b) {
  constructor() {
    super(...arguments);
    g(this, "_tag", null);
    g(this, "_loading", !0);
    g(this, "_saving", !1);
    g(this, "_tagId");
  }
  async connectedCallback() {
    super.connectedCallback();
    const e = window.location.pathname;
    console.log("Tag edit view URL:", e);
    const t = e.match(/\/tagmanager-tag\/edit\/(\d+)/);
    console.log("Matches:", t), t && t[1] ? (this._tagId = parseInt(t[1]), console.log("Loading tag ID:", this._tagId), await this._loadTag()) : (console.error("Could not extract tag ID from URL:", e), this._loading = !1);
  }
  async _loadTag() {
    var t, a, i, u;
    if (!this._tagId) return;
    console.log("_loadTag called for ID:", this._tagId), this._loading = !0;
    const e = await p.getTagById(this._tagId);
    if (console.log("Raw tag from API:", e), console.log("Raw tagsInGroup:", (e == null ? void 0 : e.tagsInGroup) || (e == null ? void 0 : e.TagsInGroup)), e) {
      const s = e.tagsInGroup || e.TagsInGroup, v = {
        selectedItem: (s == null ? void 0 : s.selectedItem) || (s == null ? void 0 : s.SelectedItem) || { id: 0, tag: "", Id: 0, Tag: "" },
        options: ((s == null ? void 0 : s.options) || (s == null ? void 0 : s.Options) || []).map((o) => ({
          id: o.id || o.Id || 0,
          tag: o.tag || o.Tag || ""
        }))
      };
      this._tag = {
        id: e.id || e.Id || 0,
        tag: e.tag || e.Tag || "",
        group: e.group || e.Group || "",
        noTaggedNodes: e.noTaggedNodes || e.NoTaggedNodes || 0,
        taggedDocuments: (e.taggedDocuments || e.TaggedDocuments || []).map((o) => ({
          documentId: o.documentId || o.DocumentId || 0,
          documentName: o.documentName || o.DocumentName || "",
          documentUrl: o.documentUrl || o.DocumentUrl || ""
        })),
        taggedMedia: (e.taggedMedia || e.TaggedMedia || []).map((o) => ({
          documentId: o.documentId || o.DocumentId || 0,
          documentName: o.documentName || o.DocumentName || "",
          documentUrl: o.documentUrl || o.DocumentUrl || ""
        })),
        tagsInGroup: v
      };
    } else
      this._tag = null;
    console.log("Normalized tag:", this._tag), console.log("Normalized tagsInGroup:", (t = this._tag) == null ? void 0 : t.tagsInGroup), console.log("Options count:", (u = (i = (a = this._tag) == null ? void 0 : a.tagsInGroup) == null ? void 0 : i.options) == null ? void 0 : u.length), this._loading = !1, this.requestUpdate();
  }
  async _save() {
    if (!this._tag) return;
    this._saving = !0;
    const e = await p.save(this._tag);
    this._saving = !1;
    const t = await this.getContext(m);
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
    if (!this._tag) return;
    const e = await this.getContext(T), t = e == null ? void 0 : e.open(this, $, {
      data: {
        headline: "Delete Tag",
        content: `Are you sure you want to delete the tag "${this._tag.tag}"?`,
        color: "danger",
        confirmLabel: "Delete"
      }
    });
    if (!await (t == null ? void 0 : t.onSubmit())) return;
    this._saving = !0;
    const i = await p.deleteTag(this._tag);
    this._saving = !1;
    const u = await this.getContext(m);
    i ? (u == null || u.peek("positive", {
      data: {
        headline: "Tag Deleted",
        message: `"${this._tag.tag}" has been deleted successfully`
      }
    }), setTimeout(() => {
      history.back();
    }, 500)) : u == null || u.peek("danger", {
      data: {
        headline: "Delete Failed",
        message: "Failed to delete the tag. Please try again."
      }
    });
  }
  _onTagNameChange(e) {
    if (!this._tag) return;
    const t = e.target;
    this._tag = { ...this._tag, tag: t.value };
  }
  _onMergeTagChange(e) {
    if (!this._tag) return;
    const t = e.target, a = parseInt(t.value), i = this._tag.tagsInGroup.options.find((u) => u.id === a);
    i && (this._tag = {
      ...this._tag,
      tagsInGroup: {
        ...this._tag.tagsInGroup,
        selectedItem: i
      }
    });
  }
  render() {
    var e, t;
    return console.log("Render called, _loading:", this._loading, "_tag:", this._tag), this._loading ? l`<div class="loader-container"><uui-loader></uui-loader></div>` : this._tag ? l`
			<div class="tag-editor">
				<!-- Header with tag name and actions -->
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
								${this._saving ? l`<uui-loader></uui-loader>` : l`<uui-icon name="icon-save"></uui-icon>`}
								Save
							</uui-button>
						</div>
					</div>
				</uui-box>

				<!-- Main content area -->
				<div class="editor-content">
					<!-- Left column: Tag details -->
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

								${this._tag.tagsInGroup && this._tag.tagsInGroup.options && this._tag.tagsInGroup.options.length > 1 ? l`
											<uui-form-layout-item>
												<uui-label slot="label" for="mergeTag">Merge with Tag</uui-label>
												<select
													id="mergeTag"
													class="merge-select"
													.value=${((t = (e = this._tag.tagsInGroup.selectedItem) == null ? void 0 : e.id) == null ? void 0 : t.toString()) || ""}
													@change=${this._onMergeTagChange}
													?disabled=${this._saving}>
													${this._tag.tagsInGroup.options.map(
      (a) => {
        var i;
        return l`
															<option 
																value="${a.id}"
																?selected=${a.id === ((i = this._tag.tagsInGroup.selectedItem) == null ? void 0 : i.id)}>
																${a.tag}
															</option>
														`;
      }
    )}
												</select>
												<div slot="description">
													Select a tag to merge this tag into. All content using this tag will be reassigned.
												</div>
											</uui-form-layout-item>
									  ` : ""}
							</div>
						</uui-box>
					</div>

					<!-- Right column: Tagged content -->
					<div class="right-column">
						${this._tag.taggedDocuments && this._tag.taggedDocuments.length > 0 ? l`
									<uui-box headline="Tagged Content (${this._tag.taggedDocuments.length})">
										<div class="content-list">
											${this._tag.taggedDocuments.map(
      (a) => l`
													<uui-ref-node
														name="${a.documentName || a.DocumentName}"
														href="${a.documentUrl || a.DocumentUrl}">
														<uui-icon slot="icon" name="icon-document"></uui-icon>
													</uui-ref-node>
												`
    )}
										</div>
									</uui-box>
							  ` : l`
									<uui-box headline="Tagged Content">
										<div class="empty-state">
											<uui-icon name="icon-document"></uui-icon>
											<p>No content tagged with this tag</p>
										</div>
									</uui-box>
							  `}

						${this._tag.taggedMedia && this._tag.taggedMedia.length > 0 ? l`
									<uui-box headline="Tagged Media (${this._tag.taggedMedia.length})">
										<div class="content-list">
											${this._tag.taggedMedia.map(
      (a) => l`
													<uui-ref-node
														name="${a.documentName || a.DocumentName}"
														href="${a.documentUrl || a.DocumentUrl}">
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
		` : l`<p>Tag not found</p>`;
  }
};
z(r, "styles", x`
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

		/* Responsive design */
		@media (max-width: 1200px) {
			.editor-content {
				grid-template-columns: 1fr;
			}
		}
	`);
d([
  c()
], r.prototype, "_tag", 2);
d([
  c()
], r.prototype, "_loading", 2);
d([
  c()
], r.prototype, "_saving", 2);
d([
  c()
], r.prototype, "_tagId", 2);
r = d([
  I("tag-edit-view")
], r);
const E = r;
export {
  r as TagEditViewElement,
  E as default
};
//# sourceMappingURL=tag-edit-view.element-DgFA6--M.js.map
