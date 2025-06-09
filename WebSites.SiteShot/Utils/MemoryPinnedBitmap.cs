using System.Runtime.InteropServices;
using SkiaSharp;

namespace WebSites.SiteShot.Utils;

internal class MemoryPinnedBitmap : IDisposable
{
    private SKBitmap Bitmap { get; }
    private int[] Bits { get; }
    private bool Disposed { get; set; }
    private GCHandle BitsHandle { get; }

    public MemoryPinnedBitmap(byte[] byteArray)
    {
        var skBitmap = SKBitmap.Decode(byteArray);

        Width = skBitmap.Width;
        Height = skBitmap.Height;

        Bits = new int[Width * Height];
        BitsHandle = GCHandle.Alloc(Bits, GCHandleType.Pinned);
        Bitmap = CreateAndInitializeBitmap(Width, Height, BitsHandle);

        DrawBitmap(skBitmap, Bitmap, Width, Height);
    }

    public MemoryPinnedBitmap(int width, int height)
    {
        Width = width;
        Height = height;

        Bits = new int[Width * Height];
        BitsHandle = GCHandle.Alloc(Bits, GCHandleType.Pinned);
        Bitmap = CreateAndInitializeBitmap(width, height, BitsHandle);
    }

    private static SKBitmap CreateBitmap(int width, int height)
    {
        return new SKBitmap(new SKImageInfo(width, height, SKImageInfo.PlatformColorType, SKAlphaType.Unpremul));
    }

    private static void InitializeBitmapPixels(SKBitmap bitmap, GCHandle bitsHandle)
    {
        bitmap.InstallPixels(bitmap.Info, bitsHandle.AddrOfPinnedObject(), bitmap.Info.RowBytes);
    }

    private static SKBitmap CreateAndInitializeBitmap(int width, int height, GCHandle bitsHandle)
    {
        var bitmap = CreateBitmap(width, height);
        InitializeBitmapPixels(bitmap, bitsHandle);
        return bitmap;
    }

    private static void DrawBitmap(SKBitmap skBitmap, SKBitmap targetBitmap, int width, int height)
    {
        var rect = new SKRect(0, 0, width, height);

        using var canvas = new SKCanvas(targetBitmap);
        canvas.DrawBitmap(skBitmap, rect, rect);
        canvas.Flush();
    }

    public int Height { get; }
    public int Width { get; }
    public void SetPixelColor(int x, int y, PixelColor pixelColor) => Bits[x + y * Width] = pixelColor.RawData;

    public PixelColor GetPixelColor(int x, int y) => x < 0 || x >= Width || y < 0 || y >= Height
        ? PixelColor.Empty
        : new PixelColor(Bits[x + y * Width]);

    public byte[] GetByteArrayAndDispose()
    {
        try
        {
            return Bitmap.Encode(SKEncodedImageFormat.Png, 100).ToArray();
        }
        finally
        {
            Dispose();
        }
    }

    public void Dispose()
    {
        if (Disposed)
            return;

        Disposed = true;
        Bitmap.Dispose();
        BitsHandle.Free();
    }
}