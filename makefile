MAKEFLAGS = -j1

ESLINT_FILES = "**/*.{js,ts}"
PRETTIER_FILES = "**/*.{js,json,md,ts}"
INDEX = "index.js"
BUILD = "lib"

DONE = echo [musik] ✓ $@ done

.PHONY: default \
	clean \
	wipe \
	install \
	lint \
	format \
	test \
	dev \
	build \
	start \

default:
	echo "Please enter a command..."
	$(DONE)

$(verbose).SILENT:

clean:
	rm -rf npm-debug.log
	rm -rf $(BUILD)
	$(DONE)

wipe: clean
	rm -rf node_modules
	$(DONE)

install: wipe
	npm install
	npm audit fix
	$(DONE)

lint:
	npm run eslint -- $(ESLINT_FILES)
	$(DONE)

format:
	npm run prettier -- --write $(PRETTIER_FILES)
	$(DONE)

test:
	npm run jest
	$(DONE)

dev: clean
	npm run tsc -- --watch
	$(DONE)

build: clean
	npm run tsc
	$(DONE)

start:
	node $(INDEX)
	$(DONE)
