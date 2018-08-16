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

And the daily data to input looks like this:

```
const dailyData = {
  startHour: 'hh:mm',
  endHour: 'hh:mm',
  date: 'yyyy-mm-dd',
};
```
