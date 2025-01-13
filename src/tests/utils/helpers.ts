export const normaliseDate = (obj: object & { date: Date }) => {
  return { ...obj, date: new Date(obj.date).toISOString() };
};
