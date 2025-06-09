using WebSites.SiteShot.Utils;

namespace WebSites.SiteShot.Comparers;

internal static class ImageComparer
{
    public class ImageComparerResult
    {
        public required bool AreImagesEqual { get; init; }
        public required byte[] ByteArrayDiff { get; init; }
    }

    private static readonly PixelColor argbRedColor = new(221, 43, 14);

    public static ImageComparerResult GetDiffResult(byte[] byteArrayExp, byte[] byteArrayAct, int threshold)
    {
        using var bitmapExp = new MemoryPinnedBitmap(byteArrayExp);
        using var bitmapAct = new MemoryPinnedBitmap(byteArrayAct);

        var bitmapMaxWidth = Math.Max(bitmapExp.Width, bitmapAct.Width);
        var bitmapMaxHeight = Math.Max(bitmapExp.Height, bitmapAct.Height);

        using var bitmapDiff = new MemoryPinnedBitmap(bitmapMaxWidth, bitmapMaxHeight);

        var areImagesEqual = 1;

        Parallel.For(0, bitmapDiff.Width, column =>
        {
            for (var row = 0; row < bitmapDiff.Height; row++)
            {
                var pixelColor = GetDifferencePixel(bitmapExp, bitmapAct, column, row, threshold);

                bitmapDiff.SetPixelColor(column, row, pixelColor);

                if (areImagesEqual == 1 && pixelColor.Equals(argbRedColor))
                    Interlocked.Exchange(ref areImagesEqual, 0);
            }
        });

        return new ImageComparerResult
        {
            AreImagesEqual = areImagesEqual == 1,
            ByteArrayDiff = bitmapDiff.GetByteArrayAndDispose()
        };
    }

    private static PixelColor GetDifferencePixel(MemoryPinnedBitmap bitmapExp, MemoryPinnedBitmap bitmapAct,
        int column, int row, int threshold)
    {
        var expPixel = bitmapExp.GetPixelColor(column, row);
        var actPixel = bitmapAct.GetPixelColor(column, row);

        var isExpEmpty = expPixel.Equals(PixelColor.Empty);
        var isActEmpty = actPixel.Equals(PixelColor.Empty);

        if (isExpEmpty || isActEmpty)
            return (isExpEmpty ? actPixel : expPixel)
                .ToGrayscale()
                .ApplyRedFilter();

        if (expPixel.Equals(actPixel))
            return expPixel.ToGrayscale();

        return expPixel.IsSimilarTo(actPixel, threshold)
            ? expPixel.ToGrayscale()
            : argbRedColor;
    }
}