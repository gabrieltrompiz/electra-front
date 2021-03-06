import { toast } from 'react-toastify';

/** Creates a toast from react-toastify showing an error
 * @param {string} error - Error to be shown
 */
export const logError = (error: string) => {
  const message = error.includes('request to') ? `Could not connect with GitHub` : error.replace('GraphQL error:', '').trim();
  toast(message, {
    type: 'error'
  });
};

/** Creates a toast from react-toastify showing an informative message
 * @param {string} message - Message to be shown
 */
export const logInfo = (message: string) => {
  toast(message, {
    type: 'info',
    className: 'information-toast'
  })
}