'use client'

export function checkPhoneFormat(phoneNumber: string): string | undefined {
    const beginWithZero = /^0\d{9}$/
    const beginWithNumber = /^[1-9][0-9]{8}$/
    var phoneNumberFinal;
    if (beginWithZero.test(phoneNumber)) {
        phoneNumberFinal = "+84".concat(phoneNumber.substring(1))
    }
    if (beginWithNumber.test(phoneNumber)) {
        phoneNumberFinal = "+84".concat(phoneNumber)
    }
    return phoneNumberFinal
}