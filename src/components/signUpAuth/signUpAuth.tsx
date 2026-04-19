import { NavLink, useNavigate } from "react-router-dom"; // Добавили useNavigate
import ImagePipe from "../UI/ImagePipe.tsx";
import { useState, useEffect, useContext } from "react";
import Button from "../button/Button.tsx";
import classes from "./signupauth.module.css";
import { Context } from "../../main.tsx";

function SignUpAuth() {
    const { store } = useContext(Context);
    const navigate = useNavigate(); // Для перехода на страницу входа
    
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [errorCode, setErrorCode] = useState(false); // Состояние ошибки кода

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
        setErrorCode(false);

        if (value && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            nextInput?.focus();
        }
    };
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            // Переход на предыдущую клетку
            const prevInput = document.getElementById(`code-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleResend = () => {
        setTimeLeft(60);
        setCanResend(false);
        setCode(['', '', '', '', '', '']); // Сбрасываем код при повторной отправке
    };

    const handleVerify = () => {
        const fullCode = code.join('');
    
        if (fullCode === "123456") {
            // Переходим на вход и передаем в URL параметр success
            navigate('/signin?success=true'); 
        } else {
            setErrorCode(true);
        }
    };

    return (
        <div className="sign-in">
            <div className="sign-in__container container">
                <div className="sign-in__info">
                    <NavLink to={'/signup'} className="sign-in__backlink">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M20 12H4M4 12L10 18M4 12L10 6" stroke="#190636" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>Вернуться назад
                    </NavLink>
                    <h1 className={"sign-in__title"}>Регистрация</h1>
                    
                    <p className="sign-in__text">
                        Проверьте указанную почту <b>{store.user.email}</b><br/>
                        На неё должен прийти шестизначный код.
                    </p>

                    {/* Логика текста/кнопки повтора */}
                    <p className="sign-in__backlink">
                        Не пришел код? {canResend ? (
                            <span 
                                onClick={handleResend}
                                style={{ 
                                    textDecoration: 'underline', 
                                    cursor: 'pointer',
                                    color: 'inherit' // Цвет как у текста вокруг
                                }}
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
                                    className={errorCode ? classes.inputError : ''} // Добавляем класс ошибки если надо
                                    onChange={(e) => handleChange(idx, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(idx, e)}
                                />
                            </label>
                        ))}
                    </div>

                    {/* ОТОБРАЖЕНИЕ ОШИБКИ ПОД ИНПУТАМИ */}
                    {errorCode && (
                        <div className={classes.errorMsg}>
                           <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="10" cy="10" r="10" fill="#FF4D4D"/>
                                <path d="M10 5V11M10 13H10.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                           </svg>
                           <span>Код неверный</span>
                        </div>
                    )}
                </div>
                
                <Button 
                    isBtn={true} 
                    className="button-type-2 sign-page-button"
                    onClick={handleVerify}
                >
                    Зарегистрироваться
                </Button>
                <ImagePipe />
            </div>
        </div>
    )
}

export default SignUpAuth;