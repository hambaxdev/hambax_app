// src/utils/validation.js

export const validateEmailAndPassword = (email, password, confirmPassword) => {
    const errors = {};

    if (!email) {
        errors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = 'Некорректный email';
    }

    if (!password) {
        errors.password = 'Пароль обязателен';
    } else if (password.length < 6) {
        errors.password = 'Пароль должен быть не менее 6 символов';
    }

    if (!confirmPassword) {
        errors.confirmPassword = 'Подтверждение пароля обязательно';
    }

    if (password !== confirmPassword) {
        errors.confirmPassword = 'Пароли не совпадают';
    }

    return errors;
};

export const validatePhase1 = (email, password, confirmPassword) => {
    return validateEmailAndPassword(email, password, confirmPassword);
};

export const validatePhase2 = (firstName, lastName, citizenship) => {
    const errors = {};

    if (!firstName) {
        errors.firstName = 'Имя обязательно';
    }
    if (!lastName) {
        errors.lastName = 'Фамилия обязательна';
    }
    if (!citizenship) {
        errors.citizenship = 'Гражданство обязательно';
    }

    return errors;
};

export const validatePhase3 = (country, city, zipCode, streetName) => {
    const errors = {};

    if (!country) {
        errors.country = 'Страна обязательна';
    }
    if (!city) {
        errors.city = 'Город обязателен';
    }
    if (!zipCode) {
        errors.zipCode = 'Почтовый индекс обязателен';
    }
    if (!streetName) {
        errors.streetName = 'Название улицы обязательно';
    }

    return errors;
};

export const validatePhase4 = (organizationName, taxNumber, address, phone, website, agreedToTerms) => {
    const errors = {};

    if (!organizationName) {
        errors.organizationName = 'Название организации обязательно';
    }
    if (!taxNumber) {
        errors.taxNumber = 'Налоговый номер обязателен';
    }
    if (!address) {
        errors.address = 'Адрес обязателен';
    }
    if (!phone) {
        errors.phone = 'Телефон обязателен';
    }
    if (!website) {
        errors.website = 'Веб-сайт обязателен';
    }
    if (!agreedToTerms) {
        errors.agreedToTerms = 'Вы должны согласиться с условиями';
    }

    return errors;
};
