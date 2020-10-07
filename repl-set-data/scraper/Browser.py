from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

from .URL import URL
from .Cookies import  Cookies

import time



class Browser(Cookies):
	'''
		scrape using selenium firefox
		this is functions uses alot
	'''
	def __init__(self, hide=False):
		self.__config_browser__(hide)
		print('browser has configured')

	def __config_browser__(self, hide):
		options = Options()

		options.set_headless(headless=hide)

		self.driver = webdriver.Firefox(firefox_options=options)
		self.driver.implicitly_wait(20)
		self.driver.set_script_timeout(1000)
		print('browser has opened')

	def fill_input(self, selector, value):
		element = self.driver.find_element_by_css_selector(selector)
		element.clear()
		element.send_keys(value)

	def click_btn(self, selector):
		self.driver.find_element_by_css_selector(selector).click()

	def set_cookies(self, cookies):
		for cookie in cookies:
			# print(cookie)
			self.driver.add_cookie(cookie)

	def exec_js(self, jsCode, returnVar=''):
		""" 
			put "done();" whenever you want stop if your code need to wait 
			returnVar is variable you want its value
		"""
		index = jsCode.find('done();')
		if index >= 0:
			jsCode = jsCode.replace('done();', f'done({returnVar});')
			jsCode = 'var done = arguments[0]; ' + jsCode

			func = self.driver.execute_async_script
		else:
			jsCode = f'{jsCode.rstrip(";")}; return {returnVar};'
			func = self.driver.execute_script            
		return func(jsCode)

	def infinite_scroll(self):
		self.exec_js('var intrvl = setInterval(()=>{ window.scrollBy(0, 500) }, 500)', returnVar='intrvl')

	def get(self, link, with_cookies=False):
		self.driver.get(link)
		if with_cookies:
			## .removeProtocol.removePath.removeSubDomain
			# domain = '.'.join(link.split('//')[-1].split('/', 1)[0].split('.')[-2:])
			link = URL(link)
			cookies = self.get_cookies('firefox', link.domain )
			time.sleep(2)
			self.set_cookies(cookies)
			time.sleep(2)
			self.driver.get(link)

	def page_src(self):
		return self.driver.page_source

