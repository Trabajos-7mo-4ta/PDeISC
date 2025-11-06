import { Platform } from 'react-native';

export const GOOGLE_CLIENT_ID =
  Platform.OS === 'android'
    ? '911654144135-lbdg4bknu74tulq91tk6gn080fca17l1.apps.googleusercontent.com'
    : '911654144135-ea1qlokfn34l9nf6j9eaeegnqnnuvecc.apps.googleusercontent.com';

