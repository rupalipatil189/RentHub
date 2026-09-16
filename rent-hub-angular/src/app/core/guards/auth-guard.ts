import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const currentUser = localStorage.getItem('currentUser');

  // User is not logged in
  if (!currentUser) {
    return router.createUrlTree(['/login']);
  }

  return true;
};
