import json
from django.shortcuts import render
from django.http import HttpResponseBadRequest, HttpResponse, HttpResponseNotAllowed

import re
import yagmail

# Create your views here.


def validEmail(email):
    regex = '^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$'
    return bool(re.search(regex, email.lower()))


def sendMail(subject, msg):
    # fredMail = 'mo.err17@gmail.com'
    fredMail = 'support@thegoodzone.org'

    yag = yagmail.SMTP("thegoodzone.help@gmail.com", 'the best school')
    yag.send(
        to=fredMail,
        subject=subject,
        contents=msg,
    )


def redirectMail(request):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    data = json.loads(request.body.decode('utf-8'))

    print('\n\n', request.POST, '\n\n')
    name = data.get('name')
    email = data.get('email')
    subject = data.get(
        'subject', f'{name} is explaining about somthing.')
    msg = data.get('msg')

    print('name: ', name)
    print('email: ', email)
    print('subject: ', subject)
    print('msg: ', msg)
    print('all: ', all([name, email, subject, msg]))
    print('valid mail: ', validEmail(email))

    if not (all([name, email, subject, msg]) and validEmail(email)):
        return HttpResponseBadRequest()

    try:
        sendMail(subject, f'Name: {name}<br>Email: {email}<br>Message: {msg}')
        return HttpResponse(status=200)
    except:
        print('\n\nexception\n\n')
        return HttpResponseBadRequest()
