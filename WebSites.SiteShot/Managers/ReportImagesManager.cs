using WebSites.SiteShot.Models;
using WebSites.SiteShot.Report;

namespace WebSites.SiteShot.Managers;

internal static class ReportImagesManager
{
    public static void SaveImages(
        byte[] expectedImage,
        byte[] actualImage,
        byte[] diffImage,
        ComparisonMetaData metaData,
        ReportData reportData)
    {
        // Локальная константа для промежуточной папки, где хранятся изображения
        const string INTERMEDIATE_IMAGES_FOLDER = "images";

        // Формируем путь: OutputDirectory + "images" + все элементы StoryPath
        var imagesDirectory = Path.Combine(
            new[] { metaData.OutputDirectory, INTERMEDIATE_IMAGES_FOLDER }
                .Concat(metaData.StoryPath)
                .ToArray()
        );

        // Формируем полные пути для каждого файла, используя имена из reportData.Images
        var expectedImagePath = Path.Combine(imagesDirectory, reportData.Images.Expect);
        var actualImagePath = Path.Combine(imagesDirectory, reportData.Images.Actual);
        var diffImagePath = Path.Combine(imagesDirectory, reportData.Images.Diff);

        // Сохраняем файлы
        FileManager.WriteAllBytes(expectedImagePath, expectedImage);
        FileManager.WriteAllBytes(actualImagePath, actualImage);
        FileManager.WriteAllBytes(diffImagePath, diffImage);
    }
}