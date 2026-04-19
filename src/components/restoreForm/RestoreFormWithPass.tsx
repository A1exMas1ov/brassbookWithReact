import Button from "../button/Button.tsx";
import EyeToggle from "../UI/EyeToggle"; 
import {useState, FC, useContext} from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main.tsx";
import { FaExclamationCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { validatePassword, validatePasswordMatch } from "../utils/validation";

const RestoreFormWithPass: FC = () => {

    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    
    const [passwordErr, setPasswordErr] = useState('');
    const [repeatPasswordErr, setRepeatPasswordErr] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    
    const { store } = useContext(Context);
    const navigate = useNavigate();

    const validateForm = () => {
            let isValidate = true;
            
            const passwordValidation = validatePassword(password);
            if (!passwordValidation.isValid) {
                setPasswordErr(passwordValidation.error);
                isValidate = false;
            }
            
            const matchValidation = validatePasswordMatch(password, repeatPassword);
            if (!matchValidation.isValid) {
                setRepeatPasswordErr(matchValidation.error);
                isValidate = false;
            }
            
            return isValidate;
        };

    const handleClick = async () => {
        if (validateForm()) {
            try {
                await store.resetPassword(password, repeatPassword);
                navigate('/signin?recovery=true');
            } catch (e) {
                console.log(e);
            }
        }
    }

    return (
        <form onSubmit={(e) => e.preventDefault()} className={"sign-form sign-in-form" + ''}>
            <div className="sign-form__fields-container">
                <div className="sign-form__field">
                    <label htmlFor="password">Пароль</label>
                    {passwordErr && <span className="errorUnder"> <FaExclamationCircle /> {passwordErr}</span>}
                    <div style={{ position: 'relative' }}>
                        <input 
                            onChange={e => setPassword(e.target.value)} 
                            value={password} 
                            name="password" 
                            id="password" 
                            placeholder="Введите пароль" 
                            className="sign__input" 
                            type={showPassword ? "text" : "password"}
                            style={{ paddingRight: '50px' }} 
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="button_show_password"
                        >
                            <EyeToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                        </button>
                    </div>
                </div>
                
                <div className="sign-form__field">
                    <label htmlFor="RepeatPassword">Повторите пароль</label>
                    {repeatPasswordErr && <span className="errorUnder"> <FaExclamationCircle />{repeatPasswordErr}</span>}
                    <div style={{ position: 'relative' }}>
                        <input 
                            onChange={e => setRepeatPassword(e.target.value)} 
                            value={repeatPassword} 
                            name="RepeatPassword" 
                            id="RepeatPassword" 
                            placeholder="Повторите пароль" 
                            className="sign__input" 
                            type={showRepeatPassword ? "text" : "password"}
                            style={{ paddingRight: '50px' }} 
                        />
                        <button
                            type="button"
                            onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                            className="button_show_password"
                        >
                            <EyeToggle show={showRepeatPassword} onToggle={() => setShowRepeatPassword(!showRepeatPassword)} />
                        </button>
                </div>
            </div>
            
            </div>
            <div className="sign-form__btn-container ">
                <Button onClick={handleClick}  isBtn={true} className="button-type-2 sign-page-button">Сменить пароль</Button>
            </div>
        </form>
    );
};

export default RestoreFormWithPass;