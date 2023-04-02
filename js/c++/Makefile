CXX=emcc
CXXFLAGS=-sENVIRONMENT=web -sSINGLE_FILE -sMODULARIZE -sWASM_ASYNC_COMPILATION=0 -sALLOW_MEMORY_GROWTH -lembind --closure 1

all: utils.js powders.js

%.js:
	$(CXX) $(CXXFLAGS) -sEXPORT_NAME=create_$* -o $@.out $^
	cat $@.out $@.in > ../$@

powders.js: powders.cpp

utils.js: utils.cpp utils/math_utils.cpp utils/base64.cpp

.PHONY: clean
clean:
	rm -f utils.js.out powders.js.out

