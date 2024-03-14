import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export const showNotification = (type, message) => {
    switch (type) {
        case 'info':
            NotificationManager.info(message);
            break;
        case 'success':
            NotificationManager.success(message, 'Success', 3000);
            break;
        case 'warning':
            NotificationManager.warning(message, 'Warning', 3000);
            break;
        case 'error':
            NotificationManager.error(message, 'Error', 5000);
            break;
        default:
            // Handle other cases if needed
            break;
    }
};
