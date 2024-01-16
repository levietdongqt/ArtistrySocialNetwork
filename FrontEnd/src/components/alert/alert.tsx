
import { alertType } from '@/lib/constants';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ToastParams {
  type: alertType;
  message: string;
}

export function useToast({ type, message }: ToastParams) {
  
  if (type === alertType.success) {
    console.log("vooo")
    toast.success(message);
  } else if (type === alertType.error) {
    toast.error(message);
  } else if (type === alertType.info) {
    toast.info(message);
  } else if (type === alertType.warning) {
    toast.warning(message);
  } else {
    console.error(`Unsupported toast type: ${type}`);
  }
}