const TRANSLATE = new Map<string, Set<string>>([
    ['jan', new Set(['dejaneirode', 'january', 'ocak', 'enero', 'janvier', 'января', 'январь', 'янв', 'ene', 'jan', 'sty'])],
    ['feb', new Set(['defevereirode', 'february', 'şubat', 'febrero', 'février', 'февраля', 'февраль', 'фев', 'feb', 'fév', 'lut'])],
    ['mar', new Set(['demarçode', 'march', 'mart', 'marzo', 'mars', 'марта', 'март', 'мар', 'mar'])],
    ['apr', new Set(['deabrilde', 'april', 'nisan', 'abril', 'avril', 'апреля', 'апрель', 'апр', 'abr', 'avr', 'kwi'])],
    ['may', new Set(['demaiode', 'may', 'mayıs', 'mayo', 'mai', 'мая', 'май', 'maja'])],
    ['jun', new Set(['dejunhode', 'june', 'haziran', 'junio', 'juin', 'июня', 'июнь', 'июн', 'jun', 'cze'])],
    ['jul', new Set(['dejulhode', 'july', 'temmuz', 'julio', 'juillet', 'июля', 'июль', 'июл', 'jul', 'juil', 'lip'])],
    ['aug', new Set(['deagostode', 'august', 'ağustos', 'agosto', 'août', 'августа', 'август', 'авг', 'ago', 'aoû', 'sie'])],
    ['sep', new Set(['desetembrode', 'september', 'eylül', 'septiembre', 'septembre', 'сентября', 'сентябрь', 'сен', 'sep', 'wrz'])],
    ['oct', new Set(['deoutubrode', 'october', 'ekim', 'octubre', 'octobre', 'октября', 'октябрь', 'окт', 'oct', 'paź'])],
    ['nov', new Set(['denovembrode', 'november', 'kasım', 'noviembre', 'novembre', 'ноября', 'ноябрь', 'ноя', 'nov', 'lis'])],
    ['dec', new Set(['dedezembrode', 'december', 'aralık', 'diciembre', 'décembre', 'декабря', 'декабрь', 'дек', 'dic', 'déc', 'gru'])],
    ['yesterday', new Set(['yesterday', 'вчера', 'wczoraj', 'hier'])],
    ['today', new Set(['today', 'сегодня', 'aujourd\'hui'])]
]);

const translate = (str: string): string => {
    const reg = /([a-zа-яA-ZА-ЯçŞğéüûıź]+)/;
    return str.replace(reg, word => {
        for (const [key, set] of TRANSLATE) {
            if (set.has(word)) {
                return key;
            }
        }
        return word;
    });
};

export const isValidDate = (date: Date | any) => date instanceof Date && !isNaN(+date);

