export const validateEmail = (email: string): { isValid: boolean; error: string } => {
    const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    
    if (!email) {
        return { isValid: false, error: 'Заполните обязательное поле' };
    }
    if (!re.test(String(email).toLowerCase())) {
        return { isValid: false, error: 'Почта указана некорректно' };
    }
    return { isValid: true, error: '' };
};

export const validatePassword = (password: string): { isValid: boolean; error: string } => {
    if (!password) {
        return { isValid: false, error: 'Заполните обязательное поле' };
    }
    if (password.length < 8 || password.length > 25) {
        return { isValid: false, error: 'Пароль должен быть от 8 до 25 символов' };
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
        return { isValid: false, error: 'Пароль должен состоять из букв верхнего и нижнего регистра и хотя бы одного символа' };
    }
    return { isValid: true, error: '' };
};

export const validatePasswordMatch = (password: string, repeatPassword: string): { isValid: boolean; error: string } => {
    if (password !== repeatPassword) {
        return { isValid: false, error: 'Пароли не совпадают' };
    }
    return { isValid: true, error: '' };
};

export const validateName = (name: string): { isValid: boolean; error: string } => {
    const nameRegex = /^[а-яА-Яa-zA-Z\s]+$/;
    
    if (!name) {
        return { isValid: false, error: 'Заполните обязательное поле' };
    }
    if (!nameRegex.test(name) || name.length > 25) {
        return { isValid: false, error: 'Имя/Фамилия содержит от 1 до 25 букв' };
    }
    return { isValid: true, error: '' };
};

export const validateINN = (inn: string): { isValid: boolean; error: string } => {
    const innRegex = /^\d{10}$|^\d{12}$/;
    
    if (!inn) {
        return { isValid: false, error: 'Заполните обязательное поле' };
    }
    if (!innRegex.test(inn)) {
        return { isValid: false, error: 'ИНН должен содержать 10 или 12 цифр' };
    }
    return { isValid: true, error: '' };
};

export const validateCompanyName = (name: string): { isValid: boolean; error: string } => {
    if (!name) {
        return { isValid: false, error: 'Заполните обязательное поле' };
    }
    if (name.length > 50) {
        return { isValid: false, error: 'Название компании до 50 символов' };
    }
    return { isValid: true, error: '' };
};

export const validatePosition = (position: string): { isValid: boolean; error: string } => {
    if (!position) {
        return { isValid: false, error: 'Заполните обязательное поле' };
    }
    if (position.length > 50) {
        return { isValid: false, error: 'Должность до 50 символов' };
    }
    return { isValid: true, error: '' };
};