const lowerAlpha = "abcdefghijklmnopqrstuvwxyz";
const upperAlpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "1234567890";
const chars = Array.from(lowerAlpha + upperAlpha + numbers);

export const createUniqueId = (length, existingIds) => {
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
};

export const formatRelativeDate = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = new Date(dateStr + "T00:00:00");
  date.setHours(0, 0, 0, 0);

  const diffDays = Math.round((date - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";

  if (diffDays > 1 && diffDays <= 7) {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  }

  const options = { month: "short", day: "numeric" };
  if (date.getFullYear() !== today.getFullYear()) {
    options.year = "numeric";
  }
  return new Intl.DateTimeFormat("en-US", options).format(date).replace(",", "");
};

export const isToday = (dateStr) => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  return dateStr === `${yyyy}-${mm}-${dd}`;
};

export const hasDatePassed = (dateStr) => {
  const inputDate = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate < today;
};

export const isDayOfWeek = (str) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return days.includes(str);
};