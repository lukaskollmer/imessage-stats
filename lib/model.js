
const ServiceType = (string) => {
  switch (string) {
    case 'iMessage': return ServiceType.iMessage;
    case 'SMS': return ServiceType.SMS;
    default: return ServiceType.Unknown;
  }
}

ServiceType.Unknown  = -1;
ServiceType.SMS      =  0;
ServiceType.iMessage =  1;


class Conversation {
  constructor(chat) {
    this.service = ServiceType(chat.service_name);
    this.chatId = chat.chat_identifier;
    this.lastAddressedHandle = chat.last_addressed_handle;
    this.accountId = chat.account_id;
  }
}

class Handle {
  constructor(handle) {
    this.id = handle.id;
    this.handle_id = handle.ROWID;
    this.country = handle.country;
    this.service = ServiceType(handle.service);
  }
}

class Message {
  constructor(message) {
    this.guid = message.guid;
    this.text = message.text;
    this.handle = message.handle; // TODO set a handle object
    this.handleId = message.handle_id;
    this.subject = message.subject;
    this.attributedBody = message.attributedBody;
    this.service = ServiceType(message.service);
    this.date = message.date;
    this.dateRead = message.date_read;
    this.dateDelivered = message.date_delivered;
    this.isFromMe = message.is_from_me;
    this.isRead = message.is_read;
    this.hasAttatchment = message.cache_has_attatchment;
    this.isAudioMessage = message.is_audio_message;
    this.balloonId = message.balloon_bundle_id;
  }
}

module.exports = {
  ServiceType,
  Conversation,
  Handle,
  Message
}
