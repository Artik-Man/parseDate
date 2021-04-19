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
    ['today', new Set(['today', 'сегодня', 'aujourd\'hui'])],
    ['at', new Set(['at', 'в'])]
]);

const translate = (str: string): string => {
    const reg = /([a-zа-яёçŞğéüûıź]+)/gi;
    return str.toLowerCase().replace(reg, word => {
        for (const [key, set] of TRANSLATE) {
            if (set.has(word)) {
                return key;
            }
        }
        return word;
    });
};

const months = ['', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

const logger = (log: boolean, input: string, date: Date, parser: string): void => {
    if (log) {
        console.group('[simple-date-parser]:logger');
        console.log('Parser: ' + parser)
        console.log(input);
        console.dir(date);
        console.groupEnd();
    }
}

const numberFormat = (num: number, count = 2): string => {
    return ('0' + num).slice(-count);
};

const createDate = (Y: number | string, M?: number | string, D?: number | string, h?: number | string, m?: number | string, s?: number | string, a?: string): Date => {

    let year: number = parseInt(Y + '', 10);

    if (year < 25) {
        year = 2000 + year;
    } else if (year < 100) {
        year = 1900 + year;
    } else if (year < 1000) {
        year = 1000 + year;
    }

    const month: number = parseInt(M + '', 10) || 1;

    const day: number = parseInt(D + '', 10) || 1;

    let hours = 0, minutes = 0, seconds = 0;
    if (h) {
        hours = parseInt(h + '', 10) || 0;
        if (a?.trim() === 'pm') {
            hours += 12;
        }
    }
    if (m) {
        minutes = parseInt(m + '', 10) || 0;
    }
    if (s) {
        seconds = parseInt(s + '', 10) || 0;
    }

    const iso = `${ year }-${ numberFormat(month) }-${ numberFormat(day) }T${ numberFormat(hours) }:${ numberFormat(minutes) }:${ numberFormat(seconds) }.000Z`

    return new Date(iso);
}

export const isValidDate = (date: Date | any) => date instanceof Date && !isNaN(+date);

export const parseDate = (str: string, log = false): Date => {
    str = translate(str);

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
        const reg = /(\d{1,2})[.\-\/ \\]([a-z]{3}),?[.\-\/ \\](\d{2,4}),?\s?(at|-)?\s?(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?(\s(am|pm))?/;
        if (reg.test(str)) {
            const match = str.match(reg);
            if (match) {
                console.log(match)
                const [, d, M, y, , h, m, s, a] = match;
                const date = createDate(y, months.indexOf(M), d, h, m, s, a);
                if (isValidDate(date)) {
                    logger(log, str, date, 'dd MMM YYYY at h:mm');
                    return date;
                }
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
        const reg = /([a-z]{3})[.\-\/ \\](\d{1,2}),?[.\-\/ \\](\d{4}),?(\s\D+)?\s?(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?\s?(am|pm)?/;
        if (reg.test(str)) {
            const match = str.match(reg);
            if (match) {
                // console.log(match)
                const [, M, d, y, , h, m, s, a] = match;
                const date = createDate(y, months.indexOf(M), d, h, m, s, a);

                if (isValidDate(date)) {
                    logger(log, str, date, 'MMM dd, YYYY, hh:mm:ss');
                    return date;
                }
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
        const reg = /(yesterday|today)(,)?\s?(at\s)?((\d{1,2}):(\d{1,2}):?(\d{1,2})?(\s(am|pm))?)?/;
        if (reg.test(str)) {
            const match = str.match(reg);
            if (match) {
                const d = new Date();
                const [, kw, , , , h, m, s, a] = match;
                if (kw === 'yesterday') {
                    d.setDate(d.getDate() - 1);
                }

                let Y = d.getFullYear(),
                    M = d.getMonth() + 1,
                    D = d.getDate();

                const date = createDate(Y, M, D, h, m, s, a);

                if (isValidDate(date)) {
                    logger(log, str, date, 'yesterday at h:mm:ss a');
                    return date;
                }
            }
        }
    }

    // d
    // dd
    // dd.
    // dd-
    // dd/
    // dd.M
    // dd.MM
    // dd.MM.YY
    // dd.MM.YYYY
    // dd.MM.YYYY, hh:mm:ss
    {
        const reg = /(\d{1,2})([.\-\/ \\](\d{1,2}))?([.\-\/ \\](\d{1,4}))?,?\s?(\d{1,2})?([.:\-\/ \\](\d{1,2}))?([.:\-\/ \\](\d{1,2}))?/;
        if (reg.test(str)) {
            const match = str.match(reg);
            if (match) {
                const [, D, , M, , Y, h, , m, , s] = match;
                // console.log(match)
                const date = createDate(Y, M, D, h, m, s);

                if (isValidDate(date)) {
                    logger(log, str, date, 'dd.MM.YYYY, hh:mm:ss');
                    return date;
                }
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
        const reg = /(\d{4})[.\-\/ \\]?(\d{1,2})?[.\-\/ \\]?(\d{1,2})?\s?(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?(\s(am|pm))?/;
        if (reg.test(str)) {
            const match = str.match(reg);
            if (match) {
                // console.log(match)
                const [, y, M, d, h, m, s, , a] = match;
                const date = createDate(y, M, d, h, m, s, a);

                if (isValidDate(date)) {
                    logger(log, str, date, 'YYYY-MM-dd hh:mm:ss');
                    return date;
                }
            }
        }
    }

    throw new Error(`[Date parsing error] : ${ str }`);
};

