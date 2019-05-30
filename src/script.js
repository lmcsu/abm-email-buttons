import './style.scss';
import icons from './icons/index';
import { ResizeObserver } from 'resize-observer';

class abmEmailButtons {
    static services = {
        mailru: {
            caption: 'Mail.ru',
            link: 'https://e.mail.ru/',
            imgSmall: icons.mailruSmall,
            imgLarge: icons.mailruLarge,
            domains: [
                'mail.ru',
                'inbox.ru',
                'list.ru',
                'bk.ru',
            ],
        },
        yandex: {
            caption: 'Яндекс',
            link: 'https://mail.yandex.ru/',
            imgSmall: icons.yandexSmall,
            imgLarge: icons.yandexLarge,
            domains: [
                'yandex.ru',
                'ya.ru',
                'yandex.com',
            ],
        },
        gmail: {
            caption: 'Google',
            link: 'https://mail.google.com/',
            imgSmall: icons.gmailSmall,
            imgLarge: icons.gmailLarge,
            domains: [
                'gmail.com',
            ]
        },
    };

    static className = 'abm-email-buttons';

    /** @type HTMLElement */
    element = null;

    /** @type string | null */
    domain = null;

    /** @type ResizeObserver */
    resizeObserver = null;

    constructor(element) {
        this.element = element;
        this.findEmailDomain();
        this.initResizeObserver();
        this.createButtons();
    }

    findEmailDomain = () => {
        const params = window.location.search.substring(1).split('&');
        const arr = {};
        params.forEach((param) => {
            const pair = param.split('=');
            arr[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        });
        const email = arr['user_email'] || '';
        const emailPair = email.split('@');
        this.domain = emailPair[1] || false;
    };

    initResizeObserver = () => {
        const breakPoints = [
            [510, 'L'],
            [425, 'M'],
            [375, 'S'],
            [320, 'XS'],
            [0, 'XXS'],
        ];
        const classPrefix = abmEmailButtons.className + '_size-';

        this.resizeObserver = new ResizeObserver((entries) => {
            console.log(123456);
            for (const entry of entries) {
                const classes = this.element.className.split(' ').filter((name) => {
                    return name.indexOf(classPrefix) === -1;
                });
                const { width } = entry.contentRect;
                for (let i = 0; i < breakPoints.length; i++) {
                    const bp = breakPoints[i];
                    classes.push(classPrefix + bp[1]);
                    if (width >= bp[0]) {
                        break;
                    }
                }
                this.element.className = classes.join(' ');
            }
        });
        this.resizeObserver.observe(this.element);
    };

    createButtons = () => {
        let currentServiceName = false;
        const serviceNames = [];
        for (let serviceName in abmEmailButtons.services) {
            if (abmEmailButtons.services.hasOwnProperty(serviceName)) {
                serviceNames.push(serviceName);
                if (abmEmailButtons.services[serviceName].domains.indexOf(this.domain) !== -1) {
                    currentServiceName = serviceName;
                    break;
                }
            }
        }
        if (currentServiceName) {
            this.addButton(currentServiceName, true);
            this.element.className += ' ' + abmEmailButtons.className + '_single';
        } else {
            serviceNames.forEach((serviceName) => {
                this.addButton(serviceName, false);
            });
        }
    };

    addButton = (serviceName, single = false) => {
        const createElement = (tagName, appendTo, attrs, content = '') => {
            const el = document.createElement(tagName);
            for (let attrName in attrs) {
                if (attrs.hasOwnProperty(attrName)) {
                    el.setAttribute(attrName, attrs[attrName]);
                }
            }
            el.innerHTML = content;
            appendTo.appendChild(el);
            return el;
        };
        const service = abmEmailButtons.services[serviceName];
        const classPrefix = abmEmailButtons.className + '__';

        const button = createElement('a', this.element, {
            href: service.link,
            target: '_blank',
            'class': classPrefix + 'button',
        });
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const X = e.pageX - rect.x - (window.pageXOffset || document.documentElement.scrollLeft);
            const Y = e.pageY - rect.y - (window.pageYOffset || document.documentElement.scrollTop);
            let rippleDiv = createElement('div', button, {
                style: `left: ${X}px; top: ${Y}px;`,
                'class': classPrefix + 'button-ripple',
            });
            setTimeout(() => {
                rippleDiv.parentElement.removeChild(rippleDiv);
            }, 900);
        });

        const currentImg = single ? service.imgLarge : service.imgSmall;
        createElement('img', button, {
            src: currentImg.src,
            width: currentImg.width,
            height: currentImg.height,
            'class': classPrefix + 'img',
        });
        if (!single) {
            createElement('div', button, {
                'class': classPrefix + 'caption',
            }, service.caption);
        }
    };

    static initializeAll = () => {
        document.querySelectorAll('.' + abmEmailButtons.className).forEach((element) => {
            if (element.hasAttribute('data-init')) {
                return;
            }
            new abmEmailButtons(element);
            element.setAttribute('data-init', 1);
        });
    }
}
abmEmailButtons.initializeAll();
