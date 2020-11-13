build:
	wasm-pack build

setup:
	make build
	npm i --prefix ./web

dev:
	npm run start --prefix ./web