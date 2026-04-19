import { FaEye, FaEyeSlash } from "react-icons/fa";
import './eyeToggle.css';

interface EyeToggleProps {
    show: boolean;
    onToggle: () => void;
}

const EyeToggle: React.FC<EyeToggleProps> = ({ show, onToggle }) => {
    return (
        <button
            type="button"
            onClick={onToggle}
            className="eye-toggle-button"
            aria-label={show ? "Скрыть пароль" : "Показать пароль"}
        >
            {show ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
        </button>
    );
};

export default EyeToggle;