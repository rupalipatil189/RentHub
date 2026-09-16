import { inject } from '@angular/core';

import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);

  const currentUser = localStorage.getItem('currentUser');

  if (!currentUser) {
    return router.createUrlTree(['/login']);
  }

  const user = JSON.parse(currentUser);

  const userRole = user.role;

  const allowedRoles = route.data['roles'] as string[];

  if (allowedRoles.includes(userRole)) {
    return true;
  }

  // User doesn't have permission
  return router.createUrlTree(['/home']);
};
