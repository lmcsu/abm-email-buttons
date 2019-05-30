// import mailruSmallSrc from './mailru_small.png';
// import yandexSmallSrc from './yandex_small.png';
// import gmailSmallSrc from './gmail_small.png';
// import mailruLargeSrc from './mailru_large.jpeg';
// import yandexLargeSrc from './yandex_large.jpeg';
// import gmailLargeSrc from './gmail_large.jpeg';

const baseUrl = 'https://static.worldwideshop.ru/abm-email-buttons/';

const mailruSmallSrc = baseUrl + 'mailru_small.png';
const yandexSmallSrc = baseUrl + 'yandex_small.png';
const gmailSmallSrc = baseUrl + 'gmail_small.png';
const mailruLargeSrc = baseUrl + 'mailru_large.jpeg';
const yandexLargeSrc = baseUrl + 'yandex_large.jpeg';
const gmailLargeSrc = baseUrl + 'gmail_large.jpeg';

const mailruSmall = {
    src: mailruSmallSrc,
    width: 46,
    height: 37,
};
const yandexSmall = {
    src: yandexSmallSrc,
    width: 46,
    height: 35,
};
const gmailSmall = {
    src: gmailSmallSrc,
    width: 46,
    height: 34,
};
const mailruLarge = {
    src: mailruLargeSrc,
    width: 236,
    height: 104,
};
const yandexLarge = {
    src: yandexLargeSrc,
    width: 236,
    height: 173,
};
const gmailLarge = {
    src: gmailLargeSrc,
    width: 236,
    height: 105,
};

export default {
    mailruSmall,
    yandexSmall,
    gmailSmall,
    mailruLarge,
    yandexLarge,
    gmailLarge,
}
