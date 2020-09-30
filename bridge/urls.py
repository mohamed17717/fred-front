from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path

from contactus.views import redirectMail
from workaround.views import index

urlpatterns = [
    path('', index),
    path('admin/', admin.site.urls),
    path('contact-us/', redirectMail)
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL,
                          document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
