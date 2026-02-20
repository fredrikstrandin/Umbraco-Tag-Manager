var h = Object.defineProperty;
var _ = (i, t, e) => t in i ? h(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var n = (i, t, e) => _(i, typeof t != "symbol" ? t + "" : t, e);
import { LitElement as p, html as s, css as f, property as v, state as c, customElement as b } from "@umbraco-cms/backoffice/external/lit";
import { t as d } from "./tagmanager-repository-BtcZTuQa.js";
var m = Object.defineProperty, y = Object.getOwnPropertyDescriptor, $ = (i, t, e) => t in i ? m(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e, r = (i, t, e, o) => {
  for (var a = o > 1 ? void 0 : o ? y(t, e) : t, l = i.length - 1, g; l >= 0; l--)
    (g = i[l]) && (a = (o ? g(t, e, a) : g(a)) || a);
  return o && a && m(t, e, a), a;
}, T = (i, t, e) => $(i, t + "", e);
let u = class extends p {
  constructor() {
    super(...arguments);
    n(this, "tagId");
    n(this, "_tag", null);
    n(this, "_loading", !0);
    n(this, "_saving", !1);
  }
  async connectedCallback() {
    super.connectedCallback(), this.tagId && await this._loadTag();
  }
  async _loadTag() {
    this.tagId && (this._loading = !0, this._tag = await d.getTagById(this.tagId), this._loading = !1);
  }
  async _save() {
    if (!this._tag) return;
    this._saving = !0;
    const t = await d.save(this._tag);
    this._saving = !1, t && this.dispatchEvent(
      new CustomEvent("notification", {
        bubbles: !0,
        composed: !0,
        detail: { headline: "Success", message: "Tag saved successfully", color: "positive" }
      })
    );
  }
  async _delete() {
    if (!this._tag || !confirm(`Are you sure you want to delete the tag "${this._tag.tag}"?`)) return;
    this._saving = !0;
    const e = await d.deleteTag(this._tag);
    this._saving = !1, e && (this.dispatchEvent(
      new CustomEvent("notification", {
        bubbles: !0,
        composed: !0,
        detail: { headline: "Success", message: "Tag deleted successfully", color: "positive" }
      })
    ), history.back());
  }
  _onTagNameChange(t) {
    if (!this._tag) return;
    const e = t.target;
    this._tag = { ...this._tag, tag: e.value };
  }
  _onMergeTagChange(t) {
    if (!this._tag) return;
    const e = t.target, o = parseInt(e.value), a = this._tag.tagsInGroup.options.find((l) => l.id === o);
    a && (this._tag = {
      ...this._tag,
      tagsInGroup: {
        ...this._tag.tagsInGroup,
        selectedItem: a
      }
    });
  }
  render() {
    return this._loading ? s`<uui-loader></uui-loader>` : this._tag ? s`
			<uui-box>
				<div class="form-container">
					<uui-form-layout-item>
						<uui-label slot="label" for="tagName" required>Tag Name</uui-label>
						<uui-input
							id="tagName"
							.value=${this._tag.tag}
							@input=${this._onTagNameChange}
							?disabled=${this._saving}>
						</uui-input>
					</uui-form-layout-item>

					<uui-form-layout-item>
						<uui-label slot="label">Group</uui-label>
						<div>${this._tag.group}</div>
					</uui-form-layout-item>

					<uui-form-layout-item>
						<uui-label slot="label">Usage Count</uui-label>
						<div>${this._tag.noTaggedNodes} item(s)</div>
					</uui-form-layout-item>

					${this._tag.tagsInGroup && this._tag.tagsInGroup.options.length > 1 ? s`
								<uui-form-layout-item>
									<uui-label slot="label" for="mergeTag">Merge with Tag</uui-label>
									<uui-select
										id="mergeTag"
										.value=${this._tag.tagsInGroup.selectedItem.id.toString()}
										@change=${this._onMergeTagChange}
										?disabled=${this._saving}>
										${this._tag.tagsInGroup.options.map(
      (t) => s`
												<uui-select-option value="${t.id}">${t.tag}</uui-select-option>
											`
    )}
									</uui-select>
									<div slot="description">
										Select a tag to merge this tag into. All content using this tag will be
										reassigned.
									</div>
								</uui-form-layout-item>
						  ` : ""}

					${this._tag.taggedDocuments && this._tag.taggedDocuments.length > 0 ? s`
								<uui-form-layout-item>
									<uui-label slot="label">Tagged Content</uui-label>
									<uui-ref-list>
										${this._tag.taggedDocuments.map(
      (t) => s`
												<uui-ref-node
													name="${t.documentName}"
													href="${t.documentUrl}">
												</uui-ref-node>
											`
    )}
									</uui-ref-list>
								</uui-form-layout-item>
						  ` : ""}

					${this._tag.taggedMedia && this._tag.taggedMedia.length > 0 ? s`
								<uui-form-layout-item>
									<uui-label slot="label">Tagged Media</uui-label>
									<uui-ref-list>
										${this._tag.taggedMedia.map(
      (t) => s`
												<uui-ref-node
													name="${t.documentName}"
													href="${t.documentUrl}">
												</uui-ref-node>
											`
    )}
									</uui-ref-list>
								</uui-form-layout-item>
						  ` : ""}

					<div class="actions">
						<uui-button
							label="Save"
							look="primary"
							color="positive"
							@click=${this._save}
							?disabled=${this._saving}>
							${this._saving ? s`<uui-loader></uui-loader>` : "Save"}
						</uui-button>
						<uui-button
							label="Delete"
							look="secondary"
							color="danger"
							@click=${this._delete}
							?disabled=${this._saving}>
							Delete
						</uui-button>
					</div>
				</div>
			</uui-box>
		` : s`<p>Tag not found</p>`;
  }
};
T(u, "styles", f`
		:host {
			display: block;
			padding: var(--uui-size-layout-1);
		}

		.form-container {
			display: flex;
			flex-direction: column;
			gap: var(--uui-size-space-5);
		}

		.actions {
			display: flex;
			gap: var(--uui-size-space-3);
			margin-top: var(--uui-size-space-5);
		}
	`);
r([
  v({ type: Number })
], u.prototype, "tagId", 2);
r([
  c()
], u.prototype, "_tag", 2);
r([
  c()
], u.prototype, "_loading", 2);
r([
  c()
], u.prototype, "_saving", 2);
u = r([
  b("tag-edit-view")
], u);
export {
  u as TagEditViewElement
};
//# sourceMappingURL=tag-edit-view.element-C65K2W5E.js.map
