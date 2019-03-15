namespace Osmos.Basecamp.Models
{
    public class Todolist : TodoBase
    {
        public string name { get; set; }
        public string description { get; set; }
        public bool completed { get; set; }
        public int completed_count { get; set; }
        public int remaining_count { get; set; }
    }
}



