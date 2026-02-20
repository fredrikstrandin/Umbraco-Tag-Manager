var c = Object.defineProperty;
var h = (e, t, a) => t in e ? c(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a;
var s = (e, t, a) => h(e, typeof t != "symbol" ? t + "" : t, a);
import { LitElement as _, html as d, css as f, property as m, state as g, customElement as b } from "@umbraco-cms/backoffice/external/lit";
import { t as y } from "./tagmanager-repository-BtcZTuQa.js";
var p = Object.defineProperty, v = Object.getOwnPropertyDescriptor, w = (e, t, a) => t in e ? p(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a, l = (e, t, a, o) => {
  for (var r = o > 1 ? void 0 : o ? v(t, a) : t, n = e.length - 1, u; n >= 0; n--)
    (u = e[n]) && (r = (o ? u(t, a, r) : u(r)) || r);
  return o && r && p(t, a, r), r;
}, T = (e, t, a) => w(e, t + "", a);
let i = class extends _ {
  constructor() {
    super(...arguments);
    s(this, "tagId");
    s(this, "_tag", null);
    s(this, "_loading", !0);
  }
  async connectedCallback() {
    super.connectedCallback(), this.tagId && await this._loadTag();
  }
  async _loadTag() {
    this.tagId && (this._loading = !0, this._tag = await y.getTagById(this.tagId), this._loading = !1);
  }
  render() {
    return this._loading ? d`<uui-loader></uui-loader>` : this._tag ? d`
			<umb-workspace-editor alias="TagManager.TagWorkspace">
				<div id="header" slot="header">
					<uui-button
						label="Back"
						look="secondary"
						@click=${() => history.back()}>
						<uui-icon name="icon-arrow-left"></uui-icon>
					</uui-button>
					<h2>${this._tag.tag}</h2>
				</div>
			</umb-workspace-editor>
		` : d`<p>Tag not found</p>`;
  }
};
T(i, "styles", f`
		:host {
			display: block;
			width: 100%;
			height: 100%;
		}

		#header {
			display: flex;
			align-items: center;
			gap: var(--uui-size-space-4);
		}
	`);
l([
  m({ type: Number })
], i.prototype, "tagId", 2);
l([
  g()
], i.prototype, "_tag", 2);
l([
  g()
], i.prototype, "_loading", 2);
i = l([
  b("tag-workspace")
], i);
export {
  i as TagWorkspaceElement
};
//# sourceMappingURL=tag-workspace.element-DomOa9Ug.js.map
