import {rateLimit} from 'express-rate-limit';


const apiRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 10, 
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, 
  legacyHeaders: false, 
});
export { apiRateLimit };