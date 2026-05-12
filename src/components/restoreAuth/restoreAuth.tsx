import { useNavigate } from "react-router-dom";
import ImagePipe from "../UI/ImagePipe.tsx";
import { useState, useEffect, useContext } from "react";
import Button from "../button/Button.tsx";
import classes from "./restoreauth.module.css";
import { Context } from "../../main.tsx";
import { FaExclamationCircle } from "react-icons/fa";

function RestoreAuth() {
    const { store } = useContext(Context);
    const navigate = useNavigate();

    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [errorCode, setErrorCode] = useState('');

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
            document.getElementById(`code-${index + 1}`)?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            document.getElementById(`code-${index - 1}`)?.focus();
        }
    };

    // Повторная отправка — вызывает POST /refreshCode
    const handleResend = async () => {
        try {
            await store.refreshCode(store.restoreEmail);
            setTimeLeft(60);
            setCanResend(false);
            setCode(['', '', '', '', '', '']);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Ошибка при повторной отправке';
            setErrorCode(msg);
        }
    };

    // Сохраняем код в store и переходим к смене пароля
    const handleVerify = () => {
        const fullCode = code.join('');
        if (fullCode.length < 6) {
            setErrorCode('Введите все 6 цифр кода');
            return;
        }
        // Сохраняем код — он понадобится в RestoreFormWithPass для PUT /registration
        store.restoreCode = fullCode;
        navigate('/restore?success=true');
    };

    return (
        <div className="sign-in">
            <div className="sign-in__container container">
                <div className="sign-in__info">
                    <button
                        onClick={() => navigate(-1)}
                        className="sign-in__backlink"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M20 12H4M4 12L10 18M4 12L10 6" stroke="#190636" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Вернуться назад
                    </button>
                    <h1 className={"sign-in__title"}>Восстановление пароля</h1>

                    <p className="sign-in__text">
                        Проверьте указанную почту <b>{store.restoreEmail}</b><br/>
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
                                    onChange={(e) => handleChange(idx, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(idx, e)}
                                />
                            </label>
                        ))}
                    </div>

                    {errorCode && (
                        <div className="errorUnder">
                            <FaExclamationCircle />
                            <span>{errorCode}</span>
                        </div>
                    )}
                </div>

                <Button
                    isBtn={true}
                    className="button-type-2 sign-page-button"
                    onClick={handleVerify}
                    
                >
                    Продолжить
                </Button>
                <ImagePipe />
            </div>
        </div>
    );
}

export default RestoreAuth;