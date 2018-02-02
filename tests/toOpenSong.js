const convert = require('../converters/toOpenSong');


let ivs = `
1 paragraph 1line
1 paragraph 2line


2 paragraph 1line
2 paragraph 2line

3 paragraph 1line
3 paragraph 2line

1 paragraph 1line
1 paragraph 2line
`;

console.log(convert('IVS', ivs));
