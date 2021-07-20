//* Se obtiene el string de duracion del video esto se descompone y luego se hace una operacion matematica para obtener el resultado en segundos.
function transformTime(timeDuration) {
    let duration = timeDuration.split("");
    let timeS = '';
    let numero1 = '';
    let timeH = '';
    let timeM = '';
    for (let index = 2; index < duration.length; index++) {
        if (duration[index] == "H" || duration[index] == "M" || duration[index] == "S") {
            if (duration[index] == "H") {
                timeH = numero1;
                numero1 = '';
            } else if (duration[index] == "M") {
                timeM = numero1;
                numero1 = '';
            } else if (duration[index] == "S") {
                timeS = numero1;
                numero1 = '';
            }
        }
        if (!isNaN(duration[index])) {
            numero1 += duration[index];
        }

    }
    timeH = timeH * 3600
    timeM = timeM * 60
    let time = parseInt(timeH) + parseInt(timeM) + parseInt(timeS);
    return time;
}

module.exports.transformTime= transformTime;