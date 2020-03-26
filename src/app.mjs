/* eslint-disable no-undef */

import US from 'mass.js/lib/units/US.mjs';
import UK from 'mass.js/lib/units/UK.mjs';
import SI from 'mass.js/lib/units/SI.mjs';
import MassJS from 'mass.js/lib/mass.mjs';

const Units = {
  US,
  UK,
  SI,
};

const Mass = new MassJS([]);

let inputMass;
let outputValue;
let outputFormat;
let inputUnits;
let outputUnits;
let writtenFormat;
let cm;

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
      json: true,
    },
    gutters: ['CodeMirror-lint-markers'],
    lint: {
      getAnnotations: jsonValidator,
      async: true,
    },
  });

  inputUnits.onchange = function() {
    // logs a conversion for goal 1
    _paq.push(['trackGoal', 2]);

    cm.getDoc().setValue(
        JSON.stringify(Units[this.options[this.selectedIndex].value], null, 4),
    );
  };

  $('a[data-toggle="pill"]').on('shown.bs.tab', function(e) {
    if (e.target.id === 'units-tab') {
      cm.refresh();
    }
  });
});

/** Handle user input */
function onInput() {
  try {
    const value = Mass.parse(inputMass.value);

    if (typeof value === 'number') {
      // logs a conversion for goal 1
      _paq.push(['trackGoal', 1]);

      outputValue.value = value;

      outputFormat.value = Mass.format(value, {
        written: writtenFormat.checked,
      });
    } else {
      resetOutput();
    }
  } catch (e) {
    resetOutput();

    console.error(e);
  }
}

/** Reset output */
async function resetOutput() {
  outputValue.value = '';
  outputFormat.value = '';
}

/**
 * Override CodeMirror JSON linter
 *
 * @param {*} cm
 * @param {*} updateLinting
 * @param {*} options
 */
async function jsonValidator(cm, updateLinting, options) {
  const errors = CodeMirror.lint.json(cm, options);

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
