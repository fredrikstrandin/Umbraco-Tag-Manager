var g = Object.defineProperty;
var h = (e, t, a) => t in e ? g(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a;
var o = (e, t, a) => h(e, typeof t != "symbol" ? t + "" : t, a);
import { LitElement as m, html as l, css as v, state as d, customElement as f } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as _ } from "@umbraco-cms/backoffice/element-api";
import { UmbModalToken as b, UMB_MODAL_MANAGER_CONTEXT as x } from "@umbraco-cms/backoffice/modal";
import { UMB_WORKSPACE_CONTEXT as y } from "@umbraco-cms/backoffice/workspace";
import { T } from "./tagmanager-repository-BvW2JE0F.js";
const w = new b(
  "TagManager.Modal.CreateTag",
  {
    modal: {
      type: "sidebar",
      size: "small"
    }
  }
);
var p = Object.defineProperty, P = Object.getOwnPropertyDescriptor, z = (e, t, a) => t in e ? p(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a, u = (e, t, a, i) => {
  for (var s = i > 1 ? void 0 : i ? P(t, a) : t, n = e.length - 1, c; n >= 0; n--)
    (c = e[n]) && (s = (i ? c(t, a, s) : c(s)) || s);
  return i && s && p(t, a, s), s;
}, N = (e, t, a) => z(e, t + "", a);
let r = class extends _(m) {
  constructor() {
    super();
    o(this, "_repository");
    o(this, "_loadRequestId", 0);
    o(this, "_pathnamePoller", null);
    o(this, "_lastPathname", "");
    o(this, "_tags", []);
    o(this, "_loading", !1);
    o(this, "_groupName", "");
    this._repository = new T(this);
  }
  async connectedCallback() {
    super.connectedCallback(), this.consumeContext(y, (t) => {
      const a = t == null ? void 0 : t.unique;
      if (a) {
        this.observe(a, (i) => {
          this._syncFromWorkspaceUnique(i);
        });
        return;
      }
      this._startPathnameFallback();
    }), this._lastPathname = window.location.pathname, this._syncFromPathname(this._lastPathname);
  }
  disconnectedCallback() {
    this._pathnamePoller !== null && (window.clearInterval(this._pathnamePoller), this._pathnamePoller = null), super.disconnectedCallback();
  }
  _startPathnameFallback() {
    this._pathnamePoller === null && (this._pathnamePoller = window.setInterval(() => {
      const t = window.location.pathname;
      t !== this._lastPathname && (this._lastPathname = t, this._syncFromPathname(t));
    }, 200));
  }
  _getGroupNameFromPath(t) {
    const a = t.match(/\/tagmanager-group\/(?:edit\/)?([^/]+)/);
    return a != null && a[1] ? decodeURIComponent(a[1]) : null;
  }
  async _syncFromPathname(t) {
    const a = this._getGroupNameFromPath(t);
    if (!a) {
      this._groupName = "", this._tags = [], this._loading = !1, this.requestUpdate();
      return;
    }
    a !== this._groupName && (this._groupName = a, await this._loadTags(a));
  }
  async _syncFromWorkspaceUnique(t) {
    if (t == null || t === "") {
      this._groupName = "", this._tags = [], this._loading = !1, this.requestUpdate();
      return;
    }
    t !== this._groupName && (this._groupName = t, this._tags = [], this._loading = !0, this.requestUpdate(), await this._loadTags(t));
  }
  async _loadTags(t) {
    const a = ++this._loadRequestId;
    this._loading = !0, this.requestUpdate();
    try {
      const i = await this._repository.getTagsInGroup(t);
      if (a !== this._loadRequestId) return;
      const s = t.trim();
      this._tags = i.filter((n) => (n.group || n.Group || "").trim() === s);
    } catch {
    } finally {
      a === this._loadRequestId && (this._loading = !1, this.requestUpdate());
    }
  }
  _handleEditTag(t) {
    const a = `/umbraco/section/tagmanager/workspace/tagmanager-tag/edit/${t.id}`;
    history.pushState(null, "", a), window.dispatchEvent(new PopStateEvent("popstate"));
  }
  async _createTag() {
    const t = await this.getContext(x);
    if (!t) return;
    const a = t.open(this, w, {
      data: {
        groupName: this._groupName
      }
    });
    try {
      await a.onSubmit() && (await new Promise((s) => setTimeout(s, 500)), this._groupName && await this._loadTags(this._groupName));
    } catch {
    }
  }
  render() {
    if (this._loading)
      return l`
				<div class="loading-container">
					<uui-loader></uui-loader>
					<p>Loading tags...</p>
				</div>
			`;
    const t = this._tags.reduce((a, i) => a + (i.noTaggedNodes || i.NoTaggedNodes || 0), 0);
    return l`
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
									<div class="stat-value">${t}</div>
									<div class="stat-label">Total Uses</div>
								</div>
							</div>
							<div class="stat-card">
								<div class="stat-icon">
									<uui-icon name="icon-chart"></uui-icon>
								</div>
								<div class="stat-content">
									<div class="stat-value">${this._tags.length > 0 ? Math.round(t / this._tags.length) : 0}</div>
									<div class="stat-label">Avg per Tag</div>
								</div>
							</div>
						</div>
					</div>
				</uui-box>

				${this._tags.length === 0 ? l`
							<div class="empty-state">
								<uui-icon name="icon-tag"></uui-icon>
								<p>No tags in this group</p>
							</div>
					  ` : l`
							<uui-box headline="All Tags">
								<div class="tag-grid">
									${this._tags.map(
      (a) => l`
											<uui-card-content-node
												name="${a.tag || a.Tag || ""}"
												@click=${() => this._handleEditTag(a)}>
												<uui-icon slot="icon" name="icon-tag"></uui-icon>
												<div slot="info">
													<div class="tag-info">
														<uui-icon name="icon-files"></uui-icon>
														${a.noTaggedNodes || a.NoTaggedNodes || 0} uses
													</div>
												</div>
												<uui-action-bar slot="actions">
													<uui-button
														label="Edit"
														@click=${(i) => {
        i.stopPropagation(), this._handleEditTag(a);
      }}>
														<uui-icon name="icon-edit"></uui-icon>
													</uui-button>
												</uui-action-bar>
											</uui-card-content-node>
										`
    )}
								</div>
							</uui-box>
					  `}
			</div>
		`;
  }
};
N(r, "styles", v`
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
u([
  d()
], r.prototype, "_tags", 2);
u([
  d()
], r.prototype, "_loading", 2);
u([
  d()
], r.prototype, "_groupName", 2);
r = u([
  f("tagmanager-group-view")
], r);
const F = r;
export {
  r as TagManagerGroupViewElement,
  F as default
};
//# sourceMappingURL=tag-group-workspace.element-D6J4ta08.js.map
