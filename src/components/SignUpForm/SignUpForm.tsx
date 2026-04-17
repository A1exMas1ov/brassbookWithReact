import Button from "../button/Button.tsx";
import React, { useState, useContext } from "react";
import classes from "./signupgrid.module.css";
import { useNavigate } from "react-router-dom";
import { FaExclamationCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Context } from "../../main";

function SignUpForm({ className }: { className?: string }) {
    const navigate = useNavigate();
    const { store } = useContext(Context);

    const [step, setStep] = useState(1);
    const [values, setValues] = useState({
        name: '',
        secondName: '',
        companyName: '',
        position: '',
        inn: '',
        email: '',
        password: '',
        repeatPassword: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};
        const nameRegex = /^[а-яА-Яa-zA-Z\s]+$/;
        const InnRegex = /^\d{10}$|^\d{12}$/;

        if (!values.name) newErrors.name = "Заполните обязательное поле";
        else if (!nameRegex.test(values.name) || values.name.length > 25) newErrors.name = "Имя содержит от 1 до 25 букв";
            
        if (!values.secondName) newErrors.secondName = "Заполните обязательное поле";
        else if (!nameRegex.test(values.secondName) || values.secondName.length > 25) newErrors.secondName = "Фамилия содержит от 1 до 25 букв";

        if (!values.companyName) newErrors.companyName = "Заполните обязательное поле";
        else if (values.companyName.length > 50) newErrors.companyName = "Название компании до 50 символов";

        if (!values.position) newErrors.position = "Заполните обязательное поле";
        else if (values.position.length > 50) newErrors.position = "Должность до 50 символов";

        if (!values.inn) newErrors.inn = "Заполните обязательное поле";
        else if (!InnRegex.test(values.inn)) newErrors.inn = "ИНН должен содержать 10 или 12 цифр";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: Record<string, string> = {};
        const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

        if (!values.email) newErrors.email = 'Заполните обязательное поле';
        else if (!re.test(values.email)) newErrors.email = 'Почта указана некорректно';

        if (!values.password) newErrors.password = 'Заполните обязательное поле';
        else if (values.password.length < 8 || values.password.length > 25) newErrors.password = 'Пароль должен быть от 8 до 25 символов';
        else if (!/[A-Z]/.test(values.password) || !/[a-z]/.test(values.password) || !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(values.password)) {
            newErrors.password = 'Нужны заглавные, строчные и спецсимвол';
        }

        if (values.repeatPassword !== values.password) {
            newErrors.repeatPassword = 'Пароли не совпадают';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleContinue = async () => {
        if (step === 1) {
            if (validateStep1()) {
                setStep(2);
                setErrors({});
            }
        } else {
            if (validateStep2()) {
                try {
                    await store.registration(values);
                    navigate('/signupauth');
                } catch (e: any) {
                    setErrors({ form: e.response?.data?.message || "Ошибка сервера" });
                }
            }
        }
    };

    return (
        <form onSubmit={(e) => e.preventDefault()} className={"sign-form sign-in-form " + (className || '')}>
            <div className={classes.ChangeAcc}>
                <div className={classes.button__personalact}>Корпоративный аккаунт</div>
                <div className={classes.button__personalacttt}>____________________________________</div>
            </div>

            <div className={classes.signform__fieldscontainer}>
                <div className={classes.div_main}>
                    
                    {step === 1 && (
                        <>
                            <div className={classes.div_first}>
                                <div className={classes.signform__field}>
                                    <label>Имя</label>
                                    <input name="name" value={values.name} onChange={handleChange} placeholder="Введите имя" className={classes.sign__input1} />
                                    {errors.name && <span className={classes.errorUnder}> <FaExclamationCircle /> {errors.name}</span>}
                                </div>
                                <div className={classes.signform__field}>
                                    <label>Фамилия</label>
                                    <input name="secondName" value={values.secondName} onChange={handleChange} placeholder="Введите фамилию" className={classes.sign__input2} />
                                    {errors.secondName && <span className={classes.errorUnder}> <FaExclamationCircle /> {errors.secondName}</span>}
                                </div>
                            </div>

                            <div className={classes.div_second}>
                                <div className={classes.signform__field}>
                                    <label>Название компании</label>
                                    <input name="companyName" value={values.companyName} onChange={handleChange} placeholder="Название компании" className={classes.sign__input3} />
                                    {errors.companyName && <span className={classes.errorUnder}> <FaExclamationCircle />{errors.companyName}</span>}
                                </div>
                            </div>

                            <div className={classes.div_third}>
                                <div className={classes.signform__field}>
                                    <label>Должность</label>
                                    <input name="position" value={values.position} onChange={handleChange} placeholder="Ваша должность" className={classes.sign__input4} />
                                    {errors.position && <span className={classes.errorUnder}> <FaExclamationCircle /> {errors.position}</span>}
                                </div>
                                <div className={classes.signform__field}>
                                    <label>ИНН</label>
                                    <input name="inn" value={values.inn} onChange={handleChange} placeholder="Введите ИНН" className={classes.sign__input5} />
                                    {errors.inn && <span className={classes.errorUnder}> <FaExclamationCircle /> {errors.inn}</span>}
                                </div>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className={classes.div_second}>
                                <div className={classes.signform__field}>
                                    <label>Почта (Логин)</label>
                                    <input name="email" value={values.email} onChange={handleChange} placeholder="Введите почту" className={classes.sign__input3} />
                                    {errors.email && <span className={classes.errorUnder}> <FaExclamationCircle />{errors.email}</span>}
                                </div>
                            </div>

                            <div className={classes.signform__field}>
                                <label>Пароль</label>
                                <div className={classes.passwordWrapper}>
                                    <input 
                                        name="password" 
                                        type={showPassword ? "text" : "password"} 
                                        value={values.password} 
                                        onChange={handleChange} 
                                        placeholder="Введите пароль" 
                                        className={classes.sign__input3} 
                                    />
                                    <button type="button" className={classes.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.password && <span className={classes.errorUnder}> <FaExclamationCircle />{errors.password}</span>}
                            </div>

                            <div className={classes.signform__field}>
                                <label>Повторите пароль</label>
                                <div className={classes.passwordWrapper}>
                                    <input 
                                        name="repeatPassword" 
                                        type={showRepeatPassword ? "text" : "password"} 
                                        value={values.repeatPassword} 
                                        onChange={handleChange} 
                                        placeholder="Повторите пароль" 
                                        className={classes.sign__input3} 
                                    />
                                    <button type="button" className={classes.eyeIcon} onClick={() => setShowRepeatPassword(!showRepeatPassword)}>
                                        {showRepeatPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.repeatPassword && <span className={classes.errorUnder}> <FaExclamationCircle /> {errors.repeatPassword}</span>}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="sign-form__btn-container">
                <Button isBtn={true} onClick={handleContinue} className="button-type-2 sign-page-button">
                    {step === 1 ? "Продолжить" : "Зарегистрироваться"}
                </Button>
            </div>
        </form>
    );
}

export default SignUpForm;