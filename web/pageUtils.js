function getOptionalHTMLElements(...ids) {
    const optionalElements = {};
    for (const id of ids) {
        Object.assign(optionalElements, { [id]: document.getElementById(id) });
    }
    return optionalElements;
}
function getRequiredHTMLElements(...ids) {
    const requiredElements = {};
    const missingIds = [];
    for (const id of ids) {
        const requiredElement = document.getElementById(id);
        if (requiredElement === null)
            missingIds.push(id);
        else
            Object.assign(requiredElements, { [id]: requiredElement });
    }
    if (missingIds.length > 0)
        throw Error(`Missing required page elements: ${missingIds.map(id => "'" + id + "'").join(", ")}.`);
    return requiredElements;
}
function getRequiredNamedForm(name) {
    const form = document.forms.namedItem(name);
    if (form === null)
        throw Error(`Missing required named form: '${name}'.`);
    return form;
}
function getRequiredNamedFormControl(form, name, typeTest) {
    const control = form.elements.namedItem(name);
    if (control !== null && typeTest(control))
        return control;
    throw Error(`Missing required named form control: '${name}'.`);
}
function queryElements(parentNode, tagName, attributeSelector) {
    return parentNode.querySelectorAll(`${tagName}[${attributeSelector}]`);
}
function queryElement(parentNode, tagName, idSelector) {
    return parentNode.querySelector(`${tagName}#${idSelector}`);
}
function queryRequiredElement(tagName, idSelector, parentNode = document.body) {
    const selector = `${tagName}#${idSelector}`;
    const htmlElement = parentNode.querySelector(selector);
    if (htmlElement === null)
        throw Error(`Missing required HTML element '${selector}'.`);
    return htmlElement;
}
function queryRequiredElementByClassSelector(parentNode, tagName, classSelector) {
    const selector = `${tagName}.${classSelector}`;
    const htmlElements = parentNode.querySelectorAll(selector);
    if (htmlElements.length !== 1)
        throw Error(`Missing required HTML element '${selector}'.`);
    return htmlElements[0];
}
function findClosestTarget(eventTarget, htmlElementSelector) {
    if (eventTarget instanceof Element) {
        const closestTarget = eventTarget.closest(htmlElementSelector);
        if (closestTarget instanceof HTMLElement) {
            return closestTarget;
        }
    }
    return null;
}
function maxZIndex() {
    let maxZ = 0;
    for (const element of document.body.querySelectorAll("*")) {
        const zIndex = window.getComputedStyle(element).zIndex;
        if (zIndex === "auto")
            continue;
        const z = window.parseFloat(zIndex);
        if (Number.isFinite(z) && z > maxZ)
            maxZ = z;
    }
    return maxZ;
}
export { getOptionalHTMLElements, getRequiredHTMLElements, getRequiredNamedForm, getRequiredNamedFormControl, queryElements, queryRequiredElement, queryRequiredElementByClassSelector, findClosestTarget, maxZIndex };
