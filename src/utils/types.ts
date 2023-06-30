export interface ChildrenType {
  children: React.ReactNode;
}

export interface GenericObject {
  [key: string]: any;
}

export interface DrawerNavItemType {
  icon: string;
  label: string;
  path: string;
} 

export interface ApiKeyType {
  id: string;
  key: string;
  createdAt: number;
}

export interface useStatusType {
  loading: boolean;
  error: null | string;
}