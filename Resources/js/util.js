let convertToIsoDate = simDate => {
  // Example input: "20161108T142504-0500"
  // Desired output: 2016-11-08T14:25:04-0500

  const dateCharacters = simDate.split("");
  let isoDate = "";
  for (var i = 0; i < dateCharacters.length; i++) {
    if (i === 4 || i === 6) {
      isoDate += "-";
    }
    if (i === 11 || i === 13) {
      isoDate += ":";
    }
    isoDate += dateCharacters[i];
  }
  return isoDate;
};

module.exports = {
  convertToIsoDate
};
