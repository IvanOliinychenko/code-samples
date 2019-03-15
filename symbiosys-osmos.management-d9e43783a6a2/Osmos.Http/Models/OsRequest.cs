using System.Collections.Generic;
using System.Net.Http;

namespace Osmos.Http.Models
{
    public class OsRequest
    {
        public HttpMethod Method { get; set; }
        public List<KeyValuePair<string, string>> Headers { get; set; }
        public object Content { get; set; }
        public string Url { get; set; }

        public OsRequest()
        {
            Method = HttpMethod.Get;
        }
    }
}
