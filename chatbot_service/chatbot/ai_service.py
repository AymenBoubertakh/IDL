from transformers import MBartForConditionalGeneration, MBart50TokenizerFast
from transformers import BartForConditionalGeneration, BartTokenizer
import logging

logger = logging.getLogger(__name__)


class AIService:
    """
    AI Service for handling translation and summarization using Hugging Face Transformers
    Models are loaded lazily (on first use) and cached in memory
    """
    
    # Class-level variables to cache models
    _translation_model = None
    _translation_tokenizer = None
    _summarization_model = None
    _summarization_tokenizer = None
    
    # Supported languages for mBART-50
    SUPPORTED_LANGUAGES = {
        'ar_AR': 'Arabic',
        'cs_CZ': 'Czech',
        'de_DE': 'German',
        'en_XX': 'English',
        'es_XX': 'Spanish',
        'et_EE': 'Estonian',
        'fi_FI': 'Finnish',
        'fr_XX': 'French',
        'gu_IN': 'Gujarati',
        'hi_IN': 'Hindi',
        'it_IT': 'Italian',
        'ja_XX': 'Japanese',
        'kk_KZ': 'Kazakh',
        'ko_KR': 'Korean',
        'lt_LT': 'Lithuanian',
        'lv_LV': 'Latvian',
        'my_MM': 'Burmese',
        'ne_NP': 'Nepali',
        'nl_XX': 'Dutch',
        'ro_RO': 'Romanian',
        'ru_RU': 'Russian',
        'si_LK': 'Sinhala',
        'tr_TR': 'Turkish',
        'vi_VN': 'Vietnamese',
        'zh_CN': 'Chinese',
        'af_ZA': 'Afrikaans',
        'az_AZ': 'Azerbaijani',
        'bn_IN': 'Bengali',
        'fa_IR': 'Persian',
        'he_IL': 'Hebrew',
        'hr_HR': 'Croatian',
        'id_ID': 'Indonesian',
        'ka_GE': 'Georgian',
        'km_KH': 'Khmer',
        'mk_MK': 'Macedonian',
        'ml_IN': 'Malayalam',
        'mn_MN': 'Mongolian',
        'mr_IN': 'Marathi',
        'pl_PL': 'Polish',
        'ps_AF': 'Pashto',
        'pt_XX': 'Portuguese',
        'sv_SE': 'Swedish',
        'sw_KE': 'Swahili',
        'ta_IN': 'Tamil',
        'te_IN': 'Telugu',
        'th_TH': 'Thai',
        'tl_XX': 'Tagalog',
        'uk_UA': 'Ukrainian',
        'ur_PK': 'Urdu',
        'xh_ZA': 'Xhosa',
        'gl_ES': 'Galician',
        'sl_SI': 'Slovene',
    }
    
    @classmethod
    def get_supported_languages(cls):
        """Return dictionary of supported languages"""
        return cls.SUPPORTED_LANGUAGES
    
    @classmethod
    def _load_translation_model(cls):
        """
        Load translation model (mBART-50) - lazy loading
        This will download the model on first use (~2.4 GB)
        """
        if cls._translation_model is None:
            logger.info("Loading translation model (mBART-50)... This may take a few minutes on first run.")
            try:
                cls._translation_model = MBartForConditionalGeneration.from_pretrained(
                    "facebook/mbart-large-50-many-to-many-mmt"
                )
                cls._translation_tokenizer = MBart50TokenizerFast.from_pretrained(
                    "facebook/mbart-large-50-many-to-many-mmt"
                )
                logger.info("✅ Translation model loaded successfully!")
            except Exception as e:
                logger.error(f"❌ Error loading translation model: {str(e)}")
                raise
        return cls._translation_model, cls._translation_tokenizer
    
    @classmethod
    def _load_summarization_model(cls):
        """
        Load summarization model (BART) - lazy loading
        This will download the model on first use (~1.6 GB)
        """
        if cls._summarization_model is None:
            logger.info("Loading summarization model (BART)... This may take a few minutes on first run.")
            try:
                cls._summarization_model = BartForConditionalGeneration.from_pretrained(
                    "facebook/bart-large-cnn"
                )
                cls._summarization_tokenizer = BartTokenizer.from_pretrained(
                    "facebook/bart-large-cnn"
                )
                logger.info("✅ Summarization model loaded successfully!")
            except Exception as e:
                logger.error(f"❌ Error loading summarization model: {str(e)}")
                raise
        return cls._summarization_model, cls._summarization_tokenizer
    
    @classmethod
    def translate(cls, text, source_lang, target_lang):
        """
        Translate text from source_lang to target_lang
        
        Args:
            text (str): Text to translate
            source_lang (str): Source language code (e.g., 'en_XX')
            target_lang (str): Target language code (e.g., 'fr_XX')
        
        Returns:
            str: Translated text
        """
        # Validate language codes
        if source_lang not in cls.SUPPORTED_LANGUAGES:
            raise ValueError(f"Unsupported source language: {source_lang}")
        if target_lang not in cls.SUPPORTED_LANGUAGES:
            raise ValueError(f"Unsupported target language: {target_lang}")
        
        # Load model
        model, tokenizer = cls._load_translation_model()
        
        # Set source language
        tokenizer.src_lang = source_lang
        
        # Tokenize
        encoded = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
        
        # Generate translation
        generated_tokens = model.generate(
            **encoded,
            forced_bos_token_id=tokenizer.lang_code_to_id[target_lang],
            max_length=512,
            num_beams=5,
            early_stopping=True
        )
        
        # Decode
        translated_text = tokenizer.batch_decode(generated_tokens, skip_special_tokens=True)[0]
        
        return translated_text
    
    @classmethod
    def summarize(cls, text, max_length=150, min_length=50):
        """
        Summarize text to a medium-length paragraph
        
        Args:
            text (str): Text to summarize
            max_length (int): Maximum length of summary
            min_length (int): Minimum length of summary
        
        Returns:
            str: Summarized text
        """
        # Load model
        model, tokenizer = cls._load_summarization_model()
        
        # Tokenize
        inputs = tokenizer(text, return_tensors="pt", max_length=1024, truncation=True, padding=True)
        
        # Generate summary
        summary_ids = model.generate(
            inputs["input_ids"],
            max_length=max_length,
            min_length=min_length,
            length_penalty=2.0,
            num_beams=4,
            early_stopping=True
        )
        
        # Decode
        summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        
        return summary