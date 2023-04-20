import useAppSelector from "./useAppSelector";
const useTheme = () => {
  const theme = useAppSelector((state) => state.theme);

  return theme?.theme;
};

export default useTheme;
