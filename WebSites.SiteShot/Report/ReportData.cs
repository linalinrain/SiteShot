using Newtonsoft.Json;

namespace WebSites.SiteShot.Report;

internal class ReportData
{
    [JsonProperty("storyPath")]
    public required string[] StoryPath { get; init; }
    
    [JsonProperty("result")]
    public required string Result { get; init; }
    
    [JsonProperty("view")]
    public required string View { get; init; }
    
    [JsonProperty("verify")]
    public required string Verify { get; init; }
    
    [JsonProperty("skip")]
    public required string Skip { get; init; }
    
    [JsonProperty("images")]
    public required ReportImages Images { get; init; }
    
    [JsonProperty("links")]
    public required string[] Links { get; init; }
    
    [JsonProperty("gitLabProjectId")]
    public required int? GitLabProjectId { get; init; }
    
    [JsonProperty("gitLabMergeRequestId")]
    public required int? GitLabMergeRequestId { get; init; }
}

internal class ReportImages
{
    [JsonProperty("actual")]
    public required string Actual { get; init; }
    
    [JsonProperty("expect")]
    public required string Expect { get; init; }
    
    [JsonProperty("diff")]
    public required string Diff { get; init; }
}