/* jshint node: true */

'use strict';


var gulp = require('gulp');
var g = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var mainBowerFiles = require('main-bower-files');

// === Paths ===

var src = {
    toString: function () {
        return 'src'
    }
};
src.app = {
    toString: function () {
        return src + '/app'
    }
};
src.app.files = src.app + '/**/*.js';
src.app.templates = src.app + '/**/*.html';
src.images = {
    toString: function () {
        return src + '/images'
    }
};
src.images.files = src.images + '/**/*.{gif,jpg,jpeg,png,webp}';
src.appAssets = {
    toString: function () {
        return src + '/assets'
    }
};
src.appAssets.files = src.appAssets + '/**/*.*';
src.index = src + '/index.html';
src.content = src + '/content.html';
src.styles = {
    toString: function () {
        return src + '/styles'
    }
};
src.styles.files = src.styles + '/**/[!_]*.less';
src.styles.includes = src.styles + '/**/_*.less';
src.vendor = src + '/vendor';
src.test = src + '/test';

var specs = {
    toString: function () {
        return src + '/test'
    }
};
specs.pages = specs + '/pages';


var dist = {
    toString: function () {
        return 'dist'
    }
};
dist.app = {
    toString: function () {
        return dist + '/app'
    }
};
dist.app.templates = dist.app + '/templates.js';
dist.images = dist + '/images';
dist.appAssets = dist + '/assets';
dist.index = dist + '/index.html';
dist.styles = {
    toString: function () {
        return dist + '/styles'
    }
};
dist.styles.files = dist.styles + '/**/*.css';

// === General stuff ===

var server = {
    host: 'localhost',
    port: '9001'
}

// === Developement ===

gulp.task('clean', function (cb) {
    g.cache.clearAll();
    return del([
      dist + '/*',
    ], cb);
});

gulp.task('vendorIndex', function() {
    return gulp.src(mainBowerFiles("**/*.js",{
        paths: {
            bowerDirectory: 'src/vendor',
            bowerrc: '.bowerrc',
            bowerJson: 'bower.json'
        }
    }))
    .pipe(g.concatFilenames('.vendorScripts'))
    .pipe(g.replace(/^.+\/src\/vendor(.+)/gm, 'vendor$1'))
    .pipe(g.replace(/src/gm, 'dist'))
    .pipe(gulp.dest(''));
});

gulp.task('index', function () {
    return gulp.src(src.index)
        .pipe(g.fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(g.includeSource())
        .pipe(gulp.dest('' + dist));
});


gulp.task('jshint', function () {
    return gulp.src(src.app.files)
        .pipe(g.jshint())
        .pipe(g.jshint.reporter('jshint-stylish'))
        .pipe(g.jshint.reporter('fail'));
});

gulp.task('templates', function () {
    return gulp.src(src.app.templates)
        .pipe(g.angularTemplatecache({ // compiles all html templates into cache
            module: 'app.templates',
            standalone: true,
            root: 'app',
        }))
        .pipe(gulp.dest('' + dist.app));
});

gulp.task('styles', function () { //copies css, compiles less and ads vendor prefixes
    return gulp.src(src.styles.files)
        .pipe(g.less()) //less compile
        .on('error', function (err) {
            console.warn(err.message)
        })
        .pipe(g.autoprefixer()) //vendor prefixes
        .pipe(gulp.dest('' + dist.styles));
});

gulp.task('webserver', function () {
    gulp.src(['' + dist, '' + src])
        .pipe(g.webserver({
            host: server.host,
            port: server.port,
            directoryListing: false,
            fallback:   'index.html',
            livereload: true,
            open:       true
        }));
});

gulp.task('watch', function () {
    // compile handlers
    gulp.watch(src.app.files, { interval: 500 },['index'/*, 'jshint'*/]);
    gulp.watch(src.app.templates, { interval: 500 },['templates']);
    gulp.watch([src.index, src.content], { interval: 500 },['index']); // 20140918 content se vklada do index tak se sleduje zvlast
    gulp.watch([src.styles.files, src.styles.includes], { interval: 500 }, ['styles']);
});


// === Build ===

gulp.task('buildImages', function () { //minify images
    return gulp.src(src.images.files)
        .pipe(g.cache(g.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true,
        })))
        .pipe(gulp.dest(dist.images));
});

gulp.task('buildAssets', function () {
    return gulp.src(src.appAssets.files)
        .pipe(gulp.dest(dist.appAssets));
});

gulp.task('vendorBuildIndex', function() {
    return gulp.src(mainBowerFiles("**/*.js",{
        paths: {
            bowerDirectory: 'src/vendor',
            bowerrc: '.bowerrc',
            bowerJson: 'bower.json'
        }
    }))
    .pipe(g.concatFilenames('.vendorScripts'))
    .pipe(g.replace(/^.+\/src\/vendor(.+)/gm, 'vendor$1'))
    .pipe(g.replace(/src/gm, 'dist'))
    .pipe(g.replace(/chart\.js$/gm, 'chart.js'))
    //.pipe(g.replace(/.js$/gm, '.min.js'))
    .pipe(gulp.dest(''));
});

gulp.task('buildIndex', function () { // build index.html
    const notIndexFilter = g.filter(['*', '!index.html', '!content.html'], {restore: true});
    return gulp.src(src.index)
        .pipe(g.fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(g.includeSource())
        // replace LF to CRLF which is necessary for userev
        .pipe(g.replace(/\x0D\x0A/g, '\n'))
        .pipe(g.replace(/\x0A/g, '\r\n'))
        //.pipe(g.replace(/vendor\/([\w\-\/]+).((js|css))/g, 'vendor/$1.min.$2'))
        .pipe(g.useref({ // concatenate assets defined in HTML build blocks
            searchPath: ['' + src, '' + dist]
        }))
        .pipe(notIndexFilter)
        .pipe(g.rev())
        .pipe(notIndexFilter.restore)
        .pipe(g.revReplace()) 
        .pipe(gulp.dest('' + dist));
});

gulp.task('favicon', function () {
    return gulp.src(src + '/favicon.ico')
        .pipe(gulp.dest('' + dist));
});

gulp.task('cleanBuild', function (cb) {
    return del([
      dist.app + '/templates.js',
      dist.styles + '/bootstrap.css',
      dist.styles + '/main.css',
    ], cb);
});


// === Main tasks definitions ===
//

gulp.task('build', function () {
    return runSequence(
        'clean',
        ['buildImages', 'buildAssets', 'favicon', 'styles', 'templates'],
        'vendorBuildIndex',
        'buildIndex',
        'cleanBuild'
    );
});

// 20140918 zmena connect za webserver - https://github.com/schickling/gulp-webserver
gulp.task('default', function () {
    return runSequence(
        'clean', ['vendorIndex','index', /*'jshint',*/ 'templates', 'styles', 'webserver' ],
        'watch'
    );
});
