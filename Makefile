
TESTS = test/*.js
REPORTER = dot

all:
	@node ./support/compile.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		$(TESTS)

test-cov: lib-cov
	@SUPERCOUCH_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

test-server:
	@node ./support/server.js

lib-cov:
	@rm -rf lib-cov
	@jscoverage lib lib-cov

.PHONY: all test test-cov lib-cov test-server
