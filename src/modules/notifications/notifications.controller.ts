import {Controller, Get} from '@nestjs/common';
import {NotificationsRepository} from './notifications.repository';

@Controller('notifications')
export class NotificationsController {
	constructor(private notificationsRepository: NotificationsRepository) {}
}
