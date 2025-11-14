import { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { chatbotService } from '../../services/chatbotService';
import { LANGUAGE_CODES } from '../../utils/constants';
import Button from '../common/Button';
import toast from 'react-hot-toast';

export default function TranslationTab() {
  const [text, setText] = useState('');
  const [sourceLang, setSourceLang] = useState('en_XX');
  const [targetLang, setTargetLang] = useState('fr_XX');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!text.trim()) {
      toast.error('Please enter text to translate');
      return;
    }

    setLoading(true);
    try {
      const response = await chatbotService.translate(text, sourceLang, targetLang);
      setResult(response);
      toast.success('Translation completed!');
    } catch (error) {
      toast.error('Translation failed. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    if (result) {
      setText(result.translated_text);
      setResult(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Language Selection */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From
          </label>
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="input-field"
          >
            {Object.entries(LANGUAGE_CODES).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSwapLanguages}
          className="mt-6 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Swap languages"
        >
          <ArrowRight className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To
          </label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="input-field"
          >
            {Object.entries(LANGUAGE_CODES).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Input Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text to Translate
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to translate..."
          className="input-field resize-none"
          rows={6}
        />
      </div>

      {/* Translate Button */}
      <Button
        onClick={handleTranslate}
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Translating...
          </>
        ) : (
          'Translate'
        )}
      </Button>

      {/* Result */}
      {result && (
        <div className="card bg-primary-50 border-primary-200">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">Translation Result</h4>
            <span className="text-xs text-gray-500">
              {result.source_language_name} → {result.target_language_name}
            </span>
          </div>
          <p className="text-gray-900 text-lg leading-relaxed">
            {result.translated_text}
          </p>
        </div>
      )}
    </div>
  );
}