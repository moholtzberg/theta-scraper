// import { redirect } from '@sveltejs/kit';
// import { handle as authenticationHandle } from './auth.server.js';
// import { sequence } from '@sveltejs/kit/hooks';

// async function authorizationHandle({ event, resolve }) {

 // const session = await event.locals.auth();
    // console.log("Session:", session);
  
  //if (!session) {
  //    if (event.url.pathname === '/auth/login') {
 //       return resolve(event);
  //    } else {
  //      throw redirect(303, '/auth/login');
   //   }
  //  } else {
   //   if (event.url.pathname === '/auth/login') {
    //    throw redirect(303, '/');
    //  } else {
    //    return resolve(event);
    //  }
  //  }

  //return resolve(event);
// }

// export const handle = sequence(authenticationHandle, authorizationHandle)
// or
// export { handle } from "./auth"