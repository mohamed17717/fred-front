import random
from django.shortcuts import render, get_object_or_404
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import (
    HttpResponse,
    HttpResponseNotAllowed,
    HttpResponseBadRequest,
    JsonResponse,
    HttpResponseForbidden,
    HttpResponseNotFound,
)
from django.db.models import Count, Q
from django.views.decorators.http import require_http_methods

import json

from .models import Coach, Course, LiveEvent, Rating, Review, Category, Blog, Instructor


def paginate(qs, page=1):
    paginator = Paginator(qs, 20)
    try:
        paginatedData = paginator.page(page)
    except PageNotAnInteger:
        page = 1
        paginatedData = paginator.page(1)
    except EmptyPage:
        page = paginator.num_pages
        paginatedData = paginator.page(paginator.num_pages)

    return {
        'data': [item.serialize() for item in paginatedData],
        'total_pages': paginator.num_pages,
        'current_page': page,
        'has_next': paginatedData.has_next(),
        'has_prev': paginatedData.has_previous(),
    }


def requiredFields(requiredFields=[]):
    def decorator(func):
        def wrapper(request, *args, **kwargs):
            notFoundMsg = 'this is value is not found right now'
            for field in requiredFields:
                value = request.POST.get(field, notFoundMsg)
                if value == notFoundMsg:
                    return HttpResponseBadRequest(f'{field} is required')
            return func(request, *args, **kwargs)
        return wrapper
    return decorator


@require_http_methods(["GET"])
def getUserRating(request, courseId, userId):
    rate = Rating.checkIfUserRate(courseId, userId)
    if rate:
        return JsonResponse(rate)
    return HttpResponseNotFound()


@require_http_methods(["POST"])
def setRating(request, courseId):
    data = json.loads(request.body.decode('utf-8'))

    rate = data.get('rate', None)
    userId = data.get('userId')
    if not (rate and userId):
        return HttpResponseBadRequest()

    if Rating.checkIfUserRate(courseId, userId):
        return HttpResponseForbidden()

    course = get_object_or_404(Course, publicId=courseId)

    rating = Rating(course=course, rate=rate, authorId=userId)
    rating.save()

    return HttpResponse(status=200)


@require_http_methods(["POST"])
def setReview(request, courseId):
    data = json.loads(request.body.decode('utf-8'))

    content = data.get('content', None)
    name = data.get('name', None)
    pp = data.get('pp', None)
    userId = data.get('userId')

    print(content)
    print(name)
    print(pp)
    print(userId)

    if not (content and name and pp and userId):
        return HttpResponseBadRequest()

    course = get_object_or_404(Course, publicId=courseId)

    review = Review(course=course, name=name, pp=pp,
                    content=content, authorId=userId)
    review.save()

    return HttpResponse(status=200)


@require_http_methods(["GET"])
def search(request):
    query = request.GET.get('q')
    page = request.GET.get('page', 1)
    if not query:
        return HttpResponseBadRequest()

    qs = Course.objects.all()
    qs = qs.filter(
        Q(title__icontains=query) |
        Q(description__icontains=query) |
        Q(categories__name__icontains=query)
    ).distinct()

    return JsonResponse(paginate(qs, page), safe=False)


@require_http_methods(["GET"])
def listCourses(request):
    page = request.GET.get('page', 1)
    courses = Course.objects.all().order_by('-created')
    data = paginate(courses, page)

    return JsonResponse(data)


@require_http_methods(["GET"])
def listCoursesMostSell(request):
    # page = request.GET.get('page', 1)
    courses = Course.objects.all().order_by('-buy_count')[:10]
    # data = paginate(courses, page)
    data = [course.serialize() for course in courses]
    return JsonResponse(data, safe=False)


@require_http_methods(["GET"])
def listCoursesMostView(request):
    # page = request.GET.get('page', 1)
    courses = Course.objects.all().order_by('-view_count')[:10]
    # data = paginate(courses, page)
    data = [course.serialize() for course in courses]
    return JsonResponse(data, safe=False)


@require_http_methods(["GET"])
def getCourse(request, courseId):
    course = get_object_or_404(Course, publicId=courseId)
    data = course.serialize(full=True)

    return JsonResponse(data, safe=False)


@require_http_methods(["GET"])
def buyCourse(request, courseId):
    course = get_object_or_404(Course, publicId=courseId)
    course.buy_count += 1
    course.save()

    return HttpResponse(status=200)


@require_http_methods(["GET"])
def viewCourse(request, courseId):
    course = get_object_or_404(Course, publicId=courseId)
    course.view_count += 1
    course.save()

    return HttpResponse(status=200)


@require_http_methods(["GET"])
def filterCourses(request, category):
    page = request.GET.get('page', 1)

    # category = get_object_or_404(Category, name=category)
    # courses = category.category_courses.all()
    courses = Course.objects.filter(Q(categories__name__icontains=category))
    return JsonResponse(paginate(courses, page))


@require_http_methods(["GET"])
def getRelatedCourses(request, courseId):
    course = get_object_or_404(Course, publicId=courseId)
    return JsonResponse(course.getRelatedCourses(), safe=False)


@require_http_methods(["GET"])
def getRandomRelatedCourses(request, courseId):
    course = get_object_or_404(Course, publicId=courseId)

    category = random.choice(course.categories.all())
    if not category:
        return HttpResponse(status=304)

    qs = Course.objects.all()
    qs = qs.filter(
        Q(categories__name__icontains=category.name) & ~ Q(pk=course.pk)
    ).distinct()

    data = [c.serialize() for c in qs]
    return JsonResponse(data, safe=False)


