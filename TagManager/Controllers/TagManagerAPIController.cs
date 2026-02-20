using Microsoft.Extensions.Logging;
using NPoco;
using Umbraco_Tag_Manager.Models;
using Umbraco.Cms.Core.Scoping;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Services;
using Umbraco.Extensions;
using Asp.Versioning;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Umbraco_Tag_Manager.Controllers
{
    /// <summary>
    /// API Controller for TagManager operations
    /// </summary>
    [ApiVersion("1.0")]
    [ApiExplorerSettings(GroupName = "TagManager")]
    public class TagManagerApiController : TagManagerApiControllerBase
    {
        private readonly IScopeProvider _scopeProvider;
        private readonly ILogger<TagManagerApiController> _logger;
        private readonly IMediaService _mediaService;
        private readonly IContentService _contentService;
        private readonly ITagService _tagService;

        public TagManagerApiController(
            IScopeProvider scopeProvider,
            ILogger<TagManagerApiController> logger,
            IMediaService mediaService,
            IContentService contentService,
            ITagService tagService)
        {
            _scopeProvider = scopeProvider;
            _logger = logger;
            _mediaService = mediaService;
            _contentService = contentService;
            _tagService = tagService;
        }

        [HttpGet("tag/{tagId:int}")]
        public IActionResult GetTagById(int tagId)
        {
            var tag = new CmsTags();

            try
            {
                using (var scope = _scopeProvider.CreateScope())
                {
                    var query = new Sql().Select(
                        $"id, tag, [group], propertytypeid, count(tagId) as noTaggedNodes FROM cmsTags LEFT JOIN cmsTagRelationship ON cmsTags.id = cmsTagRelationship.tagId Where cmsTags.Id = {tagId} GROUP BY tag, id, [group], propertytypeid;");

                    tag = scope.Database.Fetch<CmsTags>(query).FirstOrDefault();

                    var taggedDocs = GetTaggedDocumentNodeIds(tagId);

                    if (tag != null)
                    {
                        tag.TaggedDocuments = taggedDocs;

                        var taggedMedia = GetTaggedMediaNodeIds(tagId);

                        tag.TaggedMedia = taggedMedia;

                        var tagsInGroup = GetAllTagsInGroup(tagId);

                        tag.TagsInGroup = tagsInGroup;
                    }

                    scope.Complete();

                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetTagById:");
            }


            return Ok(tag);
        }

        [HttpGet("taggroups")]
        public IActionResult GetTagGroups()
        {
            IEnumerable<TagGroup> tagGroups = null;
            try
            {
                using (var scope = _scopeProvider.CreateScope())
                {
                    var query = new Sql().Select("[group] from cmstags GROUP BY [group] ORDER BY [group];");
                    tagGroups = scope.Database.Fetch<TagGroup>(query);
                    scope.Complete();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetAllTagsInGroup:");
            }

            return Ok(tagGroups);
        }

        public TagInGroup GetAllTagsInGroup(int tagId)
        {
            var tagsInGroup = new TagInGroup();

            try
            {
                var listOfTags = new List<PlainPair>();

                using (var scope = _scopeProvider.CreateScope())
                {
                    var groupNameQuery = new Sql().Select($"[group] FROM cmsTags WHERE id={tagId}");
                    var resultGroupName = scope.Database.Single<string>(groupNameQuery);

                    var query = new Sql().Select(
                        $"id, tag FROM cmsTags where [group] = '{resultGroupName}' ORDER BY tag");

                    var results = scope.Database.Fetch<PlainPair>(query);

                    foreach (var result in results)
                    {
                        var t = new PlainPair { Id = Convert.ToInt32(result.Id), Tag = result.Tag };

                        listOfTags.Add(t);

                        if (result.Id == tagId)
                        {
                            tagsInGroup.SelectedItem = t;
                        }
                    }

                    tagsInGroup.Options = listOfTags;
                    scope.Complete();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in Error in GetAllTagsInGroup:");
            }

            return tagsInGroup;
        }

        [HttpGet("tagsingroup/{groupName}")]
        public IActionResult GetAllTagsInGroup(string groupName)
        {
            IEnumerable<CmsTags> tags = null;
            try
            {
                using (var scope = _scopeProvider.CreateScope())
                {
                    var query = new Sql().Select(
                        $"id, tag, [group], count(tagId) as noTaggedNodes FROM cmstags LEFT JOIN cmsTagRelationship ON cmsTags.id = cmsTagRelationship.tagId WHERE [group] = '{groupName}' GROUP BY tag, id, [group] ORDER BY tag");

                    tags = scope.Database.Fetch<CmsTags>(query);
                    scope.Complete();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetAllTagsInGroup:");
            }
            return Ok(tags);
        }

        public List<TaggedDocument> GetTaggedDocumentNodeIds(int tagId)
        {
            var docs = new List<TaggedDocument>();

            try
            {
                using (var scope = _scopeProvider.CreateScope())
                {
                    var query = new Sql().Select("nodeId as DocumentId").From("cmsTagRelationship").Where(
                        $"tagID = {tagId}");

                    var results = scope.Database.Fetch<TaggedDocument>(query);
                    foreach (var result in results)
                    {
                        var contentService = _contentService;
                        var content = contentService.GetById(result.DocumentId);

                        if (content != null)
                        {
                            if (!string.IsNullOrWhiteSpace(content.Name))
                            {
                                var document = new TaggedDocument
                                {
                                    DocumentId = result.DocumentId,
                                    DocumentName = content.Name,
                                    DocumentUrl = $"/umbraco/section/content/workspace/document/edit/{content.Key}"
                                };
                                docs.Add(document);
                            }
                        }
                    }
                    scope.Complete();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetTaggedDocumentNodeIds:");
            }
            return docs;
        }

        public List<TaggedMedia> GetTaggedMediaNodeIds(int tagId)
        {

            var medias = new List<TaggedMedia>();

            try
            {
                var query = new Sql().Select("nodeId as DocumentId").From("cmsTagRelationship").Where(
                    $"tagID = {tagId}");

                using (var scope = _scopeProvider.CreateScope())
                {
                    var results = scope.Database.Fetch<TaggedDocument>(query);
                    foreach (var result in results)
                    {
                        var mediaService = _mediaService; 
                        var media = mediaService.GetById(result.DocumentId);

                        if (media != null)
                        {
                            if (!string.IsNullOrWhiteSpace(media.Name))
                            {
                                var taggedMedia = new TaggedMedia
                                {
                                    DocumentId = result.DocumentId,
                                    DocumentName = media.Name,
                                    DocumentUrl = $"/umbraco/section/media/workspace/media/edit/{media.Key}"
                                };
                                medias.Add(taggedMedia);
                            }
                        }
                    }
                    scope.Complete();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetTaggedMediaNodeIds:");
            }

            return medias;
        }

        public int MoveTaggedNodes(int currentTagId, int newTagId)
        {
            var success = 0;

            try
            {
                using (var scope = _scopeProvider.CreateScope())
                {
                    success = scope.Database.Execute("Update cmsTagRelationship SET tagID = @1 WHERE tagID = @0 AND nodeId NOT IN (SELECT nodeId FROM cmsTagRelationship WHERE tagId = @1);", currentTagId, newTagId);

                    if (success == 1)
                    {
                        success = scope.Database.Execute("DELETE FROM cmsTagRelationship WHERE tagId = @0;", currentTagId);
                    }
                    scope.Complete();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in MoveTaggedNodes:");
            }
            return success;
        }

        [HttpPost("save")]
        public IActionResult Save([FromBody] CmsTags tag)
        {
            var success = 0;

            try
            {
                using (var scope = _scopeProvider.CreateScope())
                {
                    if (tag.Id == 0)
                    {
                        var existingTag = scope.Database.FirstOrDefault<CmsTags>(
                            "SELECT * FROM cmsTags WHERE tag = @0 AND [group] = @1",
                            tag.Tag,
                            tag.Group);

                        if (existingTag != null)
                        {
                            _logger.LogWarning($"Tag '{tag.Tag}' already exists in group '{tag.Group}'");
                            return Ok(0); 
                        }

                        var insertSql = "INSERT INTO cmsTags (tag, [group]) VALUES (@0, @1)";
                        success = scope.Database.Execute(insertSql, tag.Tag, tag.Group);

                        if (success > 0)
                        {
                            var newTag = scope.Database.FirstOrDefault<CmsTags>(
                                "SELECT * FROM cmsTags WHERE tag = @0 AND [group] = @1",
                                tag.Tag,
                                tag.Group);

                            if (newTag != null)
                            {
                                tag.Id = newTag.Id;
                                _logger.LogInformation($"Created new tag with ID: {tag.Id}, Tag: {tag.Tag}, Group: {tag.Group}");
                            }
                        }
                    }
                    else
                    {
                        success = scope.Database.Execute("Update cmsTags set tag = @0 where id = @1", tag.Tag, tag.Id);

                        if (success == 1 && tag.TagsInGroup?.SelectedItem != null && tag.Id != tag.TagsInGroup.SelectedItem.Id)
                        {
                            var sqlQuery1 = string.Format("Update cmsTagRelationship SET tagID = {0} WHERE tagID = {1} AND nodeId NOT IN (SELECT nodeId FROM cmsTagRelationship WHERE tagId = {0});", tag.TagsInGroup.SelectedItem.Id, tag.Id);

                            success = scope.Database.Execute(sqlQuery1);

                            var sqlQuery2 = $"DELETE FROM cmsTagRelationship WHERE tagId = {tag.Id};";
                            scope.Database.Execute(sqlQuery2);
                        }

                        UpdateDocuments(tag);
                        UpdateMedia(tag);
                    }

                    scope.Complete();
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in Save:");
                return BadRequest($"Error saving tag: {ex.Message}");
            }

            return Ok(success);
        }


        private void UpdateDocuments(CmsTags tag)
        {
            try
            {
                if (tag.TaggedDocuments.Count > 0)
                {
                    var contentService = _contentService;
                    var tagService = _tagService;

                    foreach (var doc in tag.TaggedDocuments)
                    {
                        var content = contentService.GetById(doc.DocumentId);

                        foreach (var property in content.Properties)
                        {
                            var propertyAlias = property.Alias;
                            var tags = tagService.GetTagsForEntity(doc.DocumentId, tag.Group);
                            IEnumerable<string> tagList = tags.Select(x => x.Text).ToList();

                            property.SetValue(tagList);
                        }

                        contentService.Save(content);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in UpdateDocuments:");
            }
        }

        private void UpdateMedia(CmsTags tag)
        {
            try
            {
                if (tag.TaggedMedia.Count > 0)
                {
                    var mediaService = _mediaService;
                    var tagService = _tagService;

                    foreach (var med in tag.TaggedMedia)
                    {
                        var media = mediaService.GetById(med.DocumentId);

                        foreach (var property in media.Properties)
                        {
                            var propertyAlias = property.Alias;
                            var tags = tagService.GetTagsForEntity(med.DocumentId, tag.Group);
                            IEnumerable<string> tagList = tags.Select(x => x.Text).ToList();

                            property.SetValue(tagList);
                        }

                        mediaService.Save(media);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in UpdateMedia:");
            }
        }
        [HttpPost("delete")]
        public IActionResult DeleteTag([FromBody] CmsTags tag)
        {
            if (tag == null || tag.Id <= 0)
            {
                _logger.LogWarning("DeleteTag called with invalid tag: tag is null or Id is invalid");
                return BadRequest("Invalid tag data. Tag ID is required.");
            }

            try
            {
                _logger.LogInformation($"Attempting to delete tag with ID: {tag.Id}, Tag: {tag.Tag}, Group: {tag.Group}");

                // Delete tag relationships first
                int relationshipDeleted = 0;
                using (var scope = _scopeProvider.CreateScope())
                {
                    var sqlQuery1 = $"DELETE FROM cmsTagRelationship WHERE tagId = {tag.Id};";
                    relationshipDeleted = scope.Database.Execute(sqlQuery1);
                    scope.Complete();
                    _logger.LogInformation($"Deleted {relationshipDeleted} tag relationships for tag ID {tag.Id}");
                }

                // Delete the tag itself
                var success = 0;
                using (var scope = _scopeProvider.CreateScope())
                {
                    var sqlQuery2 = $"DELETE FROM cmsTags WHERE id = {tag.Id};";
                    success = scope.Database.Execute(sqlQuery2);
                    scope.Complete();
                    _logger.LogInformation($"Deleted tag with ID {tag.Id}. Rows affected: {success}");
                }

                if (success > 0)
                {
                    // Update documents and media that were using this tag
                    UpdateDocuments(tag);
                    UpdateMedia(tag);
                }
                else
                {
                    _logger.LogWarning($"No rows were deleted for tag ID {tag.Id}. Tag may not exist.");
                }

                return Ok(success);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting tag with ID {tag.Id}:");
                return BadRequest($"Error deleting tag: {ex.Message}");
            }
        }
    }
}