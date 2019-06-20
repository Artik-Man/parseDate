const TRANSLATE = new Map<string, Set<string>>();
TRANSLATE.set('jan', new Set(['deJaneirode', 'January', 'january', 'Ocak', 'Enero', 'Janvier', 'janvier', 'Января', 'января', 'Январь', 'Янв', 'янв', 'Ene', 'Ene', 'Jan', 'sty']));
TRANSLATE.set('feb', new Set(['deFevereirode', 'February', 'february', 'Şubat', 'Febrero', 'Février', 'février', 'Февраля', 'февраля', 'Февраль', 'Фев', 'фев', 'Feb', 'Feb', 'Fév', 'lut']));
TRANSLATE.set('mar', new Set(['deMarçode', 'March', 'march', 'Mart', 'Marzo', 'Mars', 'mars', 'Марта', 'марта', 'Март', 'Мар', 'мар', 'Mar', 'Mar', 'Mar', 'mar']));
TRANSLATE.set('apr', new Set(['deAbrilde', 'April', 'april', 'Nisan', 'Abril', 'Avril', 'avril', 'Апреля', 'апреля', 'Апрель', 'Апр', 'апр', 'Abr', 'Abr', 'Avr', 'kwi']));
TRANSLATE.set('may', new Set(['deMaiode', 'May', 'may', 'Mayıs', 'Mayo', 'Mai', 'mai', 'Мая', 'мая', 'Май', 'Май', 'май', 'Mayo', 'May', 'Mai', 'maja']));
TRANSLATE.set('jun', new Set(['deJunhode', 'June', 'june', 'Haziran', 'Junio', 'Juin', 'juin', 'Июня', 'июня', 'Июнь', 'Июн', 'июн', 'Jun', 'Jun', 'Juin', 'cze']));
TRANSLATE.set('jul', new Set(['deJulhode', 'July', 'july', 'Temmuz', 'Julio', 'Juillet', 'juillet', 'Июля', 'июля', 'Июль', 'Июл', 'июл', 'Jul', 'Jul', 'Juil', 'lip']));
TRANSLATE.set('aug', new Set(['deAgostode', 'August', 'august', 'Ağustos', 'Agosto', 'Août', 'août', 'Августа', 'августа', 'Август', 'Авг', 'авг', 'Ago', 'Ago', 'Aoû', 'sie']));
TRANSLATE.set('sep', new Set(['deSetembrode', 'September', 'september', 'Eylül', 'Septiembre', 'Septembre', 'septembre', 'Сентября', 'сентября', 'Сентябрь', 'Сен', 'сен', 'Sep', 'Sep', 'Sep', 'wrz']));
TRANSLATE.set('oct', new Set(['deOutubrode', 'October', 'october', 'Ekim', 'Octubre', 'Octobre', 'octobre', 'Октября', 'октября', 'Октябрь', 'Окт', 'окт', 'Oct', 'Oct', 'Oct', 'paź']));
TRANSLATE.set('nov', new Set(['deNovembrode', 'November', 'november', 'Kasım', 'Noviembre', 'Novembre', 'novembre', 'Ноября', 'ноября', 'Ноябрь', 'Ноя', 'ноя', 'Nov', 'Nov', 'Nov', 'lis']));
TRANSLATE.set('dec', new Set(['deDezembrode', 'December', 'december', 'Aralık', 'Diciembre', 'Décembre', 'décembre', 'Декабря', 'декабря', 'Декабрь', 'Дек', 'дек', 'Dic', 'Dic', 'Déc', 'gru']));
TRANSLATE.set('yesterday', new Set(['yesterday', 'вчера', 'wczoraj', 'hier']));
TRANSLATE.set('today', new Set(['today', 'сегодня', 'aujourd\'hui']));


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

export const parseDate = (str: string): Date => {
    str = translate(str.toLowerCase());

    // 1.12.1999 23:21
    // 1.12.1999
    // 21.12.2011
    // 01-01-2017
    // 1.12.1999 23:21
    // 21.12.2011 23:21
    // 01-01-2017, 23:21:45
    const reg1 = /(\d{1,2}).(\d{1,2}).(\d{4}),?\s?(\d{1,2}:\d{1,2}(:\d{1,2})?)?/;
    if (reg1.test(str)) {
        str = str.replace(reg1, '$3-$2-$1 $4 ');
        return new Date(str);
    }

    // 20 jan 2007 at 6:38
    // 15 jan 2007 at 6:38:24
    // 20 jan 2007 at 6:38 am
    // 20 jan 2007 at 6:38:22 am
    // 01 march 2017, 23:21
    // 13 april 2017, 23:21
    // 2 feb 2017, 23:21
    // 01 mar 2017
    // 13 apr 2017
    // 2 feb 2017
    // 5 may, 2012
    // 5 may, 2012 - 21:20
    // 5 may, 2012 - 01:20 pm
    // 5 may, 2012 - 21:20:22
    // 5 may, 2012 - 06:20:22 am
    const reg2 = /(\d{1,2})\s([a-z]{3}),?\s(\d{4})\D+(\d{1,2}:\d{1,2}(:\d{1,2})?(\s(am|pm)?))?/;
    if (reg2.test(str)) {
        str = str.replace(reg2, '$1 $2 $3 $4 ');
        return new Date(str);
    }

    // apr 26, 2006, 04:23:44
    // apr 26, 2006, 04:23:44 am
    // mar 26, 2006, 04:23
    // mar 26, 2006, 04:23 pm
    // mar 03, 2012
    // may 22, 2019 at 5:42 pm
    const reg3 = /([a-z]{3})\s(\d{1,2}),?\s(\d{4}),?(\s\D+)?\s?(\d{1,2}:\d{1,2}:?\d{1,2})?\s?(am|pm)?/;
    if (reg3.test(str)) {
        str = str.replace(reg3, '$1 $2 $3 $5 $6 ');
        return new Date(str);
    }

    // 2017-02-09
    // 2017-02-09 08:40
    // 2017-02-09 08:40 am
    // 2017-02-09 08:40:22
    const reg4 = /(\d{4})-(\d{1,2})-(\d{1,2})\s?(\d{1,2}:\d{1,2}:?(\d{1,2})?(\s(am|pm))?)?/;
    if (reg4.test(str)) {
        str = str.replace(reg4, '$1-$2-$3 $4 ');
        return new Date(str);
    }

    // Сегодня, 07:12
    // today at 6:00 am
    // today at 6:00:12 am
    // Вчера, 07:12
    // yesterday at 6:00 am
    // yesterday at 6:00:12 am
    const reg5 = /(yester|to)day(,)?\s(at\s)?((\d{1,2}):(\d{1,2}):?(\d{1,2})?(\s(am|pm))?)/;
    if (reg5.test(str)) {
        const parsed = new Date();
        const [h, m, s, a] = str.replace(reg5, '$5/$6/$7/$8').split('/');
        if (h.length) {
            let hours = +h;
            if (a.indexOf('pm') !== -1) {
                hours += 12;
            }
            parsed.setHours(hours);
        }
        if (m.length) {
            parsed.setMinutes(+m);
        }
        if (s.length) {
            parsed.setSeconds(+s);
        }
        if (/yesterday/.test(str)) {
            parsed.setDate(parsed.getDate() - 1);
        }
        return parsed;
    }

    throw new Error(`[Date parsing error] : ${str}`);
};

