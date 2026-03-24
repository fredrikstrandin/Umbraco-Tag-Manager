# TagManager release notes

## 17.0.5

### Backoffice (client)

- **Sidebar tree** lists **tag groups only**. Individual tags are no longer shown in the tree; open tags from the group workspace grid (cards).
- **Tree data source** aligned with the API: tag groups use the **group name** as the stable identifier end-to-end. Children of the hidden tree root match the root group list; **`getChildrenOf` no longer loads tags** under groups.
- **Ancestors** for an open tag workspace use the real **group name** instead of a shared numeric placeholder, so tree highlight and navigation stay consistent.
- **Group workspace** reloads when the route changes to another group even when that group has **zero** tags (fixes empty-group switching).
- **Tree item** manifest registers only `tagmanager-root` and `tagmanager-group` (tags are not tree nodes).

### API / server

- **Delete tag** now **syncs content and media**: loads the tag row and affected document/media IDs from `cmsTagRelationship` **before** deleting relationships and the tag, then updates tag picker / Tags property values using `ITagService` so stored values match the database.
- Fixes the case where **the last tag** on a property left stale text because `ITagService` returned no tags after deletion—properties are still detected when the stored value still contains the removed tag label.


### Integrating sites (project reference)

- If the site references **this project**, do **not** also copy `App_Plugins/TagManager` under the site’s own `wwwroot`. Static web assets from the TagManager project already publish those files; a second copy causes **conflicting static web assets** at the same path.

---

## 17.0.4 and earlier

See [GitHub releases](https://github.com/ZAAKS/Umbraco-Tag-Manager/releases) and commit history for prior versions.