@require_http_methods(["GET"])
def listCoaches(request):
    coaches = Coach.objects.all()

    data = [coach.serialize() for coach in coaches]
    return JsonResponse(data, safe=False)


@require_http_methods(["GET"])
def listLiveEvents(request):
    liveEvents = LiveEvent.objects.all()

    data = [liveEvent.serialize() for liveEvent in liveEvents]
    return JsonResponse(data, safe=False)


def handelCourseData(request):
    data = {}
    # print('\n\nData: ', data, '\n\n')
    data['categories'] = request.POST.getlist('categories') or []
    data['relatedCourses'] = request.POST.getlist('relatedCourses') or []

    # print('\n\n', data, '\n\n')
    return data


# 'author_name', 'author_pp'
@require_http_methods(["POST"])
@requiredFields(['title', 'publicId', 'thumbnail', 'price'])
def createCourse(request):
    data = request.POST.dict()
    data.update(handelCourseData(request))
    data.pop('categories')
    data.pop('relatedCourses')

    course = Course(**data)
    course.save()

    # print(course)
    # print('\n\ncourse: ', course, '\n\n')

    return course


@require_http_methods(["POST"])
@requiredFields(['publicId'])
def setCourse(request):
    data = request.POST.dict()
    # data = handelCourseData(request)
    data.update(handelCourseData(request))

    categories = Category.setCategories(data.pop('categories'))
    relatedCourses = data.pop('relatedCourses')

    publicId = data.get('publicId')
    course = Course.objects.filter(publicId=publicId)
    if not course:
        course = createCourse(request)
    else:
        course.update(**data)
        course = course.first()

    print('\n\ndata: ', data, '\n\n')
    # print('\n\ncourse: ', course, '\n\n')
    course.setCategories(categories)
    course.setRelatedCourses(relatedCourses)

    return HttpResponse(status=200)


@require_http_methods(["POST"])
@requiredFields(['publicIds'])
def deleteCourses(request):
    publicIds = request.POST.getlist('publicIds')
    # publicIds = json.loads(publicIds)
    print('\n\n\n', publicIds, '\n\n\n')

    for course in Course.objects.all():
        if course.publicId not in publicIds:
            course.delete()
    return HttpResponse(status=200)


@require_http_methods(["POST"])
@requiredFields(['publicId', 'name', 'pp', 'description', 'calendly'])
def createCoach(request):
    data = request.POST.dict()
    coach = Coach(**data)
    coach.save()
    return coach


@require_http_methods(["POST"])
@requiredFields(['publicId'])
def setCoach(request):
    data = request.POST.dict()

    publicId = request.POST.get('publicId')
    coach = Coach.objects.filter(publicId=publicId)

    if not coach:
        createCoach(request)
    else:
        coach.update(**data)

    return HttpResponse(status=200)


@require_http_methods(["POST"])
@requiredFields(['publicIds'])
def deleteCoaches(request):
    publicIds = request.POST.getlist('publicIds')
    for coach in Coach.objects.all():
        if coach.publicId not in publicIds:
            coach.delete()
    return HttpResponse(status=200)


@require_http_methods(["POST"])
@requiredFields(['publicId', 'title', 'thumbnail', 'date', 'time', 'description', 'calendly'])
def createLiveEvent(request):
    data = request.POST.dict()
    liveEvent = LiveEvent(**request.POST.dict())
    liveEvent.save()
    return liveEvent


@require_http_methods(["POST"])
@requiredFields(['publicId'])
def setLiveEvent(request):
    data = request.POST.dict()

    publicId = request.POST.get('publicId')

    liveEvent = LiveEvent.objects.filter(publicId=publicId)
    if not liveEvent:
        createLiveEvent(request)
    else:
        liveEvent.update(**request.POST.dict())
    return HttpResponse(status=200)


@require_http_methods(["POST"])
@requiredFields(['publicIds'])
def deleteLiveEvents(request):
    publicIds = request.POST.getlist('publicIds')
    # publicIds = json.loads(publicIds)

    for liveEvent in LiveEvent.objects.all():
        if liveEvent.publicId not in publicIds:
            liveEvent.delete()
    return HttpResponse(status=200)


# blogs
@require_http_methods(["POST"])
@requiredFields(['publicId', 'title', 'url', 'author_name', 'author_pp', 'date', 'description'])
def setBlog(request):
    data = request.POST.dict()
    blog = Blog(**data)
    blog.save()
    return HttpResponse(status=200)


@require_http_methods(["GET"])
def listBlogs(request):
    blogs = Blog.objects.all().order_by('-created')[:5]
    return JsonResponse([blog.serialize() for blog in blogs], safe=False)


def index(request):
    return HttpResponse('Helllo world!!')


@require_http_methods(['GET'])
def listCategories(request):
    categories = Category.objects.all()
    data = [category.serialize() for category in categories]
    return JsonResponse(data, safe=False)


@require_http_methods(["POST"])
@requiredFields(['publicId', 'name', 'pp', 'description'])
def createInstructor(request):
    instructor = Instructor(**request.POST.dict())
    instructor.save()
    return instructor


@require_http_methods(["POST"])
@requiredFields(['publicId'])
def setInstructor(request):
    publicId = request.POST.get('publicId')

    instructor = Instructor.objects.filter(publicId=publicId)
    if not instructor:
        createInstructor(request)
    else:
        instructor.update(**request.POST.dict())

    return HttpResponse(status=200)


@require_http_methods(["POST"])
@requiredFields(['publicIds'])
def deleteInstructors(request):
    publicIds = request.POST.getlist('publicIds')
    # publicIds = json.loads(publicIds)
    for instructor in Instructor.objects.all():
        if instructor.publicId not in publicIds:
            instructor.delete()
    return HttpResponse(status=200)
