c3 [![Build Status](https://travis-ci.org/masayuki0812/c3.svg?branch=master)](https://travis-ci.org/masayuki0812/c3) [![Dependency Status](https://david-dm.org/masayuki0812/c3.svg)](https://david-dm.org/masayuki0812/c3) [![devDependency Status](https://david-dm.org/masayuki0812/c3/dev-status.svg)](https://david-dm.org/masayuki0812/c3#info=devDependencies) [![license](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](https://github.com/masayuki0812/c3/blob/master/LICENSE)
==


c3 is a D3-based reusable chart library that enables deeper integration of charts into web applications.

Follow the link for more information: [http://c3js.org](http://c3js.org/)

## Why fork?
C3 development got kinda stack in time. As Etersoft uses c3 for its projects we decided to fork it and improve it by outselves. All releases from origin will be merged as soon as they are out.

## How is this differ?

Our current improvements

#### Working with data

**chart.loadColumns([[id, values...], [...]])**

Loads given columns. Alias to chart.load({columns: [[id, values...], ...]});

**chart.appendToColumn(column)**

Append given values to sequence

Usage:
```js
    // Say data was [0, 50]
    chart.appendToColumn(['data', 100, 200]);
    // Now data is [0, 50, 100, 200]
```

**chart.popFromColumn(id, amount)**

Pops given amount from sequence

Usage:
```js
    // Say data was [0, 100, 200, 300]
    chart.popFromColumn('data', 2);
    // Now data is [0, 100]
```

**chart.setValue(id, index, value)**

Sets value for given sequence and index. If no value is presented in index, new value is appended to sequence.
```js
    // Say data was [0, 100, 200, 300]
    chart.setValue('data', 2, 400);
    // Now data is [0, 100, 400, 300]

    // Set non-existing value
    chart.setValue('data', 10, 20);
    // Now data is [0, 100, 400, 300, 20]
```

**chart.getValue(id, index)**

Gets value for given sequence and index.
```js
    // Say data was [0, 100, 200]
    chart.getValue('data', 1) === 100

    // Non-existing sequence or index
    chart.getValue('no such thing', 10) === undefined
    chart.getValue('data', 100) === undefined
```
