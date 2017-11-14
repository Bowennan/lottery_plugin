import gulp 			from 'gulp';
import gulpSequence 	from 'gulp-sequence';
import header			from 'gulp-header';

import less 			from 'gulp-less';
import postcss   		from 'gulp-postcss';
import reporter			from 'postcss-reporter';
import autoprefixer		from 'autoprefixer';
import stylelint  		from 'stylelint';

import babel  			from 'gulp-babel';
import uglify			from 'gulp-uglify';

const explanatoryNotes = '/*前端组--南海波*/\n';
// 源文件地址
const lessPath = 'dev/less/*.less';
const jsPath = 'dev/js/*.js';
const imagePath = 'dev/image/*.+(png|jpg|gif|svg)';

// 编译后路径
const distPath = 'static/';

// Less 解析
gulp.task('less', function() {
	const plugins = [
		stylelint({
		    "rules":{
		        "color-no-invalid-hex":true,//颜色色值
		        "declaration-colon-space-before":"never",//冒号前空格
		        "declaration-colon-space-after":"always",//冒号后空格
		        "indentation": 4,//缩进
		        "number-leading-zero":"always",//少于1时前导0
		    }
		}),
		autoprefixer({browsers: ['last 2 version']}),
	]
    return gulp.src(lessPath)
        .pipe(less())
        .pipe(postcss(plugins),reporter({clearMessages:true}))
        .pipe(header(explanatoryNotes))
        .pipe(gulp.dest(distPath + 'css'))
})

// js 解析
gulp.task('scripts', function() {
	return gulp.src(jsPath)
		.pipe(babel())
		// .pipe(uglify({compress:{properties:false},output:{'quote_keys':true}})) // 压缩
		.pipe(header(explanatoryNotes))
		.pipe(gulp.dest(distPath + 'js'))
})

// images
gulp.task('images', function() {
    return gulp.src(imagePath)
        .pipe(gulp.dest(distPath + 'image'));
})

// 监听
gulp.task('watch', function() {
    gulp.watch(lessPath, ['less']);
    gulp.watch(imagePath, ['images']);
    gulp.watch(jsPath,['scripts']);
})

gulp.task('build',gulpSequence('scripts','images','less',['watch']));
gulp.task('default', ['build']);