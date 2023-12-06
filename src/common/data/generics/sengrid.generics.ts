export class SenGridEmailInformation {
  constructor(data: Partial<SenGridEmailInformation> = {}) {
    Object.assign(this, data);
  }
  to: string;
  subject: string = 'Reward Charly Notification';
  from: string = 'Reward Charly <notifications@kanddys.com>';
  replyTo: string = 'help@kanddys.com';
}

export class AttachmentData {
  content: string;
  filename: string;
  type: string;
  disposition: string;
}
