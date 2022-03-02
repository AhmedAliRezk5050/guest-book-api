const getUniqueId = (idLength = 32) => {
  let uniqueId = (Math.floor(Math.random() * 25) + 10).toString(36) + '_';

  uniqueId += new Date().getTime().toString(36) + '_';
  do {
    uniqueId += Math.floor(Math.random() * 35).toString(36);
  } while (uniqueId.length < idLength);

  return uniqueId;
};

module.exports = getUniqueId;