export const parseDate = (str: string): Date => {
    str = translate(str.toLowerCase());

    // YYYYMMdd
    {
        const reg = /(20|19)(\d{2})(\d{2})(\d{2})/;
        if (reg.test(str)) {
            const date = new Date(str.replace(reg, '$1$2-$3-$4').trim());
            if (isValidDate(date)) {
                return date;
            }
        }
    }

    // d.MM.YYYY
    // d.M.YYYY
    // dd-MM-YYYY
    // d-M-YYYY
    // dd.MM.YYYY hh:mm
    // d.M.YYYY hh:mm
    // dd-MM-YYYY, hh:mm:ss
    {
        const reg = /(\d{1,2})[.\-\/ \\](\d{1,2})[.\-\/ \\](\d{4}),?\s?(\d{1,2}:\d{1,2}(:\d{1,2})?)?/;
        if (reg.test(str)) {
            const date = new Date(str.replace(reg, '$3-$2-$1 $4 ').trim());
            if (isValidDate(date)) {
                return date;
            }
        }
    }

    // dd MMM YYYY at h:mm
    // dd MMM YYYY at h:mm:ss
    // dd MMM YYYY at h:mm a
    // dd MMM YYYY at h:mm:ss a
    // dd MMM YYYY, hh:mm
    // dd-MMMM-YYYY, hh:mm
    // d MMM YYYY, hh:mm
    // dd MMM YYYY
    // d MMM YYYY
    // d MMM, YYYY
    // d MMM, YYYY - hh:mm
    // d MMM, YYYY - hh:mm a
    // d MMM, YYYY - hh:mm:ss
    // d MMM, YYYY - hh:mm:ss a
    {
        const reg = /(\d{1,2})[.\-\/ \\]([a-z]{3}),?[.\-\/ \\](\d{4}),?\s?(at|-)?\s?(\d{1,2}:\d{1,2}(:\d{1,2})?(\s(am|pm)?))?/;
        if (reg.test(str)) {
            const date = new Date(str.replace(reg, '$1 $2 $3 $5 ').trim());
            if (isValidDate(date)) {
                return date;
            }
        }
    }

    // MMM dd, YYYY, hh:mm:ss
    // MMM dd, YYYY, hh:mm:ss a
    // MMM dd, YYYY, hh:mm
    // MMM dd, YYYY, hh:mm a
    // MMM dd, YYYY
    // MMM dd YYYY
    // MMM dd, YYYY at h:mm a
    {
        const reg = /([a-z]{3})[.\-\/ \\](\d{1,2}),?[.\-\/ \\](\d{4}),?(\s\D+)?\s?(\d{1,2}:\d{1,2}:?\d{1,2})?\s?(am|pm)?/;
        if (reg.test(str)) {
            const date = new Date(str.replace(reg, '$1 $2 $3 $5 $6 ').trim());
            if (isValidDate(date)) {
                return date;
            }
        }
    }

    // YYYY-MM-dd
    // YYYY.MM.dd
    // YYYY/MM/dd
    // YYYY-MM-dd hh:mm
    // YYYY-MM-dd hh:mm a
    // YYYY-MM-dd hh:mm:ss
    {
        const reg = /(\d{4})[.\-\/ \\](\d{1,2})[.\-\/ \\](\d{1,2})\s?(\d{1,2}:\d{1,2}:?(\d{1,2})?(\s(am|pm))?)?/;
        if (reg.test(str)) {
            const date = new Date(str.replace(reg, '$1-$2-$3 $4 ').trim());
            if (isValidDate(date)) {
                return date;
            }
        }
    }

    // Сегодня
    // Yesterday
    // Сегодня, hh:mm
    // today at h:mm a
    // today at h:mm:ss a
    // Вчера, hh:mm
    // yesterday at h:mm a
    // yesterday at h:mm:ss a
    {
        const reg = /(yester|to)day(,)?\s?(at\s)?((\d{1,2}):(\d{1,2}):?(\d{1,2})?(\s(am|pm))?)?/;
        if (reg.test(str)) {
            const date = new Date();
            const [h, m, s, a] = str.replace(reg, '$5/$6/$7/$8').split('/');
            if (h.length) {
                let hours = +h;
                if (a.indexOf('pm') !== -1) {
                    hours += 12;
                }
                date.setHours(hours);
            }
            if (m.length) {
                date.setMinutes(+m);
            }
            if (s.length) {
                date.setSeconds(+s);
            }
            if (/yesterday/.test(str)) {
                date.setDate(date.getDate() - 1);
            }
            if (isValidDate(date)) {
                return date;
            }
        }
    }

    // 1
    // 12
    // 12.
    // 12-
    // 12/
    // 12.0
    // 12.4
    // 12.04
    // 12.04.20
    // 12.04.2021
    {
        const reg = /(\d{1,2})?([.\-\/ \\](\d{1,2}))?([.\-\/ \\](\d{1,4}))?/;
        if (reg.test(str)) {
            const date = new Date();
            const [d, m, y] = str.replace(reg, '$1/$3/$5').split('/').map(x => parseInt(x, 10));
            if (d) {
                date.setDate(d);
            }
            if (m) {
                date.setMonth(m - 1);
            }
            if (y) {
                let year = y;
                if (y < 1000) {
                    year = 1000 + y;
                }
                if (y < 100) {
                    year = 1900 + y;
                }
                if (y < 25) {
                    year = 2000 + y;
                }
                date.setFullYear(year);
            }
            return date;
        }

    }

    throw new Error(`[Date parsing error] : ${ str }`);
};
