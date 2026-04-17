import { useState, useContext } from 'react';
import Button from '../button/Button';
import classes from './signupcorp.module.css';
import { useNavigate } from "react-router-dom"; // Используем хук для перехода
import { Context } from '../../main';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignUpSelfAcc = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    
    const [emailErr, setEmailErr] = useState('');
    const [passwordErr, setPasswordErr] = useState('');
    const [repeatPasswordErr, setRepeatPasswordErr] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    
    const { store } = useContext(Context);
    const navigate = useNavigate();

    const validateForm = () => {
        let isValid = true;

        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!email) {
            setEmailErr('Email не может быть пустым');
            isValid = false;
        } else if (!re.test(String(email).toLowerCase())) {
            setEmailErr('Некорректный email');
            isValid = false;
        } else {
            setEmailErr('');
        }

        if (!password) {
            setPasswordErr('Пароль не может быть пустым');
            isValid = false;
        } else if (password.length < 8 || password.length > 25) {
            setPasswordErr('Пароль должен быть от 8 до 25 символов');
            isValid = false;
        } else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
            setPasswordErr('Пароль должен содержать заглавную, строчную буквы и спецсимвол');
            isValid = false;
        } else {
            setPasswordErr('');
        }

        if (repeatPassword !== password) {
            setRepeatPasswordErr('Пароли должны совпадать');
            isValid = false;
        } else {
            setRepeatPasswordErr('');
        }

        return isValid;
    };

    const handleRegistration = async () => {
        if (validateForm()) {
            try {
                await store.registration(email, password);
                navigate('/signupauth');
            } catch (e) {
                console.log(e);
            }
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
                    {emailErr && <div style={{ color: 'red', fontSize: '12px' }}>{emailErr}</div>}
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
                    {passwordErr && <div style={{ color: 'red', fontSize: '12px' }}>{passwordErr}</div>}
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
                    <label htmlFor="RepeatPassword">Повторите пароль</label>
                    {repeatPasswordErr && <div style={{ color: 'red', fontSize: '12px' }}>{repeatPasswordErr}</div>}
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
                            className={classes.button_show_password} 
                        >
                            {showRepeatPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                    </div>
                </div>
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