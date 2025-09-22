package io.ionic.starter.plugins.wallpaper;

import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@CapacitorPlugin(name = "MyWallpaperPlugin")
public class MyWallpaperPlugin extends Plugin {

    private final ExecutorService executor = Executors.newSingleThreadExecutor();

    @PluginMethod
    public void setHomeScreenWallpaper(PluginCall call) {
        String imageUrl = call.getString("url");
        if (imageUrl == null || imageUrl.isEmpty()) {
            call.reject("url is required");
            return;
        }
        try {
            String srcType = imageUrl.startsWith("data:") ? "data" : imageUrl.startsWith("http") ? "http" : imageUrl.startsWith("content:") ? "content" : imageUrl.startsWith("file:") ? "file" : "other";
            Log.d("MyWallpaperPlugin", "setHomeScreenWallpaper request srcType=" + srcType + ", len=" + imageUrl.length());
        } catch (Exception ignore) {}
        executor.execute(() -> {
            try {
                WallpaperSetter setter = new WallpaperSetter();
                WallpaperSetter.Result result = setter.setHome(getContext(), imageUrl);
                getActivity().runOnUiThread(() -> {
                    if (result.success) {
                        JSObject ret = new JSObject();
                        ret.put("status", "ok");
                        call.resolve(ret);
                    } else {
                        Log.e("MyWallpaperPlugin", "setHome failed code=" + result.code + ", message=" + result.message);
                        call.reject(result.message != null ? result.message : "failed", result.code);
                    }
                });
            } catch (Exception e) {
                Log.e("MyWallpaperPlugin", "setHome error", e);
                getActivity().runOnUiThread(() -> call.reject(e.getMessage() != null ? e.getMessage() : "unknown error"));
            }
        });
    }

    @PluginMethod
    public void setLockScreenWallpaper(PluginCall call) {
        String imageUrl = call.getString("url");
        if (imageUrl == null || imageUrl.isEmpty()) {
            call.reject("url is required");
            return;
        }
        try {
            String srcType = imageUrl.startsWith("data:") ? "data" : imageUrl.startsWith("http") ? "http" : imageUrl.startsWith("content:") ? "content" : imageUrl.startsWith("file:") ? "file" : "other";
            Log.d("MyWallpaperPlugin", "setLockScreenWallpaper request srcType=" + srcType + ", len=" + imageUrl.length());
        } catch (Exception ignore) {}
        executor.execute(() -> {
            try {
                WallpaperSetter setter = new WallpaperSetter();
                WallpaperSetter.Result result = setter.setLock(getContext(), imageUrl);
                getActivity().runOnUiThread(() -> {
                    if (result.success) {
                        JSObject ret = new JSObject();
                        ret.put("status", "ok");
                        call.resolve(ret);
                    } else {
                        Log.e("MyWallpaperPlugin", "setLock failed code=" + result.code + ", message=" + result.message);
                        call.reject(result.message != null ? result.message : "failed", result.code);
                    }
                });
            } catch (Exception e) {
                Log.e("MyWallpaperPlugin", "setLock error", e);
                getActivity().runOnUiThread(() -> call.reject(e.getMessage() != null ? e.getMessage() : "unknown error"));
            }
        });
    }
}
