default:
	./js20150601 -f bootstrap.js -f test/default.js

.PHONY: test
test :
	./js20150601 -f bootstrap.js -f test/testcase.js -f test/test.js

octane :
	./js -f bootstrap.js -f benchmark/octane/octane.js
