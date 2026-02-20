import { html as n, customElement as p } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as c } from "@umbraco-cms/backoffice/element-api";
import { UmbLitElement as i } from "@umbraco-cms/backoffice/lit-element";
var g = Object.getOwnPropertyDescriptor, u = (a, o, l, m) => {
  for (var e = m > 1 ? void 0 : m ? g(o, l) : o, r = a.length - 1, s; r >= 0; r--)
    (s = a[r]) && (e = s(e) || e);
  return e;
};
let t = class extends c(i) {
  render() {
    return n`
			<umb-workspace-editor alias="TagManager.TagWorkspace">
			</umb-workspace-editor>
		`;
  }
};
t = u([
  p("tag-workspace")
], t);
const k = t;
export {
  t as TagWorkspaceElement,
  k as default
};
//# sourceMappingURL=tag-workspace.element-B-1W5B64.js.map
