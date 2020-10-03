"use strict";

var baseFontSizeInput = document.getElementById('base-font-size');
var pixelsInput = document.getElementById('pixels');
var remsInput = document.getElementById('rems');
var arrowSpan = document.querySelector('.arrow');
var alerts = document.querySelector('.alerts');
var lastCalculatedPixels = true;

var getFields = function getFields() {
  var dependantField = lastCalculatedPixels ? pixelsInput : remsInput;
  var sourceField = lastCalculatedPixels ? remsInput : pixelsInput;
  return {
    dependantField: dependantField,
    sourceField: sourceField
  };
};

var calculate = function calculate(calculator) {
  var _getFields = getFields(),
      dependantField = _getFields.dependantField,
      sourceField = _getFields.sourceField;

  var baseFontSize = parseFloat(baseFontSizeInput.value);
  var sourceSize = parseFloat(sourceField.value);
  dependantField.value = '';
  dependantField.classList.remove('invalid');
  var invalid = false;
  /* Using both isNaN and reg ex, as both individually didnt behave quite how I wanted */

  if (!baseFontSizeInput.value.match(/^[0-9]*\.?[0-9]*$/) || isNaN(baseFontSize) || baseFontSize <= 0) {
    baseFontSizeInput.classList.add('invalid');
    invalid = true;
  } else {
    baseFontSizeInput.classList.remove('invalid');
  }

  if (isNaN(sourceSize) || !sourceField.value.match(/^[0-9]*\.?[0-9]*$/)) {
    sourceField.classList.add('invalid');
    invalid = true;
  } else {
    sourceField.classList.remove('invalid');
  }

  if (invalid) return;
  var result = calculator(baseFontSize, sourceSize);
  dependantField.value = result;
};

var baseFontSizeChanged = function baseFontSizeChanged() {
  lastCalculatedPixels ? calculatePixels() : calculateRems();
};

var calculateRems = function calculateRems() {
  lastCalculatedPixels = false;
  arrowSpan.classList.add('arrow--right');
  calculate(function (base, target) {
    return target / base;
  });
};

var calculatePixels = function calculatePixels() {
  lastCalculatedPixels = true;
  arrowSpan.classList.remove('arrow--right');
  calculate(function (base, target) {
    return target * base;
  });
};

var swapValues = function swapValues() {
  lastCalculatedPixels = !lastCalculatedPixels;

  var _getFields2 = getFields(),
      sourceField = _getFields2.sourceField,
      dependantField = _getFields2.dependantField;

  sourceField.value = dependantField.value;
  lastCalculatedPixels ? calculatePixels() : calculateRems();
};

var showAlert = function showAlert(msg, success) {
  var alert = document.createElement('div');
  alert.classList.add('alert');
  alert.textContent = msg;

  if (!success) {
    alert.classList.add('alert--failed');
  }

  alerts.appendChild(alert);
  setTimeout(function () {
    alerts.removeChild(alert);
  }, 2000);
};

var copyContents = function copyContents(e) {
  var input = e.target; // grab the value so we can reset if needed

  var hasContent = input.value !== '';

  if (!hasContent) {
    input.value = ' ';
  }

  input.select();
  var success = document.execCommand('copy');

  if (!hasContent) {
    input.value = '';
  }

  input.setSelectionRange(0, 0);

  if (success) {
    showAlert('Copied to clipboard!', true);
  } else {
    showAlert('Unable to copy!', false);
  }
};

baseFontSizeInput.addEventListener('input', baseFontSizeChanged);
baseFontSizeInput.addEventListener('dblclick', copyContents);
pixelsInput.addEventListener('input', calculateRems);
pixelsInput.addEventListener('dblclick', copyContents);
remsInput.addEventListener('input', calculatePixels);
remsInput.addEventListener('dblclick', copyContents);
arrowSpan.addEventListener('click', swapValues);
