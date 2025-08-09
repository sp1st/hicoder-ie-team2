const TruncateMessage = (
  message: string | undefined,
  maxLength: number = 8,
): string => {
  if (!message) return "";
  return message.length > maxLength
    ? `${message.substring(0, maxLength)}...`
    : message;
};
export default TruncateMessage;
