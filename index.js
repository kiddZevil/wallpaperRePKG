const fs = require('fs');
const path = require('path');
const cmd = require('node-cmd');

//读取路径
const readDir = fs.readdirSync("./source");

readDir.forEach(fname => {
    const order = 'repkg extract -o ./output/' + fname + ' ./source/' + fname + '/scene.pkg';
    console.log(order)

    cmd.runSync(
        order, (err, res) => {
            console.log(err)
        }
    );
});

const targetDir = fs.readdirSync("./output");
let appendMark = 1;
targetDir.forEach(fname => {
    const dir = `./output/${fname}/materials`;
    const targetDir = fs.readdirSync(dir);

    for (const nm in targetDir) {
        const arr1 = targetDir[nm].split('.');
        const arr = arr1[arr1.length - 1];
        if (arr === "jpg" || arr === "png" || arr === "gif" || arr === "jpeg") {
            const sourceFile = path.join(dir, targetDir[nm]);
            const destPath = path.join("./results", fname + "_" + appendMark + "." + arr);
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