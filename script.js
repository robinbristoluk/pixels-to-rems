const baseFontSizeInput = document.getElementById('base-font-size');
    const pixelsInput = document.getElementById('pixels');
    const remsInput = document.getElementById('rems');
    const arrowSpan = document.querySelector('.arrow');

    let lastCalculatedPixels = true;

    const calculate = (calculator, isConvertingPixels) => {

        const dependantField = isConvertingPixels ? remsInput : pixelsInput;
        const sourceField = isConvertingPixels ? pixelsInput : remsInput;

        const baseFontSize = parseFloat(baseFontSizeInput.value);
        const sourceSize = parseFloat(sourceField.value);

        dependantField.value = '';
        dependantField.classList.remove('invalid');

        let invalid = false;

        /* Using both isNaN and reg ex, as both individually didnt behave quite how I wanted */

        if (!baseFontSizeInput.value.match(/^[0-9]*\.?[0-9]*$/) || (isNaN(baseFontSize) ||  baseFontSize <= 0)) {
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

        if(invalid) return;

        const result = calculator(baseFontSize, sourceSize);
        
        dependantField.value = result
    }

    const baseFontSizeChanged = () => {
        lastCalculatedPixels 
            ? calculatePixels() 
            : calculateRems();
    }

    const calculateRems = () => {

        lastCalculatedPixels = false;
        arrowSpan.classList.add('arrow--right');

        calculate((base, target) => target / base, true);
    }

    const calculatePixels = () => {

        lastCalculatedPixels = true;
        arrowSpan.classList.remove('arrow--right');

        calculate((base, target) => target * base, false);
    }

    baseFontSizeInput.addEventListener('input', baseFontSizeChanged);
    pixelsInput.addEventListener('input', calculateRems);
    remsInput.addEventListener('input', calculatePixels);