import { useState, useContext } from 'react';
import Button from '../button/Button';
import classes from './signupcorp.module.css';
import { useNavigate } from "react-router-dom";
import { Context } from '../../main';
import { FaExclamationCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { UserRole } from '../../../models/enums/UserRole';
import { UserStatus } from '../../../models/enums/UserStatus';
import { validateEmail, validatePassword, validatePasswordMatch } from "../utils/validation";

const SignUpSelfAcc = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const [emailErr, setEmailErr] = useState('');
    const [passwordErr, setPasswordErr] = useState('');
    const [repeatPasswordErr, setRepeatPasswordErr] = useState('');
    const [formErr, setFormErr] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    const { store } = useContext(Context);
    const navigate = useNavigate();

    const validateForm = () => {
        let isValid = true;

        setEmailErr('');
        setPasswordErr('');
        setRepeatPasswordErr('');

        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            setEmailErr(emailValidation.error);
            isValid = false;
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            setPasswordErr(passwordValidation.error);
            isValid = false;
        }

        const matchValidation = validatePasswordMatch(password, repeatPassword);
        if (!matchValidation.isValid) {
            setRepeatPasswordErr(matchValidation.error);
            isValid = false;
        }

        return isValid;
    };

    const handleRegistration = async () => {
        if (!validateForm()) return;

        try {
            // Шаг 1: отправить код на email
            await store.sendCode(email);

            // Сохраняем данные в store для завершения регистрации после ввода кода
            store.pendingRegistration = {
                email,
                password,
                roleName: UserRole.ROLE_PERSONAL,
                status: UserStatus.ACTIVATE,
                code: '' // код введёт пользователь на следующем шаге
            };

            navigate('/signupauth');
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Ошибка сервера';
            setFormErr(msg);
        }
    };

    return (
        <form onSubmit={(e) => e.preventDefault()} className="sign-form sign-in-form">
            <div className={classes.ChangeAcc}>
                <div className={classes.button__corporationact}>Личный аккаунт</div>
                <div className={classes.button__corporationacttt}>________________________</div>
            </div>

            <div className="sign-form__fields-container">
                <div className="sign-form__field">
                    <label htmlFor="email">Почта</label>
                    {emailErr && <span className={classes.errorUnder}><FaExclamationCircle /> {emailErr}</span>}
                    <input
                        onChange={e => setEmail(e.target.value)}
                        value={email}
                        name="email"
                        id="email"
                        placeholder="Введите вашу почту"
                        className="sign__input"
                        type="email"
                    />
                </div>

                <div className="sign-form__field">
                    <label htmlFor="password">Пароль</label>
                    {passwordErr && <span className={classes.errorUnder}><FaExclamationCircle /> {passwordErr}</span>}
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
                            className={classes.button_show_password}
                        >
                            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                    </div>
                </div>

                <div className="sign-form__field">
                    <label htmlFor="repeatPassword">Повторите пароль</label>
                    {repeatPasswordErr && <span className={classes.errorUnder}><FaExclamationCircle /> {repeatPasswordErr}</span>}
                    <div style={{ position: 'relative' }}>
                        <input
                            onChange={e => setRepeatPassword(e.target.value)}
                            value={repeatPassword}
                            name="repeatPassword"
                            id="repeatPassword"
                            placeholder="Повторите пароль"
                            className="sign__input"
                            type={showRepeatPassword ? "text" : "password"}
                            style={{ paddingRight: '50px' }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                            className={classes.button_show_password}
                        >
                            {showRepeatPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                    </div>
                </div>

                {formErr && <span className={classes.errorUnder}><FaExclamationCircle /> {formErr}</span>}
            </div>

            <div className="sign-form__btn-container">
                <Button
                    onClick={handleRegistration}
                    isBtn={true}
                    className="button-type-2 sign-page-button"
                >
                    Продолжить
                </Button>
            </div>
        </form>
    );
};

export default SignUpSelfAcc;