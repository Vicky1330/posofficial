// src/utils/navigation.ts

export const goBack = (): void => {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = '/';
    }
};
