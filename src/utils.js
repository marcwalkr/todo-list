const lowerAlpha = "abcdefghijklmnopqrstuvwxyz";
const upperAlpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "1234567890";
const chars = Array.from(lowerAlpha + upperAlpha + numbers);

export function createUniqueId(length, existingIds) {
  const createId = () => {
    const idArr = [];
    for (let i = 0; i < length; i++) {
      const randChar = chars[Math.floor(Math.random() * chars.length)];
      idArr.push(randChar);
    }

    return idArr.join("");
  };

  let id;
  do {
    id = createId();
  } while (existingIds.has(id))

  return id;
}