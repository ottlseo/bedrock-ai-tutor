export const isEnglishSentence = (str) => {
    const regex = /^[\w\s!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]+$/;
    return regex.test(str);
};