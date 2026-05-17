export const formatLastActiveChat = (lastActiveChat: string) => {
  const lastActiveDate = new Date(lastActiveChat);

  if (Number.isNaN(lastActiveDate.getTime())) {
    return lastActiveChat;
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfLastActive = new Date(lastActiveDate);
  startOfLastActive.setHours(0, 0, 0, 0);

  const dayDifference = Math.round(
    (startOfToday.getTime() - startOfLastActive.getTime()) / 86400000,
  );

  if (dayDifference <= 0) {
    return "Today";
  }

  if (dayDifference === 1) {
    return "Yesterday";
  }

  return `${dayDifference} days ago`;
};

export default formatLastActiveChat;
