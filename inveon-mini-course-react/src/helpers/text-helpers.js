export const textHelpers = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};
export const slugify = (text) => text.toLowerCase().replace(/\s+/g, "-");