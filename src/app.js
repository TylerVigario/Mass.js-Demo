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

const Mass = new MassJS([]);

var inputMass;
var outputValue;
var outputFormat;
var inputUnits;
var outputUnits;
var writtenFormat;
var cm;

$(() => {
    inputMass = document.getElementById('input-mass');
    outputValue = document.getElementById('output-value');
    outputFormat = document.getElementById('output-format');
    inputUnits = document.getElementById('input-units');
    outputUnits = document.getElementById('output-units');
    writtenFormat = document.getElementById('written-format');

    inputMass.oninput = onInput;

    writtenFormat.onclick = onInput;

    outputUnits.value = JSON.stringify(Units.US, null, 4);

    cm = CodeMirror.fromTextArea(outputUnits, {
        lineNumbers: true,
        mode: {
            name: 'javascript',
            json: true
        },
        gutters: ['CodeMirror-lint-markers'],
        lint: {
            getAnnotations: jsonValidator,
            async: true
        }
    });

    inputUnits.onchange = function() {
        cm.getDoc().setValue(
            JSON.stringify(Units[this.options[this.selectedIndex].value], null, 4)
        );
    };

    $('a[data-toggle="pill"]').on('shown.bs.tab', function (e) {
        if (e.target.id === 'units-tab') {
            cm.refresh();
        }
    });
});

function onInput() {
    try {
        let value = Mass.parse(inputMass.value);

        if (typeof value === 'number') {
            outputValue.value = value;

            outputFormat.value = Mass.format(value, {
                written: writtenFormat.checked
            });
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