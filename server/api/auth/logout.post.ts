export default defineEventHandler((event) => {
    deleteCookie(event, 'auth-token');

    return { success: true };
});