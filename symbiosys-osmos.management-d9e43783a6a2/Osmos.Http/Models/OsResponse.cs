using System.Net.Http;

namespace Osmos.Http.Models
{
    public class OsResponse<T> where T : class
    {
        public HttpResponseMessage HttpResponseMessage { get; set; }
        public string ContentAsString { get; set; }
        public T Object { get; set; }
        public bool Succeeded { get; set; }

    }
}
