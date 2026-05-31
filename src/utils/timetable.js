export function flattenTimetable(timetable) {
  return [
    ...(timetable.friday || []),
    ...(timetable.saturday || []),
    ...(timetable.sunday || []),
  ];
}

export const emptyTimetable = () => ({
  friday: [],
  saturday: [],
  sunday: [],
});
