import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { chatbotService } from '../../services/chatbotService';
import Button from '../common/Button';
import toast from 'react-hot-toast';

export default function SummarizationTab() {
  const [text, setText] = useState('');
  const [maxLength, setMaxLength] = useState(150);
  const [minLength, setMinLength] = useState(50);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!text.trim()) {
      toast.error('Please enter text to summarize');
      return;
    }

    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount < 50) {
      toast.error('Text must be at least 50 words long');
      return;
    }

    setLoading(true);
    try {
      const response = await chatbotService.summarize(text, maxLength, minLength);
      setResult(response);
      toast.success('Summarization completed!');
    } catch (error) {
      toast.error('Summarization failed. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const wordCount = text.trim().split(/\s+/).filter(w => w).length;

  return (
    <div className="space-y-6">
      {/* Input Text */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Text to Summarize
          </label>
          <span className="text-xs text-gray-500">
            {wordCount} words {wordCount < 50 && '(minimum 50 words)'}
          </span>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter a long text to summarize (minimum 50 words)..."
          className="input-field resize-none"
          rows={10}
        />
      </div>

      {/* Length Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Length: {minLength}
          </label>
          <input
            type="range"
            min="30"
            max="100"
            value={minLength}
            onChange={(e) => setMinLength(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Length: {maxLength}
          </label>
          <input
            type="range"
            min="100"
            max="300"
            value={maxLength}
            onChange={(e) => setMaxLength(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Summarize Button */}
      <Button
        onClick={handleSummarize}
        disabled={loading || wordCount < 50}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Summarizing...
          </>
        ) : (
          'Summarize'
        )}
      </Button>

      {/* Result */}
      {result && (
        <div className="card bg-green-50 border-green-200">
          <div className="flex items-start justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">Summary</h4>
            <div className="text-xs text-gray-500 text-right">
              <div>{result.original_word_count} words → {result.summary_word_count} words</div>
              <div className="text-green-600 font-medium">
                {Math.round((1 - result.summary_length / result.original_length) * 100)}% shorter
              </div>
            </div>
          </div>
          <p className="text-gray-900 text-lg leading-relaxed">
            {result.summary}
          </p>
        </div>
      )}
    </div>
  );
}