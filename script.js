const baseFontSizeInput = document.getElementById('base-font-size');
    const pixelsInput = document.getElementById('pixels');
    const remsInput = document.getElementById('rems');
    const arrowSpan = document.querySelector('.arrow');

    let lastCalculatedPixels = true;

    const getFields = () => {
        const dependantField = lastCalculatedPixels ? pixelsInput : remsInput;
        const sourceField = lastCalculatedPixels ? remsInput : pixelsInput;
        return {dependantField, sourceField};
    }

    const calculate = calculator => {

        const {dependantField, sourceField} = getFields();

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

        calculate((base, target) => target / base);
    }

    const calculatePixels = () => {

        lastCalculatedPixels = true;
        arrowSpan.classList.remove('arrow--right');

        calculate((base, target) => target * base);
    }

    const swapValues = () => {

        lastCalculatedPixels = !lastCalculatedPixels;

        const { sourceField, dependantField } = getFields();

        sourceField.value = dependantField.value;

        lastCalculatedPixels ? 
            calculatePixels() :
            calculateRems();
    }

    const copyContents = e => {
        const input = e.target;
        // grab the value so we can reset if needed
        const hasContent = input.value !== '';
        if (!hasContent) { input.value = ' '; }
        input.select();
        document.execCommand('copy');
        if (!hasContent) { input.value = ''; }
        input.setSelectionRange(0,0);     
    }

    baseFontSizeInput.addEventListener('input', baseFontSizeChanged);
    baseFontSizeInput.addEventListener('dblclick', copyContents);
    pixelsInput.addEventListener('input', calculateRems);
    pixelsInput.addEventListener('dblclick', copyContents);
    remsInput.addEventListener('input', calculatePixels);
    remsInput.addEventListener('dblclick', copyContents);
    arrowSpan.addEventListener('click', swapValues);