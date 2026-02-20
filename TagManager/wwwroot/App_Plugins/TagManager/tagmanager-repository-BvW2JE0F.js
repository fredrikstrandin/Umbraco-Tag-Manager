import { UmbControllerBase as c } from "@umbraco-cms/backoffice/class-api";
import { UMB_AUTH_CONTEXT as i } from "@umbraco-cms/backoffice/auth";
const a = "/umbraco/TagManager/api/v1/TagManager";
class g extends c {
  constructor(t) {
    super(t);
  }
  async getAuthHeaders() {
    try {
      const t = await this.getContext(i), e = await (t == null ? void 0 : t.getLatestToken());
      return {
        "Content-Type": "application/json",
        ...e ? { Authorization: `Bearer ${e}` } : {}
      };
    } catch {
      return {
        "Content-Type": "application/json"
      };
    }
  }
  async getTagById(t) {
    try {
      const e = await this.getAuthHeaders(), r = await fetch(`${a}/tag/${t}`, {
        headers: e,
        credentials: "include"
      });
      return r.ok ? await r.json() : null;
    } catch {
      return null;
    }
  }
  async getTagGroups() {
    try {
      const t = await this.getAuthHeaders(), e = await fetch(`${a}/taggroups`, {
        headers: t,
        credentials: "include"
      });
      return e.ok ? await e.json() : [];
    } catch {
      return [];
    }
  }
  async getTagsInGroup(t) {
    try {
      const e = await this.getAuthHeaders(), r = await fetch(`${a}/tagsingroup/${encodeURIComponent(t)}`, {
        headers: e,
        credentials: "include"
      });
      return r.ok ? await r.json() : [];
    } catch {
      return [];
    }
  }
  async getTags(t) {
    return this.getTagsInGroup(t);
  }
  async save(t) {
    try {
      const e = await this.getAuthHeaders(), r = await fetch(`${a}/save`, {
        method: "POST",
        headers: e,
        body: JSON.stringify(t),
        credentials: "include"
      });
      if (!r.ok)
        return !1;
      const n = await r.json().catch(() => null);
      return n !== null && n > 0;
    } catch {
      return !1;
    }
  }
  async deleteTag(t) {
    try {
      const e = t.id || t.Id;
      if (!e || e <= 0)
        return !1;
      const r = {
        id: e,
        tag: t.tag || t.Tag || "",
        group: t.group || t.Group || ""
      }, n = await this.getAuthHeaders(), s = await fetch(`${a}/delete`, {
        method: "POST",
        headers: n,
        body: JSON.stringify(r),
        credentials: "include"
      });
      if (!s.ok)
        return !1;
      const o = await s.json().catch(() => null);
      return o !== null && o > 0;
    } catch {
      return !1;
    }
  }
}
export {
  g as T
};
//# sourceMappingURL=tagmanager-repository-BvW2JE0F.js.map
