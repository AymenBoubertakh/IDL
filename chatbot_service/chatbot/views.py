from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .ai_service import AIService
import logging

logger = logging.getLogger(__name__)


@api_view(['POST'])
def translate_text(request):

    try:
        # Get request data
        text = request.data.get('text')
        source_lang = request.data.get('source_lang', 'en_XX')
        target_lang = request.data.get('target_lang', 'fr_XX')
        
        # Validate input
        if not text:
            return Response(
                {'error': 'Text is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not text.strip():
            return Response(
                {'error': 'Text cannot be empty'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Log the request
        logger.info(f"Translation request: {source_lang} -> {target_lang}")
        
        # Perform translation
        translated_text = AIService.translate(text, source_lang, target_lang)
        
        # Return response
        return Response({
            'original_text': text,
            'translated_text': translated_text,
            'source_language': source_lang,
            'target_language': target_lang,
            'source_language_name': AIService.SUPPORTED_LANGUAGES.get(source_lang, 'Unknown'),
            'target_language_name': AIService.SUPPORTED_LANGUAGES.get(target_lang, 'Unknown')
        }, status=status.HTTP_200_OK)
        
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.error(f"Translation error: {str(e)}")
        return Response(
            {'error': f'Translation failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def summarize_text(request):

    try:
        # Get request data
        text = request.data.get('text')
        max_length = request.data.get('max_length', 150)
        min_length = request.data.get('min_length', 50)
        
        # Validate input
        if not text:
            return Response(
                {'error': 'Text is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not text.strip():
            return Response(
                {'error': 'Text cannot be empty'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if text is long enough to summarize
        if len(text.split()) < 50:
            return Response(
                {'error': 'Text is too short to summarize. Minimum 50 words required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Log the request
        logger.info(f"Summarization request: text length = {len(text)} chars")
        
        # Perform summarization
        summary = AIService.summarize(text, max_length=max_length, min_length=min_length)
        
        # Return response
        return Response({
            'original_text': text,
            'summary': summary,
            'original_length': len(text),
            'summary_length': len(summary),
            'original_word_count': len(text.split()),
            'summary_word_count': len(summary.split())
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Summarization error: {str(e)}")
        return Response(
            {'error': f'Summarization failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def supported_languages(request):
  
    languages = AIService.get_supported_languages()
    return Response({
        'languages': languages,
        'count': len(languages)
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def health_check(request):
  
    return Response({
        'status': 'healthy',
        'service': 'chatbot_service',
        'version': '1.0.0'
    }, status=status.HTTP_200_OK)