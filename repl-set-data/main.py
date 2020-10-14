from flask import Flask
import requests
import re
from scraper.Scraper import Scraper
from scraper.URL import URL
import json


# coaching
def extractCoachingCard(card):
    return {
        'publicId': card.select_one('[data-course-id]')['data-course-id'],
        'url': f"{protocol}://{domain}{card.select_one('[data-course-url]')['data-course-url']}",
        'thumbnail': card.select_one('img')['src'],
        'title': card.select_one('.course-listing-title[role="heading"]').text.strip(),
        'author_name': card.select_one('.course-listing-extra-info .course-author-name').text.strip(),
        'author_pp': card.select_one('.course-listing-extra-info img')['src'],
    }


def parseCoaching(text):
    regex = r'# *\w+.*[^#]+'
    patterns = re.findall(regex, text.strip())
    # print(text.strip())
    # print(patterns)

    data = {'type': 'coach'}
    for p in patterns:
        # coach: description, calendly
        # live event: date, time, description, calendly

        lines = p.strip().split('\n')
        key = lines[0].strip('# ')
        value = '\n'.join(lines[1:])
        data[key] = value

    # special handle
    if data.get('coach', None):
        data['type'] = 'coach'
        data['description'] = data['coach']
    elif data.get('live event', None):
        data['type'] = 'live event'
        data['description'] = data['live event']
    elif data.get('course', None):
        data['type'] = 'course'
        data['description'] = data['course']

    urls = data.get('urls', '').split('\n')
    for url in urls:
        urlDomain = URL(url).domain.split('.')[0]
        if urlDomain not in ['facebook', 'twitter', 'instagram', 'calendly']:
            urlDomain = 'site'
        data[urlDomain] = url

    return data


def handleCoachingCardData(cardData):
    card = cardData.copy()
    # handel for coach
    if card['type'] in ['coach', 'course']:
        allowedFields = [
            'name', 'pp', 'description',
            'url', 'publicId', 'facebook', 'twitter', 'instagram', 'site'
        ]

        if card['type'] == 'coach':
            allowedFields.append('calendly')

        card['name'] = card.pop('title')
        card['pp'] = card.pop('thumbnail')
    # handel for live event
    else:
        allowedFields = [
            'title', 'thumbnail', 'name', 'time',
            'date', 'description', 'calendly', 'url', 'publicId',
        ]

    allowedFields.append('type')
    for key, _ in card.copy().items():
        if key not in allowedFields:
            card.pop(key)

    return card


def getCoachingCards(soup):
    selector = 'div.row.services-row.list > div'
    cards = soup.select(selector)

    data = {
        'total': [],
        'coach': [],
        'live event': [],
        'course': [],
    }

    for card in cards:
        data['total'].append(extractCoachingCard(card))

    s = Scraper()

    # print(data['total'])

    for cardData in data['total']:
        url = cardData.get('url')
        s.get(url)
        tempSoup = s.html_soup()

        descriptionContentELm = tempSoup.select_one(
            '.course-block.custom_html')

        # print('Desc: ', descriptionContentELm.text)
        if not (descriptionContentELm and any([t in descriptionContentELm.text for t in ['course', 'coach', 'live event']])):
            continue

        descriptionContent = descriptionContentELm.text
        cardData.update(parseCoaching(descriptionContent))

        card = handleCoachingCardData(cardData)
        data[card.pop('type')].append(card)

    data.pop('total')
    return data


# course
def getCategoriesURLs(soup):
    selector = 'ul li a[href^="/courses/category/"]'
    urls = soup.select(selector)

    data = []
    for url in urls:
        data.append({
            'name': url.text,
            'url': f'{protocol}://{domain}{url["href"]}'
        })

    return data


def extractCourseCard(card):
    price = card.select_one(
        '.course-listing-extra-info .course-price').text.strip().strip('ج.م').replace(',', '')
    # print('\n\nprice: ', price, '\n\n')
    if price:
        if price.lower() == 'free':
            price = 0
        else:
            price = float(price)

    data = {
        'publicId': card.select_one('[data-course-id]')['data-course-id'],
        'url': f"{protocol}://{domain}{card.select_one('[data-course-url]')['data-course-url']}",
        'thumbnail': card.select_one('img')['src'],
        'title': card.select_one('.course-listing-title[role="heading"]').text.strip(),
        'description': card.select_one('.course-listing-subtitle').text.strip(),
        'price': price
    }

    authorNameElm = card.select_one(
        '.course-listing-extra-info .course-author-name')
    authorPPElm = card.select_one('.course-listing-extra-info img')
    extras = {
        'author_name': authorNameElm.text.strip() if authorNameElm else None,
        'author_pp': authorPPElm['src'] if authorPPElm else None,
    }

    data.update(extras)

    return data


