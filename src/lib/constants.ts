export const INSTITUTE = {
  name: "वेद अभ्यासिका",
  branch: "शाखा क्र. 01",
  location: "महादेवनगर",
  owner: "Rahul Chaudhari",
  contacts: ["7719991306", "8080082679"],
  motto: "॥ विद्या विनयेन शोभते ॥",
  timings: "सकाळी 7:00 ते रात्री 11:00",
};

export interface Hall {
  id: string;
  name: string;
  desks: number;
  fee: number;
}

export interface Branch {
  id: string;
  name: string;
  halls: Hall[];
}

export const BRANCHES: Branch[] = [
  {
    id: "branch-1",
    name: "शाखा 1. महादेवनगर",
    halls: [
      { id: "hall-b", name: "Hall B", desks: 21, fee: 900 },
      { id: "hall-c", name: "Hall C", desks: 48, fee: 900 },
      { id: "hall-d", name: "Hall D", desks: 65, fee: 900 },
    ],
  },
  {
    id: "branch-2",
    name: "शाखा 2. गोपाळपट्टी",
    halls: [
      { id: "hall-a", name: "Hall A", desks: 50, fee: 800 },
    ],
  },
];

// Flat list including Hall D AC (hidden from sidebar but used in HallView toggle)
export const HALLS: Hall[] = [
  ...BRANCHES.flatMap((b) => b.halls),
  { id: "hall-d-ac", name: "Hall D AC", desks: 19, fee: 1200 },
];

export const REGISTRATION_FEE = 100;

export const FACILITIES = [
  "Quiet Study Environment",
  "AC / Non AC Hall",
  "Reserved Seats",
  "Glass Compartments",
  "Comfortable Chairs",
  "Two Wheeler Parking",
  "Discussion Area",
  "Meeting Room",
  "CCTV",
  "High Speed WiFi",
  "Newspapers",
  "Charging Point",
  "Water Purifier",
  "Separate Washrooms",
];

export const RULES = [
  "बाहेरच्या व्यक्तींना प्रवेश नाही",
  "पाहुण्यांची जबाबदारी संबंधित मेंबरची",
  "शुल्क २ तारखेच्या आत भरावे",
  "एकाच टेबलाचा वापर",
  "शेजारच्या टेबलावर वस्तू ठेवू नयेत",
  "दैनिक व्यवस्थित ठेवावे",
  "प्रवेश शुल्क परत मिळणार नाही",
  "डेस्कवर कागद चिकटवू नयेत",
  "खुर्ची टेबलाखाली ठेवावी",
  "पुस्तके सोबत घेऊन जावीत",
  "शांतता व स्वच्छता राखावी",
  "मद्यपान / तंबाखू निषिद्ध",
  "अभ्यासिका शांत अभ्यासासाठी आहे",
];

export type DeskStatus = "available" | "occupied" | "expired";

export interface Student {
  id: string;
  full_name: string;
  mobile_number: string;
  pin?: string;
  status: "active" | "expired" | "inactive";
  created_at: string;
}

export interface Allocation {
  id: string;
  student_id: string;
  hall_name: string;
  desk_number: number;
  start_date: string;
  end_date: string;
  active: boolean;
}

export function getWhatsAppReminderUrl(mobile: string): string {
  const message = `नमस्कार,

📚 वेद अभ्यासिका
शाखा क्र. 01 | महादेवनगर

आपली अभ्यासिकेची सदस्यता लवकरच संपत आहे.

कृपया पुढील महिन्याचे शुल्क लवकर भरावे.

धन्यवाद 🙏
वेद अभ्यासिका`;
  return `https://wa.me/91${mobile}?text=${encodeURIComponent(message)}`;
}

export function getShareSeatsMessage(availableByHall: Record<string, number>): string {
  const hallLines = Object.entries(availableByHall)
    .map(([hall, count]) => `${hall} — ${count} जागा`)
    .join("\n");

  return `📚 वेद अभ्यासिका
शाखा क्र. 01 | महादेवनगर

अभ्यासासाठी शांत व प्रशस्त अभ्यासिका उपलब्ध.

उपलब्ध जागा:
${hallLines}

⏰ वेळ
सकाळी 7 ते रात्री 11

📞 संपर्क
7719991306
8080082679`;
}
