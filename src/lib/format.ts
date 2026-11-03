// Locale helpers. All user-facing formatting for Indonesia goes through here.

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const dateFormat = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const shortDateFormat = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  day: "numeric",
  month: "short",
});

const timeFormat = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const dateTimeFormat = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const dayFormat = new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", day: "2-digit" });
const monthFormat = new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", month: "short" });

export const formatRupiah = (amount: number): string => currency.format(amount);
export const formatDate = (date: Date): string => dateFormat.format(date);
export const formatShortDate = (date: Date): string => shortDateFormat.format(date);
export const formatTime = (date: Date): string => `${timeFormat.format(date).replace(".", ":")} WIB`;
export const formatDateTime = (date: Date): string => `${dateTimeFormat.format(date).replace(".", ":")} WIB`;
export const formatDay = (date: Date): string => dayFormat.format(date);
export const formatMonth = (date: Date): string => monthFormat.format(date);
export const formatNumber = (n: number): string => new Intl.NumberFormat("id-ID").format(n);
