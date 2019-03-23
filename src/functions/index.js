function getRandomItem(array) {
  if (!array.length || array.length == 0)
    throw new Error("Cant get random item: Incorrect Array");
  let randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

module.exports = {
  getRandomItem
}
