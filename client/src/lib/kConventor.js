const kConventor = (number) => {
  if (number) {
    const newNumber = Number(number);
    if (newNumber >= 1000) {
      return Math.floor(newNumber / 1000) + 'k';
    } else {
      return newNumber;
    }
  }
};

export default kConventor;
