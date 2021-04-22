// Toggles a value in an array.
// This directly mutates the array.
export function arrayToggle(array: string[] = [], value: string) {
  const index = array.indexOf(value);
  if (index > -1) {
    // Remove if value is in array
    array.splice(index, 1);
  } else {
    // Add if value is NOT in array
    array.push(value);
  }
}

// Removes a value from an array if it exists.
// This mutates the array.
export function remove(array: string[] = [], value: string) {
  const index = array.indexOf(value);
  if (index > -1) {
    array.splice(index, 1);
  }
}
