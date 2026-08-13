import { cn } from "@/lib/utils";
import type { CSSProperties, ReactNode } from "react";

type IsolateProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  title?: string;
  id?: string;
  as?: "span" | "div" | "time" | "p";
  dateTime?: string;
};

/** Isolate Latin / numeric / technical content so RTL page direction cannot reverse it. */
export function LtrIsolate({
  children,
  className,
  as: Tag = "span",
  dateTime,
  style,
  ...props
}: IsolateProps) {
  return (
    <Tag
      dir="ltr"
      style={style}
      className={cn("[unicode-bidi:isolate]", className)}
      {...(Tag === "time" && dateTime ? { dateTime } : {})}
      {...props}
    >
      {children}
    </Tag>
  );
}

/** Explicit block-level LTR container for scorelines, countdown rows, etc. */
export function LtrBlock({
  children,
  className,
  as: Tag = "div",
  ...props
}: IsolateProps) {
  return (
    <Tag
      dir="ltr"
      className={cn("[unicode-bidi:isolate]", className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
