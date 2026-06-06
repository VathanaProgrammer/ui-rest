import type { Category, PaginationInfo, Breadcrumb } from './types';
import axios from 'axios';
import { ref } from 'vue';
import { onMounted } from 'vue'; // this method will run every time the component or this code is call 

export const breadcrumbs: Breadcrumb[] = [
  { label: 'Menu Management', path: '/menu' }, 
  { label: 'Categories', path: '/category' },
];



// defind the variable that will hold the data return from an api
 // now after you call you already know what is return right
// Yes smart so what the reurn is goes to? so if I remove it it still work as normal 
// and if we want it happnd when we first open this page we need to use a function in Vue 
// what I told you is call an api url is https://localhost:7444/api/categories
                                    // but I will show you a simple way that will easy to understand what this first

// export const mockCategories: Category[] = [ // This is what I told you that is a data that you define for static data
//                                             // it not from our database
//                                             // so you can define it as you want
//                                             // but it make it work with our api and our design you need to make a request
//                                             // Firt to call or make a request to our api to get the data you need to import the tool name axios
//   {
//     id: 1,
//     name: 'Appetizers3',
//     iconColor: '#3b82f6',
//     iconBg: '#1e3a5f',
//     itemCount: 12,
//     status: 'active',
//     displayOrder: '01',
//   },
//   {
//     id: 2,
//     name: 'Signature Mains',
//     iconColor: '#10b981',
//     iconBg: '#064e3b',
//     itemCount: 24,
//     status: 'active',
//     displayOrder: '02',
//   },
//   {
//     id: 3,
//     name: 'Sides',
//     iconColor: '#f97316',
//     iconBg: '#431407',
//     itemCount: 18,
//     status: 'active',
//     displayOrder: '03',
//   },
//   {
//     id: 4,
//     name: 'Refreshing Beverages',
//     iconColor: '#06b6d4',
//     iconBg: '#0c4a6e',
//     itemCount: 42,
//     status: 'active',
//     displayOrder: '04',
//   },
//   {
//     id: 5,
//     name: 'Chef Specials',
//     iconColor: '#f59e0b',
//     iconBg: '#451a03',
//     itemCount: 6,
//     status: 'inactive',
//     displayOrder: '05',
//   },
// ];

// export const mockPagination: PaginationInfo = {
//   current: 1,
//   total: 3,
//   showing: '1-5',
//   totalItems: 18,
// };