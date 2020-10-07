import requests
import re

from bs4 import BeautifulSoup

from .URL import URL
from .Cookies import Cookies
from .String import String


# screaper functions must be independent
class Scraper(Cookies, String):
    '''
            scrape using requests.session
            this is functions uses alot
    '''

    def __init__(self):
        # args
        self.soup = None
        self.src = None
        self.session = None
        self.url = None
        self.response = None
        self.method = None

        self.__setup__()

    def __setup__(self):
        self.session = requests.Session()
        self.session.headers.update({
            # very common user-agent
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0'
        })

    def set_cookies(self, cookies):
        for cookie in cookies:
            self.session.cookies.set(cookie['name'], cookie['value'])

    def get(self, url):
        self.url = url
        self.method = 'GET'
        self.response = self.session.get(self.url)
        self.src = self.response.text
        return self.response

    def post(self, url, data={}):
        self.url = url
        self.method = 'POST'
        self.response = self.session.post(self.url, data=data)
        self.src = self.response.text
        return self.response

    def regex(self, ptrn):
        ptrns = {
            'ilink': r'(href|src)="(/[^"\s]+)"*?',
            'xlink': r'(href|src)="(http[s]*://[^"\s]+)"',
            'link': r'(href|src)="((https:/)*/[^"\s]+)"',
        }
        ptrn = ptrns.get(ptrn, None) or ptrn
        return re.findall(ptrn, self.src)

    def download(self, link, location=None):
        url = URL(link)
        location = location or './' + url.path.strip('/').split('/')[-1]

        res = requests.get(link)

        with open(location, 'wb') as f:
            f.write(res.content)

    def write(self, data, location, append=True):
        encode = {'encoding': 'UTF-8', 'errors': 'ignore'}
        data = data.encode(**encode).decode(**encode)

        location = location or f'./{self.random_string()}.txt'

        with open(location, 'a' if append else 'w') as f:
            f.write(data)

    def html_soup(self):
        assert self.src
        # type of parsing is dynamic
        # but leave it now
        return BeautifulSoup(self.src, 'html.parser')
