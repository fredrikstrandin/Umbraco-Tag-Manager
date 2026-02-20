var c = Object.defineProperty;
var h = (a, e, t) => e in a ? c(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t;
var n = (a, e, t) => h(a, typeof e != "symbol" ? e + "" : e, t);
import { html as _, css as b, state as m, customElement as f } from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement as v } from "@umbraco-cms/backoffice/modal";
import { UMB_NOTIFICATION_CONTEXT as d } from "@umbraco-cms/backoffice/notification";
import { T as y } from "./tagmanager-repository-BvW2JE0F.js";
var p = Object.defineProperty, C = Object.getOwnPropertyDescriptor, N = (a, e, t) => e in a ? p(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t, g = (a, e, t, r) => {
  for (var i = r > 1 ? void 0 : r ? C(e, t) : e, o = a.length - 1, l; o >= 0; o--)
    (l = a[o]) && (i = (r ? l(e, t, i) : l(i)) || i);
  return r && i && p(e, t, i), i;
}, T = (a, e, t) => N(a, e + "", t);
let u = class extends v {
  constructor() {
    super();
    n(this, "_repository");
    n(this, "_tagName", "");
    n(this, "_saving", !1);
    this._repository = new y(this);
  }
  connectedCallback() {
    super.connectedCallback();
  }
  async _handleSubmit(e) {
    var r, i, o;
    if (e.preventDefault(), !this._tagName.trim())
      return;
    this._saving = !0;
    const t = {
      id: 0,
      tag: this._tagName.trim(),
      group: ((r = this.data) == null ? void 0 : r.groupName) || "default",
      noTaggedNodes: 0,
      taggedDocuments: [],
      taggedMedia: [],
      tagsInGroup: {
        selectedItem: { id: 0, tag: "" },
        options: []
      }
    };
    try {
      const l = await this._repository.save(t), s = await this.getContext(d);
      l ? (s == null || s.peek("positive", {
        data: {
          headline: "Tag Created",
          message: `"${this._tagName}" has been created successfully`
        }
      }), (i = this.modalContext) == null || i.setValue({
        tag: t.tag,
        group: t.group
      }), (o = this.modalContext) == null || o.submit()) : (s == null || s.peek("danger", {
        data: {
          headline: "Create Failed",
          message: "Failed to create the tag. Please try again."
        }
      }), this._saving = !1);
    } catch {
      const s = await this.getContext(d);
      s && s.peek("danger", {
        data: {
          headline: "Create Failed",
          message: "An error occurred while creating the tag."
        }
      });
    } finally {
      this._saving = !1;
    }
  }
  _handleCancel() {
    var e;
    (e = this.modalContext) == null || e.reject();
  }
  render() {
    var e;
    return _`
			<umb-modal-layout headline="Create Tag">
				<form @submit=${this._handleSubmit}>
					<uui-box>
						<umb-property-layout label="Tag Name" description="Enter the name for the new tag">
							<uui-input
								slot="editor"
								.value=${this._tagName}
								@input=${(t) => {
      this._tagName = t.target.value || "", this.requestUpdate();
    }}
								placeholder="Enter tag name"
								required
								autofocus>
							</uui-input>
						</umb-property-layout>

						<umb-property-layout label="Group" description="The tag group this tag belongs to">
							<uui-input
								slot="editor"
								.value=${((e = this.data) == null ? void 0 : e.groupName) || "default"}
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
							.state=${this._saving ? "waiting" : void 0}>
							${this._saving ? "Creating..." : "Create"}
						</uui-button>
					</div>
				</form>
			</umb-modal-layout>
		`;
  }
};
T(u, "styles", b`
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
	`);
g([
  m()
], u.prototype, "_tagName", 2);
g([
  m()
], u.prototype, "_saving", 2);
u = g([
  f("tag-create-modal")
], u);
const M = u;
export {
  u as TagCreateModalElement,
  M as default
};
//# sourceMappingURL=tag-create-modal.element-BtPKIxQX.js.map
