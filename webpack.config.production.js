const path = require('path') //node js module import
const CleanPlugin = require('clean-webpack-plugin')

module.exports = {
    mode: 'production',
    entry: './src/app.ts',
    output: {
        filename: 'bundle.js', //bebas bisa di hash juga check doc nya
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'none',
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
    },
    plugins: [
        new CleanPlugin.CleanWebpackPlugin() // MENG CLEAR DIST FOLDER
    ]
}