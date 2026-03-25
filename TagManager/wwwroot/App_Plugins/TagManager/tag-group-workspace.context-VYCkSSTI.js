var y = Object.defineProperty;
var r = (t) => {
  throw TypeError(t);
};
var T = (t, e, o) => e in t ? y(t, e, { enumerable: !0, configurable: !0, writable: !0, value: o }) : t[e] = o;
var n = (t, e, o) => T(t, typeof e != "symbol" ? e + "" : e, o), p = (t, e, o) => e.has(t) || r("Cannot " + o);
var a = (t, e, o) => (p(t, e, "read from private field"), o ? o.call(t) : e.get(t)), u = (t, e, o) => e.has(t) ? r("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, o), m = (t, e, o, i) => (p(t, e, "write to private field"), i ? i.call(t, o) : e.set(t, o), o);
import { UmbContextBase as d } from "@umbraco-cms/backoffice/class-api";
import { UmbEntityContext as l } from "@umbraco-cms/backoffice/entity";
import { UMB_WORKSPACE_CONTEXT as C, UmbWorkspaceRouteManager as E } from "@umbraco-cms/backoffice/workspace";
var s;
class U extends d {
  constructor(o) {
    super(o, C.toString());
    u(this, s);
    n(this, "routes");
    /** Observable group key (same as tree item `unique`). */
    n(this, "unique");
    n(this, "workspaceAlias", "TagManager.GroupWorkspace");
    m(this, s, new l(this)), this.unique = a(this, s).unique, this.routes = new E(this), this.routes.setRoutes([
      {
        path: "edit/:unique",
        component: async () => (await import("./tagmanager-group-workspace-shell.element-B2ejBKg5.js")).TagManagerGroupWorkspaceShellElement,
        setup: (i, c) => {
          const h = c.match.params.unique, g = decodeURIComponent(h);
          a(this, s).setUnique(g);
        }
      }
    ]);
  }
  set manifest(o) {
    this.workspaceAlias = o.alias, a(this, s).setEntityType(o.meta.entityType);
  }
  getEntityType() {
    return a(this, s).getEntityType() ?? "tagmanager-group";
  }
}
s = new WeakMap();
export {
  U as TagManagerGroupWorkspaceContext,
  U as api
};
//# sourceMappingURL=tag-group-workspace.context-VYCkSSTI.js.map
