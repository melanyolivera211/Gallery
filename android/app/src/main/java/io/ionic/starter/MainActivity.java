package io.ionic.starter;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import io.ionic.starter.plugins.wallpaper.MyWallpaperPlugin;

public class MainActivity extends BridgeActivity {
		@Override
		public void onCreate(Bundle savedInstanceState) {
			super.onCreate(savedInstanceState);
			registerPlugin(MyWallpaperPlugin.class);
		}
}
