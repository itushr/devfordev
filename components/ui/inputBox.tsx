"use client";

import {
  InputHTMLAttributes,
  MouseEventHandler,
  ReactNode,
  useState,
} from "react";
import clsx from "clsx";

type InputBoxProps = InputHTMLAttributes<HTMLInputElement> & {
  prefix?: ReactNode;
  suffix?: ReactNode;
  prefixOnClick?: MouseEventHandler<HTMLButtonElement>;
  suffixOnClick?: MouseEventHandler<HTMLButtonElement>;
};

export default function InputBox({
  prefix,
  suffix,
  prefixOnClick,
  suffixOnClick,
  ...props
}: InputBoxProps) {
  const [inputFocused, setInputFocused] = useState(false);

  return (
    <div
      className={clsx(
        "flex items-center rounded-md border transition",
        inputFocused && "ring-2"
      )}
    >
      {prefix && (
        <button
          type="button"
          className="border-r px-3 py-3 rounded-md"
          onClick={prefixOnClick}
          disabled={!prefixOnClick}
        >
          {prefix}
        </button>
      )}

      <input
        {...props}
        className={clsx("flex-1 px-3 py-3 outline-none", props.className)}
        onFocus={(e) => {
          setInputFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setInputFocused(false);
          props.onBlur?.(e);
        }}
      />

      {suffix && (
        <button
          type="button"
          className="border-l px-3 py-3 rounded-md"
          onClick={suffixOnClick}
          disabled={!suffixOnClick}
        >
          {suffix}
        </button>
      )}
    </div>
  );
}