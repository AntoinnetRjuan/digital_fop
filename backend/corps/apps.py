from django.apps import AppConfig


class CorpsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'corps'

    def ready(self):
        import corps.signals