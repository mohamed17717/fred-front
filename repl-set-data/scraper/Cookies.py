import browser_cookie3

class Cookies:
	def get_cookies(self, browser, website):
		""" 
			get all cookies from the browser 
			determine the browser firefox | chrome | both
			then filter the output on specific website

			output return in [{'name': 'cookie_name', 'value': 'cookie_value'}, {...}, .....]
		"""

		if browser == 'firefox':
			browser = browser_cookie3.firefox
		elif browser == 'chrome':
			browser = browser_cookie3.chrome
		else:
			browser = browser_cookie3.load
		cookie_jar = browser(domain_name = website)
		
		cookies = []
		for c in cookie_jar:
			cookie = {'domain': None, 'name': c.name, 'value': c.value, 'secure': c.secure and True or False}
			if c.expires: cookie['expiry'] = c.expires
			if c.path_specified: cookie['path'] = c.path
			cookies.append(cookie)
		return cookies

