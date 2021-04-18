import { parseDate } from './index';

const runTest = (label: string, fn: (arg: any) => any, samples: { in: any, out: any }[]) => {
    return () => {
        console.log(`[START]  ${ label }`);
        let success = 0;
        let failed = 0;
        for (const sample of samples) {
            const prepared = fn(sample.in);
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
    const testDateParsing = runTest('parseDate', (str) => {
        try {
            return parseDate(str).toISOString().slice(0, -5);
        } catch (e) {
            console.warn(e)
        }
    }, [
        {
            in: '1.12.1999 23:21',
            out: '1999-12-01T23:21:00'
        },
        {
            in: '21.12.2011 23:21',
            out: '2011-12-21T23:21:00'
        },
        {
            in: '02-01-2017, 23:21',
            out: '2017-01-02T23:21:00'
        },
        {
            in: 'Birthday: 01 March 2017',
            out: '2017-03-01T00:00:00'
        },
        {
            in: '13 april 2017, 23:21',
            out: '2017-04-13T23:21:00'
        },
        {
            in: '2 Февраля 2017, 23:21',
            out: '2017-02-02T23:21:00'
        },
        {
            in: '5 May, 2012 - 9:20:32 PM',
            out: '2012-05-05T21:20:32'
        },
        {
            in: '2017-02-09 08:40',
            out: '2017-02-09T08:40:00'
        },
        {
            in: '2012-02-07 08:40:24 PM',
            out: '2012-02-07T20:40:24'
        },
        {
            in: 'i think in 2010-01-03',
            out: '2010-01-03T00:00:00'
        },
        {
            in: '1999',
            out: '1999-01-01T00:00:00'
        },
        {
            in: '3.12.1999',
            out: '1999-12-03T00:00:00'
        },
        {
            in: '22.12.2011',
            out: '2011-12-22T00:00:00'
        },
        {
            in: '01-01-2017',
            out: '2017-01-01T00:00:00'
        },
        {
            in: 'Марта 26, 2006, 04:23:44',
            out: '2006-03-26T04:23:44'
        },
        {
            in: '20 Jan 2007 at 6:38 AM',
            out: '2007-01-20T06:38:00'
        },
        {
            in: 'Тема создана: 23.3.2017, 17:36',
            out: '2017-03-23T17:36:00'
        },
        {
            in: 'May 22, 2019 at 5:42 PM',
            out: '2019-05-22T17:42:00'
        },
        {
            in: 'Сегодня, 07:12',
            out: (() => {
                const date = new Date();
                date.setUTCHours(7, 12, 0);
                return date.toISOString().slice(0, -5);
            })()
        },
        {
            in: 'Today at 6:00 AM',
            out: (() => {
                const date = new Date();
                date.setUTCHours(6, 0, 0);
                return date.toISOString().slice(0, -5);
            })()
        },
        {
            in: 'вчера 22:05',
            out: (() => {
                const date = new Date();
                date.setDate(date.getDate() - 1);
                date.setUTCHours(22, 5, 0);
                return date.toISOString().slice(0, -5);
            })()
        },
        {
            in: 'Yesterday at 2:43 PM',
            out: (() => {
                const date = new Date();
                date.setDate(date.getDate() - 1);
                date.setUTCHours(14, 43, 0);
                return date.toISOString().slice(0, -5);
            })()
        },
    ]);

    (() => {
        testDateParsing();
    })();

})();


