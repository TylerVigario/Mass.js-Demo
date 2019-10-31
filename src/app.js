/* eslint-disable no-undef */

require('./app.scss');

import US from 'mass.js/src/units/US';
import UK from 'mass.js/src/units/UK';
import SI from 'mass.js/src/units/SI';
import MassJS from 'mass.js/src/mass';

const Units = {
    US,
    UK,
    SI
};

const Mass = new MassJS({});

var inputMass;
var outputValue;
var outputFormat;
var inputUnits;
var outputUnits;

$(() => {
    inputMass = document.getElementById('inputMass');
    outputValue = document.getElementById('outputValue');
    outputFormat = document.getElementById('outputFormat');
    inputUnits = document.getElementById('inputUnits');

    outputUnits = CodeMirror(document.getElementById('outputUnits'), {
        lineNumbers: true,
        mode: {
            name: 'javascript',
            json: true
        },
        gutters: ['CodeMirror-lint-markers'],
        lint: {
            getAnnotations: jsonValidator,
            async: true
        },
        value: JSON.stringify(Units.US, null, 4)
    });

    inputUnits.onchange = function() {
        outputUnits.getDoc().setValue(
            JSON.stringify(Units[this.options[this.selectedIndex].value], null, 4)
        );
    };

    inputMass.oninput = onInput;
});

function onInput() {
    try {
        let value = Mass.parse(inputMass.value);

        if (typeof value === 'number') {
            outputValue.value = value;
            outputFormat.value = Mass.format(value);
        } else {
            resetOutput();
        }
    } catch (e) {
        resetOutput();

        console.error(e);
    }
}

async function resetOutput() {
    outputValue.value = '';
    outputFormat.value = '';
}

async function jsonValidator(cm, updateLinting, options) {
    let errors = CodeMirror.lint.json(cm, options);

    updateLinting(errors);

    if (errors.length === 0) {
        Mass.units = JSON.parse(cm);

        if (inputMass.value.length > 0) {
            onInput();
        }

        console.log('Updated units');
    } else {
        resetOutput();
    }
}