import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Sparkles, Copy, Check, Lightbulb, Video, RefreshCw, Layers } from 'lucide-react';

export default function HookGenerator() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('TikTok / Reels');
  const [contentType, setContentType] = useState('تعليمي / تثقيفي');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [error, setError] = useState('');

  const generateHooksAndIdeas = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('يرجى إدخال موضوع المحتوى.');
      return;
    }
    
    // استخدام المفتاح المدخل أو المفتاح المخزن في متغيرات البيئة
    const keyToUse = apiKey.trim() || process.env.REACT_APP_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!keyToUse) {
      setError('يرجى إدخال مفتاح Gemini API للبدء.');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const ai = new GoogleGenAI({ apiKey: keyToUse });

      const prompt = `
أنت خبير في صناعة المحتوى الرقمي والتسويق عبر شبكات التواصل الاجتماعي.
قم بإنشاء أفكار وسيناريوهات خطافية (Hooks) جذابة لمقطع فيديو بناءً على التفاصيل التالية:
- موضوع الفيديو: "${topic}"
- المنصة المستهدفة: "${platform}"
- نوع المحتوى: "${contentType}"

قم بالرد بصيغة JSON حصرية بدون أي نصوص زائدة بنفس هذا التنسيق بالضبط:
{
  "hooks": [
    {
      "hook": "الخطاف الأول الذي يقال في أول 3 ثواني لإثارة الفضول",
      "visual_idea": "وصف الفكرة البصرية أو المشهد الذي يُعرض في الشاشة خلال الخطاف",
      "script_outline": "ملخص سريع لسيناريو باقي الفيديو (3 نقاط)"
    },
    {
      "hook": "الخطاف الثاني المباشر والجريء",
      "visual_idea": "وصف البصريات للمشهد",
      "script_outline": "ملخص النقاط الأساسية"
    },
    {
      "hook": "الخطاف الثالث القائم على السؤال أو التحدي",
      "visual_idea": "وصف البصريات للمشهد",
      "script_outline": "ملخص النقاط الأساسية"
    }
  ],
  "suggested_titles": ["عنوان جذاب 1", "عنوان جذاب 2", "عنوان جذاب 3"]
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsedData = JSON.parse(response.text);
      setResults(parsedData);
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء الاتصال بـ Gemini API. تأكد من صحة المفتاح والمحاولة مجدداً.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 font-sans dir-rtl" dir="rtl">
      <div className="max-w-4xl mx-auto">
        
        {/* الهيدر */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>مدعوم بالذكاء الاصطناعي (Gemini 2.5 Flash)</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3 text-white tracking-tight">
            مولد الخطافات والأفكار لصناع المحتوى
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
            احصل على أفضل 3 ثوانٍ أُولى لمقاطعك لزيادة نسبة المشاهدة والاحتفاظ بالجمهور على مختلف المنصات.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* نموذج إدخال البيانات */}
          <div className="lg:col-span-5 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 shadow-xl backdrop-blur-sm h-fit">
            <form onSubmit={generateHooksAndIdeas} className="space-y-5">
              
              {/* إدخال المفتاح (اختياري إذا تم وضعه في .env) */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Gemini API Key (اختياري إذا كان معرّفاً في البيئة):
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* موضوع الفيديو */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  موضوع الفيديو أو الفكرة الأساسية <span className="text-indigo-400">*</span>
                </label>
                <textarea
                  required
                  rows="3"
                  placeholder="مثال: كيف تبدأ التداول للمبتدئين، أو 5 أدوات ذكاء اصطناعي ستوفر وقتك..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition resize-none"
                />
              </div>

              {/* اختيار المنصة */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  المنصة المستهدفة
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
                >
                  <option>TikTok / Reels / Shorts</option>
                  <option>YouTube (فيديو طويل)</option>
                  <option>X (Twitter) Video</option>
                  <option>LinkedIn Video</option>
                </select>
              </div>

              {/* نوع المحتوى */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  أسلوب المحتوى
                </label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
                >
                  <option>تعليمي / تثقيفي</option>
                  <option>ترفيهي / قصة (Storytelling)</option>
                  <option>تحدي / تجربة</option>
                  <option>ترويجي / بيع منتج</option>
                  <option>تحفيزي / مناقشة رأي</option>
                </select>
              </div>

              {/* رسالة الخطأ */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
                  {error}
                </div>
              )}

              {/* زر التوليد */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:bg-slate-700 text-white font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>جاري جلب الأفكار...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>توليد الخطافات والسيناريو</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* عرض النتائج */}
          <div className="lg:col-span-7 space-y-6">
            {!results && !loading && (
              <div className="bg-slate-800/40 border border-dashed border-slate-700/80 rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[350px]">
                <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center mb-4 text-slate-400">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-300 mb-1">جاهز لابتكار المحتوى؟</h3>
                <p className="text-slate-500 text-sm max-w-sm">
                  أدخل موضوع الفيديو واضغط على "توليد الخطافات" للحصول على اقتراحات احترافية تجذب المتابعين.
                </p>
              </div>
            )}

            {loading && (
              <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[350px] space-y-4">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 text-sm animate-pulse">يقوم الذكاء الاصطناعي بتحليل موضوعك وصياغة أفضل الخطافات...</p>
              </div>
            )}

            {results && !loading && (
              <div className="space-y-6">
                
                {/* قائمة الخطافات */}
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                    <Video className="w-5 h-5 text-indigo-400" />
                    <span>الخطافات المقترحة (Hooks)</span>
                  </h2>

                  {results.hooks.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-2xl p-5 transition space-y-3 relative group"
                    >
                      {/* الزر السريع للنسخ */}
                      <button
                        onClick={() => handleCopy(`${item.hook}\n\nالمشهد البصري: ${item.visual_idea}`, idx)}
                        className="absolute top-4 left-4 p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition flex items-center gap-1 text-xs"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400">تم النسخ</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>نسخ</span>
                          </>
                        )}
                      </button>

                      {/* الكلام المنطوق */}
                      <div>
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                          الخطاف الكلامي #{idx + 1}
                        </span>
                        <p className="text-base font-bold text-white pl-12 leading-relaxed">
                          "{item.hook}"
                        </p>
                      </div>

                      {/* المشهد البصري */}
                      <div className="bg-slate-900/60 rounded-xl p-3 text-xs text-slate-300 border border-slate-800">
                        <strong className="text-indigo-300 block mb-1">💡 الفكرة البصرية (المشهد الأول):</strong>
                        {item.visual_idea}
                      </div>

                      {/* نقاط السيناريو */}
                      <div className="text-xs text-slate-400 pt-1">
                        <strong className="block text-slate-300 mb-1">📝 ملخص النقاط التالية:</strong>
                        <p className="whitespace-pre-line leading-normal">{item.script_outline}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* العناوين المقترحة */}
                {results.suggested_titles && (
                  <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-3">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      <span>عناوين مقترحة للفيديو (Titles)</span>
                    </h3>
                    <ul className="space-y-2">
                      {results.suggested_titles.map((title, i) => (
                        <li key={i} className="text-sm text-slate-300 flex items-center gap-2 bg-slate-900/40 p-2.5 rounded-xl">
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                          <span>{title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
