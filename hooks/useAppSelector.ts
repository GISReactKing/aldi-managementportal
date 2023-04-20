import { TypedUseSelectorHook, useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; //This is a typed selector.

export default useAppSelector;
