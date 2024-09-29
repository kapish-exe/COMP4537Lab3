
function getDate(name, messageTemplate) {

    currentDate = new Date().toLocaleString();

    const message = messageTemplate.replace('%1', name);
    return `${message} ${currentDate}`;
}

module.exports = {
    getDate
};