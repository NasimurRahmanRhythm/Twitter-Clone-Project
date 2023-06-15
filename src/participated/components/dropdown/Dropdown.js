import { useToggle } from "@/participated/hooks/useToggle";
import { GrMoreVertical } from "react-icons/gr";
import styles from "./Dropdown.module.css";
export function Dropdown({
  options = [],
  className,
  onOptionClick = () => {},
  children,
}) {
  const [show, toggle] = useToggle();
  return (
    <div className={`${styles.dropdown} ${className}`}>
      <div onClick={toggle}>{children}</div>
      <div
        className={` ${styles.dropdownContent} ${
          show ? styles.showDropdownContent : styles.hideDropdownContent
        }`}
      >
        {options.map((option, index) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOptionClick(option);
              toggle();
            }}
            key={index}
            className="btn btn-ghost"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
