export interface Category { // see this is call an interface that is represent of the data that is reponse
  // look every field is match exatly what the api is return if you miss even one charator it will not work 
  // let me show you if you change the name of the an interface
  id:            number;
  name:          string;
  displayOrder:  string | number;  // API returns number, frontend uses string
  status:        'active' | 'inactive';
  iconColor?:    string;
  imageUrl?:     string;
  itemCount?:    number;
}

export interface PaginationInfo {
  current: number;
  total: number;
  showing: string;
  totalItems: number;
}

export interface Breadcrumb {
  label: string;
  path: string;
}