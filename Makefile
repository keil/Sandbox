default:
	./js -f bootstrap.js

.PHONY: test
test :
	./js -f bootstrap.js -f test/testcase.js -f test/test.js
