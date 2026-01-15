// export default defineNuxtRouteMiddleware(async (to, from) => {
//     const { data: user } = await useFetch('/api/user', {
//         key: 'user-profile'
//     });
//
//     if (!user.value) {
//         return navigateTo('/account/login');
//     }
// });