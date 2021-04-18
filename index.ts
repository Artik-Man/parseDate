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
    const reg = /([a-zа-яA-ZА-ЯçŞğéüûıź]+)/gi;
    return str.replace(reg, word => {
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
        console.group('[simple-date-parser]:logger')
        console.log('Parser: ' + parser)
        console.log(input)
        console.dir(date);
        console.groupEnd()
    }
}

const createDate = (Y: number | string, M?: number | string, D?: number | string, h?: number | string, m?: number | string, s?: number | string, a?: string): Date => {

    const date = new Date(0);

    const year: number = parseInt(Y + '', 10);
    const month: number = parseInt(M + '', 10) || 1;
    const day: number = parseInt(D + '', 10) || 1;
    date.setUTCFullYear(year);
    date.setUTCMonth(month - 1);
    date.setUTCDate(day);

    if (h) {
        let hours = parseInt(h + '', 10) || 0;
        if (a?.trim() === 'pm') {
            hours += 12;
        }
        date.setUTCHours(hours || 0);
    }
    if (m) {
        const minutes = parseInt(m + '', 10) || 0;
        date.setUTCMinutes(minutes);
    }
    if (s) {
        const seconds = parseInt(s + '', 10) || 0;
        date.setUTCSeconds(seconds);
    }

    return date;
}

export const isValidDate = (date: Date | any) => date instanceof Date && !isNaN(+date);

export const parseDate = (str: string, log = false): Date => {
    str = translate(str.toLowerCase());
    // YYYYMMdd
    {
        const reg = /(20|19)(\d{2})(\d{2})(\d{2})/;
        if (reg.test(str)) {
            const date = new Date(str.replace(reg, '$1$2-$3-$4').trim());
            if (isValidDate(date)) {
                logger(log, str, date, 'YYYYMMdd');
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
        const reg = /(\d{1,2})[.\-\/ \\]([a-z]{3}),?[.\-\/ \\](\d{4}),?\s?(at|-)?\s?(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?(\s(am|pm))?/;
        if (reg.test(str)) {
            const match = str.match(reg);
            if (match) {
                // console.log(match)
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
                // console.log(match)
                const date = new Date();
                const [, kw, , , , h, m, s, a] = match;
                if (kw === 'yesterday') {
                    date.setUTCDate(date.getUTCDate() - 1);
                }
                if (h) {
                    let hours = parseInt(h, 10) || 0;
                    if (a === ' pm') {
                        hours += 12;
                    }
                    date.setUTCHours(hours || 0, +m || 0, +s || 0, 0);
                }

                logger(log, str, date, 'yesterday at h:mm:ss a');
                return date;

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
                    logger(log, str, date, 'dd.MM.YYYY');
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

