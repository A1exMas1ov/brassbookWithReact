import { NavLink, useSearchParams } from "react-router-dom";
import './restore.css'

import ImagePipe from "../UI/ImagePipe.tsx";
import RestoreForm from "../restoreForm/RestoreForm";
import RestoreFormWithPass from "../restoreForm/RestoreFormWithPass.tsx";

function Restore() {
    const [searchParams] = useSearchParams();
    const isSuccess = searchParams.get('success') === 'true';

    return (
        <div className="sign-in">
            <div className="sign-in__container container">
                <div className="sign-in__info">
                    <NavLink to={'/signin'} className="sign-in__backlink">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M20 12H4M4 12L10 18M4 12L10 6" stroke="#190636" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {!isSuccess ? "Вернуться назад" : "Вернуться на главную"}
                    </NavLink>

                    <h1 className={"sign-in__title"}>Восстановление пароля</h1>
                    {!isSuccess ? ( 
                    <p className="sign-in__text">Введите почту, которую вы указывали при регистрации. <br/>
                       Вы еще не зарегистрированы на сайте? <NavLink to='/signup'>Зарегистрироваться</NavLink>
                    </p> ) :
                    (
                        <p className="sign-in__text">Придумайте новый пароль. <br/></p>
                    )}
                    
                </div>
                {!isSuccess ? (<RestoreForm />) : (<RestoreFormWithPass/>)}
                
                <ImagePipe />
            </div>
        </div>
    )
}

export default Restore;