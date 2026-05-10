import { UserRole } from "../models/enums/UserRole";
import { UserStatus } from "../models/enums/UserStatus";

export interface RegistrationData {
    email: string;
    password: string;
    roleName: UserRole;    // обязательно — ROLE_COMPANY | ROLE_PERSONAL | ROLE_ANONYMOUS
    status: UserStatus;    // обязательно — ACTIVATE | DEACTIVATE
    code: string;          // обязательно — код подтверждения из email
    firstName?: string;    // было name
    lastName?: string;     // было secondName
    companyName?: string;
    profession?: string;   // было position
    inn?: number;          // бэк ждёт Long — передавай числом, не строкой
}