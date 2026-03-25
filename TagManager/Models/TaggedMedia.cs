using System.Collections.Generic;

namespace Umbraco_Tag_Manager.Models
{
    public class TaggedMedia
    {
        public string DocumentName { get; set; } = string.Empty;

        public int DocumentId { get; set; }

        public string DocumentUrl { get; set; } = string.Empty;

        /// <summary>
        /// The property-type IDs from cmsTagRelationship for this node + tag.
        /// Used to restrict property updates to only the property that held the tag.
        /// </summary>
        public List<int> RelationshipPropertyTypeIds { get; set; } = new();
    }
}