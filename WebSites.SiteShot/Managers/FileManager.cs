namespace WebSites.SiteShot.Managers;

public static class FileManager
{
    public static void WriteAllBytes(string filePath, byte[] contents)
    {
        CreateDirectory(filePath);
        File.WriteAllBytes(filePath, contents);
    }

    public static void CreateDirectory(string filePath)
    {
        var path = Path.GetDirectoryName(filePath);
        Directory.CreateDirectory(path ?? throw new Exception($"Directory [{path}] is not valid"));
    }
}