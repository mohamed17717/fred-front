import re, string, random

class String:
	def clean_string(self, string):
		return re.sub(r'\W', '', string)
	
	def random_string(self, length=20):
		space = self.clean_string(string.printable)
		return ''.join([random.choice(space) for i in range(length)])

