namespace WebSites.SiteShot.Utils;

public readonly struct PixelColor
{
    public int RawData { get; }
    public byte R { get; }
    public byte G { get; }
    public byte B { get; }
    public byte A { get; }

    public static readonly PixelColor Empty = new(0, 0, 0, 0);

    public PixelColor(int rawData)
    {
        RawData = rawData;
        A = (byte)((rawData >> 24) & 0xFF);
        R = (byte)((rawData >> 16) & 0xFF);
        G = (byte)((rawData >> 8) & 0xFF);
        B = (byte)(rawData & 0xFF);
    }

    public PixelColor(byte red, byte green, byte blue, byte alpha = 255)
    {
        R = red;
        G = green;
        B = blue;
        A = alpha;

        RawData = (alpha << 24) | (red << 16) | (green << 8) | blue;
    }

    public override string ToString() => $"ARGB({A}, {R}, {G}, {B})";

    public bool Equals(PixelColor other) => RawData == other.RawData;

    public bool IsSimilarTo(PixelColor other, int threshold)
    {
        var redDiff = Math.Abs(R - other.R);
        var greenDiff = Math.Abs(G - other.G);
        var blueDiff = Math.Abs(B - other.B);

        return redDiff <= threshold && greenDiff <= threshold && blueDiff <= threshold;
    }
}