
export function isFocusableElement(element: Element): element is HTMLElement {
    return (
        element instanceof HTMLButtonElement ||
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement ||
        element instanceof HTMLSelectElement ||
        element instanceof HTMLAnchorElement ||
        element instanceof HTMLDivElement
    );
}