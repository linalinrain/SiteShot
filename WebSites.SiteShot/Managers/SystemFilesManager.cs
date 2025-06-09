using System.Reflection;

namespace WebSites.SiteShot.Managers;

public static class SystemFilesManager
{
    public static void CreateSystemFiles(string folderPath)
    {
        FileManager.CreateDirectory(folderPath);

        var filesInDirectory = Directory.GetFiles(folderPath);
        var assembly = Assembly.Load(typeof(SystemFilesManager).Assembly.GetName());
        var systemFiles = assembly.GetManifestResourceNames();

        // Каждый файл из списка JS и HTML файлов необходимо скопировать для работы в директорию
        foreach (var fileName in systemFiles)
        {
            var cleanFileName = GetCleanFileName(fileName, assembly);
            var filePath = Path.Join(folderPath, cleanFileName);

            if (filesInDirectory.Contains(filePath))
                continue;

            var directory = Path.GetDirectoryName(filePath)!;
            Directory.CreateDirectory(directory);

            try
            {
                using var fileStream = File.Create(filePath);

                assembly.GetManifestResourceStream(fileName)!.CopyTo(fileStream);
            }
            catch (IOException)
            {
                // При параллельности первые тесты все одновременно пытаются писать файлы в систему
                // Lock не делаю для производительности
            }
        }
    }

    private static string GetCleanFileName(string fileName, Assembly assembly)
    {
        var fileNameWithPath = TrimStart(fileName, $"{assembly.GetName().Name}.Resources.");
        var extension = Path.GetExtension(fileNameWithPath);

        var fileNameWithNormalizedPath = TrimEnd(fileNameWithPath, extension).Replace('.', '/');
        return $"{fileNameWithNormalizedPath}{extension}";
    }

    private static string TrimStart(string text, string start)
        => !text.StartsWith(start) ? text : text[start.Length..];

    private static string TrimEnd(string text, string end)
        => !text.EndsWith(end) ? text : text[..^end.Length];
}