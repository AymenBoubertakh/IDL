from django.apps import AppConfig


class ChatbotConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'chatbot'
    
    def ready(self):
        """
        This method is called when Django starts.
        We can use it to initialize AI models (optional)
        """
        pass