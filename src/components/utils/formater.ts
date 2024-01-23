export const phoneMask = (phoneNumber: string): string => {
  const cleanPhoneNumber = phoneNumber.replace(/\D/g, ""); // Remove all non-numeric characters
  const isCellPhone = cleanPhoneNumber.length === 11; // Check if it's a cell phone number

  const areaCode = cleanPhoneNumber.slice(0, 2);
  const part1 = cleanPhoneNumber.slice(2, isCellPhone ? 7 : 6);
  const part2 = cleanPhoneNumber.slice(isCellPhone ? 7 : 6);

  const format = isCellPhone ? "(00) 00000-0000" : "(00) 0000-0000";

  return format
    .replace("00", areaCode)
    .replace("00000", part1)
    .replace("0000", part2);
};
