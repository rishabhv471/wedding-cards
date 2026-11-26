/**
 * Replaces `{name}` placeholders in a copy string with the supplied values.
 * JSON can only store text, so template-style labels stay editable there and
 * are turned into messages at render time.
 */
export function formatTemplate(template, values) {
    return template.replace(/\{(\w+)\}/g, (match, key) => (Object.prototype.hasOwnProperty.call(values, key) ? values[key] : match));
}
