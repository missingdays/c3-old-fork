all:
	grunt

test:
	grunt test

build:
	grunt build

install: clean
	npm install
	bower install

clean:
	rm -rf node_modules
	rm -rf bower_components

publish:
	git push origin 0.4.9d
	git push github 0.4.9d
