import { NativeModule, requireNativeModule } from 'expo';

import { QuranWallpaperServiceModuleEvents } from './QuranWallpaperService.types';

declare class QuranWallpaperServiceModule extends NativeModule<QuranWallpaperServiceModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<QuranWallpaperServiceModule>('QuranWallpaperService');
