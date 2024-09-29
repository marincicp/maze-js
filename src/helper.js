// For maze generation
export function shuffle(arr) {
  let counter = arr.length;

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);

    counter--;

    const temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }

  return arr;
}

export function createGridArr(rows, columm) {
  return Array(rows)
    .fill(null)
    .map((el) => Array(columm).fill(false));
}
