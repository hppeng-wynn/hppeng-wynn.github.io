CXX=emcc
CXXFLAGS=-sENVIRONMENT=web -sSINGLE_FILE -sMODULARIZE -sWASM_ASYNC_COMPILATION=0 -sALLOW_MEMORY_GROWTH -lembind --closure 1

all: utils.js powders.js

%.js: %.js.out
	cat $@.out $@.in > ../$@

%.js.out:
	$(CXX) $(CXXFLAGS) -sEXPORT_NAME=create_$* -o $@ $^

powders.js.out: powders.cpp definitions.cpp

utils.js.out: utils.cpp utils/math_utils.cpp utils/base64.cpp utils/bitvector.cpp

.PHONY: clean
clean:
	rm -f utils.js.out powders.js.out

