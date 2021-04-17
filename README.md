# simple-date-parser
Simple JS Date parser

https://artik-man.github.io/simple-date-parser/

https://www.npmjs.com/package/simple-date-parser

```
npm install simple-date-parser
```

Accepts a string containing a date in human-readable format.
Returns JS Date object
```typescript
parseDate(date: string) => Date;
```

Using

```typescript
import { parseDate } from './index.ts';
const date = parseDate('20 jan 2007 at 6:38');
```

## Supported formats:
```
YYYYMMdd
d.MM.YYYY
d.M.YYYY
dd-MM-YYYY
d-M-YYYY
dd.MM.YYYY hh:mm
d.M.YYYY hh:mm
dd-MM-YYYY, hh:mm:ss
dd MMM YYYY at h:mm
dd MMM YYYY at h:mm:ss
dd MMM YYYY at h:mm a
dd MMM YYYY at h:mm:ss a
dd MMM YYYY, hh:mm
dd-MMMM-YYYY, hh:mm
d MMM YYYY, hh:mm
dd MMM YYYY
d MMM YYYY
d MMM, YYYY
d MMM, YYYY - hh:mm
d MMM, YYYY - hh:mm a
d MMM, YYYY - hh:mm:ss
d MMM, YYYY - hh:mm:ss a
MMM dd, YYYY, hh:mm:ss
MMM dd, YYYY, hh:mm:ss a
MMM dd, YYYY, hh:mm
MMM dd, YYYY, hh:mm a
MMM dd, YYYY
MMM dd, YYYY at h:mm a
YYYY-MM-dd
YYYY-MM-dd hh:mm
YYYY-MM-dd hh:mm a
YYYY-MM-dd hh:mm:ss
Сегодня, hh:mm
today at h:mm a
today at h:mm:ss a
Вчера, hh:mm
yesterday at h:mm a
yesterday at h:mm:ss a
```
