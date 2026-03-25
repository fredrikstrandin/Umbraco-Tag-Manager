import { html as m, customElement as n } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as c } from "@umbraco-cms/backoffice/lit-element";
var g = Object.getOwnPropertyDescriptor, u = (a, t, p, o) => {
  for (var e = o > 1 ? void 0 : o ? g(t, p) : t, r = a.length - 1, s; r >= 0; r--)
    (s = a[r]) && (e = s(e) || e);
  return e;
};
let l = class extends c {
  render() {
    return m`<umb-workspace-editor alias="TagManager.GroupWorkspace"></umb-workspace-editor>`;
  }
};
l = u([
  n("tagmanager-group-workspace-shell")
], l);
export {
  l as TagManagerGroupWorkspaceShellElement
};
//# sourceMappingURL=tagmanager-group-workspace-shell.element-B2ejBKg5.js.map
