require('./app.scss');

import MassJS from 'mass.js/src/mass';
import Units from 'mass.js/src/units/US';
const Mass = new MassJS(Units);

var inputMass;
var outputValue;
var outputFormat;
var outputUnits;

$(() => {
    inputMass = $('#inputMass');
    outputValue = $('#outputValue');
    outputFormat = $('#outputFormat');

    // eslint-disable-next-line no-undef
    outputUnits = CodeMirror(document.getElementById('outputUnits'), {
        lineNumbers: true,
        mode: {
            name: 'javascript',
            json: true
        },
        gutters: ['CodeMirror-lint-markers'],
        lint: true,
        value: JSON.stringify(Units, null, 4)
    });

    inputMass.on('input', () => {
        try {
            let value = Mass.parse(inputMass.val());

            if (typeof value === 'number') {
                outputValue.val(value);
                outputFormat.val(Mass.format(value));
            } else {
                resetOutput();
            }
        } catch (e) {
            resetOutput();
        }
    });
});

function resetOutput() {
    outputValue.val('');
    outputFormat.val('');
}