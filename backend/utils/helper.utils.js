export const normalizeSigns = (s1, s2) => {
    const sorted = [s1.toLowerCase(), s2.toLowerCase()].sort();
    return { sign_1: sorted[0], sign_2: sorted[1] };
};