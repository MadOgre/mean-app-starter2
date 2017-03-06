"use strict";
let gulp = require("gulp");
let nodemon = require("gulp-nodemon");
let browserSync = require("browser-sync").create();
let plumber = require("gulp-plumber");
let sourceMaps = require("gulp-sourcemaps");
let sass = require("gulp-sass");
let autoprefixer = require("gulp-autoprefixer");
let uglify = require("gulp-uglify");
let concat = require("gulp-concat");
let templateCache = require("gulp-angular-templatecache");
const BROWSER_SYNC_DELAY = 400;

gulp.task("nodemon", () => {
	return nodemon({
		ext: "js",
		ignore: ["public/*"]
	})
	.on("restart", () => {
		global.setTimeout(browserSync.reload, BROWSER_SYNC_DELAY);
	});
});

gulp.task("browser-sync", ["nodemon"], () => {
	return global.setTimeout(() => {
		browserSync.init({
			port: 4000,
			proxy: "localhost:3000"
		});
	}, BROWSER_SYNC_DELAY);

});

gulp.task("css", () => {
	return gulp.src("public/scss/main.scss")
		.pipe(plumber(function(error) {
			browserSync.notify('<pre style="text-align: left">' + error.message + '</pre>', 4000);
			this.emit("end");
		}))
		.pipe(sourceMaps.init())
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(gulp.dest("public/css/"))
		.pipe(browserSync.stream())
		.pipe(sourceMaps.write("."))
		.pipe(gulp.dest("public/css/"));
});

gulp.task("js", () => {
	return gulp.src(["public/js/app.js", "public/js/app/**/*.js", "!public/js/main.js"])
		.pipe(plumber(function(error) {
		   console.log(error.cause);
		   browserSync.notify('<pre style="text-align: left">' + error.cause + '</pre>', 4000);
			this.emit("end");
		}))
		.pipe(sourceMaps.init())
		.pipe(uglify())
		.pipe(concat("main.js"))
		.pipe(sourceMaps.write("."))
		.pipe(gulp.dest("public/js"));	
});

gulp.task("templates", () => {
	return gulp.src("public/js/app/components/**/*.tpl")
		.pipe(templateCache("templates.js", {
			module: "APPNAME",
			moduleSystem: "IIFE"
		}))
		.pipe(gulp.dest("public/js/app"));
});

gulp.task("default", ["css", "templates", "js", "browser-sync"], () => {
	gulp.watch(["public/**/*.html", "public/js/main.js"], browserSync.reload);
	gulp.watch("public/scss/**/*.scss", ["css"]);
	gulp.watch(["public/js/**/*.js", "!public/js/main.js"], ["js"]);
	gulp.watch("public/js/**/*.tpl", ["templates"]);
});