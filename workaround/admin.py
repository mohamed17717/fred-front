from django.contrib import admin

from .models import (
    Category,
    Coach,
    Course,
    LiveEvent,
    Rating,
    Review,
    Blog
)

admin.site.register(Category)
admin.site.register(Coach)
admin.site.register(Course)
admin.site.register(LiveEvent)
admin.site.register(Rating)
admin.site.register(Review)
admin.site.register(Blog)
