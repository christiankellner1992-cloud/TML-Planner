export const DAY_LABELS = {
  friday: 'Friday, July 24',
  saturday: 'Saturday, July 25',
  sunday: 'Sunday, July 26',
};

export function getDayLabel(dayId) {
  return DAY_LABELS[dayId] ?? dayId;
}

export const DAY_TABS = [
  { id: 'friday', label: DAY_LABELS.friday },
  { id: 'saturday', label: DAY_LABELS.saturday },
  { id: 'sunday', label: DAY_LABELS.sunday },
];
