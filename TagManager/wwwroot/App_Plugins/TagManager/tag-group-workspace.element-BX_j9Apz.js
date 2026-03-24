var g = Object.defineProperty;
var h = (e, a, t) => a in e ? g(e, a, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[a] = t;
var s = (e, a, t) => h(e, typeof a != "symbol" ? a + "" : a, t);
import { LitElement as v, html as n, css as m, state as d, customElement as f } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as _ } from "@umbraco-cms/backoffice/element-api";
import { UmbModalToken as x, UMB_MODAL_MANAGER_CONTEXT as b } from "@umbraco-cms/backoffice/modal";
import { T as w } from "./tagmanager-repository-BvW2JE0F.js";
const y = new x(
  "TagManager.Modal.CreateTag",
  {
    modal: {
      type: "sidebar",
      size: "small"
    }
  }
);
var p = Object.defineProperty, T = Object.getOwnPropertyDescriptor, z = (e, a, t) => a in e ? p(e, a, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[a] = t, l = (e, a, t, i) => {
  for (var o = i > 1 ? void 0 : i ? T(a, t) : a, c = e.length - 1, u; c >= 0; c--)
    (u = e[c]) && (o = (i ? u(a, t, o) : u(o)) || o);
  return i && o && p(a, t, o), o;
}, N = (e, a, t) => z(e, a + "", t);
let r = class extends _(v) {
  constructor() {
    super();
    s(this, "_repository");
    s(this, "_locationPoller", null);
    s(this, "_lastPathname", "");
    s(this, "_loadRequestId", 0);
    s(this, "_tags", []);
    s(this, "_loading", !1);
    s(this, "_groupName", "");
    this._repository = new w(this);
  }
  async connectedCallback() {
    super.connectedCallback(), this._lastPathname = window.location.pathname, await this._syncFromLocation(this._lastPathname), this._locationPoller = window.setInterval(() => {
      const a = window.location.pathname;
      a !== this._lastPathname && (this._lastPathname = a, this._syncFromLocation(a));
    }, 200);
  }
  disconnectedCallback() {
    this._locationPoller !== null && (window.clearInterval(this._locationPoller), this._locationPoller = null), super.disconnectedCallback();
  }
  _getGroupNameFromPath(a) {
    const t = a.match(/\/tagmanager-group\/(?:edit\/)?([^\/]+)/);
    return t != null && t[1] ? decodeURIComponent(t[1]) : null;
  }
  async _syncFromLocation(a) {
    const t = this._getGroupNameFromPath(a);
    if (!t) {
      this._groupName = "", this._tags = [], this._loading = !1, this.requestUpdate();
      return;
    }
    t !== this._groupName && (this._groupName = t, await this._loadTags(t));
  }
  async _loadTags(a) {
    const t = ++this._loadRequestId;
    this._loading = !0, this.requestUpdate();
    try {
      const i = await this._repository.getTagsInGroup(a);
      if (t !== this._loadRequestId) return;
      this._tags = i;
    } catch {
    } finally {
      t === this._loadRequestId && (this._loading = !1, this.requestUpdate());
    }
  }
  _handleEditTag(a) {
    const t = `/umbraco/section/tagmanager/workspace/tagmanager-tag/edit/${a.id}`;
    history.pushState(null, "", t), window.dispatchEvent(new PopStateEvent("popstate"));
  }
  async _createTag() {
    const a = await this.getContext(b);
    if (!a) return;
    const t = a.open(this, y, {
      data: {
        groupName: this._groupName
      }
    });
    try {
      await t.onSubmit() && (await new Promise((o) => setTimeout(o, 500)), this._groupName && await this._loadTags(this._groupName));
    } catch {
    }
  }
  render() {
    if (this._loading)
      return n`
				<div class="loading-container">
					<uui-loader></uui-loader>
					<p>Loading tags...</p>
				</div>
			`;
    const a = this._tags.reduce((t, i) => t + (i.noTaggedNodes || i.NoTaggedNodes || 0), 0);
    return n`
			<div class="tag-container">
				<uui-box class="header-box">
					<div class="header-content">
						<div class="header-title-section">
							<div class="header-title">
								<uui-icon name="icon-folder"></uui-icon>
								<h2>Tag Manager</h2>
							</div>
							<uui-button
								look="primary"
								label="Create Tag"
								@click=${this._createTag}>
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

				${this._tags.length === 0 ? n`
							<div class="empty-state">
								<uui-icon name="icon-tag"></uui-icon>
								<p>No tags in this group</p>
							</div>
					  ` : n`
							<uui-box headline="All Tags">
								<div class="tag-grid">
									${this._tags.map((t) => n`
										<uui-card-content-node
											name="${t.tag || t.Tag || ""}"
											@click=${() => this._handleEditTag(t)}>
											<uui-icon slot="icon" name="icon-tag"></uui-icon>
											<div slot="info">
												<div class="tag-info">
													<uui-icon name="icon-files"></uui-icon>
													${t.noTaggedNodes || t.NoTaggedNodes || 0} uses
												</div>
											</div>
											<uui-action-bar slot="actions">
												<uui-button
													label="Edit"
													@click=${(i) => {
      i.stopPropagation(), this._handleEditTag(t);
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
N(r, "styles", m`
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
	`);
l([
  d()
], r.prototype, "_tags", 2);
l([
  d()
], r.prototype, "_loading", 2);
l([
  d()
], r.prototype, "_groupName", 2);
r = l([
  f("tagmanager-group-view")
], r);
const I = r;
export {
  r as TagManagerGroupViewElement,
  I as default
};
//# sourceMappingURL=tag-group-workspace.element-BX_j9Apz.js.map
