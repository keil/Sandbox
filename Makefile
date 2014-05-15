default:
	./js -f bootstrap.js -i

.PHONY: test
test :
	./js -f bootstrap.js test/testcase.js -i
