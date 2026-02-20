var p = Object.defineProperty;
var v = (t, a, i) => a in t ? p(t, a, { enumerable: !0, configurable: !0, writable: !0, value: i }) : t[a] = i;
var r = (t, a, i) => v(t, typeof a != "symbol" ? a + "" : a, i);
import { LitElement as h, html as n, css as f, state as u, customElement as m } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as x } from "@umbraco-cms/backoffice/element-api";
import { t as b } from "./tagmanager-repository-Dhwzm5P2.js";
var g = Object.defineProperty, _ = Object.getOwnPropertyDescriptor, y = (t, a, i) => a in t ? g(t, a, { enumerable: !0, configurable: !0, writable: !0, value: i }) : t[a] = i, l = (t, a, i, e) => {
  for (var o = e > 1 ? void 0 : e ? _(a, i) : a, c = t.length - 1, d; c >= 0; c--)
    (d = t[c]) && (o = (e ? d(a, i, o) : d(o)) || o);
  return e && o && g(a, i, o), o;
}, z = (t, a, i) => y(t, a + "", i);
let s = class extends x(h) {
  constructor() {
    super(...arguments);
    r(this, "_tags", []);
    r(this, "_loading", !1);
    r(this, "_groupName", "");
  }
  async connectedCallback() {
    super.connectedCallback(), this._loading = !0;
    const a = window.location.pathname.split("/"), i = a.indexOf("edit");
    i !== -1 && a[i + 1] ? (this._groupName = decodeURIComponent(a[i + 1]), await this._loadTags()) : this._loading = !1;
  }
  async _loadTags() {
    console.log("Loading tags for group:", this._groupName);
    try {
      this._tags = await b.getTagsInGroup(this._groupName), console.log("Loaded tags:", this._tags);
    } catch (a) {
      console.error("Error loading tags:", a);
    } finally {
      this._loading = !1, console.log("Loading complete, _loading:", this._loading, "tags:", this._tags.length), this.requestUpdate();
    }
  }
  _handleEditTag(a) {
    const i = `/umbraco/section/tagmanager/workspace/tagmanager-tag/edit/${a.id}`;
    history.pushState(null, "", i), window.dispatchEvent(new PopStateEvent("popstate"));
  }
  render() {
    if (console.log("Rendering, loading:", this._loading, "tags:", this._tags.length), this._loading)
      return n`
				<div class="loading-container">
					<uui-loader></uui-loader>
					<p>Loading tags...</p>
				</div>
			`;
    const a = this._tags.reduce((i, e) => i + (e.noTaggedNodes || e.NoTaggedNodes || 0), 0);
    return n`
			<div class="tag-container">
				<!-- Header with stats -->
				<uui-box class="header-box">
					<div class="header-content">
						<div class="header-title">
							<uui-icon name="icon-folder"></uui-icon>
							<h2>Tag Manager</h2>
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
									<div class="stat-value">${a}</div>
									<div class="stat-label">Total Uses</div>
								</div>
							</div>
							<div class="stat-card">
								<div class="stat-icon">
									<uui-icon name="icon-chart"></uui-icon>
								</div>
								<div class="stat-content">
									<div class="stat-value">${this._tags.length > 0 ? Math.round(a / this._tags.length) : 0}</div>
									<div class="stat-label">Avg per Tag</div>
								</div>
							</div>
						</div>
					</div>
				</uui-box>

				<!-- Tags grid -->
				${this._tags.length === 0 ? n`
							<div class="empty-state">
								<uui-icon name="icon-tag"></uui-icon>
								<p>No tags in this group</p>
							</div>
					  ` : n`
							<uui-box headline="All Tags">
								<div class="tag-grid">
									${this._tags.map((i) => n`
										<uui-card-content-node
											name="${i.tag || i.Tag || ""}"
											@click=${() => this._handleEditTag(i)}>
											<uui-icon slot="icon" name="icon-tag"></uui-icon>
											<div slot="info">
												<div class="tag-info">
													<uui-icon name="icon-files"></uui-icon>
													${i.noTaggedNodes || i.NoTaggedNodes || 0} uses
												</div>
											</div>
											<uui-action-bar slot="actions">
												<uui-button
													label="Edit"
													@click=${(e) => {
      e.stopPropagation(), this._handleEditTag(i);
    }}>
													<uui-icon name="icon-edit"></uui-icon>
												</uui-button>
											</uui-action-bar>
										</uui-card-content-node>
									`)}
								</div>
							</uui-box>
					  `}
			</div>
		`;
  }
};
z(s, "styles", f`
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

		.header-title {
			display: flex;
			align-items: center;
			gap: var(--uui-size-space-3);
			margin-bottom: var(--uui-size-space-5);
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
	`);
l([
  u()
], s.prototype, "_tags", 2);
l([
  u()
], s.prototype, "_loading", 2);
l([
  u()
], s.prototype, "_groupName", 2);
s = l([
  m("tagmanager-group-view")
], s);
const $ = s;
export {
  s as TagManagerGroupViewElement,
  $ as default
};
//# sourceMappingURL=tag-group-workspace.element-D6EpZdJB.js.map
