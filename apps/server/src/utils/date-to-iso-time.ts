export const sanitizeDateToIso = (
  dateInput: string | Date | null | undefined,
): Date | null => {
  if (
    !dateInput ||
    (typeof dateInput === 'string' && dateInput.trim() === '')
  ) {
    return null;
  }

  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      return null;
    }
    return new Date(date.toISOString());
  } catch {
    return null;
  }
};
