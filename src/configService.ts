export interface AppConfig {
  apiUrl: string;
  appVersion: string;
  mapserverUrl: string;
  dark_mode_url: string;
  light_mode_url:string;
}

export let config: AppConfig | null = null;

export const loadConfig = async (): Promise<void> => {
  try {
    const response = await fetch('/config.json');
    config = await response.json();
  } catch (error) {
    console.error('Failed to load configuration:', error);
  }
};
