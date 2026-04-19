import Button from "../button/Button.tsx";
import React, { useState, useContext } from "react";
import classes from "./signupgrid.module.css";
import { useNavigate } from "react-router-dom";
import { FaExclamationCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Context } from "../../main";
import { validateEmail, validatePassword, validatePasswordMatch, validateName, validateCompanyName, validatePosition, validateINN} from "../utils/validation";

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
        
        const nameValidation = validateName(values.name);
        if (!nameValidation.isValid) newErrors.name = nameValidation.error;
        
        const secondNameValidation = validateName(values.secondName);
        if (!secondNameValidation.isValid) newErrors.secondName = secondNameValidation.error;
        
        const companyValidation = validateCompanyName(values.companyName);
        if (!companyValidation.isValid) newErrors.companyName = companyValidation.error;
        
        const positionValidation = validatePosition(values.position);
        if (!positionValidation.isValid) newErrors.position = positionValidation.error;
        
        const innValidation = validateINN(values.inn);
        if (!innValidation.isValid) newErrors.inn = innValidation.error;
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: Record<string, string> = {};
        
        const emailValidation = validateEmail(values.email);
        if (!emailValidation.isValid) newErrors.email = emailValidation.error;
        
        const passwordValidation = validatePassword(values.password);
        if (!passwordValidation.isValid) newErrors.password = passwordValidation.error;
        
        const matchValidation = validatePasswordMatch(values.password, values.repeatPassword);
        if (!matchValidation.isValid) newErrors.repeatPassword = matchValidation.error;
        
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