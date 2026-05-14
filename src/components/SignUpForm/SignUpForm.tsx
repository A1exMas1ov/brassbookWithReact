import Button from "../button/Button.tsx";
import React, { useState, useContext } from "react";
import classes from "./signupgrid.module.css";
import { useNavigate } from "react-router-dom";
import { FaExclamationCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Context } from "../../main";
import { UserRole } from "../../../models/enums/UserRole";
import { UserStatus } from "../../../models/enums/UserStatus";
import { validateEmail, validatePassword, validatePasswordMatch, validateName, validateCompanyName, validatePosition, validateINN } from "../utils/validation";

function SignUpForm({ className }: { className?: string }) {
    const navigate = useNavigate();
    const { store } = useContext(Context);

    const [step, setStep] = useState(1);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        companyName: '',
        profession: '',
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

        const nameValidation = validateName(values.firstName);
        if (!nameValidation.isValid) newErrors.firstName = nameValidation.error;

        const secondNameValidation = validateName(values.lastName);
        if (!secondNameValidation.isValid) newErrors.lastName = secondNameValidation.error;

        const companyValidation = validateCompanyName(values.companyName);
        if (!companyValidation.isValid) newErrors.companyName = companyValidation.error;

        const positionValidation = validatePosition(values.profession);
        if (!positionValidation.isValid) newErrors.profession = positionValidation.error;

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

        if (!isConfirmed) {
            newErrors.confirmed = 'Необходимо согласиться с обработкой персональных данных';
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
                setIsLoading(true);
                try {
                    await store.sendCode(values.email, isConfirmed);
                    store.pendingRegistration = {
                        email: values.email,
                        password: values.password,
                        roleName: UserRole.ROLE_COMPANY,
                        status: UserStatus.ACTIVATE,
                        firstName: values.firstName,
                        lastName: values.lastName,
                        companyName: values.companyName,
                        profession: values.profession,
                        inn: values.inn ? Number(values.inn) : undefined,
                        code: ''
                    };
                    navigate('/signupauth');
                } catch (e: unknown) {
                    const msg = e instanceof Error ? e.message : 'Ошибка сервера';
                    setErrors({ form: msg });
                } finally {
                    setIsLoading(false);
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
                                    <input name="firstName" value={values.firstName} onChange={handleChange} placeholder="Введите имя" className={classes.sign__input1} />
                                    {errors.firstName && <span className={classes.errorUnder}><FaExclamationCircle /> {errors.firstName}</span>}
                                </div>
                                <div className={classes.signform__field}>
                                    <label>Фамилия</label>
                                    <input name="lastName" value={values.lastName} onChange={handleChange} placeholder="Введите фамилию" className={classes.sign__input2} />
                                    {errors.lastName && <span className={classes.errorUnder}><FaExclamationCircle /> {errors.lastName}</span>}
                                </div>
                            </div>

                            <div className={classes.div_second}>
                                <div className={classes.signform__field}>
                                    <label>Название компании</label>
                                    <input name="companyName" value={values.companyName} onChange={handleChange} placeholder="Название компании" className={classes.sign__input3} />
                                    {errors.companyName && <span className={classes.errorUnder}><FaExclamationCircle /> {errors.companyName}</span>}
                                </div>
                            </div>

                            <div className={classes.div_third}>
                                <div className={classes.signform__field}>
                                    <label>Должность</label>
                                    <input name="profession" value={values.profession} onChange={handleChange} placeholder="Ваша должность" className={classes.sign__input4} />
                                    {errors.profession && <span className={classes.errorUnder}><FaExclamationCircle /> {errors.profession}</span>}
                                </div>
                                <div className={classes.signform__field}>
                                    <label>ИНН</label>
                                    <input name="inn" value={values.inn} onChange={handleChange} placeholder="Введите ИНН" className={classes.sign__input5} />
                                    {errors.inn && <span className={classes.errorUnder}><FaExclamationCircle /> {errors.inn}</span>}
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
                                    {errors.email && <span className={classes.errorUnder}><FaExclamationCircle /> {errors.email}</span>}
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
                                    <button type="button" className={classes.button_show_password} onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.password && <span className={classes.errorUnder}><FaExclamationCircle /> {errors.password}</span>}
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
                                    <button type="button" className={classes.button_show_password} onClick={() => setShowRepeatPassword(!showRepeatPassword)}>
                                        {showRepeatPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.repeatPassword && <span className={classes.errorUnder}><FaExclamationCircle /> {errors.repeatPassword}</span>}
                            </div>

                            <div className={classes.signform__field} style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="checkbox"
                                    id="isConfirmed"
                                    checked={isConfirmed}
                                    onChange={e => {
                                        setIsConfirmed(e.target.checked);
                                        if (errors.confirmed) setErrors({ ...errors, confirmed: '' });
                                    }}
                                    style={{ width: 'auto', cursor: 'pointer' }}
                                />
                                <label htmlFor="isConfirmed" style={{ cursor: 'pointer', marginBottom: 0 }}>
                                    Я согласен(а) с обработкой персональных данных
                                </label>
                            </div>
                            {errors.confirmed && <span className={classes.errorUnder}><FaExclamationCircle /> {errors.confirmed}</span>}

                            {errors.form && (
                                <span className={classes.errorUnder}><FaExclamationCircle /> {errors.form}</span>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="sign-form__btn-container">
                <Button isBtn={true} onClick={handleContinue} className="button-type-2 sign-page-button" disabled={isLoading}>
                    {isLoading ? 'Отправляем...' : 'Продолжить'}
                </Button>
            </div>
        </form>
    );
}

export default SignUpForm;