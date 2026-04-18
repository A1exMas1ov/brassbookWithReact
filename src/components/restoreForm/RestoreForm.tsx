import Button from "../button/Button.tsx";
import React, {useState, FC, useContext} from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { Context } from "../../main.tsx";

const RestoreForm: FC = () => {

    const [email, setEmail] = useState<string>('')
    const navigate = useNavigate()
    const {store} = useContext(Context)
    const handleClick = (e: any) => {
        e.preventDefault()
        store.checkEmailAndSendCode(email)
        navigate('/signupauth')
    }

    return (
        <form action="" className={"sign-form sign-in-form" + ''}>
            <div className="sign-form__fields-container">
                <div className="sign-form__field">
                    <label htmlFor="email">Почта</label>
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