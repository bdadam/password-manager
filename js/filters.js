import { default as formatDate } from 'date-fns/format';

const register = Vue => {
    Vue.filter('formatDate', date => {
        return formatDate(date, 'YYYY-MM-DD HH:mm:ss');
    });
};

export default register;
