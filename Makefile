default:
	./js -f bootstrap.js -i
	#js -f bootstrap.js -i
	#~/Proglang/resources/mozilla-central/js/src/js/src/shell/js -f bootstrap.js -i

test:
	./js -f bootstrap.js test/testcase.js -i
	#~/Proglang/resources/mozilla-central/js/src/js/src/shell/js -f bootstrap.js test/test.js -i
