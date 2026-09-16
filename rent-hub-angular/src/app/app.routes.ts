import { Routes } from '@angular/router';
import { ApartmentDetails } from './features/apartment/apartment-details/apartment-details';
import { Home } from './features/home/home';
import { LoginComponent } from './features/login/login';
import { SignupComponent } from './features/signup/signup';
import { CreateApartment } from './features/create-apartment/create-apartment';
import { MyListing } from './features/my-listing/my-listing';
import { Favorites } from './features/favorites/favorites';
import { Inquiries } from './features/inquiries/inquiries';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: Home,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'apartments/:id',
    component: ApartmentDetails,
     canActivate: [authGuard]
  },
  {
    path: 'create-apartment',
    component: CreateApartment,
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['LANDLORD'],
    },
  },
  {
    path: 'create-apartment/:id',
    component: CreateApartment,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: ['LANDLORD']
    }
  },
  {
    path: 'my-listing',
    component: MyListing,
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['LANDLORD'],
    },
  },
  {
    path: 'favourites',
    component: Favorites,
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['TENANT'],
    },
  },
  {
    path: 'inquiries',
    component: Inquiries,
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      roles: [
        'TENANT',
        'LANDLORD'
      ]
    }
  },
  //   {
  //     path: 'profile',
  //     component: ProfileComponent,
  //     canActivate: [authGuard]
  //   },
  {
    path: '**',
    redirectTo: 'home',
  },
];
