namespace Umbraco_Tag_Manager.Models
{
    public class TaggedDocument
    {
        public string DocumentName { get; set; } = string.Empty;

        public int DocumentId { get; set; }

        public string DocumentUrl { get; set; } = string.Empty;
    }
}