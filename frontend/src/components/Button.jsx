import clsx from "clsx";
import "./Button.css";

function Button({
  disabled,
  onClick,
  type,
  title,
  className,
  Icon,
  popoverTarget,
  active,
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type ?? "button"}
      title={title}
      popoverTarget={popoverTarget}
      className={clsx(
        "btn-base",
        { "btn-disabled": disabled },
        { "btn-active": active },
        { btn: !disabled && !active },
        className
      )}
    >
      {Icon && <Icon />}
      <span>{title}</span>
    </button>
  );
}

export default Button;
