const path = require('path') //node js module import

module.exports = {
    entry: './src/app.ts',
    output: {
        filename: 'bundle.js', //bebas bisa di hash juga check doc nya
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    }
}