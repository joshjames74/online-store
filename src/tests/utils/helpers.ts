export const normaliseDate = (obj: Object & { date: Date }) => {
  return { ...obj, date: new Date(obj.date).toISOString() };
};
