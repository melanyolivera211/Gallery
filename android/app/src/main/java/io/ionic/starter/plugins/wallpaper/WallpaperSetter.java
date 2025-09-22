package io.ionic.starter.plugins.wallpaper;

import android.app.WallpaperManager;
import android.content.ContentResolver;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Build;
import android.util.Base64;
import android.util.DisplayMetrics;
import android.util.Log;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class WallpaperSetter {

    public static class Result {
        public boolean success;
        public String code;
        public String message;
        public Result(boolean success, String code, String message) {
            this.success = success;
            this.code = code;
            this.message = message;
        }
        public static Result ok() { return new Result(true, null, null); }
        public static Result error(String code, String message) { return new Result(false, code, message); }
    }

    public Result setHome(Context ctx, String source) {
        return set(ctx, source, false);
    }

    public Result setLock(Context ctx, String source) {
        return set(ctx, source, true);
    }

    private Result set(Context ctx, String source, boolean lock) {
        WallpaperManager wm = WallpaperManager.getInstance(ctx);
        Bitmap bitmap = null;
        try {
            bitmap = loadBitmap(ctx, source);
            if (bitmap == null) {
                return Result.error("decode-failed", "Could not decode image");
            }

            // Scale & crop to screen size
            DisplayMetrics dm = ctx.getResources().getDisplayMetrics();
            int targetW = dm.widthPixels;
            int targetH = dm.heightPixels;
            if (targetW > 0 && targetH > 0) {
                Bitmap processed = centerCrop(bitmap, targetW, targetH);
                if (processed != null) {
                    if (processed != bitmap && !bitmap.isRecycled()) bitmap.recycle();
                    bitmap = processed;
                }
            }

            // Compress and use stream (works better on some OEMs)
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            bitmap.compress(Bitmap.CompressFormat.JPEG, 90, baos);
            byte[] jpg = baos.toByteArray();
            ByteArrayInputStream bais = new ByteArrayInputStream(jpg);

            if (lock) {
                if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
                    return Result.error("unsupported", "Lock screen wallpaper requires Android 7.0+");
                }
                wm.setStream(bais, null, true, WallpaperManager.FLAG_LOCK);
            } else {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                    wm.setStream(bais, null, true, WallpaperManager.FLAG_SYSTEM);
                } else {
                    wm.setStream(bais);
                }
            }
            return Result.ok();
        } catch (Exception e) {
            Log.e("WallpaperSetter", "apply error", e);
            return Result.error("apply-failed", e.getMessage());
        } finally {
            if (bitmap != null && !bitmap.isRecycled()) {
                bitmap.recycle();
            }
        }
    }

    private Bitmap loadBitmap(Context ctx, String source) throws IOException {
        if (source == null) return null;
        try {
            if (source.startsWith("data:image")) {
                int comma = source.indexOf(',');
                String b64 = comma >= 0 ? source.substring(comma + 1) : source;
                byte[] data = Base64.decode(b64, Base64.DEFAULT);
                return decodeSampledFromBytes(data, ctx);
            }
            if (isBase64(source)) {
                byte[] data = Base64.decode(source, Base64.DEFAULT);
                return decodeSampledFromBytes(data, ctx);
            }
            if (source.startsWith("http://") || source.startsWith("https://")) {
                InputStream is = download(source);
                if (is == null) return null;
                try {
                    byte[] bytes = readAll(is);
                    return decodeSampledFromBytes(bytes, ctx);
                } finally {
                    is.close();
                }
            }
            Uri uri = Uri.parse(source);
            ContentResolver cr = ctx.getContentResolver();
            InputStream is = cr.openInputStream(uri);
            if (is == null) return null;
            try {
                byte[] bytes = readAll(is);
                return decodeSampledFromBytes(bytes, ctx);
            } finally {
                is.close();
            }
        } catch (IllegalArgumentException iae) {
            return null;
        }
    }

    private boolean isBase64(String s) {
        return s.matches("[A-Za-z0-9+/=\n\r]+") && s.length() > 100;
    }

    private InputStream download(String urlStr) {
        try {
            URL url = new URL(urlStr);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setConnectTimeout(15000);
            conn.setReadTimeout(20000);
            conn.setInstanceFollowRedirects(true);
            conn.setDoInput(true);
            conn.connect();
            int code = conn.getResponseCode();
            if (code >= 200 && code < 300) {
                return conn.getInputStream();
            }
        } catch (Exception ignored) {}
        return null;
    }

    private byte[] readAll(InputStream is) throws IOException {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        byte[] data = new byte[16 * 1024];
        int nRead;
        while ((nRead = is.read(data, 0, data.length)) != -1) {
            buffer.write(data, 0, nRead);
        }
        return buffer.toByteArray();
    }

    private Bitmap decodeSampledFromBytes(byte[] bytes, Context ctx) {
        DisplayMetrics dm = ctx.getResources().getDisplayMetrics();
        int reqWidth = Math.max(dm.widthPixels, 1080);
        int reqHeight = Math.max(dm.heightPixels, 1920);

        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;
        BitmapFactory.decodeByteArray(bytes, 0, bytes.length, options);

        options.inSampleSize = calculateInSampleSize(options, reqWidth, reqHeight);

        options.inJustDecodeBounds = false;
        options.inPreferredConfig = Bitmap.Config.RGB_565;
        try {
            return BitmapFactory.decodeByteArray(bytes, 0, bytes.length, options);
        } catch (OutOfMemoryError e) {
            options.inSampleSize = Math.max(2, options.inSampleSize * 2);
            try {
                return BitmapFactory.decodeByteArray(bytes, 0, bytes.length, options);
            } catch (OutOfMemoryError e2) {
                return null;
            }
        }
    }

    private int calculateInSampleSize(BitmapFactory.Options options, int reqWidth, int reqHeight) {
        int height = options.outHeight;
        int width = options.outWidth;
        int inSampleSize = 1;

        if (height > reqHeight || width > reqWidth) {
            final int halfHeight = height / 2;
            final int halfWidth = width / 2;

            while ((halfHeight / inSampleSize) >= reqHeight && (halfWidth / inSampleSize) >= reqWidth) {
                inSampleSize *= 2;
            }
        }
        return Math.max(1, inSampleSize);
    }

    private Bitmap centerCrop(Bitmap src, int targetW, int targetH) {
        try {
            float scale;
            int srcW = src.getWidth();
            int srcH = src.getHeight();
            if (srcW <= 0 || srcH <= 0 || targetW <= 0 || targetH <= 0) return src;

            float scaleX = (float) targetW / srcW;
            float scaleY = (float) targetH / srcH;
            scale = Math.max(scaleX, scaleY);
            int scaledW = Math.round(scale * srcW);
            int scaledH = Math.round(scale * srcH);

            Bitmap scaled = Bitmap.createScaledBitmap(src, Math.max(1, scaledW), Math.max(1, scaledH), true);
            int x = Math.max(0, (scaled.getWidth() - targetW) / 2);
            int y = Math.max(0, (scaled.getHeight() - targetH) / 2);
            Bitmap cropped = Bitmap.createBitmap(scaled, x, y, Math.min(targetW, scaled.getWidth() - x), Math.min(targetH, scaled.getHeight() - y));
            if (scaled != src && !scaled.isRecycled()) scaled.recycle();
            return cropped;
        } catch (Throwable t) {
            Log.e("WallpaperSetter", "centerCrop failed", t);
            return src;
        }
    }
}
