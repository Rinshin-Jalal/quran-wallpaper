package expo.modules.quranwallpaperservice

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Typeface
import android.service.wallpaper.WallpaperService
import android.text.StaticLayout
import android.text.TextPaint
import android.view.SurfaceHolder
import org.json.JSONArray
import android.text.Layout
import android.text.TextDirectionHeuristics


class QuranWallpaperService : WallpaperService() {
    override fun onCreateEngine(): Engine = QuranWallpaperEngine()
    
    inner class QuranWallpaperEngine : Engine() {
        private lateinit var receiver: ScreenStateReceiver
        private val arabicPaint = TextPaint().apply {
            color = Color.WHITE
            textSize = 48f
            isAntiAlias = true
            textAlign = Paint.Align.RIGHT
        }
        
        private val translationPaint = TextPaint().apply {
            color = Color.WHITE
            textSize = 32f
            isAntiAlias = true
        }
        
        override fun onCreate(surfaceHolder: SurfaceHolder) {
            super.onCreate(surfaceHolder)
            
            receiver = ScreenStateReceiver(this)
            val filter = IntentFilter(Intent.ACTION_SCREEN_ON)
            registerReceiver(receiver, filter)
        }
        
        override fun onDestroy() {
            super.onDestroy()
            try {
                unregisterReceiver(receiver)
            } catch (e: Exception) {
                // Already unregistered
            }
        }
        
        fun drawVerse() {
    val holder = surfaceHolder
    var canvas: Canvas? = null

    try {
        canvas = holder.lockCanvas()
        canvas?.let { c ->
            // White background
            c.drawColor(Color.WHITE)

            val prefs = applicationContext.getSharedPreferences(
                "${applicationContext.packageName}.quran_wallpaper",
                Context.MODE_PRIVATE
            )

            val versesJson = prefs.getString("verses_data", "[]") ?: "[]"
            val currentIndex = prefs.getInt("current_verse_index", 0)

            val verses = JSONArray(versesJson)
            if (verses.length() > 0) {
                val verse = verses.getJSONObject(currentIndex % verses.length())
                val arabicText = verse.optString("text_uthmani", verse.optString("text", ""))
                val translation = verse.optString("translation", "")

                // Paint for Arabic text (centered)
                val arabicPaint = TextPaint().apply {
                    color = Color.BLACK
                    textSize = 48f
                    isAntiAlias = true
                    textAlign = Paint.Align.CENTER
                }

                // Paint for translation (below Arabic)
                val translationPaint = TextPaint().apply {
                    color = Color.DKGRAY
                    textSize = 32f
                    isAntiAlias = true
                    textAlign = Paint.Align.CENTER
                }

                // Draw Arabic verse using StaticLayout with right-to-left text
                val arabicLayout = StaticLayout.Builder.obtain(
                    arabicText, 0, arabicText.length, arabicPaint, c.width - 100
                ).setAlignment(Layout.Alignment.ALIGN_CENTER)
                 .setTextDirection(TextDirectionHeuristics.RTL)
                 .build()

                c.save()
                c.translate(c.width / 2f, c.height / 2f - arabicLayout.height / 2f - 20f)
                arabicLayout.draw(c)
                c.restore()

                // Draw translation below Arabic text
                if (translation.isNotEmpty()) {
                    val translationLayout = StaticLayout.Builder.obtain(
                        translation, 0, translation.length, translationPaint, c.width - 100
                    ).setAlignment(Layout.Alignment.ALIGN_CENTER).build()

                    c.save()
                    c.translate(c.width / 2f, c.height / 2f + arabicLayout.height / 2f)
                    translationLayout.draw(c)
                    c.restore()
                }

                // Increment verse index and save
                prefs.edit()
                    .putInt("current_verse_index", (currentIndex + 1) % verses.length())
                    .apply()
            }
        }
    } finally {
        canvas?.let { holder.unlockCanvasAndPost(it) }
    }
}

    }
    
    inner class ScreenStateReceiver(
        private val engine: QuranWallpaperEngine
    ) : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            if (intent.action == Intent.ACTION_SCREEN_ON) {
                engine.drawVerse()
            }
        }
    }
}
