package expo.modules.quranwallpaperservice

import android.content.Context
import android.content.SharedPreferences
import android.content.Intent
import android.content.ComponentName
import android.app.WallpaperManager
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class QuranWallpaperServiceModule : Module() {

    // Safe non-null Android Context accessor
    private val context: Context
        get() = appContext.reactContext?.applicationContext
        ?: throw IllegalStateException("React context not available")

    private fun getPreferences(): SharedPreferences {
        return context.getSharedPreferences(
            "${context.packageName}.quran_wallpaper",
            Context.MODE_PRIVATE
        )
    }

    override fun definition() = ModuleDefinition {
        Name("QuranWallpaperService")

        Events("onVerseChanged")

        Function("setSurahData") { surahId: Int, verses: String, start: Int, end: Int ->
            val prefs = getPreferences()
            prefs.edit()
                .putInt("current_surah_id", surahId)
                .putString("verses_data", verses)
                .putInt("current_verse_index", 0)
                .putInt("start_verse", start)
                .putInt("end_verse", end)
                .apply()

            sendEvent("onVerseChanged", mapOf("surahId" to surahId, "verseIndex" to 0))
        }

        Function("getSurahData") {
            val prefs = getPreferences()
            mapOf(
                "surahId" to prefs.getInt("current_surah_id", -1),
                "versesData" to (prefs.getString("verses_data", "[]") ?: "[]"),
                "currentIndex" to prefs.getInt("current_verse_index", 0)
            )
        }

        Function("startWallpaperService") {
            getPreferences().edit().putBoolean("service_active", true).apply()
            true
        }

        Function("setWallpaperConfig") { configJson: String ->
            val prefs = getPreferences()
            prefs.edit()
                .putString("wallpaper_config", configJson)
                .apply()
        }

        Function("setLiveWallpaper") {
            val intent = Intent(WallpaperManager.ACTION_CHANGE_LIVE_WALLPAPER).apply {
                putExtra(
                    WallpaperManager.EXTRA_LIVE_WALLPAPER_COMPONENT,
                    ComponentName(context, QuranWallpaperService::class.java)
                )
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            context.startActivity(intent)
        }
    }
}
