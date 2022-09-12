exports.addDays = function (date, days) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

exports.addMinutes = function(date, minutes) {
    let result = new Date(date);
    result.setTime(result.getTime() + minutes * 60000);
    return result;
}

exports.addHours = function(date, hours) {
    let result = new Date(date);
    result.setTime(result.getTime() + hours * 60 * 60 * 1000);
    return result;
}