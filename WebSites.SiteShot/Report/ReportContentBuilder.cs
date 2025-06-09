using Newtonsoft.Json;
using WebSites.SiteShot.Constants;
using WebSites.SiteShot.Enums;
using WebSites.SiteShot.Models;
using WebSites.SiteShot.Utils;

namespace WebSites.SiteShot.Report;

internal static class ReportContentBuilder
{
    public static ReportData CreateReportData(ComparisonMetaData metaData, bool areImagesEqual)
    {
        var storyPath = metaData.StoryPath.ToArray();

        var result = metaData.Result == Result.Unassigned
            ? areImagesEqual
                ? Result.Success.ToString().ToLowerInvariant()
                : Result.Failed.ToString().ToLowerInvariant()
            : metaData.Result.ToString().ToLowerInvariant();

        var view = metaData.View.ToString().ToLowerInvariant();
        var verify = metaData.Verify.ToString().ToLowerInvariant();
        var skip = metaData.Skip.ToString().ToLowerInvariant();
        var links = metaData.Links.ToArray();
        var gitLabProjectId = GitLabConfig.ProjectId();
        var gitLabMergeRequestId = GitLabConfig.MergeRequestId();

        return new ReportData
        {
            StoryPath = storyPath,
            Result = result,
            View = view,
            Verify = verify,
            Skip = skip,
            Images = new ReportImages
            {
                Actual = ImageFileNames.ACTUAL_FILE_NAME,
                Expect = ImageFileNames.EXPECTED_FILE_NAME,
                Diff = ImageFileNames.DIFF_FILE_NAME
            },
            Links = links,
            GitLabProjectId = gitLabProjectId,
            GitLabMergeRequestId = gitLabMergeRequestId
        };
    }

    public static string BuildReportLine(ReportData reportData)
    {
        // Генерируем новый GUID
        var reportKey = Guid.NewGuid().ToString();

        // Сериализуем объект отчёта в отформатированный JSON.
        var json = JsonConvert.SerializeObject(reportData, Formatting.Indented);

        // Формируем строку, добавляя сгенерированный ключ и результат сериализации.
        return $"__SITESHOT_DATA__[\"{reportKey}\"] = {json};";
    }
}