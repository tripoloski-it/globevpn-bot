import { createSubsRouter } from './create-subscription.router';
import { subsRouter } from './edit-subscription.router';
import { registerUserRouter } from './register-user.router';

export const routers = [createSubsRouter, subsRouter, registerUserRouter];
