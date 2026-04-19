import Button from "../button/Button.tsx";
import React, {useState, FC, useContext} from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { Context } from "../../main.tsx";
import { FaExclamationCircle } from "react-icons/fa";

const RestoreForm: FC = () => {

    const [email, setEmail] = useState<string>('')
    const [emailErr, setEmailErr] = useState('');
    const navigate = useNavigate()
    const {store} = useContext(Context)

    const handleClick = () => {
        if (!email) {
            setEmailErr('Заполните обязательное поле')
        }
        else {
            store.checkEmailAndSendCode(email)
            navigate('/restoreauth')
        }
    }

    return (
        <form onSubmit={(e) => e.preventDefault()} className={"sign-form sign-in-form" + ''}>
            <div className="sign-form__fields-container">
                <div className="sign-form__field">
                    <label htmlFor="email">Почта</label>
                    {emailErr && <span className="errorUnder"> <FaExclamationCircle /> {emailErr}</span>}
                    <input value={email} onChange={e => setEmail(e.target.value)} name="email" id="email" placeholder="Введите вашу почту" className="sign__input" type="email"></input>
                </div>
            </div>
            <div className="sign-form__btn-container ">
                <Button onClick={handleClick}  isBtn={true} className="button-type-2 sign-page-button">Продолжить</Button>
            </div>
        </form>
    );
};

export default RestoreForm;