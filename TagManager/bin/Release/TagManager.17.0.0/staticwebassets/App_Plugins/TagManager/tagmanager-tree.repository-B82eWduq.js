var m = (r) => {
  throw TypeError(r);
};
var l = (r, a, t) => a.has(r) || m("Cannot " + t);
var g = (r, a, t) => (l(r, a, "read from private field"), t ? t.call(r) : a.get(r)), c = (r, a, t) => a.has(r) ? m("Cannot add the same private member more than once") : a instanceof WeakSet ? a.add(r) : a.set(r, t), d = (r, a, t, e) => (l(r, a, "write to private field"), e ? e.call(r, t) : a.set(r, t), t);
import { UmbTreeServerDataSourceBase as T, UmbTreeRepositoryBase as f } from "@umbraco-cms/backoffice/tree";
import { T as h } from "./tagmanager-repository-Dhwzm5P2.js";
import { U as y } from "./index-BPuvov7F.js";
var n;
class I extends T {
  constructor(t) {
    super(t, {
      getRootItems: (e) => this.getRootItems(e),
      getChildrenOf: (e) => this.getChildrenOf(e),
      getAncestorsOf: (e) => this.getAncestorsOf(e),
      mapper: (e) => e
    });
    c(this, n);
    d(this, n, new h());
  }
  async getRootItems(t) {
    const e = await g(this, n).getTagGroups();
    return { data: { items: e.map((o) => ({
      unique: o.group || "default",
      // Use group name as unique ID
      parent: null,
      name: o.group || "default",
      entityType: "tagmanager-group",
      type: "tagmanager-group",
      hasChildren: !1,
      // Don't show expand arrow - clicking opens workspace
      icon: "icon-tags",
      isFolder: !1
      // Not a folder, it's a clickable item
    })), total: e.length } };
  }
  async getChildrenOf(t) {
    const e = parseInt(t.parent.unique), o = (await g(this, n).getTagGroups()).find((i) => (i.groupId || 0) === e);
    if (!o)
      return { data: { items: [], total: 0 } };
    const s = await g(this, n).getTags(o.group || "default");
    return { data: { items: s.map((i) => ({
      unique: `${e}-${i.id}`,
      parent: { unique: t.parent.unique, entityType: "tagmanager-group" },
      name: i.tag || "",
      entityType: "tagmanager-tag",
      type: "tagmanager-tag",
      hasChildren: !1,
      icon: "icon-tag",
      isFolder: !1
    })), total: s.length } };
  }
  async getAncestorsOf(t) {
    var e;
    if (t.treeItem.entityType === "tagmanager-tag" && t.treeItem.parent) {
      const u = await g(this, n).getTagGroups(), o = parseInt(t.treeItem.parent.unique), s = u.find((p) => (p.groupId || 0) === o);
      if (s)
        return { data: { items: [{
          unique: ((e = s.groupId) == null ? void 0 : e.toString()) || "0",
          parent: null,
          name: s.group || "default",
          entityType: "tagmanager-group",
          type: "tagmanager-group",
          hasChildren: !0,
          icon: "icon-tags",
          isFolder: !0
        }], total: 1 } };
    }
    return { data: { items: [], total: 0 } };
  }
}
n = new WeakMap();
class O extends f {
  constructor(a) {
    super(a, I, y);
  }
  async requestTreeRoot() {
    const { data: a } = await this._treeSource.getRootItems({ skip: 0, take: 1 });
    return { data: {
      unique: null,
      entityType: "tagmanager-root",
      name: "Tag Manager",
      hasChildren: a ? a.total > 0 : !1,
      isFolder: !0
    } };
  }
}
export {
  O as TagManagerTreeRepository,
  O as default
};
//# sourceMappingURL=tagmanager-tree.repository-B82eWduq.js.map
