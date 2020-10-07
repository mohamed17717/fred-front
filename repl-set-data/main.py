import re
from scraper.Scraper import Scraper
from scraper.URL import URL

protocol = 'https'
domain = 'www.thegoodzone.org'
url = f'{protocol}://{domain}/courses'



# coaching
def extractCoachingCard(card):
  return {
    'publicId': card.select_one('[data-course-id]')['data-course-id'],
    'url': f"{protocol}://{domain}{card.select_one('[data-course-url]')['data-course-url']}" ,
    'thumbnail': card.select_one('img')['src'],
    'title': card.select_one('.course-listing-title[role="heading"]').text.strip(),
    'author_name': card.select_one('.course-listing-extra-info .course-author-name').text.strip(),
    'author_pp': card.select_one('.course-listing-extra-info img')['src'],
  }

def parseCoaching(text):
  regex = r'#\w+.*[^#]+'
  patterns = re.findall(regex, text)

  data = {'type': 'coach'}
  for p in patterns:
    # coach: description, calendly
    # live event: date, time, description, calendly

    lines = p.strip().split('\n')
    key = lines[0].strip('# ')
    value = '\n'.join(lines[1:])
    data[key] = value

  if data.get('live event', None):
    data['type'] = 'live event'

  for url in data['urls'].split('\n'):
    urlDomain = URL(url).domain.split('.')[0]
    if urlDomain not in ['facebook', 'twitter', 'instagram', 'calendly']:
      urlDomain = 'site'
    data[urlDomain] = url

  return data

def handleCoachingCardData(cardData):
  card = cardData.copy()
  # handel for coach
  if card['type'] == 'coach':
    allowedFields = ['name','pp','description','calendly','url','publicId','facebook','twitter','instagram','site']
    
    card['name'] = card.pop('title')
    card['pp'] = card.pop('thumbnail')
  # handel for live event
  else:
    allowedFields = ['title','thumbnail','name','time','date','description','calendly','url','publicId',]

  allowedFields.append('type')
  for key, _ in card.items():
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
  }
  for card in cards:
    data['total'].append(extractCoachingCard(card))

  s = Scraper()

  for cardData in data['total']:
    url = cardData.get('url')
    s.get(url)
    tempSoup = s.html_soup()

    descriptionContent = tempSoup.select_one('.course-block.custom_html').text
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
  return {
    'publicId': card.select_one('[data-course-id]')['data-course-id'],
    'url': f"{protocol}://{domain}{card.select_one('[data-course-url]')['data-course-url']}" ,
    'thumbnail': card.select_one('img')['src'],
    'title': card.select_one('.course-listing-title[role="heading"]').text.strip(),
    'description': card.select_one('.course-listing-subtitle').text,
    'author_name': card.select_one('.course-listing-extra-info .course-author-name').text.strip(),
    'author_pp': card.select_one('.course-listing-extra-info img')['src'],
    'price': card.select_one('.course-listing-extra-info .course-price').text
  }

def getCoursesCards(soup, isSetCategories=True):
  selector = 'div.row.course-list.list > div'
  cards = soup.select(selector)
  
  data = []
  for card in cards:
    data.append(extractCourseCard(card))

  if isSetCategories:
    s = Scraper()

    for category in getCategoriesURLs(soup):
      name = category.get('name')
      url = category.get('url')

      s.get(url)
      tempSoup = s.html_soup()
      categoryCards = getCoursesCards(tempSoup, isSetCategories=False)
      ids = [c['publicId'] for c in categoryCards]

      for course in data:
        if course['publicId'] in ids:
          if course.get('categories', None):
            course['categories'].append(name)
          else:
            course['categories'] = [name]

  return data


# get blogs
url = f'{protocol}://{domain}/blogs'

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

  print(url.split('/'))
  return {
    'thumbnail': soup.select_one('.post .post-content img')['src'],
    'publicId': url.split('/')[4],
  }

def getBlogsCards(soup):
  cards = soup.select('.blog-container .post')

  data = []
  for card in cards:
    blog = extractBlogCard(card)
    blog.update(extraBlogData(blog.get('url')))
    data.append(blog)


  return data

