import React from "react";
import styles from "./CheckBox.module.scss";

export interface CheckBoxProps {
  checked: boolean;
  onChanged: (checked: boolean) => void;
  className?: string;
  symbol?: string;
}

const tick = "✔";
const cross = "✕";

function CheckBox({ checked, onChanged, className, symbol }: CheckBoxProps) {
  return (
    <div
      className={[
        className,
        styles.CheckBox,
        checked ? styles.Checked : styles.Unchecked,
      ].join(" ")}
      onClick={() => onChanged(!checked)}
    >
      <div>{symbol ?? (checked ? tick : cross)}</div>
    </div>
  );
}
export default CheckBox;
