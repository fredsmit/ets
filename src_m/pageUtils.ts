
function getOptionalHTMLElements<ID extends string>(...ids: ID[]): Readonly<Record<ID, HTMLElement | null>> {
    const optionalElements = {} as Record<ID, HTMLElement | null>;
    for (const id of ids) {
        Object.assign(optionalElements, { [id]: document.getElementById(id) });
    }
    return optionalElements;
}

function getRequiredHTMLElements<ID extends string>(...ids: ID[]): Readonly<Record<ID, HTMLElement>> {
    const requiredElements = {} as Record<ID, HTMLElement>;
    const missingIds = [] as string[];
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

function getRequiredNamedForm(name: string): HTMLFormElement {
    const form = document.forms.namedItem(name);
    if (form === null)
        throw Error(`Missing required named form: '${name}'.`);
    return form;
}

function getRequiredNamedFormControl<T extends Element | RadioNodeList>(
    form: HTMLFormElement, name: string, typeTest: (control: Element | RadioNodeList) => control is T
): T {
    const control = form.elements.namedItem(name);
    if (control !== null && typeTest(control))
        return control;
    throw Error(`Missing required named form control: '${name}'.`);
}

function queryElements<TagName extends keyof HTMLElementTagNameMap>(
    parentNode: ParentNode,
    tagName: TagName,
    attributeSelector: string
): NodeListOf<HTMLElementTagNameMap[TagName]> {
    return parentNode.querySelectorAll<HTMLElementTagNameMap[TagName]>(`${tagName}[${attributeSelector}]`)
}

function queryElement<TagName extends keyof HTMLElementTagNameMap>(
    parentNode: ParentNode,
    tagName: TagName,
    idSelector: string
): HTMLElementTagNameMap[TagName] | null {
    return parentNode.querySelector<HTMLElementTagNameMap[TagName]>(`${tagName}#${idSelector}`)
}

function queryRequiredElement<TagName extends keyof HTMLElementTagNameMap>(
    parentNode: ParentNode,
    tagName: TagName,
    idSelector: string
): HTMLElementTagNameMap[TagName] {
    const selector = `${tagName}#${idSelector}`;
    const htmlElement = parentNode.querySelector<HTMLElementTagNameMap[TagName]>(selector)
    if (htmlElement === null)
        throw Error(`Missing required HTML element '${selector}'.`);
    return htmlElement;
}

function queryRequiredElementByClassSelector<TagName extends keyof HTMLElementTagNameMap>(
    parentNode: ParentNode,
    tagName: TagName,
    classSelector: string
): HTMLElementTagNameMap[TagName] {
    const selector = `${tagName}.${classSelector}`;
    const htmlElements = parentNode.querySelectorAll<HTMLElementTagNameMap[TagName]>(selector)
    if (htmlElements.length !== 1)
        throw Error(`Missing required HTML element '${selector}'.`);
    return htmlElements[0];
}

function findClosestTarget(eventTarget: unknown, htmlElementSelector: string): HTMLElement | null {
    if (eventTarget instanceof Element) {
        const closestTarget = eventTarget.closest<Element>(htmlElementSelector);
        if (closestTarget instanceof HTMLElement) {
            return closestTarget;
        }
    }
    return null;
}

function maxZIndex(): number {
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

export {
    getOptionalHTMLElements,
    getRequiredHTMLElements,
    getRequiredNamedForm,
    getRequiredNamedFormControl,
    queryElements,
    queryRequiredElement,
    queryRequiredElementByClassSelector,
    findClosestTarget,
    maxZIndex
};

