const gulp = require("gulp");
const htmlMin = require('gulp-htmlmin') //压缩html
const fileinclude = require('gulp-file-include'); //模块化
const changed = require('gulp-changed');
// browser-sync（浏览器同步测试工具）+del(删除) + path(路径)
const browserSync = require('browser-sync').create();
const del = require('del');
const gulpPath = require('path');
const plumber = require('gulp-plumber'); // 能夠在我们把程式错误改回來后，继续做监看的动作
const uglify = require('gulp-uglify'); // js压缩
const cleanCSS = require('gulp-clean-css'); // css压缩
const sass = require('gulp-sass');
const rename = require('gulp-rename') // 重命名文件
const imagemin = require('gulp-imagemin'); // 图片压缩
const cache = require('gulp-cache'); // 只处理修改的内容
const babel = require('gulp-babel'); // babel编译
const clean = require('gulp-clean'); // 删除文件
const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');
// ES6
// const proxyMiddleware = require('http-proxy-middleware'); // api代理
// const middleware = proxyMiddleware.createProxyMiddleware('/api', {
//     target: '代理地址',
//     changeOrigin: true,
//     pathRewrite: {
//         '^/api': ''
//     },
//     logLevel: 'debug'
// });
// 编译前先删除旧文件
gulp.task("clean", function () {
    return gulp.src('dist')
        .pipe(clean());
})
// 压缩css
gulp.task('css', function () {
    return gulp.src('app/css/*.css')
        .pipe(changed('dist/css'))
        .pipe(plumber())
        .pipe(cleanCSS())
        // cleanCSS({
        //   advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
        //   compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
        //   keepBreaks: true,//类型：Boolean 默认：false [是否保留换行]
        //   keepSpecialComments: '*'
        //   //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        // })
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});
// 打包时加版本号
gulp.task('buildCss', function () {
    return gulp.src('app/css/*.css')
        .pipe(rev()) //文件名加MD5后缀
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'))
        .pipe(rev.manifest('rev-css-manifest.json')) //生成一个rev-manifest.json
        .pipe(gulp.dest(`dist/rev`)) // 保存到 rev 目录内
});
// 图片压缩
gulp.task('Imagemin', function () {
    return gulp.src('app/images/*.{png,jpg,gif,jpeg,ico,svg}')//后缀都用小写，不然不识别
        // .pipe(
        //     cache(
        //         imagemin({
        //             optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
        //             progressive: false, //类型：Boolean 默认：false 无损压缩jpg图片
        //             interlaced: false, //类型：Boolean 默认：false 隔行扫描gif进行渲染
        //             multipass: false //类型：Boolean 默认：false 多次优化svg直到完全优化
        //         })
        //     )
        // )
        .pipe(gulp.dest('dist/images'));
});
//   编译sass
gulp.task('sass', () => {
    return gulp.src('app/css/**/*.{sass,scss}')
        .pipe(changed('dist/css'))
        .pipe(plumber())
        .pipe(sass()) //增加这行
        .pipe(cleanCSS())
        // cleanCSS({
        //   advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
        //   compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
        //   keepBreaks: true,//类型：Boolean 默认：false [是否保留换行]
        //   keepSpecialComments: '*'
        //   //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        // })
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
})
// 打包编译sass
gulp.task('buildSass', () => {
    return gulp.src('app/css/**/*.{sass,scss}')
        .pipe(sass()) //增加这行
        .pipe(rev()) //文件名加MD5后缀
        .pipe(cleanCSS())
        // cleanCSS({
        //   advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
        //   compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
        //   keepBreaks: true,//类型：Boolean 默认：false [是否保留换行]
        //   keepSpecialComments: '*'
        //   //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        // })
        .pipe(gulp.dest('dist/css'))
        .pipe(rev.manifest('rev-sass-manifest.json')) //生成一个rev-manifest.json
        .pipe(gulp.dest(`dist/rev`)) // 保存到 rev 目录内
})
// 压缩js
gulp.task('uglifyJs', function () {
    return gulp.src(['app/js/**/*.js'])
        .pipe(changed('dist/js/**/'))
        .pipe(babel())
        .pipe(plumber())
        .pipe(uglify({
            compress: {
                drop_console: true,  // 过滤 console
                drop_debugger: true  // 过滤 debugger
            },
            warnings: false
        })) //加入uglify()的处理
        // .pipe(rev()) //文件名加MD5后缀
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/js'))
        // .pipe(rev.manifest('rev-js-manifest.json')) //生成一个rev-manifest.json
        // .pipe(gulp.dest(`dist/rev`))  // 保存到 rev 目录内
        .pipe(browserSync.reload({
            stream: true
        }));
});
// 打包压缩JS
gulp.task('buildUglifyJs', function () {
    return gulp.src(['app/js/**/*.js'])
        .pipe(rev()) //文件名加MD5后缀
        .pipe(babel())
        .pipe(uglify({
            compress: {
                drop_console: true,  // 过滤 console
                drop_debugger: true// 过滤 debugger
            },
            warnings: true
        })) //加入uglify()的处理
        .pipe(gulp.dest('dist/js'))
        .pipe(rev.manifest('rev-js-manifest.json')) //生成一个rev-manifest.json
        .pipe(gulp.dest(`dist/rev`))  // 保存到 rev 目录内
});
// 压缩HTML
gulp.task('htmlMin', function () {
    var options = {
        removeComments: false, //清除HTML注释
        collapseWhitespace: false, //压缩HTML
        collapseBooleanAttributes: false, //省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: false, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: false, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: false, //删除<style>和<link>的type="text/css"
        minifyJS: false, //压缩页面JS
        minifyCSS: false //压缩页面CSS
    };
    return gulp.src(['app/**/*.html', '!app/include/**.html'])
        .pipe(changed('dist'))
        .pipe(plumber())  //这里添加plumber
        .pipe(fileinclude({
            prefix: '@', //引用符号
            basepath: './app/include', //引用文件路径
            indent: true //保留文件的缩进
        }))
        .pipe(htmlMin(options))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({ //内容更改则触发reload
            stream: true
        }));
});
// 监听更新任务
gulp.task('watch', function () {
    // 建立浏览器自动刷新服务器
    browserSync.init({
        server: {
            // livereload: true,
            baseDir: "dist", // 设置服务器的根目录
            // middleware: middleware
        },
        notify: false, //禁用浏览器的通知元素
        port: 3000,
    });
    var watchHtml = gulp.watch('app/**/*.html', gulp.series('htmlMin'));
    var watchJs = gulp.watch('app/js/**/*.js', gulp.series('uglifyJs'));
    // 监听css变化
    // var watchCss = gulp.watch('src/styles/*.css',  gulp.series('css'));
    var watchCss = gulp.watch('app/css/**/*.{sass,scss}', gulp.series('sass')); //这一块的监听需要把后缀改为scss
    var watchImg = gulp.watch('app/images/**/*', gulp.series('Imagemin'));
    watchHtml.on('unlink', function (path) {
        del('dist/' + gulpPath.basename(path));
    });
    watchJs.on('unlink', function (path) {
        del('dist/js/**/' + gulpPath.basename(path));
    });
    // css变化时执行
    // watchCss.on('unlink', function(path) {
    //     var cssName = gulpPath.basename(path).split('.css')[0]
    //     del('dist/css/' + cssName + '.css');
    // });
    watchCss.on('unlink', function (path) {
        var cssName = gulpPath.basename(path).split('.scss')[0]
        del('dist/css/' + cssName + '.css');
    });
    watchImg.on('unlink', function (path) {
        del('dist/images/**/' + gulpPath.basename(path));
    });
});
// 打包替换版本号的文件名
gulp.task('rev', function () {
    //html
    return gulp.src([`dist/rev/**/*.json`, `dist/**/*.html`])
        .pipe(revCollector({ replaceReved: true }))
        .pipe(gulp.dest('dist'));
});

gulp.task('dev', gulp.series('clean', 'htmlMin', 'uglifyJs', 'sass', 'Imagemin', 'watch'));//开发环境
gulp.task('build', gulp.series('clean', 'buildCss', 'buildSass',  'buildUglifyJs','Imagemin','htmlMin','rev')); // 生产打包