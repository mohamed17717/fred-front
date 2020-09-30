from django.shortcuts import render
from django.http import HttpResponseBadRequest, HttpResponse, HttpResponseNotAllowed

import re 
import yagmail

# Create your views here.



def validEmail(email):  
  regex = '^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$'
  return bool(re.search(regex,email))

def sendMail(subject, msg):
  fredMail = 'mo.err17@gmail.com'

  yag = yagmail.SMTP("thegoodzone.help@gmail.com", 'the best school')
  yag.send(
      to=fredMail,
      subject=subject,
      contents=msg, 
  )

def redirectMail(request):
  if request.method != 'POST':
    return HttpResponseNotAllowed(['POST'])

  name = request.POST.get('name')
  email = request.POST.get('email')
  subject = request.POST.get('subject', f'{name} is explaining about somthing.')
  msg = request.POST.get('msg')

  if not (all([name, email, subject, msg]) and validEmail(email)):
    return HttpResponseBadRequest()

  try:
    sendMail(subject, f'Name: {name}\nEmail: {email}\nMessage: {msg}')
    return HttpResponse(status=200)
  except:
    return HttpResponseBadRequest()






