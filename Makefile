
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

lib-cov: clean
	@jscoverage lib lib-cov

clean: 
	@rm -rf lib-cov
	@rm -f coverage.html

clean-docs:
	@rm -rf docs/out
	
docs: clean-docs
	@./node_modules/.bin/codex build \
		-i docs
	@./node_modules/.bin/codex serve \
		-d docs/out

.PHONY: all test test-cov lib-cov test-server clean clean-docs docs
