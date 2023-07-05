import styles from "./CheckBox.module.scss";

export interface CheckBoxProps {
  checked: boolean;
  onChanged: (checked: boolean) => void;
  className?: string;
  symbol?: string;
  checkedSymbol?: string;
  uncheckedSymbol?: string;
}

export const tick = "✔";
export const cross = "✕";

function CheckBox({
  checked,
  onChanged,
  className,
  symbol,
  checkedSymbol,
  uncheckedSymbol,
}: CheckBoxProps) {
  function getSymbol() {
    if (symbol !== undefined) return symbol;
    if (checked) return checkedSymbol ?? tick;
    return uncheckedSymbol ?? cross;
  }
  return (
    <div
      className={[
        className,
        styles.CheckBox,
        checked ? styles.Checked : styles.Unchecked,
      ].join(" ")}
      onClick={() => onChanged(!checked)}
    >
      <div>{getSymbol()}</div>
    </div>
  );
}
export default CheckBox;
