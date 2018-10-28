function* list() {
    yield 'h'
    yield 'e'
    yield 'l'
    yield 'l'
    yield 'o'
    yield ','
    yield 'w'
    yield 'o'
    yield 'r'
    yield 'l'
    yield 'd'
}

var l = list()
for(var item of l) {
    console.log(item);
}