export const normaliseDate = (obj: any & { date: Date }) => {
    return { ...obj, date: new Date(obj.date).toISOString() };
  };