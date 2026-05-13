import Button from "../button/Button.tsx";
import { useState, FC, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main.tsx";
import { FaExclamationCircle } from "react-icons/fa";

const RestoreForm: FC = () => {
    const [email, setEmail] = useState<string>('');
    //const [isConfirmed, setIsConfirmed] = useState(false);
    const [emailErr, setEmailErr] = useState('');
    //const [confirmedErr, setConfirmedErr] = useState('');
    const [formErr, setFormErr] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { store } = useContext(Context);

    const handleClick = async () => {
        setEmailErr('');
        //setConfirmedErr('');
        setFormErr('');

        let isValid = true;

        if (!email) {
            setEmailErr('Заполните обязательное поле');
            isValid = false;
        }
        // if (!isConfirmed) {
        //     setConfirmedErr('Необходимо согласиться с обработкой персональных данных');
        //     isValid = false;
        // }
        if (!isValid) return;

        setIsLoading(true);
        try {
            await store.checkEmailAndSendCode(email, true);
            navigate('/restoreauth');
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Ошибка сервера';
            setFormErr(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={(e) => e.preventDefault()} className={"sign-form sign-in-form"}>
            <div className="sign-form__fields-container">
                <div className="sign-form__field">
                    <label htmlFor="email">Почта</label>
                    {emailErr && <span className="errorUnder"><FaExclamationCircle /> {emailErr}</span>}
                    {formErr && <span className="errorUnder"><FaExclamationCircle /> {formErr}</span>}
                    <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        name="email"
                        id="email"
                        placeholder="Введите вашу почту"
                        className="sign__input"
                        type="email"
                    />
                </div>

                {/* <div className="sign-form__field" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                    <input
                        type="checkbox"
                        id="isConfirmed"
                        checked={isConfirmed}
                        onChange={e => {
                            setIsConfirmed(e.target.checked);
                            setConfirmedErr('');
                        }}
                        style={{ width: 'auto', cursor: 'pointer' }}
                    />
                    <label htmlFor="isConfirmed" style={{ cursor: 'pointer', marginBottom: 0 }}>
                        Я согласен(а) с обработкой персональных данных
                    </label>
                </div>
                {confirmedErr && <span className="errorUnder"><FaExclamationCircle /> {confirmedErr}</span>} */}
            </div>
            <div className="sign-form__btn-container">
                <Button onClick={handleClick} isBtn={true} className="button-type-2 sign-page-button" disabled={isLoading}>
                    {isLoading ? 'Отправляем...' : 'Продолжить'}
                </Button>
            </div>
        </form>
    );
};

export default RestoreForm;