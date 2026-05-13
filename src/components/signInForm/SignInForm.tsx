import "./signInForm.css";
import Button from "../button/Button.tsx";
import { useState, FC, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main.tsx";
import { FaExclamationCircle, FaEye, FaEyeSlash  } from "react-icons/fa";

const SignInForm: FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailErr, setEmailErr] = useState('');
    const [passwordErr, setPasswordErr] = useState('');
    const [formErr, setFormErr] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const { store } = useContext(Context);

    const validateForm = () => {
        let isValid = true;

        setEmailErr('');
        setPasswordErr('');

        if (!email) {
            setEmailErr('Заполните обязательное поле');
            isValid = false;
        }
        if (!password) {
            setPasswordErr('Заполните обязательное поле');
            isValid = false;
        }
        return isValid;
    };

    const handleClick = async () => {
        if (!validateForm()) return;

        setFormErr('');
        setIsLoading(true);
        try {
            await store.login(email, password);
            navigate('/user');
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Неверный email или пароль';
            setFormErr(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={(e) => e.preventDefault()} className={"sign-form sign-in-form"}>
            <div className="sign-form__fields-container">
                <div className="sign-form__field">
                    <label htmlFor="email">Почта</label>
                    {emailErr && <span className="errorUnder"><FaExclamationCircle /> {emailErr}</span>}
                    <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        name="email"
                        id="email"
                        placeholder="Введите вашу почту"
                        className="sign__input"
                        type="email"
                    />
                </div>
                <div className="sign-form__field">
                    <label htmlFor="password">Пароль</label>
                    {passwordErr && <span className="errorUnder"><FaExclamationCircle /> {passwordErr}</span>}
                    <div style={{ position: 'relative' }}>
                    <input
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        name="password"
                        id="password"
                        placeholder="Введите пароль"
                        className="sign__input"
                        type={showPassword ? "text" : "password"}
                    />
                    
                    <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="button_show_password"
                    >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                    
                    </div>
                    </div>
                {formErr && <span className="errorUnder"><FaExclamationCircle /> {formErr}</span>}
            </div>
            <div className="sign-form__btn-container">
                <Button onClick={handleClick} isBtn={true} className="button-type-2 sign-page-button" disabled={isLoading}>
                    {isLoading ? 'Входим...' : 'Войти'}
                </Button>
            </div>
        </form>
    );
};

export default SignInForm;