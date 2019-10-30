require('./app.scss');

import MassJS from 'mass.js/src/mass';
import Units from 'mass.js/src/units/US';
const Mass = new MassJS(Units);

var inputMass;
var outputValue;
var outputFormat;
var loaded = false;
var errors;

$(() => {
    inputMass = document.getElementById('inputMass');
    outputValue = document.getElementById('outputValue');
    outputFormat = document.getElementById('outputFormat');

    CodeMirror(document.getElementById('outputUnits'), {
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
        value: JSON.stringify(Units, null, 4)
    });

    inputMass.onkeyup = onInput;

    loaded = true;
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
    }
}

function resetOutput() {
    outputValue.value = '';
    outputFormat.value = '';
}

function jsonValidator(cm, updateLinting, options) {
    errors = CodeMirror.lint.json(cm, options);

    updateLinting(errors);
    
    resetOutput();

    if (loaded && errors.length === 0) {
        Mass.units = JSON.parse(cm);

        onInput();
    }
}