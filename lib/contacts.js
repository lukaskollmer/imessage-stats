const objc = require('nodobjc');

objc.framework('Foundation');
objc.framework('AddressBook');
objc.framework('Contacts');


let unhook_intercept;

String.prototype.objc = function () {
  return objc.NSString('stringWithUTF8String', this);
};


const GetAllContacts = () => {
  let addressBook = objc.ABAddressBook('sharedAddressBook');

  let allContacts = addressBook('people');



  let all = [];

  for (var i = 0; i < allContacts('count'); i++) {
    let contact = allContacts('objectAtIndex', i);

    const MultiValueListToArray = (contact, property) => {
      let tmp = "";
      let value = contact('valueForKey', property);
      if (value === null) {
        return "";
      }
      if (value('isKindOfClass', objc.ABMultiValue('class'))) {
        for (var i = 0; i < value('count'); i++) {
          tmp = tmp + value('valueAtIndex', i)('description');
        }
      } else if (value('isKindOfClass', objc.NSString('class'))) {
        tmp = tmp + value;
      } else {
        // ¯\_(ツ)_/¯
      }
      return tmp;
    };

    all.push({
      email: MultiValueListToArray(contact, objc.kABEmailProperty),
      firstName: MultiValueListToArray(contact, objc.kABFirstNameProperty),
      lastName: MultiValueListToArray(contact, objc.kABLastNameProperty),
      phone: MultiValueListToArray(contact, objc.kABPhoneProperty),
    });
  }

  return all;
}

module.exports = (property) => {
  let pool = objc.NSAutoreleasePool('alloc')('init');

  let addressBook = objc.ABAddressBook('sharedAddressBook');

  for (let contact of GetAllContacts()) {
    if (property.includes("@")) { // Is Email address
      if (contact.email.includes(property)) {
        return [contact.firstName, contact.lastName].join(' ');
      }
    } else if (property.includes('+')) { // Is phone number
      if (contact.phone.includes(property)) {
        return [contact.firstName, contact.lastName].join(' ');
      }
    }
  }

  //unhook_intercept();
  pool('drain')
  return property;
}
