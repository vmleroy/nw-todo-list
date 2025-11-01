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
    let date: Date;
    
    if (typeof dateInput === 'string') {
      // Handle YYYY-MM-DD format from frontend
      if (dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // For date-only format, assume local timezone and set to start of day
        date = new Date(dateInput + 'T00:00:00.000Z');
      } else {
        // For ISO string or other formats
        date = new Date(dateInput);
      }
    } else {
      date = dateInput;
    }
    
    if (isNaN(date.getTime())) {
      console.warn('Invalid date provided:', dateInput);
      return null;
    }
    
    return date;
  } catch (error) {
    console.error('Error sanitizing date:', error);
    return null;
  }
};
