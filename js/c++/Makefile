CXX=emcc
CXXFLAGS=-sENVIRONMENT=web -sSINGLE_FILE -sMODULARIZE -sWASM_ASYNC_COMPILATION=0 -lembind --closure 1

all: utils.js powders.js

%.js: %.cpp
	$(CXX) $(CXXFLAGS) -sEXPORT_NAME=create_$* -o $@.out $<
	cat $@.out $@.in > ../$@

powders.js: powders.cpp

utils.js: utils.cpp

.PHONY: clean
clean:
	rm -f utils.js.out powders.js.out

