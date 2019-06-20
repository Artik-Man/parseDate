# parseDate
Simple JS Date parser

```typescript
parseDate(date :string) => Date;
```
Accepts a string containing a date in human-readable format.
Returns JS Date object


```typescript
import { parseDate } from './index.ts';
const date = parseDate('20 jan 2007 at 6:38');
```

## Supported formats:
```
1.12.1999 23:21
1.12.1999
21.12.2011
01-01-2017
1.12.1999 23:21
21.12.2011 23:21
01-01-2017, 23:21:45

20 jan 2007 at 6:38
15 jan 2007 at 6:38:24
20 jan 2007 at 6:38 am
20 jan 2007 at 6:38:22 am
01 march 2017, 23:21
13 april 2017, 23:21
2 feb 2017, 23:21
01 mar 2017
13 apr 2017
2 feb 2017
5 may, 2012
5 may, 2012 - 21:20
5 may, 2012 - 01:20 pm
5 may, 2012 - 21:20:22
5 may, 2012 - 06:20:22 am

apr 26, 2006, 04:23:44
apr 26, 2006, 04:23:44 am
mar 26, 2006, 04:23
mar 26, 2006, 04:23 pm
mar 03, 2012
may 22, 2019 at 5:42 pm

2017-02-09
2017-02-09 08:40
2017-02-09 08:40 am
2017-02-09 08:40:22

Сегодня, 07:12
today at 6:00 am
today at 6:00:12 am
Вчера, 07:12
yesterday at 6:00 am
yesterday at 6:00:12 am
```
