import { Fragment, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import collect from 'collect.js';
import classNames from '@/utils/classNames';
import {CheckIcon, ChevronUpDownIcon} from "@heroicons/react/20/solid";

type Tag = {
    id: number;
    name: string;
    color: string;
};

interface TagSelectionInputProps {
    // onChange: (tags: Tag[]) => void;
}

const tags: Tag[] = [
    { id: 0, name: 'Select Tag', color: 'gray' },
    { id: 1, name: 'Video call Q', color: 'green' },
    { id: 2, name: 'Balance Deduct for Call block C', color: 'red' },
    { id: 3, name: 'International Ezetop Q', color: 'blue' },
    { id: 4, name: 'Bundle MMS Q', color: 'purple' },
    { id: 5, name: 'Bundle SMS MMS SR', color: 'orange' },
    { id: 6, name: 'Incomplete Complain', color: 'yellow' },
    { id: 7, name: 'Uber Service Q', color: 'cyan' },
    { id: 8, name: 'Number Change Q', color: 'magenta' },
    { id: 9, name: 'BOOSTER OFFER Campaign Q', color: 'lime' },
    { id: 10, name: 'Balance Deduct for Bdapps Adjust Given R', color: 'pink' },
    { id: 11, name: 'Unified Call Rate Q', color: 'teal' },
    { id: 12, name: 'Postpaid Bill Delivery Delay C', color: 'indigo' },
    { id: 13, name: 'USIM proactive informaton', color: 'brown' },
    { id: 14, name: '2G Coverage C -> Test-Firoz', color: 'gray' },
    { id: 15, name: 'Business proposal and Sponsorship Q', color: 'green' },
    { id: 16, name: 'Awareness campaign Q', color: 'red' },
    { id: 17, name: '4G provisioning Q', color: 'blue' },
    { id: 18, name: '4G Provissioning C', color: 'purple' },
    { id: 19, name: '4G Provissioning R', color: 'orange' },
    { id: 20, name: 'Adress verification by BTRC Q', color: 'yellow' },
    { id: 21, name: 'Call block Activation R', color: 'cyan' },
    { id: 22, name: 'Call block Deactivation R', color: 'magenta' },
    { id: 23, name: 'Call block SR', color: 'lime' },
    { id: 24, name: 'Cell info Display Q', color: 'pink' },
    { id: 25, name: 'DSR C', color: 'teal' },
    { id: 26, name: 'DSR SR', color: 'indigo' },
    { id: 27, name: 'E-care Q', color: 'brown' },
    { id: 28, name: 'ECN', color: 'gray' },
    { id: 29, name: 'Outgoing SMS onnet C', color: 'green' },
    { id: 30, name: 'Outgoing SMS Onnet SR', color: 'red' },
    { id: 31, name: 'Postpaid Bill Delay update C', color: 'blue' },
    { id: 32, name: 'Postpaid Bill Delay update SR', color: 'purple' },
    { id: 33, name: 'SIM Manager Application C', color: 'orange' },
    { id: 34, name: 'SIM Manager Application Q', color: 'yellow' },
    { id: 35, name: 'Contest Q', color: 'cyan' },
    { id: 36, name: 'Bdapps C', color: 'magenta' },
    { id: 37, name: 'VAS info view 6888 Q', color: 'lime' },
    { id: 38, name: 'VAS Act Deact Q', color: 'pink' },
    { id: 39, name: 'Biometric MSISDN Count in NID Q', color: 'teal' },
    { id: 40, name: 'New Goongoon request', color: 'orange' },
    { id: 41, name: 'Sony Liv C', color: 'yellow' },
    { id: 42, name: 'Sony Liv Q', color: 'cyan' },
    { id: 43, name: 'Recharge Voice pack C', color: 'magenta' },
    { id: 44, name: 'Recharge Voice pack Q', color: 'lime' },
    { id: 45, name: 'Recharge Combo pack C', color: 'pink' },
    { id: 46, name: 'Recharge Combo pack Q', color: 'teal' },
    { id: 47, name: 'Cloud Service Q', color: 'indigo' },
    { id: 48, name: 'Cloud Service C', color: 'brown' },
    { id: 49, name: 'Cloud Service SR', color: 'gray' },
    { id: 50, name: 'Text Only Facebook Q', color: 'green' },
    { id: 51, name: 'Text Only Facebook C', color: 'red' },
    { id: 52, name: 'Discover App Q', color: 'blue' },
    { id: 53, name: 'Discover App C', color: 'purple' },
    { id: 54, name: 'World Cup Jersey campaign Q', color: 'orange' },
    { id: 55, name: 'World Cup Jersey campaign C', color: 'yellow' },
    { id: 56, name: 'World Cup campaign Q', color: 'cyan' },
    { id: 57, name: 'World Cup campaign C', color: 'magenta' },
    { id: 58, name: 'Vas Cancel Q', color: 'lime' },
    { id: 59, name: 'Incoming SMS onnet Q', color: 'pink' },
    { id: 60, name: 'MNP Churn Due To Data Problem C', color: 'teal' },
    { id: 61, name: 'VoLTE Q', color: 'indigo' },
    { id: 62, name: 'App/Web blocking By BTRC Q', color: 'brown' },
    { id: 63, name: 'Recharge Bonus C', color: 'gray' },
    { id: 64, name: 'Usage Campaign Q', color: 'green' },
    { id: 65, name: '3G Data Speed Q', color: 'red' },
    { id: 66, name: '3G Data Speed C', color: 'blue' },
    { id: 67, name: 'Noor app Q', color: 'purple' },
    { id: 68, name: 'Balance Deduct for Robi TV Q', color: 'orange' },
    { id: 69, name: 'Easy Pay Q', color: 'yellow' },
    { id: 70, name: 'Refill Unbar R', color: 'cyan' },
    { id: 71, name: 'Bulk SMS Stop SR', color: 'magenta' },
    { id: 72, name: 'Balance Deduct for Vehicle Tracker Q', color: 'lime' },
    { id: 73, name: 'Balance Deduct for MIFE Adjust Given R', color: 'pink' },
    { id: 74, name: 'Robi Shop C', color: 'teal' },
    { id: 75, name: 'Retailer Trans Confirmation C', color: 'indigo' },
    { id: 76, name: 'Goongoon song add Q', color: 'brown' },
    { id: 77, name: 'Robi My plan Q', color: 'gray' },
    { id: 78, name: 'Balance deduct for Unidentified Q', color: 'green' },
    { id: 79, name: 'Retailer Bar Account Q', color: 'red' },
    { id: 80, name: 'Retailer PIN Reset For Retailer R', color: 'blue' },
    { id: 81, name: 'PIN PUK Q', color: 'purple' },
    { id: 82, name: 'Erased voucher R', color: 'orange' },
    { id: 83, name: 'Sim Deregistration Q', color: 'yellow' },
    { id: 84, name: 'Damaged SIM Q', color: 'cyan' },
    { id: 85, name: 'Balance Deduct for My health C', color: 'magenta' },
    { id: 86, name: 'Bulk SMS Stop Q', color: 'lime' },
    { id: 87, name: 'Future product Service Q', color: 'pink' },
    { id: 88, name: 'Call waiting Service Q', color: 'teal' },
    { id: 89, name: 'Data Scratch Card C', color: 'indigo' },
    { id: 90, name: 'Handset Related Q', color: 'brown' },
    { id: 91, name: 'Other number info Q', color: 'gray' },
    { id: 92, name: 'Circle Q', color: 'green' },
    { id: 93, name: 'Retailer SMS Trans Q', color: 'red' },
    { id: 94, name: 'Corporate bulk SMS C', color: 'blue' },
    { id: 95, name: 'Iflix C', color: 'purple' },
    { id: 96, name: 'CLM Voice Q', color: 'orange' },
    { id: 97, name: 'SafeNet Q', color: 'yellow' },
    { id: 98, name: 'CLM Data Q', color: 'cyan' },
    { id: 99, name: 'CLM Combo Balance Q', color: 'magenta' },
    { id: 100, name: 'Prepaid Data bundle C', color: 'lime' },
    { id: 101, name: 'Prepaid Bundle Balance Q', color: 'pink' },
    { id: 102, name: 'USIM Q', color: 'teal' },
    { id: 103, name: 'Own Number Q', color: 'indigo' },
    { id: 104, name: 'Postpaid Desire Number Q', color: 'brown' },
    { id: 105, name: 'Postpaid Tariff Q', color: 'gray' },
    { id: 106, name: 'bkash General Q', color: 'green' },
    { id: 107, name: 'Robi Helpline C', color: 'red' },
    { id: 108, name: 'RSP C', color: 'blue' },
    { id: 109, name: 'Robi Sheba C', color: 'purple' },
    { id: 110, name: 'Tariff Overcharge C', color: 'orange' },
    { id: 111, name: 'Network Coverage Indoor & Outdoor C', color: 'yellow' },
    { id: 112, name: 'Incoming Call Offnet C', color: 'cyan' },
    { id: 113, name: 'Network Congestion C', color: 'magenta' },
    { id: 114, name: 'Cashback Offer C', color: 'lime' },
    { id: 115, name: 'IR Corporate Activation SR', color: 'pink' },
    { id: 116, name: 'Corporate New connection Q', color: 'teal' },
    { id: 117, name: 'Corporate Blocking Q', color: 'indigo' },
    { id: 118, name: 'Corporate Bill Q', color: 'brown' },
    { id: 119, name: 'Retailer Commission Q', color: 'gray' },
    { id: 120, name: 'IR Incoming SMS SR', color: 'green' },
    { id: 121, name: 'IR Corporate Activation SR', color: 'green' },
    { id: 122, name: 'Corporate New connection Q', color: 'red' },
    { id: 123, name: 'Corporate Blocking Q', color: 'blue' },
    { id: 124, name: 'Corporate Bill Q', color: 'purple' },
    { id: 125, name: 'Retailer Commission Q', color: 'orange' },
    { id: 126, name: 'IR Incoming SMS SR', color: 'yellow' },
    { id: 127, name: 'LIC Block Q', color: 'cyan' },
    { id: 128, name: 'Acquisition Offer C', color: 'magenta' },
    { id: 129, name: 'Robi Cash C', color: 'lime' },
    { id: 130, name: 'MCA act R', color: 'pink' },
    { id: 131, name: 'Fraud Case C', color: 'teal' },
    { id: 132, name: 'Voice Adda C', color: 'indigo' },
    { id: 133, name: 'Biometric service C', color: 'brown' },
    { id: 134, name: 'Prepaid pre-purchase Q', color: 'gray' },
    { id: 135, name: 'MNP Potential Customer Q', color: 'green' },
    { id: 136, name: 'Blank Call Q', color: 'red' },
    { id: 137, name: 'Retailer Bar Account Q', color: 'blue' },
    { id: 138, name: 'Retailer Balance Q', color: 'purple' },
    { id: 139, name: 'Retailer PIN Change verification failed R', color: 'orange' },
    { id: 140, name: 'Balance Deduct for Bengal TV Service Q', color: 'yellow' },
    { id: 141, name: 'OneSide Call helpline', color: 'cyan' },
    { id: 142, name: 'Test call', color: 'magenta' },
    { id: 143, name: 'Robi Sheba Q', color: 'lime' },
    { id: 144, name: 'RSP Q', color: 'pink' },
    { id: 145, name: 'Robi Helpline Q', color: 'teal' },
    { id: 146, name: 'Prepaid Desire Number Q', color: 'indigo' },
    { id: 147, name: 'Call Detail Request Q', color: 'brown' },
    { id: 148, name: 'Retailer Dealership Q', color: 'gray' },
    { id: 149, name: 'Ownership transfer Q', color: 'green' },
    { id: 150, name: 'Blocking Q', color: 'red' },
    { id: 151, name: 'Career at Robi Q', color: 'blue' },
    { id: 152, name: 'Postpaid Address Change Q', color: 'purple' },
    { id: 153, name: 'Incoming SMS offnet C', color: 'orange' },
    { id: 154, name: 'Board Exam Info C', color: 'yellow' },
    { id: 155, name: 'FNF Add C', color: 'cyan' },
    { id: 156, name: 'ISD C', color: 'magenta' },
    { id: 157, name: 'Retailer 8383 USSD Q', color: 'pink' },
    { id: 158, name: 'Call Divert Q', color: 'teal' },
    { id: 159, name: 'Call Conference Service Q', color: 'indigo' },
    { id: 160, name: 'Goongoon Act Pending SR', color: 'brown' },
    { id: 161, name: 'MVPP C', color: 'gray' },
    { id: 162, name: 'Balance Transfer C', color: 'green' },
    { id: 163, name: 'Prepaid package C', color: 'red' },
    { id: 164, name: 'Account Validity Q', color: 'blue' },
    { id: 165, name: 'Postpaid Bill Q', color: 'purple' },
    { id: 166, name: 'Single App Q', color: 'orange' },
    { id: 167, name: 'IR tariff Q', color: 'yellow' },
    { id: 168, name: 'Jhotpot Q', color: 'cyan' },
    { id: 169, name: 'Jhotpot C', color: 'magenta' },
    { id: 170, name: 'Rate Cutter C', color: 'pink' },
    { id: 171, name: 'Recharge Bonus Q', color: 'teal' },
    { id: 172, name: 'CRM slow C', color: 'indigo' },
    { id: 173, name: 'Prepaid Voice bundle Q', color: 'brown' },
    { id: 174, name: 'bkash Payment Q', color: 'gray' },
    { id: 175, name: 'Recharge and Validity Q', color: 'green' },
    { id: 176, name: 'Balance Deduct Query but no deduction happened Q', color: 'red' },
    { id: 177, name: 'Retailer Campaign Q', color: 'blue' },
    { id: 178, name: 'Other Social Media Q', color: 'purple' },
    { id: 179, name: 'Balance Deduct for Call Rate Q', color: 'orange' },
    { id: 180, name: 'Balance Deduct for Jhotpot Q', color: 'yellow' },
    { id: 181, name: 'Cholbe Robi App Q', color: 'cyan' },
    { id: 182, name: 'E-ticketing C', color: 'magenta' },
    { id: 183, name: 'Prank Call', color: 'pink' },
    { id: 184, name: 'Bar Due to Non NID Reg Q', color: 'teal' },
    { id: 185, name: '5G Q', color: 'indigo' },
    { id: 186, name: 'Goongoon Cancel R', color: 'brown' },
    { id: 187, name: 'Amar Goongoon Cancel Q', color: 'gray' },
    { id: 188, name: 'SIM registration Q', color: 'green' },
    { id: 189, name: 'Outbound call Q', color: 'red' },
    { id: 190, name: 'Balance Deduct for VAS Adjustment Given', color: 'blue' },
    { id: 191, name: 'Supplementary Charge Q', color: 'purple' },
    { id: 192, name: 'Ichchedana C', color: 'orange' },
    { id: 193, name: 'Acquisition Offer Q', color: 'yellow' },
    { id: 194, name: 'Amar Goongoon Act Q', color: 'cyan' },
    { id: 195, name: 'IVR C', color: 'magenta' },
    { id: 196, name: 'IVR SR', color: 'pink' },
    { id: 197, name: 'Balance Deduct for MIFE known Cancel R', color: 'teal' },
    { id: 198, name: 'Doorstep Service C', color: 'indigo' },
    { id: 199, name: 'Wow Call', color: 'brown' },
    { id: 200, name: 'Facebook C', color: 'gray' },
    { id: 201, name: 'Robi Social media Q', color: 'green' },
    { id: 202, name: 'MNP General Q', color: 'red' },
    { id: 203, name: 'E-care C', color: 'blue' },
    { id: 204, name: 'CLM Rate cutter Q', color: 'purple' },
    { id: 205, name: 'Robi My plan C', color: 'orange' },
    { id: 206, name: 'Balance Deduct for Data Q', color: 'yellow' },
    { id: 207, name: 'Data pack suspend / Resume C', color: 'cyan' },
    { id: 208, name: 'Manual Internet Setting Q', color: 'magenta' },
    { id: 209, name: 'OTA internet Setting R', color: 'pink' },
    { id: 210, name: 'Modem C', color: 'teal' },
    { id: 211, name: '2G Coverage C', color: 'indigo' },
    { id: 212, name: 'Elite discount offer C', color: 'brown' },
    { id: 213, name: 'Retailer CLM offer C', color: 'gray' },
    { id: 214, name: 'Retailer CLM offer Q', color: 'green' },
    { id: 215, name: 'Old Winback C', color: 'red' },
    { id: 216, name: 'Current Winback C', color: 'blue' },
    { id: 217, name: 'CLM Data C', color: 'purple' },
    { id: 218, name: 'Clone handset Bar Q', color: 'orange' },
    { id: 219, name: 'Combo pack Adjustment Q', color: 'yellow' },
    { id: 220, name: 'Voice pack Adjustment Q', color: 'cyan' },
    { id: 221, name: 'Incomplete Customer Query', color: 'magenta' },
    { id: 222, name: 'Prepaid Balance C', color: 'pink' },
    { id: 223, name: 'VoLTE C', color: 'teal' },
    { id: 224, name: '4G Data Speed C', color: 'indigo' },
    { id: 225, name: 'Data balance Q', color: 'brown' },
    { id: 226, name: 'SMS balance Q', color: 'gray' },
    { id: 227, name: 'Combo balance Q', color: 'green' },
    { id: 228, name: 'IOT Q', color: 'red' },
    { id: 229, name: 'IOT C', color: 'blue' },
    { id: 230, name: 'Recycle Sim Q', color: 'purple' },
    { id: 231, name: 'Blocking verification failed Q', color: 'orange' },
    { id: 232, name: 'Unblocking Q', color: 'yellow' },
    { id: 233, name: 'Unblocking verification failed Q', color: 'cyan' },
    { id: 234, name: 'Nagad Q', color: 'magenta' },
    { id: 235, name: 'Nagad C', color: 'pink' },
    { id: 236, name: 'Retailer Stock Q', color: 'teal' },
    { id: 237, name: '2G Coverage Q', color: 'indigo' },
    { id: 238, name: '2G Coverage SR', color: 'brown' },
    { id: 239, name: '2G Data Speed C', color: 'gray' },
    { id: 240, name: '4G Data Speed C', color: 'green' },
    { id: 241, name: 'Robi Flexi Plan C', color: 'red' },
    { id: 242, name: 'Robi Flexi Plan Q', color: 'blue' },
    { id: 243, name: 'NBS Internet Package R', color: 'purple' },
    { id: 244, name: 'Nearest store location Q', color: 'orange' },
    { id: 245, name: 'Customer Insight C', color: 'yellow' },
    { id: 246, name: 'Nearest store location C', color: 'cyan' },
    { id: 247, name: 'Robi Sheba R', color: 'magenta' },
    { id: 248, name: 'Robi Cash R', color: 'pink' },
    { id: 249, name: 'Robi Shop R', color: 'teal' },
    { id: 250, name: 'Robi Showroom R', color: 'indigo' },
    { id: 251, name: 'Robi e-Care R', color: 'brown' },
    { id: 252, name: 'Robi Website R', color: 'gray' },
    { id: 253, name: 'Robi Facebook R', color: 'green' },
    { id: 254, name: 'Robi Twitter R', color: 'red' },
    { id: 255, name: 'Robi Linkedin R', color: 'blue' },
    { id: 256, name: 'Robi Instagram R', color: 'purple' },
    { id: 257, name: 'Robi Youtube R', color: 'orange' },
    { id: 258, name: 'Robi Whatsapp R', color: 'yellow' },
    { id: 259, name: 'Robi Viber R', color: 'cyan' },
    { id: 260, name: 'Robi Messenger R', color: 'magenta' },
    { id: 261, name: 'Robi Live chat R', color: 'pink' },
    { id: 262, name: 'Robi Email R', color: 'teal' },
    { id: 263, name: 'Robi helpline R', color: 'indigo' },
    { id: 264, name: 'Robi helpline SR', color: 'brown' },
    { id: 265, name: 'Robi Retailer R', color: 'gray' },
    { id: 266, name: 'Robi Contact Center R', color: 'green' },
    { id: 267, name: 'Robi Boi Ghor R', color: 'red' },
    { id: 268, name: 'Robi Jhotpot R', color: 'blue' },
    { id: 269, name: 'Robi New SIM R', color: 'purple' },
    { id: 270, name: 'Robi Bondhu App R', color: 'orange' },
    { id: 271, name: 'Robi Shop R', color: 'yellow' },
    { id: 272, name: 'Robi Website Q', color: 'cyan' },
    { id: 273, name: 'Robi Facebook Q', color: 'magenta' },
    { id: 274, name: 'Robi Twitter Q', color: 'pink' },
    { id: 275, name: 'Robi Linkedin Q', color: 'teal' },
    { id: 276, name: 'Robi Instagram Q', color: 'indigo' },
    { id: 277, name: 'Robi Youtube Q', color: 'brown' },
    { id: 278, name: 'Robi Whatsapp Q', color: 'gray' },
    { id: 279, name: 'Robi Viber Q', color: 'green' },
    { id: 280, name: 'Robi Messenger Q', color: 'red' },
    { id: 281, name: 'Robi Imo Q', color: 'blue' },
    { id: 282, name: 'Robi Live chat Q', color: 'purple' },
    { id: 283, name: 'Robi Email Q', color: 'orange' },
    { id: 284, name: 'Robi Email C', color: 'yellow' },
    { id: 285, name: 'Robi helpline Q', color: 'cyan' },
    { id: 286, name: 'Robi helpline SR', color: 'magenta' },
    { id: 287, name: 'Robi helpline C', color: 'pink' },
    { id: 288, name: 'Robi helpline C', color: 'teal' },
    { id: 289, name: 'Robi Social Media C', color: 'indigo' },
    { id: 290, name: 'Robi Digital Platform C', color: 'brown' },
    { id: 291, name: 'Robi Chatbot C', color: 'gray' },
    { id: 292, name: 'Robi IVR C', color: 'green' },
    { id: 293, name: 'Robi Outbound C', color: 'red' },
    { id: 294, name: 'Robi Physical Center C', color: 'blue' },
    { id: 295, name: 'Robi E-Care R', color: 'purple' },
    { id: 296, name: 'Robi App R', color: 'orange' },
    { id: 297, name: 'Robi Facebook R', color: 'yellow' },
    { id: 298, name: 'Robi Twitter R', color: 'cyan' },
    { id: 299, name: 'Robi Linkedin R', color: 'magenta' },
    { id: 300, name: 'Robi Instagram R', color: 'pink' },
    { id: 301, name: 'Robi Youtube R', color: 'teal' },
    { id: 302, name: 'Robi Whatsapp R', color: 'indigo' },
    { id: 303, name: 'Robi Viber R', color: 'brown' },
    { id: 304, name: 'Robi Messenger R', color: 'gray' },
    { id: 305, name: 'Robi Imo R', color: 'green' },
    { id: 306, name: 'Robi Live chat R', color: 'red' },
    { id: 307, name: 'Robi Email R', color: 'blue' },
    { id: 308, name: 'Robi helpline R', color: 'purple' },
    { id: 309, name: 'Robi Retailer R', color: 'orange' },
    { id: 310, name: 'Robi E-Care R', color: 'yellow' },
    { id: 311, name: 'Robi App Q', color: 'cyan' },
    { id: 312, name: 'Robi Chatbot Q', color: 'magenta' },
    { id: 313, name: 'Robi IVR Q', color: 'pink' },
    { id: 314, name: 'Robi Outbound Q', color: 'teal' },
    { id: 315, name: 'Robi Physical Center Q', color: 'indigo' },
    { id: 316, name: 'Robi Call Center Q', color: 'brown' },
    { id: 317, name: 'Robi Digital Platform Q', color: 'gray' },
    { id: 318, name: 'Robi Imo Q', color: 'green' },
    { id: 319, name: 'Robi Social Media Q', color: 'red' },
    { id: 320, name: 'Robi Website Q', color: 'blue' },
    { id: 321, name: 'Robi E-Care C', color: 'purple' },
    { id: 322, name: 'Robi App C', color: 'orange' },
    { id: 323, name: 'Robi Chatbot C', color: 'yellow' },
    { id: 324, name: 'Robi IVR C', color: 'cyan' },
    { id: 325, name: 'Robi Outbound C', color: 'magenta' },
    { id: 326, name: 'Robi Physical Center C', color: 'pink' },
    { id: 327, name: 'Robi Digital Platform C', color: 'teal' },
    { id: 328, name: 'Robi Imo C', color: 'indigo' },
    { id: 329, name: 'Robi Social Media C', color: 'brown' },
    { id: 330, name: 'Robi Website C', color: 'gray' },
];

export default function TagSelectionInput({
                                              selectedTags,
                                              setSelectedTags,
                                              label = "Select Tags"
}) {
    const [selected, setSelected] = useState<Tag | null>(tags[0]);
    // const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

    useEffect(() => {
        const updatedTags: Tag[] = collect(selectedTags).push(selected!).filter((item:any) => item.id > 0).toArray();
        setSelectedTags(updatedTags);
    }, [selected]);



    // Filter out the selected tag from the available options
    const availableTags = tags.filter((tag) => !selectedTags.find((selectedTag) => selectedTag?.id === tag?.id));

    return (
        <Listbox value={selected} onChange={setSelected}>
            {({ open }) => (
                <>
                    <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">{ label }</Listbox.Label>
                    <div className="relative mt-2">
                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">

                            <span className="flex items-center">
                                <span
                                    aria-label={selected?.color === 'green' ? 'Online' : 'Offline'}
                                    className={classNames(
                                        selected?.color === 'green' ? 'bg-green-400' : 'bg-gray-200',
                                        'inline-block h-2 w-2 flex-shrink-0 rounded-full'
                                    )}
                                />

                                <span className="ml-3 block truncate">{selected?.name}</span>
                            </span>

                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </span>
                        </Listbox.Button>

                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {availableTags.map((tag) => (
                                    <Listbox.Option
                                        key={tag.id}
                                        className={({ active }) =>
                                            classNames(
                                                active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                                                'relative cursor-default select-none py-2 pl-3 pr-9'
                                            )
                                        }
                                        value={tag}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <div className="flex items-center">
                                                      <span
                                                          className={classNames(
                                                              tag.color === 'green' ? 'bg-green-400' : 'bg-gray-200',
                                                              'inline-block h-2 w-2 flex-shrink-0 rounded-full'
                                                          )}
                                                          aria-hidden="true"
                                                      />
                                                    <span className={classNames(selected ? 'font-bold' : 'font-normal', 'ml-3 block truncate')}>
                                                        {tag.name}

                                                        <span className="sr-only"> is {tag.color === 'green' ? 'online' : 'offline'}</span>
                                                    </span>
                                                </div>

                                                {selected ? (
                                                    <span
                                                        className={classNames(
                                                            active ? 'text-white' : 'text-indigo-600',
                                                            'absolute inset-y-0 right-0 flex items-center pr-4'
                                                        )}
                                                    >
                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                  </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </>
            )}
        </Listbox>
    );
}
