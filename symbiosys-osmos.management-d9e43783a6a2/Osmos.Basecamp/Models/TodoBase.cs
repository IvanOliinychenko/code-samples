namespace Osmos.Basecamp.Models
{
    public class TodoBase : EntityResponse
    {
        public int position { get; set; }
        public bool @private { get; set; }
        public bool trashed { get; set; }
        public Creator creator { get; set; }
        public string url { get; set; }
        public string app_url { get; set; }
    }
}
