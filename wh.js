#!/usr/bin/env node

'use strict';

const fs = require('fs');


const MAX_FIELDS = 5;
const DAY_CODES = [
  'non-working-day',
  'holiday',
  'sickness',
];
const minutesInWorkingDay = 540; // 9 hours a day * 60 minutes

// Global variables
let _input = '';
let _currentInputLine = 0;

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', data => _input += data);

process.stdin.on('end', () => {
  const lines = _input.trim().split('\n');
  main(lines);
});

const parseDate = token => {
  if (! token.match(/^\d{4}-\d{2}-\d{2}$/)) {
    throw new Error(`Invalid date format. Should be 'YYYY-MM-DD'. Received '${token}'`);
  }
  return new Date(token);
};

const parseHour = token => {
  const [ _, hours, minutes ] = token.match(/^(\d\d)(\d\d)$/);
  if (! hours || ! minutes) {
    throw new Error(`Invalid hour format. Should be 'HHMM'. Received '${token}'`);
  }

  return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
};

const parseFields = line => {
  const [ date, startHour, endHour, code, notes ] = line.split(';').map(v => v.trim());

  const lineData = {
    date: date ? parseDate(date) : 'No date!',
    startHour: startHour ? parseHour(startHour) : 'No start hour!',
    endHour: endHour ? parseHour(endHour) : 'No end hour!',
    code,
    notes,
  };

  let workedMinutes = lineData.endHour - lineData.startHour;
  workedMinutes = workedMinutes ? workedMinutes : 0;

  const result = {
    date,
    startHour: lineData.startHour,
    endHour: lineData.endHour,
    code: lineData.code,
    workedMinutes,
    extraMinutes: workedMinutes - minutesInWorkingDay,
  };

  return result;
};

// TODO make unit test for all cases to this function
// TODO maybe this process should be run on parseFields, so we can better decide if we substract or not

const tellMeWhatToAdd = (code, minutes) => {
  // determines according to `code` if these `minutes` should be added or
  // substracted and returns the appropriate value for `buildChartJsData`
  // to add up

  // First check for extra hours on non-working days
  const nonWorkableDays = [
    'non-working-day',
    'holiday',
  ];
  if (nonWorkableDays.includes(code)) {
    if (minutes > 0) {
      return minutes;
    } else {
      return 0; // we don't substract negative minutes from non-working days
    }
  }

  if ('from-home' === code) {
    if (minutes > 0) {
      return minutes;
    } else { // were incorrectly deducted, revert `workedMinutes - minutesInWorkingDay`
      return minutes + minutesInWorkingDay;
    }
  }

  if ('boss-license' === code) {
    if (minutes > 0) {
      return minutes;
    } else {
      return 0; // boss gave order to leave earlier, so we don't count negative time
    }
  }

  // default
  return minutes;
};

const buildChartJsData = (acumulator, value) => {
  acumulator.workedMinutes.push(value.workedMinutes);
  acumulator.extraMinutes.push(value.extraMinutes);
  acumulator.totalExtraMinutes += tellMeWhatToAdd(value.code, value.extraMinutes);
  return acumulator;
};

const main = lines => {
  // drop first line, those are headers
  lines.shift();
  try {
    const result = lines.map(parseFields)
      .reduce(buildChartJsData, {
        workedMinutes: [],
        extraMinutes: [],
        totalExtraMinutes: 0,
      });

    const stdOut = 1;
    fs.writeFileSync(stdOut, JSON.stringify(result), { encoding: 'utf8', flag: 'a' })
  } catch (e) {
    console.log(e);
  }
};
