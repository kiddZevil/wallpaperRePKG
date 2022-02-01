const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process'); 
//读取路径
const sourcePath = "./source";
const readDir = getDir(sourcePath);
readDir.forEach(fname => {
    const flag = fsExistsSync(path.join(sourcePath, fname, "scene.pkg"));
    if (flag) {
        repkgRun(fname)
    } else {
        getVideo(fname);
    }
    console.log(fname)
});
getPic();
//调用cmd转换解包场景文件
function repkgRun(folderName) {
    const order = 'repkg extract -o ./output/' + folderName + ' ' + sourcePath + '/' + folderName + '/scene.pkg';
    runSync(
        order, (err, res) => {
            console.log(err)
        }
    );
}

function runSync(command){
    try {
        return { 
            data:   execSync(command).toString(), 
            err:    null, 
            stderr: null 
        }
    } 
    catch (error) {
        return { 
            data:   null, 
            err:    error.stderr.toString(), 
            stderr: error.stderr.toString() 
        }
    }
}

//检测文件或者文件夹存在 nodeJS
function fsExistsSync(path) {
    try {
        fs.accessSync(path, fs.F_OK);
    } catch (e) {
        return false;
    }
    return true;
}

//随机数生成（避免重名文件冲突）
function random() {
    return Math.floor(Math.random() * 10000);
}

//读取并分类视频文件
function getVideo(fname) {
    mkdirsSync("./results/video");
    const dir = path.join(sourcePath, fname);
    const videoDir = getDir(dir);
    for (const nm in videoDir) {
        const fullNameArr = videoDir[nm].split('.');
        const arr = fullNameArr[fullNameArr.length - 1];

        if (arr === "mp4") {
            const newName = fullNameArr[0] + random();
            const sourceFile = path.join(dir, videoDir[nm]);
            const destPath = path.join("./results/video", newName + "." + arr);
            fs.rename(sourceFile, destPath, function (err) {
                if (err) throw err;
                fs.stat(destPath, function (err, stats) {
                    if (err) throw err;
                    console.log('stats: ' + JSON.stringify(stats));
                });
            });
        }
    }
}

//读取解包图片文件
function getPic() {
    mkdirsSync("./results/pic");
    const targetDir = getDir("./output");
    let appendMark = 1;
    targetDir.forEach(fname => {
        const dir = `./output/${fname}/materials`;
        const targetDir = getDir(dir);

        for (const nm in targetDir) {
            const arr1 = targetDir[nm].split('.');
            const arr = arr1[arr1.length - 1];
            if (arr === "jpg" || arr === "png" || arr === "gif" || arr === "jpeg") {
                const sourceFile = path.join(dir, targetDir[nm]);
                const destPath = path.join("./results/pic", fname + "_" + appendMark + "." + arr);
                appendMark++
                fs.rename(sourceFile, destPath, function (err) {
                    if (err) throw err;
                    fs.stat(destPath, function (err, stats) {
                        if (err) throw err;
                        console.log('stats: ' + JSON.stringify(stats));
                    });
                });
            }
        }
    });
}

//递归判断并创建目录
function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

function getDir(path_way) {
    mkdirsSync(path_way);
    return fs.readdirSync(path_way);
};