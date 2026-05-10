import { NavLink, useNavigate } from "react-router-dom";
import ImagePipe from "../UI/ImagePipe.tsx";
import { useState, useEffect, useContext } from "react";
import Button from "../button/Button.tsx";
import classes from "./signupauth.module.css";
import { Context } from "../../main.tsx";

function SignUpAuth() {
    const { store } = useContext(Context);
    const navigate = useNavigate();

    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [errorCode, setErrorCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [timeLeft]);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1 || isNaN(Number(value))) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        setErrorCode('');

        if (value && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            const prevInput = document.getElementById(`code-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleResend = async () => {
        try {
            const email = store.pendingRegistration?.email;
            if (email) {
                await store.sendCode(email);
            }
            setTimeLeft(60);
            setCanResend(false);
            setCode(['', '', '', '', '', '']);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Ошибка при повторной отправке';
            setErrorCode(msg);
        }
    };

    const handleVerify = async () => {
        const fullCode = code.join('');
        if (fullCode.length < 6) {
            setErrorCode('Введите все 6 цифр кода');
            return;
        }

        setIsLoading(true);
        try {
            // Подтверждаем код (isConfirmed: true)
            const email = store.pendingRegistration?.email ?? '';
            await store.confirmCode(email);

            // Завершаем регистрацию с кодом
            if (store.pendingRegistration) {
                await store.registration({
                    ...store.pendingRegistration,
                    code: fullCode
                });
                store.pendingRegistration = null;
            }

            navigate('/signin?success=true');
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Неверный или устаревший код';
            setErrorCode(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="sign-in">
            <div className="sign-in__container container">
                <div className="sign-in__info">
                    <NavLink to={'/signup'} className="sign-in__backlink">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M20 12H4M4 12L10 18M4 12L10 6" stroke="#190636" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Вернуться назад
                    </NavLink>
                    <h1 className={"sign-in__title"}>Регистрация</h1>

                    <p className="sign-in__text">
                        Проверьте указанную почту <b>{store.pendingRegistration?.email}</b><br/>
                        На неё должен прийти шестизначный код.
                    </p>

                    <p className="sign-in__backlink">
                        Не пришел код? {canResend ? (
                            <span
                                onClick={handleResend}
                                style={{ textDecoration: 'underline', cursor: 'pointer', color: 'inherit' }}
                            >
                                Отправить код повторно
                            </span>
                        ) : (
                            `Отправить повторно через ${timeLeft} секунд`
                        )}
                    </p>

                    <div className={classes.div__input}>
                        {code.map((num, idx) => (
                            <label key={idx}>
                                <input
                                    id={`code-${idx}`}
                                    type="text"
                                    maxLength={1}
                                    value={num}
                                    className={errorCode ? classes.inputError : ''}
                                    onChange={(e) => handleChange(idx, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(idx, e)}
                                />
                            </label>
                        ))}
                    </div>

                    {errorCode && (
                        <div className={classes.errorMsg}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="10" cy="10" r="10" fill="#FF4D4D"/>
                                <path d="M10 5V11M10 13H10.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <span>{errorCode}</span>
                        </div>
                    )}
                </div>

                <Button
                    isBtn={true}
                    className="button-type-2 sign-page-button"
                    onClick={handleVerify}
                    disabled={isLoading}
                >
                    {isLoading ? 'Проверяем...' : 'Зарегистрироваться'}
                </Button>
                <ImagePipe />
            </div>
        </div>
    );
}

export default SignUpAuth;