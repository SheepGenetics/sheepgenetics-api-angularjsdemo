function p(data) {
    var result = null;
    if (typeof data === 'object')
        result = JSON.stringify(data);
    else
        result = data;

    //console.log("---------- CONSOLE LOG ----------\n" + result + "\n---------- END CONSOLE LOG ----------");
}

function pa(data) {
    if (typeof data === 'object')
        alert(JSON.stringify(data));
    else
        alert(data);
}

function asFilesize(sizeInBytes) {
    if (sizeInBytes < 1024) {
        return sizeInBytes.toFixed(2) + "b";
    } else if (sizeInBytes < 1048576) {
        return (sizeInBytes / 1024).toFixed(2) + "KB"
    } else if (sizeInBytes < 1073741824) {
        return (sizeInBytes / (1024 * 1024)).toFixed(2) + "MB"
    } else {
        return (sizeInBytes / (1024 * 1024 * 1024)).toFixed(2) + "GB";
    }
}