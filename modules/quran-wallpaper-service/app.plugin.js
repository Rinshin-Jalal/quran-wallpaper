const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withQuranWallpaper(config) {
  return withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults.manifest;

    // Add permissions
    androidManifest["uses-permission"] =
      androidManifest["uses-permission"] || [];
    androidManifest["uses-permission"].push(
      { $: { "android:name": "android.permission.SET_WALLPAPER" } },
      { $: { "android:name": "android.permission.BIND_WALLPAPER" } },
      { $: { "android:name": "android.permission.INTERNET" } }
    );

    // Add WallpaperService
    const application = androidManifest.application[0];
    application.service = application.service || [];
    application.service.push({
      $: {
        "android:name":
          "expo.modules.quranwallpaperservice.QuranWallpaperService",
        "android:permission": "android.permission.BIND_WALLPAPER",
        "android:exported": "true",
      },
      "intent-filter": [
        {
          action: [
            {
              $: {
                "android:name": "android.service.wallpaper.WallpaperService",
              },
            },
          ],
        },
      ],
      "meta-data": [
        {
          $: {
            "android:name": "android.service.wallpaper",
            "android:resource": "@xml/wallpaper",
          },
        },
      ],
    });

    return config;
  });
};
