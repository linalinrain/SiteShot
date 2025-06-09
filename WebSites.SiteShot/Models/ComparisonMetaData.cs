using WebSites.SiteShot.Enums;

namespace WebSites.SiteShot.Models;

public class ComparisonMetaData
{
    /// <summary>
    /// Результат теста. Значение по умолчанию – Unassigned.
    /// </summary>
    public Result Result { get; init; } = Result.Unassigned;

    /// <summary>
    /// Состояние отображения (view). По умолчанию – Unviewed.
    /// </summary>
    public View View { get; init; } = View.Unviewed;

    /// <summary>
    /// Режим верификации. По умолчанию – Unverified.
    /// </summary>
    public Verify Verify { get; init; } = Verify.Unverified;

    /// <summary>
    /// Статус пропуска. По умолчанию – Unskipped.
    /// </summary>
    public Skip Skip { get; init; } = Skip.Unskipped;

    /// <summary>
    /// StoryPath – массив строк. По умолчанию пустой список.
    /// </summary>
    public string[] StoryPath { get; init; } = Array.Empty<string>();

    /// <summary>
    /// Links – массив ссылок. По умолчанию пустой список.
    /// </summary>
    public string[] Links { get; init; } = Array.Empty<string>();

    /// <summary>
    /// Дополнительные детали. По умолчанию – пустая строка.
    /// </summary>
    public string AdditionalDetails { get; init; } = string.Empty;
    
    /// <summary>
    /// Путь для сохранения отчёта.
    /// </summary>
    public string OutputDirectory { get; init; } = string.Empty;
    
    /// <summary>
    /// Порог сравнения, по умолчанию равен 0.
    /// </summary>
    public int Threshold { get; init; } = 0;
}