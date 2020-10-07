from bs4 import BeautifulSoup


class Soup:
    """docstring for Soup"""

    def __init__(self, src):
        # self.soup = BeautifulSoup(src, 'xml')
        # self.soup = BeautifulSoup(src, 'html5lib')
        self.soup = BeautifulSoup(src, 'lxml')
        # self.soup = BeautifulSoup(src, 'html.parser')

    def select(self, selector):
        return self.soup.select(selector)

    def select_one(self, selector):
        return self.soup.select_one(selector)

    def selectByText(self, selector, text):
        elms = self.soup.select(selector)
        text = text.lower()
        return filter(lambda elm: text in elm.text.lower(), elms)

    def selectByChild(self, selectorParent, selectorChild):
        elms = self.soup.select(selectorParent)
        return filter(lambda elm: elm.select_one(selectorChild) != None, elms)

    # def parent_until(selectorChild, selectorParent):
    # 	pass

    # def brother_to(selector, selectorWanted):
    # 	pass
