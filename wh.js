#!/usr/bin/env node

'use strict';

const MAX_FIELDS = 5;
const DAY_CODES = [
  'non-working-day',
  'holiday',
  'sickness',
];
const minutesInWorkDay = 9 * 60;

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

  console.log('line:', line);
  console.log(lineData);
  console.log('Worked hours:', (lineData.endHour - lineData.startHour) / 60);
  console.log();
};

const main = lines => {
  // drop first line, those are headers
  lines.shift();
  try {
    lines.forEach(parseFields);
  } catch (e) {
    console.log(e);
  }
};

