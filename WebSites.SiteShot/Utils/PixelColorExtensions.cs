namespace WebSites.SiteShot.Utils;

public static class PixelColorExtensions
{
    public static PixelColor ToGrayscale(this PixelColor color)
    {
        const double RED_WEIGHT = 0.3;
        const double GREEN_WEIGHT = 0.6;
        const double BLUE_WEIGHT = 0.1;

        var grayscale = (byte)(RED_WEIGHT * color.R + GREEN_WEIGHT * color.G + BLUE_WEIGHT * color.B);
        var brightenedGrayscale = (byte)(grayscale + (255 - grayscale) * 0.5);

        return new PixelColor(brightenedGrayscale, brightenedGrayscale, brightenedGrayscale, color.A);
    }

    public static PixelColor ApplyRedFilter(this PixelColor color)
    {
        return new PixelColor(
            (byte)(color.R * 0.98),
            (byte)(color.G * 0.91),
            (byte)(color.B * 0.92),
            color.A
        );
    }
}