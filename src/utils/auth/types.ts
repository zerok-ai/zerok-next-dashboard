export interface ZkUserProfileType {
  fullName: string;
  firstName: string;
  lastName: string;
  primaryEmailAddresses: {
    emailAddress: string;
  };
}