def getCoursesCards(soup, isSetCategories=False):
    selector = 'div.row.course-list.list > div'
    cards = soup.select(selector)

    data = []
    for card in cards:
        data.append(extractCourseCard(card))

    if isSetCategories:
        s = Scraper()

        categoriesUrls = getCategoriesURLs(soup)
        for category in categoriesUrls:
            name = category.get('name')
            url = category.get('url')

            s.get(url)
            tempSoup = s.html_soup()
            categoryCards = getCoursesCards(tempSoup)
            ids = [c['publicId'] for c in categoryCards]

            for course in data:
                if course['publicId'] in ids:
                    if course.get('categories', None):
                        course['categories'].append(name)
                    else:
                        course['categories'] = [name]

    return data


# get blogs
def extractBlogCard(card):
    return {
        'title': card.select_one('h1').text.strip(),
        'url': f'{protocol}://{domain}{card.select_one("h1 a")["href"]}',
        'author_pp': card.select_one('.post-byline img')['src'],
        'author_name': card.select_one('.post-byline .post-author-name').text.strip(),
        'date': card.select_one('.post-byline .post-date').text.strip(),
        'description': card.select_one('.post-content').text.replace('READ MORE', '').strip(),
    }


def extraBlogData(url):
    s = Scraper()
    s.get(url)
    soup = s.html_soup()

    data = {'publicId': url.split('/')[4], }

    thumbnailElm = soup.select_one('.post-content img')

    data.update({
        'thumbnail': thumbnailElm['src'] if thumbnailElm else None,
    })

    return data


def getBlogsCards(soup):
    cards = soup.select('.blog-container .post')

    data = []
    for card in cards:
        blog = extractBlogCard(card)
        blog.update(extraBlogData(blog.get('url')))
        data.append(blog)

    return data


# set data to backend

def updateDB(items, delPath, setPath):
    bk = 'https://thegoodzone.pythonanywhere.com'

    publicIds = [item['publicId'] for item in items]
    print(publicIds)
    requests.post(f'{bk}{delPath}', data={'publicIds': publicIds})

    for item in items:
        print(item)
        requests.post(f'{bk}{setPath}', data=item)


def getCourses(coursesSoup):
    courses = getCoursesCards(coursesSoup, isSetCategories=True)
    return courses


def getCoaches(coursesSoup):
    coaching = getCoachingCards(coursesSoup)
    return coaching


def getBlogs(blogsSoup):
    blogs = getBlogsCards(blogsSoup)
    return blogs


def getTheGoodZoneDataAndMyPathes():

    s = Scraper()

    coursesUrl = f'{protocol}://{domain}/courses'
    s.get(coursesUrl)
    coursesSoup = s.html_soup()

    blogsUrl = f'{protocol}://{domain}/blog'
    s.get(blogsUrl)
    blogsSoup = s.html_soup()

    return [
        {
            'delPath': '/delete/courses/',
            'setPath': '/set/course/',
            'items': getCourses(coursesSoup)
        },
        {
            'delPath': '/delete/coaches/',
            'setPath': '/set/coach/',
            'items': getCoaches(coursesSoup)['coach']
        },
        {
            'delPath': '/delete/instructors/',
            'setPath': '/set/instructor/',
            'items': getCoaches(coursesSoup)['course']
        },
        {
            'delPath': '/delete/live-events/',
            'setPath': '/set/live-event/',
            'items': getCoaches(coursesSoup)['live event']
        },
        {
            'delPath': '/delete/blogs/',
            'setPath': '/set/blog/',
            'items': getBlogs(blogsSoup)
        },
    ]


def setToMyDB():
    pathes = getTheGoodZoneDataAndMyPathes()
    for p in pathes:
        updateDB(**p)


protocol = 'https'
domain = 'www.thegoodzone.org'

app = Flask(__name__)


@app.route('/')
def index():
    setToMyDB()
    return 'hello world'


app.run(host='0.0.0.0', port=8080)
