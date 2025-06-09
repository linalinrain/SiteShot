using Newtonsoft.Json;
using WebSites.SiteShot.Report;

namespace WebSites.SiteShot.Managers;

internal static class ReportManager
{
    private static readonly object padlock = new();
    
    public static void SaveReport(string folderPath, ReportData reportData)
    {
        // Формируем строку отчёта
        var reportLine = BuildReportLine(reportData);
        // Формируем полный путь к data.js с помощью Path.Combine
        var filePath = Path.Combine(folderPath, "data.js");

        // Пишем строку в файл, используя блокировку для потокобезопасной записи
        lock (padlock)
        {
            File.AppendAllText(filePath, reportLine + Environment.NewLine);
        }
    }
    
    private static string BuildReportLine(ReportData reportData)
    {
        var reportKey = Guid.NewGuid().ToString();
        var json = JsonConvert.SerializeObject(reportData, Formatting.Indented);
        return $"__SITESHOT_DATA__[\"{reportKey}\"] = {json};";
    }
}