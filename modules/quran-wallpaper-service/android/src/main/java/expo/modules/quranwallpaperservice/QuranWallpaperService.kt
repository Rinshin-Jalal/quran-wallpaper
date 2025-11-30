package expo.modules.quranwallpaperservice

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.service.wallpaper.WallpaperService
import android.text.Layout
import android.text.StaticLayout
import android.text.TextDirectionHeuristics
import android.text.TextPaint
import android.view.SurfaceHolder
import org.json.JSONArray
import org.json.JSONObject

class QuranWallpaperService : WallpaperService() {
    override fun onCreateEngine(): Engine = QuranWallpaperEngine()

    inner class QuranWallpaperEngine : Engine() {
        private lateinit var receiver: ScreenStateReceiver
        private val arabicPaint =
                TextPaint().apply {
                    color = Color.WHITE
                    textSize = 48f
                    isAntiAlias = true
                    textAlign = Paint.Align.RIGHT
                }

        private val translationPaint =
                TextPaint().apply {
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
                    val prefs =
                            applicationContext.getSharedPreferences(
                                    "${applicationContext.packageName}.quran_wallpaper",
                                    Context.MODE_PRIVATE
                            )

                    // Get wallpaper config with BLACK as default
                    val configJson = prefs.getString("wallpaper_config", null)
                    val config = if (configJson != null) {
                        try {
                            JSONObject(configJson)
                        } catch (e: Exception) {
                            null
                        }
                    } else null

                    val backgroundColor = config?.optString("backgroundColor", "#000000") ?: "#000000"
                    val arabicTextColor = config?.optString("arabicTextColor", "#FFFFFF") ?: "#FFFFFF"
                    val translationTextColor = config?.optString("translationTextColor", "#AAAAAA") ?: "#AAAAAA"
                    val arabicFontSize = config?.optDouble("arabicFontSize", 60.0)?.toFloat() ?: 60f
                    val translationFontSize = config?.optDouble("translationFontSize", 36.0)?.toFloat() ?: 36f
                    val textPosition = config?.optString("textPosition", "bottom") ?: "bottom"

                    // Background color (BLACK by default)
                    c.drawColor(Color.parseColor(backgroundColor))

                    val versesJson = prefs.getString("verses_data", "[]") ?: "[]"
                    val currentIndex = prefs.getInt("current_verse_index", 0)
                    val startVerse = prefs.getInt("start_verse", 0)
                    val endVerse = prefs.getInt("end_verse", 0)

                    val verses = JSONArray(versesJson)
                    if (verses.length() > 0) {
                        // Calculate total verses in range (inclusive)
                        val validStart = maxOf(0, minOf(startVerse, verses.length() - 1))
                        val validEnd = maxOf(validStart, minOf(endVerse, verses.length() - 1))

                        // Number of verses in range (inclusive)
                        val versesInRange = validEnd - validStart + 1

                        if (versesInRange > 0) {
                            val positionInRange = currentIndex % versesInRange

                            // Actual verse index in full array
                            val verseIndex = validStart + positionInRange

                            val verse = verses.getJSONObject(verseIndex)
                            val arabicText =
                                    verse.optString("text_uthmani", verse.optString("text", ""))
                            val translation = verse.optString("translation", "")

                            // Paint for Arabic text (right aligned, larger line spacing)
                            val arabicPaintLocal =
                                    TextPaint().apply {
                                        color = Color.parseColor(arabicTextColor)
                                        textSize = arabicFontSize
                                        isAntiAlias = true
                                        textAlign = Paint.Align.RIGHT
                                    }

                            // Paint for translation (right aligned)
                            val translationPaintLocal =
                                    TextPaint().apply {
                                        color = Color.parseColor(translationTextColor)
                                        textSize = translationFontSize
                                        isAntiAlias = true
                                        textAlign = Paint.Align.RIGHT
                                    }

                            // Width for text (right side padding)
                            val textWidth = c.width * 0.85f

                            // Draw Arabic verse - RIGHT ALIGNED
                            val arabicLayout =
                                    StaticLayout.Builder.obtain(
                                                    arabicText,
                                                    0,
                                                    arabicText.length,
                                                    arabicPaintLocal,
                                                    textWidth.toInt()
                                            )
                                            .setAlignment(
                                                    Layout.Alignment.ALIGN_OPPOSITE
                                            ) // Right align
                                            .setLineSpacing(
                                                    8f,
                                                    1.4f
                                            ) // Increased line height (spacing, multiplier)
                                            .setTextDirection(TextDirectionHeuristics.RTL)
                                            .build()

                            // Calculate startY based on position setting
                            val translationHeight = if (translation.isNotEmpty()) {
                                val translationLayout =
                                        StaticLayout.Builder.obtain(
                                                        translation,
                                                        0,
                                                        translation.length,
                                                        translationPaintLocal,
                                                        textWidth.toInt()
                                                )
                                                .setAlignment(Layout.Alignment.ALIGN_OPPOSITE)
                                                .setLineSpacing(6f, 1.3f)
                                                .build()
                                translationLayout.height + 20f
                            } else 0f

                            val totalTextHeight = arabicLayout.height + translationHeight
                            
                            val startY = when (textPosition) {
                                "top" -> 100f
                                "center" -> (c.height - totalTextHeight) / 2f
                                else -> c.height - totalTextHeight - 300f // bottom (default)
                            }

                            // Draw Arabic text
                            c.save()
                            c.translate(
                                    c.width - 40f, // Right margin
                                    startY
                            )
                            arabicLayout.draw(c)
                            c.restore()

                            // Draw translation below Arabic - RIGHT ALIGNED
                            if (translation.isNotEmpty()) {
                                val translationLayout =
                                        StaticLayout.Builder.obtain(
                                                        translation,
                                                        0,
                                                        translation.length,
                                                        translationPaintLocal,
                                                        textWidth.toInt()
                                                )
                                                .setAlignment(
                                                        Layout.Alignment.ALIGN_OPPOSITE
                                                ) // Right align
                                                .setLineSpacing(
                                                        6f,
                                                        1.3f
                                                ) // Line spacing for translation
                                                .build()

                                c.save()
                                c.translate(
                                        c.width - 40f, // Same right alignment as Arabic
                                        startY + arabicLayout.height + 20f // Below Arabic
                                )
                                translationLayout.draw(c)
                                c.restore()
                            }

                            // Increment verse index within range only and save
                            prefs.edit().putInt("current_verse_index", (currentIndex + 1)).apply()
                        }
                    }
                }
            } finally {
                canvas?.let { holder.unlockCanvasAndPost(it) }
            }
        }
    }

    inner class ScreenStateReceiver(private val engine: QuranWallpaperEngine) :
            BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            if (intent.action == Intent.ACTION_SCREEN_ON) {
                engine.drawVerse()
            }
        }
    }
}
