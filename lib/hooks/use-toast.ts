import { toast, ToastOptions, ToastPosition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "next-themes";
import { ToastType, ToastTypeValues } from "../types/hooks/use-toast";

const useToast = () => {
  const { theme } = useTheme();
  const showToast = (
    message: string,
    type: ToastType = ToastTypeValues.SUCCESS,
    position: ToastPosition = "top-center",
    hideProgressBar: boolean = true
  ) => {
    const options: ToastOptions = {
      position,
      hideProgressBar,
      theme,
    };

    switch (type) {
      case ToastTypeValues.SUCCESS:
        toast.success(message, options);
        break;
      case ToastTypeValues.ERROR:
        toast.error(message, options);
        break;
      case ToastTypeValues.INFO:
        toast.info(message, options);
        break;
      case ToastTypeValues.WARNING:
        toast.warn(message, options);
        break;
      default:
        toast(message, options);
        break;
    }
  };

  const showErrorToast = (message: string) =>
    showToast(message, ToastTypeValues.ERROR);
  return { showToast, showErrorToast };
};

export default useToast;
