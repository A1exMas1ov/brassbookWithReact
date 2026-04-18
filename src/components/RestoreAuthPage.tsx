import Header from "./header/Header.tsx";
import RestoreAuth from "./restoreAuth/restoreAuth.tsx";
interface RestoreProps{
    type?: string
}
function RestoreAuthPage({}: RestoreProps) {
    return(
        <>
            <Header headerStyle={'header_padding-34'} headerContainerStyle={'header__container_without-enter'} logoStyle={'header__logo_black'} linkStyle={'nav__link_black'}/>
            <RestoreAuth />
        </>
    )
}

export default RestoreAuthPage