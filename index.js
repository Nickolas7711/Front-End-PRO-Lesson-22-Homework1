let userData = {
    'USD': 1000,
    'EUR': 900,
    'UAH': 15000,
    'BIF': 20000,
    'AOA': 100
};

let bankData = {
    'USD': {
        max: 3000,
        min: 100,
        img: '💵'
    },
    'EUR': {
        max: 1000,
        min: 50,
        img: '💶'
    },
    'UAH': {
        max: 0,
        min: 0,
        img: '💴'
    },
    'GBP': {
        max: 10000,
        min: 100,
        img: '💷'
    }
};

function getUserInput(message) {
    return new Promise(resolve => {
        const userInput = confirm(message);
        resolve(userInput);
    });
}

function getCurrencyBalance(userData) {
    const availableCurrencies = Object.keys(userData);
    return new Promise((resolve, reject) => {
        function requestCurrency() {
            let currency = prompt(`Введіть назву валюти (${availableCurrencies.join(', ')}):`);
            if (currency === null) {
            reject('Ви скасували введення назви валюти.');
            } else {
                currency = currency.toUpperCase();
                if (userData.hasOwnProperty(currency)) {
                    resolve(currency);
                } else {
                    console.log('Введена недопустимая валюта.');
                    requestCurrency();
                }
            }
        }
        requestCurrency();
    });
}

function getAmountForWithdrawal(currency, bankData) {
    return new Promise((resolve, reject) => {
        const maxAmount = bankData[currency].max;
        const minAmount = bankData[currency].min;
        let amount = parseFloat(prompt(`Введіть суму для зняття (${currency}):`));

        if (isNaN(amount) || amount < minAmount) {
            reject(`Введена сума менша за допустимий мінімум. Мінімальна сума виведення: ${minAmount}`);
        } else if (amount > maxAmount) {
            reject(`Введена сума перевищує дозволений максимум. Максимальна сума виводу: ${maxAmount}`);
        } else {
            resolve(amount);
        }
    });
}

async function getMoney(userData, bankData) {
    const mssCurrencyNotAvailable = 'Валюта відсутня у банкоматі.';

    try {
        const isViewBalance = await getUserInput('Переглянути баланс карти?');
        if (isViewBalance) {
            const currency = await getCurrencyBalance(userData, bankData);
            console.log(`Баланс: ${userData[currency]} ${currency}`);
        } else {
            const currency = await getCurrencyBalance(userData, bankData);
            try {
                if (bankData.hasOwnProperty(currency)) {
                    const amount = await getAmountForWithdrawal(currency, bankData);
                    userData[currency] -= amount;
                    console.log(`Ось ваша готівка: ${amount} ${currency} ${bankData[currency].img}`);
                } else {
                    console.log(mssCurrencyNotAvailable);
                }
            } catch (err) {
                console.log(err);
            }
        } 
    } catch (err) {
        console.log(err);
    } finally {
        console.log('Дякуємо, гарного дня 😊');
    }
}

getMoney(userData, bankData);