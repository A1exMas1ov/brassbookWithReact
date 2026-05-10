import { NavLink } from "react-router-dom";
import "./buttonType1.css";
import "./buttonType2.css";
import "./buttonType3.css";
import "./buttonType4.css";
import { ReactNode } from "react";

interface ButtonProps {
    to?: string;
    buttonText?: string;
    textAndBorderColor?: string;
    className?: string;
    isBtn?: boolean;
    children?: ReactNode;
    isSubmit?: boolean;
    onClick?: () => void | Promise<void>;
    disabled?: boolean;
}

function Button(buttonProps: ButtonProps) {
    return (
        !buttonProps.isBtn
            ? <NavLink
                to={buttonProps.to || '/'}
                className={buttonProps.className || ''}
                style={{ color: buttonProps.textAndBorderColor, borderColor: buttonProps.textAndBorderColor }}
              >
                {buttonProps.buttonText || ''}{buttonProps.children}
              </NavLink>
            : <button
                onClick={buttonProps.onClick}
                type={buttonProps.isSubmit ? 'submit' : 'button'}
                className={buttonProps.className || ''}
                style={{ color: buttonProps.textAndBorderColor, borderColor: buttonProps.textAndBorderColor }}
                disabled={buttonProps.disabled}
              >
                {buttonProps.children}
              </button>
    );
}

export default Button;