from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

from django.db import models

# Create your models here.


class Course(models.Model):
  title = models.CharField(max_length=256)
  publicId = models.CharField(max_length=32)
  category = models.CharField(max_length=64, null=True)
  description = models.CharField(max_length=512, null=True)
  thumbnail = models.URLField(max_length=200)
  price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
  author_name = models.CharField(max_length=32)
  author_pp = models.URLField(max_length=200)
  buy_count = models.IntegerField(default=0)

  def getReviews(self):
    return self.course_reviews.all()

  def getRates(self):
    rates = self.course_rates.all()

    total = len(rates)
    average = sum(rates) / total

    ratesCounts = [0,0,0,0,0]
    for rate in rates:
      ratesCounts[rate-1] += 1

    return {
      'total': total,
      'average': average,
      'rates_counts': ratesCounts
    }

  def __str__(self):
    return self.title


class Review(models.Model):
  course = models.ForeignKey(
    Course, on_delete=models.CASCADE, related_name='course_reviews')
  name = models.CharField(max_length=32)
  pp = models.URLField(max_length=200)
  content = models.TextField()


class Rating(models.Model):
  @staticmethod
  def __minimumRate__(value):
    if value < 1:
      raise ValidationError(f'minimum rate is 1') 

  @staticmethod
  def __maximumRate__(value):
    if value > 5:
      raise ValidationError(f'maximum rate is 5') 
      
    
  course = models.ForeignKey(
    Course, on_delete=models.CASCADE, related_name='course_rates')
  rate = models.IntegerField(validators=[
    __minimumRate__, __maximumRate__])



class Coach(models.Model):
  name = models.CharField(max_length=32)
  pp = models.URLField(max_length=200)
  description = models.CharField(max_length=512)
  facebook = models.URLField(max_length=200, null=True)
  twitter = models.URLField(max_length=200, null=True)
  instagram = models.URLField(max_length=200, null=True)
  site = models.URLField(max_length=200, null=True)
  calendly = models.URLField(max_length=200)

  def __str__(self):
    return self.name


class LiveEvent(models.Model):
  title = models.CharField(max_length=256)
  thumbnail = models.URLField(max_length=200)
  name = models.CharField(max_length=32, null=True)
  time = models.CharField(max_length=8)
  date = models.CharField(max_length=32)
  description = models.CharField(max_length=512)
  calendly = models.URLField(max_length=200)

  def __str__(self):
    return self.title

class Blog(models.Model):
  title = models.CharField(max_length=256)
  thumbnail = models.URLField(max_length=200)
  url = models.URLField(max_length=200)
  author_name = models.CharField(max_length=32)
  author_pp = models.URLField(max_length=200)
  date = models.CharField(max_length=32)
  description = models.CharField(max_length=512)
  tags = models.CharField(max_length=256)

  def __str__(self):
    return self.title
