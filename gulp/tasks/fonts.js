import fs from "fs";
import fonter from "gulp-fonter";
import ttf2woff2 from "gulp-ttf2woff2";

export const otfToTtf = () => {
    return app.gulp.src(`${app.path.srcFolder}/fonts/*.otf`, {}).pipe(
        app.plugins
            .plumber(
                app.plugins.notify.onError({
                    title: "FONTS",
                    message: "Error: <%= error.message %>",
                })
            )
            .pipe(
                fonter({
                    formats: ["ttf"],
                })
            )
            .pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`))
    );
};

export const ttfToWoff = () => {
    return (
        app.gulp
            .src(`${app.path.srcFolder}/fonts/*.ttf`, {})
            .pipe(
                app.plugins.plumber(
                    app.plugins.notify.onError({
                        title: "FONTS",
                        message: "Error: <%= error.message %>",
                    })
                )
            )
            // Конвертируем в .woff
            .pipe(
                fonter({
                    formats: ["woff"],
                })
            )
            // Выгружаем в папку с результатом
            .pipe(app.gulp.dest(`${app.path.build.fonts}`))
            // Ищем файлы шрифтоа .ttf
            .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))
            // Конвертируем в .woff2
            .pipe(ttf2woff2())
            // Выгружаем в папку с результатом
            .pipe(app.gulp.dest(`${app.path.build.fonts}`))
    );
};

export const fontsStyle = () => {
    // Файл стилей подключения шрифтов
    let fontsFile = `${app.path.srcFolder}/scss/fonts.scss`;
    // Проверяем существует ли файл шрифтов
    fs.readdir(app.path.build.fonts, function (err, fontsFiles) {
        if (fontsFiles) {
            // Проверяем существует ли файл стилей подключения шрифтов
            if (!fs.existsSync(fontsFile)) {
                // Если файла нет, создаём его
                fs.writeFile(fontsFile, '', cb);
                let newFileOnly;
                for (let index = 0; index < fontsFiles.length; index++) {
                    let fontFileName = fontsFiles[index].split('.')[0];
                    if (newFileOnly !== fontFileName) {
                        let fontName = fontFileName.split('-')[0] ? fontFileName.split('-')[0] : fontFileName;
                        let fontWeight = fontFileName.split('-')[1] ? fontFileName.split('-')[1] : fontFileName;
                        switch (fontWeight.toLowerCase()) {
                            case 'thin':
                                fontWeight = 100;
                                break;
                            case 'extralight':
                                fontWeight = 200;
                                break;
                            case 'light':
                                fontWeight = 300;
                                break;
                            case 'medium':
                                fontWeight = 500;
                                break;
                            case 'semibold':
                                fontWeight = 600;
                                break;
                            case 'bold':
                                fontWeight = 700;
                                break;
                            case 'extrabold':
                                fontWeight = 800;
                                break;
                            case 'heavy':
                                fontWeight = 800;
                                break;
                            case 'black':
                                fontWeight = 900;
                                break;
                            default:
                                fontWeight = 400;
                                break;
                        }
                        fs.appendFile(fontsFile,
                            `@font-face {
                                font-family: ${fontName};
                                font-display: swap;
                                src: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");
                                font-weight: ${fontWeight};
                                font-style: normal;
                            }\r\n`, cb);
                        newFileOnly = fontFileName;
                    }
                }
            } else {
                console.log("Файл scss/fonts.scss уже существует. Для обновления файла нужно его удалить!");
            }
        }
    });

    return app.gulp.src(`${app.path.srcFolder}`);
    function cb() { }
}
