import moment from "moment";

export const propertyValues: FormValues = {
  images: null,
  description: "",
  rulesFiles: null,

  sharedBath: "",
  privateBath: "",
  address: "",
  amenities: [],
};

export const changPasswordValues = {
  password: "",
  confirmPassword: "",
  newPassword: "",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getErrorMessage(error: any): string {
  return error?.response?.data?.message || "Something went wrong";
}

export const getDateFormat = (date: Date | string | number) => {
  return moment(date).format("MM-DD-YYYY");
};

export type DateRange = { start: string; end: string };

export function convertToRanges(bookedDates: string[]): DateRange[] {
  if (!bookedDates.length) return [];

  // Sort dates to ensure order
  const sortedDates = bookedDates.sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const ranges: DateRange[] = [];
  let start = sortedDates[0];
  let end = sortedDates[0];

  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(end);
    const current = new Date(sortedDates[i]);
    const diffDays =
      (current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      // continuous day → extend range
      end = sortedDates[i];
    } else {
      // gap → push current range and start new one
      ranges.push({ start, end });
      start = sortedDates[i];
      end = sortedDates[i];
    }
  }

  // push last range
  ranges.push({ start, end });

  return ranges;
}

export const formatProductId = (productId: string): string => {
  return productId
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
