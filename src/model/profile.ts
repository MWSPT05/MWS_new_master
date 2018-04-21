export interface Profile {
    key?: string;
    displayName: string;
    mobileNo: string;
    homeLatitude: string;
    homeLongitude: string;
    notificationToken: string;
    isFinding: boolean;
}

export interface Location {
    latitude: number;
    longitude: number;
}

export interface RecipientProfile {
    displayName: string;
    mobileNo: string;
}