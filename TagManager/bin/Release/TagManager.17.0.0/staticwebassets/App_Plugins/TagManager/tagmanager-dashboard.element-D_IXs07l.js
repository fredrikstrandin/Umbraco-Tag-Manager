var h = Object.defineProperty;
var _ = (a, e, t) => e in a ? h(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t;
var r = (a, e, t) => _(a, typeof e != "symbol" ? e + "" : e, t);
import { LitElement as b, html as l, css as m, state as p, customElement as G } from "@umbraco-cms/backoffice/external/lit";
import { t as d } from "./tagmanager-repository-BtcZTuQa.js";
var c = Object.defineProperty, v = Object.getOwnPropertyDescriptor, f = (a, e, t) => e in a ? c(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t, o = (a, e, t, s) => {
  for (var u = s > 1 ? void 0 : s ? v(e, t) : e, g = a.length - 1, n; g >= 0; g--)
    (n = a[g]) && (u = (s ? n(e, t, u) : n(u)) || u);
  return s && u && c(e, t, u), u;
}, T = (a, e, t) => f(a, e + "", t);
let i = class extends b {
  constructor() {
    super(...arguments);
    r(this, "_tagGroups", []);
    r(this, "_selectedGroup", null);
    r(this, "_tagsInGroup", []);
    r(this, "_loading", !0);
  }
  connectedCallback() {
    super.connectedCallback(), this._loadTagGroups();
  }
  async _loadTagGroups() {
    this._loading = !0, this._tagGroups = await d.getTagGroups(), console.log("Tag groups loaded:", this._tagGroups), this._loading = !1;
  }
  async _selectGroup(e) {
    this._selectedGroup = e, this._loading = !0, this._tagsInGroup = await d.getTagsInGroup(e), this._loading = !1;
  }
  _openTagWorkspace(e) {
    history.pushState(null, "", `section/tagmanager/workspace/tagmanager-tag/edit/${e}`);
  }
  render() {
    return l`
			<uui-box headline="Tag Manager">
				<div id="tag-manager-container">
					${this._loading ? l`<uui-loader></uui-loader>` : l`
								<div class="tag-groups">
									<h3>Tag Groups</h3>
									<uui-menu-item
										label="All Groups"
										@click=${() => this._selectedGroup = null}>
									</uui-menu-item>
									${this._tagGroups.map(
      (e) => l`
											<uui-menu-item
												label="${e.group}"
												@click=${() => this._selectGroup(e.group)}
												?active=${this._selectedGroup === e.group}>
											</uui-menu-item>
										`
    )}
								</div>

								${this._selectedGroup ? l`
											<div class="tags-list">
												<h3>Tags in ${this._selectedGroup}</h3>
												<uui-table>
													<uui-table-head>
														<uui-table-head-cell>Tag</uui-table-head-cell>
														<uui-table-head-cell>Usage Count</uui-table-head-cell>
														<uui-table-head-cell>Actions</uui-table-head-cell>
													</uui-table-head>
													${this._tagsInGroup.map(
      (e) => l`
															<uui-table-row>
																<uui-table-cell>${e.tag}</uui-table-cell>
																<uui-table-cell>${e.noTaggedNodes}</uui-table-cell>
																<uui-table-cell>
																	<uui-button
																		label="Edit"
																		look="primary"
																		@click=${() => this._openTagWorkspace(e.id)}>
																		Edit
																	</uui-button>
																</uui-table-cell>
															</uui-table-row>
														`
    )}
												</uui-table>
											</div>
									  ` : l`<p>Select a tag group to view tags</p>`}
						  `}
				</div>
			</uui-box>
		`;
  }
};
T(i, "styles", m`
		:host {
			display: block;
			padding: var(--uui-size-layout-1);
		}

		#tag-manager-container {
			display: grid;
			grid-template-columns: 250px 1fr;
			gap: var(--uui-size-layout-1);
		}

		.tag-groups {
			border-right: 1px solid var(--uui-color-border);
			padding-right: var(--uui-size-space-4);
		}

		.tags-list {
			padding-left: var(--uui-size-space-4);
		}

		h3 {
			margin-top: 0;
		}
	`);
o([
  p()
], i.prototype, "_tagGroups", 2);
o([
  p()
], i.prototype, "_selectedGroup", 2);
o([
  p()
], i.prototype, "_tagsInGroup", 2);
o([
  p()
], i.prototype, "_loading", 2);
i = o([
  G("tagmanager-dashboard")
], i);
export {
  i as TagManagerDashboardElement
};
//# sourceMappingURL=tagmanager-dashboard.element-D_IXs07l.js.map
