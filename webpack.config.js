const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: {
        main: ['./src/app.js'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        minimizer: [new TerserPlugin({
            extractComments: false
        })],
    },
    module: {
        rules: [
            { 
                test: /\.scss$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function () {
                                return [
                                    require('autoprefixer')
                                ];
                            }
                        }
                    },
                    { loader: 'sass-loader' }
                ]
            }, {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    'corejs': '3',
                                    'useBuiltIns': 'usage'
                                }
                            ]
                        ]
                    }
                }
            }
        ]
    }
};