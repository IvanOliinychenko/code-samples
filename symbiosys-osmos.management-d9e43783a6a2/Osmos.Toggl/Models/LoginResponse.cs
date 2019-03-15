using Newtonsoft.Json;
using System.Collections.Generic;

namespace Osmos.Toggl.Models
{

    public class LoginResponse
    {
        [JsonProperty("since")]
        public int Since { get; set; }

        [JsonProperty("data")]
        public LoginResponseData Data { get; set; }

        [JsonProperty("error")]
        public string Error { get; set; }
    }

    public class NewBlogPost
    {
    }

    public class Project
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("wid")]
        public int Wid { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("billable")]
        public bool Billable { get; set; }

        [JsonProperty("active")]
        public bool Active { get; set; }

        [JsonProperty("at")]
        public string At { get; set; }

        [JsonProperty("color")]
        public string Color { get; set; }
    }

    public class Tag
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("wid")]
        public int Wid { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }
    }

    public class WorkspaceLogin
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("at")]
        public string At { get; set; }

        [JsonProperty("default_hourly_rate")]
        public int DefaultHourlyRate { get; set; }

        [JsonProperty("default_currency")]
        public string DefaultCurrency { get; set; }

        [JsonProperty("projects_billable_by_default")]
        public bool ProjectsBillableByDefault { get; set; }

        [JsonProperty("rounding")]
        public int Rounding { get; set; }

        [JsonProperty("rounding_minutes")]
        public int RoundingMinutes { get; set; }

        [JsonProperty("api_token")]
        public string ApiToken { get; set; }
    }

    public class LoginResponseData
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("api_token")]
        public string ApiToken { get; set; }

        [JsonProperty("default_wid")]
        public int DefaultWid { get; set; }

        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("fullname")]
        public string Fullname { get; set; }

        [JsonProperty("jquery_timeofday_format")]
        public string JqueryTimeofdayFormat { get; set; }

        [JsonProperty("jquery_date_format")]
        public string JqueryDateFormat { get; set; }

        [JsonProperty("timeofday_format")]
        public string TimeofdayFormat { get; set; }

        [JsonProperty("date_format")]
        public string DateFormat { get; set; }

        [JsonProperty("store_start_and_stop_time")]
        public bool StoreStartAndStopTime { get; set; }

        [JsonProperty("beginning_of_week")]
        public int BeginningOfWeek { get; set; }

        [JsonProperty("language")]
        public string Language { get; set; }

        [JsonProperty("duration_format")]
        public string DurationFormat { get; set; }

        [JsonProperty("image_url")]
        public string ImageUrl { get; set; }

        [JsonProperty("at")]
        public string At { get; set; }

        [JsonProperty("created_at")]
        public string CreatedAt { get; set; }

        [JsonProperty("timezone")]
        public string Timezone { get; set; }

        [JsonProperty("retention")]
        public int Retention { get; set; }

        [JsonProperty("new_blog_post")]
        public NewBlogPost NewBlogPost { get; set; }

        [JsonProperty("projects")]
        public List<Project> Projects { get; set; }

        [JsonProperty("tags")]
        public List<Tag> Tags { get; set; }

        [JsonProperty("tasks")]
        public List<object> Tasks { get; set; }

        [JsonProperty("workspaces")]
        public List<WorkspaceLogin> Workspaces { get; set; }

        [JsonProperty("clients")]
        public List<object> Clients { get; set; }
    }
}
