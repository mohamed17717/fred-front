from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path

from contactus.views import redirectMail
from workaround.views import (
    index,

    getUserRating,
    setRating,
    setReview,
    search,
    listCourses,
    listCoursesMostSell,
    listCoursesMostView,
    getCourse,
    getInstructor,
    buyCourse,
    viewCourse,
    filterCourses,
    getRelatedCourses,
    getRandomRelatedCourses,
    listCoaches,
    listLiveEvents,

    setCoach,
    deleteCoaches,
    setLiveEvent,
    deleteLiveEvents,
    setCourse,
    deleteCourses,

    listBlogs,
    setBlog,

    listCategories,
)

urlpatterns = [
    path('', index),
    # categories
    path('categories/', listCategories),
    # course links
    path('rate/<str:courseId>/', setRating),
    path('rate/<str:courseId>/<str:userId>/', getUserRating),
    path('review/<str:courseId>/', setReview),
    path('search/', search),
    path('courses/', listCourses),
    path('courses/most-sell/', listCoursesMostSell),
    path('courses/most-view/', listCoursesMostView),
    path('course/<str:courseId>/', getCourse),
    path('course/instructor/', getInstructor),
    path('buy-course/<str:courseId>/', buyCourse),
    path('view-course/<str:courseId>/', viewCourse),
    path('filter/<str:category>/', filterCourses),
    path('related-courses/<str:courseId>/', getRelatedCourses),
    path('random-related-courses/<str:courseId>/', getRandomRelatedCourses),
    # coaches
    path('coaches/', listCoaches),
    # live events
    path('live-events/', listLiveEvents),

    # set coach
    path('set/course/', setCourse),
    path('delete/courses/', deleteCourses),

    path('set/coach/', setCoach),
    path('delete/coaches/', deleteCoaches),

    path('set/live-event/', setLiveEvent),
    path('delete/live-events/', deleteLiveEvents),

    path('set/blog/', setBlog),
    path('blogs/', listBlogs),


    path('admin/', admin.site.urls),
    path('contact-us/', redirectMail)
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL,
                          document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
