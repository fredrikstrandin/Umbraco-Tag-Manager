const n = "/umbraco/TagManager/api/v1/TagManager";
class a {
  async getTagById(e) {
    try {
      const t = await fetch(`${n}/tag/${e}`, {
        credentials: "include"
      });
      return t.ok ? await t.json() : null;
    } catch {
      return null;
    }
  }
  async getTagGroups() {
    try {
      const e = await fetch(`${n}/taggroups`, {
        credentials: "include"
      });
      return e.ok ? await e.json() : [];
    } catch {
      return [];
    }
  }
  async getTagsInGroup(e) {
    try {
      const t = await fetch(`${n}/tagsingroup/${encodeURIComponent(e)}`, {
        credentials: "include"
      });
      return t.ok ? await t.json() : [];
    } catch {
      return [];
    }
  }
  async getTags(e) {
    return this.getTagsInGroup(e);
  }
  async save(e) {
    try {
      return (await fetch(`${n}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(e),
        credentials: "include"
      })).ok;
    } catch {
      return !1;
    }
  }
  async deleteTag(e) {
    try {
      return (await fetch(`${n}/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(e),
        credentials: "include"
      })).ok;
    } catch {
      return !1;
    }
  }
}
const s = new a();
export {
  a as T,
  s as t
};
//# sourceMappingURL=tagmanager-repository-Dhwzm5P2.js.map
