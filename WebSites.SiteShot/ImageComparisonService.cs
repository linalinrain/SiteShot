using WebSites.SiteShot.Comparers;
using WebSites.SiteShot.Managers;
using WebSites.SiteShot.Models;
using WebSites.SiteShot.Report;

namespace WebSites.SiteShot;

public static class ImageComparisonService
{
    public static bool CompareAndGenerateReport(byte[] expectedImage, byte[] actualImage, ComparisonMetaData metaData)
    {
        // 1) Производим сравнение
        var comparisonResult = ImageComparer.GetDiffResult(expectedImage, actualImage, metaData.Threshold);
        var diffImage = comparisonResult.ByteArrayDiff;

        // 2) Формируем отчёт
        var reportData = ReportContentBuilder.CreateReportData(metaData, comparisonResult.AreImagesEqual);

        // 3) Создаем системные файлы в OutputDirectory
        SystemFilesManager.CreateSystemFiles(metaData.OutputDirectory);

        // 4) Сохраняем отчёт
        ReportManager.SaveReport(metaData.OutputDirectory, reportData);

        // 5) Сохраняем изображения
        ReportImagesManager.SaveImages(expectedImage, actualImage, diffImage, metaData, reportData);

        // 6) Возвращаем статус сравнения
        return comparisonResult.AreImagesEqual;
    }
}