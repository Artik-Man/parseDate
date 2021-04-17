import { parseDate } from './index';

const runTest = (label: string, fn: (arg: any) => any, samples: { in: any, out: any }[]) => {
    return async () => {
        console.log(`[START]  ${ label }`);
        let success = 0;
        let failed = 0;
        for (const sample of samples) {
            const prepared = await fn(sample.in);
            if (prepared !== sample.out) {
                failed++;
                console.warn('\x1b[31m', `
-----------------------------------------------------
[FAILED]  ${ label }:
[in]:     ${ sample.in }
[parsed]: ${ prepared }
[out]:    ${ sample.out }
-----------------------------------------------------
                `, '\x1b[0m');
            } else {
                success++;
            }
        }
        console.log(`[FINISH] ${ label }: success: ${ success }, failed: ${ failed }`);
    };
};
(() => {
    const testDateParsing = runTest('parseDate', async (str) => {
        return parseDate(str).toISOString().slice(0, -5);
    }, [
        {
            in: '1.12.1999 23:21',
            out: '1999-12-01T20:21:00'
        },
        {
            in: '21.12.2011 23:21',
            out: '2011-12-21T19:21:00'
        },
        {
            in: '01-01-2017, 23:21',
            out: '2017-01-01T20:21:00'
        },
        {
            in: '01 March 2017, 23:21',
            out: '2017-03-01T20:21:00'
        },
        {
            in: '13 april 2017, 23:21',
            out: '2017-04-13T20:21:00'
        },
        {
            in: '2 Февраля 2017, 23:21',
            out: '2017-02-02T20:21:00'
        },
        {
            in: '5 May, 2012 - 21:20',
            out: '2012-05-05T17:20:00'
        },
        {
            in: '2017-02-09 08:40',
            out: '2017-02-09T05:40:00'
        },
        {
            in: '3.12.1999',
            out: '1999-12-02T21:00:00'
        },
        {
            in: '21.12.2011',
            out: '2011-12-21T00:00:00'
        },
        {
            in: '01-01-2017',
            out: '2017-01-01T00:00:00'
        },
        {
            in: 'Марта 26, 2006, 04:23:44',
            out: '2006-03-26T00:23:44'
        },
        {
            in: '20 Jan 2007 at 6:38 AM',
            out: '2007-01-20T03:38:00'
        },
        {
            in: 'Тема создана: 23.3.2017, 17:36',
            out: '2017-03-23T14:36:00'
        },
        {
            in: 'May 22, 2019 at 5:42 PM',
            out: '2019-05-22T14:42:00'
        },
        {
            in: 'Сегодня, 07:12',
            out: (() => {
                const date = new Date();
                date.setHours(7);
                date.setMinutes(12);
                return date.toISOString().slice(0, -5);
            })()
        },
        {
            in: 'Today at 6:00 AM',
            out: (() => {
                const date = new Date();
                date.setHours(6);
                date.setMinutes(0);
                return date.toISOString().slice(0, -5);
            })()
        },
        {
            in: 'Вчера, 22:05',
            out: (() => {
                const date = new Date();
                date.setDate(date.getDate() - 1);
                date.setHours(22);
                date.setMinutes(5);
                return date.toISOString().slice(0, -5);
            })()
        },
        {
            in: 'Yesterday at 2:43 PM',
            out: (() => {
                const date = new Date();
                date.setDate(date.getDate() - 1);
                date.setHours(14);
                date.setMinutes(43);
                return date.toISOString().slice(0, -5);
            })()
        },
    ]);

    (async () => {
        await testDateParsing();
    })();

})();
