import Header from "./header/Header.tsx";
import Restore from "./restore/Restore.tsx";
interface RestorePageProps {
    type?: string
}
function RestorePage({}: RestorePageProps) {
    return(
        <>
            <Header headerStyle={'header_padding-34'} headerContainerStyle={'header__container_without-enter'} logoStyle={'header__logo_black'} linkStyle={'nav__link_black'}/>
            <Restore />
        </>
    )
}

export default RestorePage