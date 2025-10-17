import { useDarkMode } from '../context/DarkModeContext';
import theme from '../theme';
import darkTheme from '../theme-dark';

export const useAppTheme = () => {
  const { isDarkMode } = useDarkMode();
  return isDarkMode ? darkTheme : theme;
};