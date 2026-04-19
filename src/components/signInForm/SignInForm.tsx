import "./signInForm.css";
import Button from "../button/Button.tsx";
import React, {useState, FC, useContext} from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { Context } from "../../main.tsx";
import { FaExclamationCircle } from "react-icons/fa";

const SignInForm: FC = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //const [isLoading, setIsLoading] = useState(false); 
    const [emailErr, setEmailErr] = useState('');
    const [passwordErr, setPasswordErr] = useState('');

    const navigate = useNavigate();
    const {store} = useContext(Context);

    const validateForm = () => {
        let isValidate = true
        if (!email) {
            setEmailErr('Заполните обязательное поле')
            isValidate = false
        }
        if (!password) {
            setPasswordErr('Заполните обязательное поле')
            isValidate = false
        }
        return isValidate
    }

    const handleClick = async (e: any) => {
        if (validateForm()) {
            try {
                await store.login(email, password)  
                navigate('/user')                 
            } catch (e) {
                    console.log(e);
            }
        }
    }

    return (
        <form onSubmit={(e) => e.preventDefault()}  className={"sign-form sign-in-form" + ''}>
            <div className="sign-form__fields-container">
                <div className="sign-form__field">
                    <label htmlFor="email">Почта</label>
                    {emailErr && <span className="errorUnder"> <FaExclamationCircle /> {emailErr}</span>}
                    <input value={email} onChange={e => setEmail(e.target.value)} name="email" id="email" placeholder="Введите вашу почту" className="sign__input" type="email" />
                </div>
                <div className="sign-form__field">
                    <label htmlFor="password">Пароль</label>
                    {passwordErr && <span className="errorUnder"> <FaExclamationCircle /> {passwordErr}</span>}
                    <input value={password} onChange={e => setPassword(e.target.value)} name="password" id="password" placeholder="Введите пароль" className="sign__input" type="password" />
                </div>
            </div>
            <div className="sign-form__btn-container ">
                <Button onClick={handleClick} isBtn={true} className="button-type-2 sign-page-button" >Войти</Button>
            </div>
        </form>
    );
};

export default SignInForm;