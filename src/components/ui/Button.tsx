// Link-styled and button-styled actions with luxury Burgundy and Champagne Gold styling.
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "gold" | "ghost";

function classes(variant: Variant, size: "md" | "lg", extra?: string) {
  return [styles.button, styles[variant], size === "lg" ? styles.lg : "", extra ?? ""].filter(Boolean).join(" ");
}

interface CommonProps {
  variant?: Variant;
  size?: "md" | "lg";
  icon?: IconName;
  children: ReactNode;
  className?: string;
}

export function ButtonLink({
  href,
  variant = "secondary",
  size = "md",
  icon,
  external,
  className,
  onClick,
  children,
}: CommonProps & { href: string; external?: boolean; onClick?: () => void }) {
  const content = (
    <>
      {children}
      {icon ? <Icon name={icon} size={16} /> : null}
    </>
  );
  if (external) {
    return (
      <a href={href} className={classes(variant, size, className)} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes(variant, size, className)} onClick={onClick}>
      {content}
    </Link>
  );
}

export function Button({
  variant = "secondary",
  size = "md",
  icon,
  className,
  children,
  type = "button",
  ...rest
}: CommonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">) {
  return (
    <button type={type} className={classes(variant, size, className)} {...rest}>
      {children}
      {icon ? <Icon name={icon} size={16} /> : null}
    </button>
  );
}
