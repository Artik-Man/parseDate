import {parseDate} from './index.js';

const input = document.getElementById('input');
const output = document.getElementById('output');

const parse = (str) => {
    try {
        return parseDate(str, true);
    } catch (e) {
        console.warn(e);
        return null;
    }
};

const start = () => {
    const date = parse(input.value);
    if (date) {
        output.innerText = date.toISOString();
    } else {
        output.innerText = 'Can not parse this date';
    }
};

input.addEventListener('input', start);
start();

let focus = false;
let runTimeout;

input.addEventListener('focus', () => focus = true);
input.addEventListener('blur', () => {
    focus = false;

    clearTimeout(runTimeout);
    runTimeout = setTimeout(() => {
        run();
    }, 10000)
});

const tests = [
    '19-04-2021 16:56:34', '15.05.2020', 'today', 'вчера в 12:00',
    '2001-12-01', '2015', '20160708', '1999 3 1 17:05',
    '25 марта 1997 в 17:08', '1 May, 1995 - 9:00 pm',
    '9.10.12 13:05:47', '17 dejunhode 2012',
    'février 13 2004 03:07', 'wczoraj'
];

let index = 0;

const run = () => {
    const str = tests[index];
    let i = 0;
    const write = () => {
        setTimeout(() => {
            if (!focus) {
                const slice = str.slice(0, ++i);
                input.value = slice;
                if (slice.length < str.length) {
                    write();
                } else {
                    input.dispatchEvent(new Event("input"));
                    index++;
                    if (index >= tests.length) {
                        index = 0;
                    }

                    clearTimeout(runTimeout);
                    runTimeout = setTimeout(() => {
                        run();
                    }, 3000)
                }
            }
        }, 50);
    }
    write();
}

runTimeout = setTimeout(() => {
    run();
}, 5000);
