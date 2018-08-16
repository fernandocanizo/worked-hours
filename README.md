# Worked Hours

A simple app to calculate your working hours by project.

## Idea

The idea is to build an app to **calculate** and **graph** worked hours so one
can see at a glance if one have worked extra hours or if one is in debt.

## Data format

So far there is an initial definition/configuration per project:

```
const configuration = {
  workingHours: {
    monday: {
      start: 'hh:mm',
      end: 'hh:mm',
      },
    tuesday: { ... },
    ...
    },
  nonWorkingDays: [
    'mm-dd', ...
    ],
};
```

Another more flexible way to configure `workingHours` would be to specify a day
range and an hour range, i.e.:

```
workingHours: {
  dayRange: ['monday', 'friday'],
  hourRange: ['09:00', '18:00'],
  }
```

Yet it can be further simplified if you have freedom about entry/exit hours:

```
workingHours: {
  dayRange: ['monday', 'friday'],
  workHours: 9, // a quantity
  }
```

And the daily data to input looks like this:

```
const dailyData = {
  startHour: 'hh:mm',
  endHour: 'hh:mm',
  date: 'yyyy-mm-dd',
};
```
