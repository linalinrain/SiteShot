using Newtonsoft.Json;

namespace WebSites.SiteShot.Utils;

public static class GitLabConfig
{
    public static string? PipelineUrl()
        => GetEnvironmentVariable("CI_PIPELINE_URL");

    public static string? JobUrl()
        => GetEnvironmentVariable("CI_JOB_URL");

    public static string? ProjectName()
        => GetEnvironmentVariable("PROJECT_NAME");

    public static int? ProjectId()
        => GetIntegerEnvironmentVariable("CI_PROJECT_ID");

    public static int? MergeRequestId()
        => GetIntegerEnvironmentVariable("CI_MERGE_REQUEST_IID");

    public static string[] GetSkippedTests()
    {
        var envVariable = GetEnvironmentVariable("PW_SKIPPED_TESTS") ?? "[]";
        return JsonConvert.DeserializeObject<string[]>(envVariable)!;
    }

    private static int? GetIntegerEnvironmentVariable(string name)
    {
        var variable = GetEnvironmentVariable(name);
        return string.IsNullOrEmpty(variable)
            ? null
            : int.Parse(variable);
    }

    private static string? GetEnvironmentVariable(string name)
        => Environment.GetEnvironmentVariable(name);
}