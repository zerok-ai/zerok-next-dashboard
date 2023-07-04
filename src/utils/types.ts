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
  createdAtMs: number;
}

export interface useStatusType {
  loading: boolean;
  error: null | string;
}

export interface ApiKeyHidden {
  id: string;
  createdAtMs: number;
}

export interface ApiKeyDetail {
  id: string;
  createdAtMs: number;
  key: null | string;
}

export interface UserDetail {
  name: string;
  email: string;
  id: string;
}