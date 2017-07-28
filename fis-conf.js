/* global fis */
fis.match('*.es', {
    parser: fis.plugin('typescript', {
        target: 1, // 0: es3 // 1: es5 // 2: es6
        // module: 2, // 1: commonjs // 2: amd // 3: umd // 4: system
        // sourceMap: DEBUG,
        noEmitHelpers: true,
        importHelpers: true,
    }),
    rExt: 'js',
    deploy: fis.plugin('local-deliver', {
        to: './',
    }),
    optimizer: fis.plugin('uglify-js', {
        compress: {
            'drop_console': true, // 删除console.*
            'drop_debugger': true, // 删除debugger
        },
    }),
});
