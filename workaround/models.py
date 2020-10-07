from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.core.validators import MaxValueValidator, MinValueValidator, URLValidator

from django.db import models

# Create your models here.

class Category(models.Model):
  name = models.CharField(max_length=64)

  def __str__(self):
    return self.name

  def serialize(self):
    return {'name': self.name}

  @staticmethod
  def setCategories(categories):
    objects = []
    for category in categories:
      categoryObj = Category.objects.filter(name=category).first()
      if not categoryObj:
        categoryObj = Category(name=category)
        categoryObj.save()

      objects.append(categoryObj)
    return objects


class Course(models.Model):
  title = models.CharField(max_length=256)
  publicId = models.CharField(max_length=32)
  description = models.CharField(max_length=512, null=True, blank=True)
  thumbnail = models.URLField(max_length=200)
  price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
  author_name = models.CharField(max_length=32)
  author_pp = models.URLField(max_length=200)
  
  buy_count = models.IntegerField(default=0)
  view_count = models.IntegerField(default=0)
  created = models.DateTimeField(auto_now_add=True)

  url = models.URLField(max_length=200)

  categories = models.ManyToManyField(Category, related_name='course_categories')
  relatedCourses = models.ManyToManyField('self', related_name='related_courses', symmetrical=False, blank=True)

  def getReviews(self):
    reviews = self.course_reviews.all()
    return [review.serialize() for review in reviews]

  def getRates(self):
    rates = self.course_rates.all()
    rates = [r.rate for r in rates]

    total = len(rates)
    average = sum(rates) / total if total > 0 else 0

    ratesCounts = [0,0,0,0,0]
    for rate in rates:
      ratesCounts[rate-1] += 1

    return {
      'total': total,
      'average': average,
      'rates_counts': ratesCounts
    }

  def getRelatedCourses(self):
    # relatedcourses = map(lambda rel: *rel.all(), [self.relatedCourses, self.related_courses])
    # relatedcourses = map(lambda course: course.serialize(), relatedcourses)

    relatedcourses = []
    coursesIds = []
    for course in self.relatedCourses.all():
      relatedcourses.append(course.serialize())
      coursesIds.append(course.pk)

    for course in self.related_courses.all():
      if course.pk not in coursesIds:
        relatedcourses.append(course.serialize())

    return relatedcourses


  def getCategories(self):
    return [category.serialize() for category in self.categories.all()]

  def setCategories(self, categories):
    self.categories.clear()
    for category in categories:
        self.categories.add(category)

  def setRelatedCourses(self, relatedCourses):
    for relatedCourse in relatedCourses:
        relatedCourseObj = Course.objects.filter(publicId=relatedCourse).first()
        if relatedCourseObj:
            self.relatedCourses.add(relatedCourseObj)


  def __str__(self):
    return self.title

  def serialize(self, full=False):
    course = {
      'title': self.title,
      'publicId': self.publicId,
      'description': self.description,
      'thumbnail': self.thumbnail,
      'price': self.price,
      'author_name': self.author_name,
      'author_pp': self.author_pp,
      'buy_count': self.buy_count,

      'rating': self.getRates(),
    }

    if full:
      course.update({
        'categories': self.getCategories(),
        'reviews': self.getReviews(),
        'relatedCourses': self.getRelatedCourses(),
      })

    return course




class Review(models.Model):
  course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='course_reviews')
  name = models.CharField(max_length=32)
  pp = models.URLField(max_length=200)
  content = models.TextField()
  created = models.DateTimeField(auto_now_add=True)


  def serialize(self):
    return {
      'name': self.name,
      'pp': self.pp,
      'content': self.content,
    }


class Rating(models.Model):      
  authorId = models.CharField(max_length=64) 
  course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='course_rates')
  rate = models.IntegerField(validators=[MaxValueValidator(5),MinValueValidator(1)])
  created = models.DateTimeField(auto_now_add=True)

  def serialize(self):
    return {'rate': self.rate}

  @staticmethod
  def checkIfUserRate(courseId, userId):
    rates = Rating.objects.filter(authorId=userId, course__publicId=courseId)
    if len(rates) > 0:
      return rates[0].serialize() 
    return False



class Coach(models.Model):
  name = models.CharField(max_length=32)
  pp = models.URLField(max_length=200)
  description = models.CharField(max_length=512)
  calendly = models.URLField(max_length=200)

  url = models.URLField(max_length=200)

  publicId = models.CharField(max_length=32)

  facebook = models.URLField(max_length=200, null=True, blank=True)
  twitter = models.URLField(max_length=200, null=True, blank=True)
  instagram = models.URLField(max_length=200, null=True, blank=True)
  site = models.URLField(max_length=200, null=True, blank=True)

  created = models.DateTimeField(auto_now_add=True)
  
  def __str__(self):
    return self.name

  def serialize(self):
    return {
      'name': self.name,
      'pp': self.pp,
      'description': self.description,
      'facebook': self.facebook,
      'twitter': self.twitter,
      'instagram': self.instagram,
      'site': self.site,
      'calendly': self.calendly,
    }


class LiveEvent(models.Model):
  title = models.CharField(max_length=256)
  thumbnail = models.URLField(max_length=200)
  name = models.CharField(max_length=32, null=True, blank=True)
  time = models.CharField(max_length=8)
  date = models.CharField(max_length=32)
  description = models.CharField(max_length=512)
  calendly = models.URLField(max_length=200)

  url = models.URLField(max_length=200)

  publicId = models.CharField(max_length=32)

  created = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return self.title

  def serialize(self):
    return {
      'title': self.title,
      'thumbnail': self.thumbnail,
      'name': self.name,
      'time': self.time,
      'date': self.date,
      'description': self.description,
      'calendly': self.calendly,
    }


class Blog(models.Model):
  title = models.CharField(max_length=256)
  thumbnail = models.URLField(max_length=200)
  url = models.URLField(max_length=200)
  author_name = models.CharField(max_length=32)
  author_pp = models.URLField(max_length=200)
  date = models.CharField(max_length=32)
  description = models.CharField(max_length=512)
  # tags = models.CharField(max_length=256)
  created = models.DateTimeField(auto_now_add=True)
  publicId = models.CharField(max_length=32)


  def __str__(self):
    return self.title

  def serialize(self):
    return {
      'title': self.title,
      'thumbnail': self.thumbnail,
      'url': self.url,
      'author_name': self.author_name,
      'author_pp': self.author_pp,
      'date': self.date,
      'description': self.description,
      'created': self.created,
      'publicId': self.publicId,
    }
