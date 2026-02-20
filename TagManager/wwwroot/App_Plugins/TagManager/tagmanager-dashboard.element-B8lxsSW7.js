import { LitElement as l, html as u, css as g, customElement as p } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as c } from "@umbraco-cms/backoffice/element-api";
var d = Object.defineProperty, h = Object.getOwnPropertyDescriptor, m = (e, a, i) => a in e ? d(e, a, { enumerable: !0, configurable: !0, writable: !0, value: i }) : e[a] = i, b = (e, a, i, n) => {
  for (var t = n > 1 ? void 0 : n ? h(a, i) : a, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (t = s(t) || t);
  return t;
}, v = (e, a, i) => m(e, a + "", i);
let r = class extends c(l) {
  _openGitHubRepository(e) {
    e.preventDefault(), window.open("https://github.com/ZAAKS/Umbraco-Tag-Manager", "_blank", "noopener,noreferrer");
  }
  render() {
    return u`
			<uui-box headline="Tag Manager">
				<div class="tag-manager-info">
					<div class="header-section">
						<h2>Umbraco 17 Tag Manager</h2>
						<uui-button
							look="outline"
							label="View Source Repository"
							@click=${this._openGitHubRepository}>
							<uui-icon name="icon-github"></uui-icon>
							View Source Repository
						</uui-button>
					</div>
					<p>This package has been developed to provide a standard "Umbraco" interface to manage tags within your site.</p>
					
					<h3>Features</h3>
					<p>The package provides a tiled overview of all tags used in Umbraco. Each tag shows where it's used and how many times. Tags can also be created in advance so they show up in the content document type in the autocomplete.</p>
					
					<p>The tree is split into separate branches for each tag group created, which is useful if you run multiple blogs on your site or have multiple tag groups defined in a site.</p>
					
					<p>Functionality includes:</p>
					<ul>
						<li>Ability to edit tag data</li>
						<li>Ability to delete tags</li>
						<li>Tags on nodes/media are updated with edited tags</li>
						<li>Ability to move all tagged nodes to another tag - useful in cases of spelling mistakes, cleaning up tags, etc.</li>
						<li>Links to content where the tag is used.</li>
						<li>The ability to create new tags</li>
					</ul>
					
					<h3>Credits</h3>
					<p>This package is #friendly courtesy of Nigel Wilson, who built the initial package a zillion years ago. We converted and polished it with his consent - again - #h5yr Nigel.</p>
					
					<p>For v7 websites, please use the original =splendid= package by Nigel: Tag Manager for Umbraco 7.</p>
					
					<p>For V8 websites, use our previous version: Umbraco 8 Tag Manager.</p>
					
					<h3>Collaboration and Suggestions</h3>
					<p>We are open to suggestions and collaboration to build upon this lovely package. This package is part of our ongoing package development and will be updated frequently with new features.</p>
				</div>
			</uui-box>
		`;
  }
};
v(r, "styles", g`
		:host {
			display: block;
			padding: var(--uui-size-layout-1);
		}

		.tag-manager-info {
			padding: var(--uui-size-space-4);
		}

		.header-section {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: var(--uui-size-space-4);
			flex-wrap: wrap;
			gap: var(--uui-size-space-3);
		}

		.tag-manager-info h2 {
			margin-top: 0;
			margin-bottom: 0;
			color: var(--uui-color-text);
		}

		.header-section uui-button {
			white-space: nowrap;
		}

		.header-section uui-icon {
			margin-right: var(--uui-size-space-2);
		}

		.tag-manager-info h3 {
			margin-top: var(--uui-size-space-4);
			color: var(--uui-color-text);
		}

		.tag-manager-info p {
			margin-bottom: var(--uui-size-space-3);
			line-height: 1.6;
			color: var(--uui-color-text);
		}

		.tag-manager-info ul {
			margin-left: var(--uui-size-space-5);
			margin-bottom: var(--uui-size-space-3);
		}

		.tag-manager-info li {
			margin-bottom: var(--uui-size-space-2);
			line-height: 1.6;
		}
	`);
r = b([
  p("tagmanager-dashboard")
], r);
export {
  r as TagManagerDashboardElement
};
//# sourceMappingURL=tagmanager-dashboard.element-B8lxsSW7.js.map
