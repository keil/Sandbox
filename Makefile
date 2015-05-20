default:
	./js -f bootstrap.js -f test/default.js

.PHONY: test
test :
	./js -f bootstrap.js -f test/testcase.js -f test/test.js

octane :
	./js -f bootstrap.js -f benchmark/octane/octane.js -f benchmark/octane/run.js

sbxbench :
	./jsx  -f bootstrap.js -f benchmark/sbxbench/octane.js

baseline :
	./js -f bootstrap.js -f benchmark/baseline/trunk/run.js
