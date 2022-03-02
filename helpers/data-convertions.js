const _idKeyReplace = (obj) => {
  const { _id, ...otherKeys } = obj;
  return { id: _id, ...otherKeys };
};

module.exports = { _idKeyReplace };
