// One reusable inline SVG icon component. No emoji and no icon fonts.
import type { SVGProps } from "react";

export type IconName =
  | "menu" | "close" | "whatsapp" | "instagram" | "facebook" | "tiktok" | "youtube" | "spotify"
  | "calendar" | "clock" | "pin" | "phone" | "users" | "check" | "star" | "music" | "crown" | "glass"
  | "arrow" | "logout" | "dashboard" | "ticket" | "disc" | "utensils" | "lock" | "alert" | "sparkle";

// Path data on a 24x24 grid. Stroked icons use a 2px round stroke.
const STROKE: Partial<Record<IconName, string[]>> = {
  menu: ["M4 6h16", "M4 12h16", "M4 18h16"],
  close: ["M6 6l12 12", "M18 6L6 18"],
  phone: ["M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"],
  instagram: ["M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z", "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z", "M17.5 6.5h.01"],
  facebook: ["M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5A.5.5 0 0 1 14 8z"],
  tiktok: ["M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5", "M14 3a5 5 0 0 0 5 5"],
  youtube: ["M3 8a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z", "M10 9.5v5l4.5-2.5z"],
  spotify: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M7 9.5c3.5-1 7-.7 10 1", "M7.8 13c2.8-.8 5.5-.5 8 .9", "M8.5 16.2c2.2-.5 4.3-.3 6.2.7"],
  calendar: ["M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v12a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5z", "M4 10h16", "M8 3v4", "M16 3v4"],
  clock: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M12 7.5V12l3 2"],
  pin: ["M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.800 12 21 12 21z", "M12 7.5a2.500 2.500 0 1 0 0 5 2.500 2.500 0 0 0 0-5z"],
  users: ["M9 11a3.500 3.500 0 1 0 0-7 3.500 3.500 0 0 0 0 7z", "M2.500 20a6.500 6.500 0 0 1 13 0", "M16 4.500a3.500 3.500 0 0 1 0 6.500", "M18 14a6.500 6.500 0 0 1 3.500 6"],
  check: ["M4.500 12.500l5 5 10-11"],
  star: ["M12 3.500l2.700 5.500 6 .9-4.400 4.200 1 6-5.300-2.800-5.300 2.800 1-6L3.300 9.900l6-.9z"],
  music: ["M9 18V5l11-2v13", "M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3z", "M20 16a3 3 0 1 1-3-3 3 3 0 0 1 3 3z"],
  crown: ["M3 8l4.500 4L12 5l4.500 7L21 8l-2 11H5z"],
  glass: ["M6 3h12l-1.500 8a4.500 4.500 0 0 1-9 0z", "M12 15.500V21", "M8.500 21h7"],
  arrow: ["M5 12h14", "M13 6l6 6-6 6"],
  logout: ["M10 4H6.500A1.500 1.500 0 0 0 5 5.500v13A1.500 1.500 0 0 0 6.500 20H10", "M15 8l4 4-4 4", "M19 12H9"],
  dashboard: ["M4 4h7v9H4z", "M13 4h7v5h-7z", "M13 11h7v9h-7z", "M4 15h7v5H4z"],
  ticket: ["M4 8a2 2 0 0 0 0 4v0a2 2 0 0 1 0 4v1.500A1.500 1.500 0 0 0 5.500 19h13a1.500 1.500 0 0 0 1.500-1.500V16a2 2 0 0 1 0-4v0a2 2 0 0 0 0-4V6.500A1.500 1.500 0 0 0 18.500 5h-13A1.500 1.500 0 0 0 4 6.500z", "M14 6v12"],
  disc: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z", "M12 6a6 6 0 0 1 6 6"],
  utensils: ["M6 3v8a2 2 0 0 0 2 2v8", "M10 3v8", "M6 7h4", "M17 3c-2 2-3 5-3 8h3v10"],
  lock: ["M6 11h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z", "M8 11V8a4 4 0 0 1 8 0v3"],
  alert: ["M12 3.500l9.500 16.500h-19z", "M12 10v4.500", "M12 17.500h.01"],
  sparkle: ["M12 3l1.800 5.200L19 10l-5.200 1.800L12 17l-1.800-5.200L5 10l5.200-1.800z"],
};

const WHATSAPP_PATH =
  "M12 2a10 10 0 0 0-8.600 15.100L2 22l5.100-1.300A10 10 0 1 0 12 2zm5.200 14.200c-.2.600-1.300 1.200-1.800 1.200-.5.100-1.100.1-3.500-.8-3-1.200-4.900-4.200-5-4.400-.1-.2-1.200-1.600-1.200-3s.8-2.100 1-2.400c.3-.3.600-.3.800-.3h.6c.2 0 .4 0 .6.500l.9 2.100c.1.200.1.400 0 .6l-.4.600c-.1.200-.3.300-.1.600.2.300.8 1.300 1.700 2.100 1.100 1 2.100 1.300 2.400 1.500.3.100.5.100.6-.1l.9-1c.2-.3.400-.2.700-.1l2 1c.3.100.5.200.5.300.1.200.1.800-.1 1.400z";

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 20, ...rest }: IconProps) {
  if (name === "whatsapp") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...rest}>
        <path d={WHATSAPP_PATH} />
      </svg>
    );
  }
  const paths = STROKE[name] ?? [];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
