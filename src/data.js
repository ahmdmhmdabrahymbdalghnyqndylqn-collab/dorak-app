export const initialGuards = [
  { id: 'g1', name: 'أحمد العجارمة', phone: '079 123 4567', buildings: 3, lastSeen: 'منذ 8 دقائق', status: 'نشط' },
  { id: 'g2', name: 'محمد الزعبي', phone: '078 452 1180', buildings: 2, lastSeen: 'منذ ساعة', status: 'نشط' },
  { id: 'g3', name: 'خالد الرواشدة', phone: '077 801 3392', buildings: 1, lastSeen: 'أمس', status: 'بانتظار الموافقة' },
  { id: 'g4', name: 'سامي الحياري', phone: '079 620 4415', buildings: 1, lastSeen: 'منذ 9 أيام', status: 'موقوف' },
];

export const initialBuildings = [
  { id: 'b1', name: 'عمارة الياسمين', area: 'الجبيهة، عمّان', guard: 'أحمد العجارمة', units: 18, residents: 42, collected: 760, due: 140, balance: 535 },
  { id: 'b2', name: 'برج النخيل', area: 'شارع الجامعة، عمّان', guard: 'محمد الزعبي', units: 24, residents: 57, collected: 1080, due: 220, balance: 810 },
  { id: 'b3', name: 'مساكن الروابي', area: 'تلاع العلي، عمّان', guard: 'أحمد العجارمة', units: 12, residents: 29, collected: 520, due: 80, balance: 410 },
  { id: 'b4', name: 'عمارة الصفوة', area: 'الزرقاء الجديدة', guard: 'سامي الحياري', units: 16, residents: 35, collected: 610, due: 190, balance: 390 },
];

export const initialResidents = [
  { id: 'r1', name: 'يزن محمود', owner: 'نفسه', phone: '079 331 0291', building: 'عمارة الياسمين', unit: '101', monthly: 50, paid: 50, car: 'نعم', status: 'مدفوع' },
  { id: 'r2', name: 'ليث أبو رمان', owner: 'فؤاد أبو رمان', phone: '—', building: 'عمارة الياسمين', unit: '102', monthly: 50, paid: 25, car: 'نعم', status: 'جزئي' },
  { id: 'r3', name: 'عمر حجازي', owner: 'سليم حجازي', phone: '078 129 7754', building: 'برج النخيل', unit: '204', monthly: 60, paid: 0, car: 'لا', status: 'متأخر' },
  { id: 'r4', name: 'سارة الخطيب', owner: 'نفسها', phone: '079 998 1204', building: 'مساكن الروابي', unit: '301', monthly: 45, paid: 45, car: 'نعم', status: 'مدفوع' },
  { id: 'r5', name: 'عدنان الشوابكة', owner: 'نفسه', phone: '—', building: 'عمارة الصفوة', unit: '3', monthly: 40, paid: 0, car: 'لا', status: 'متأخر' },
];

export const orders = [
  { id: '#1048', resident: 'ليث أبو رمان', building: 'عمارة الياسمين', type: 'خضار وفواكه', total: 12.5, status: 'جديد', time: '10:32 ص' },
  { id: '#1047', resident: 'سارة الخطيب', building: 'مساكن الروابي', type: 'سوبرماركت', total: 26.75, status: 'جارٍ الشراء', time: '9:48 ص' },
  { id: '#1046', resident: 'يزن محمود', building: 'عمارة الياسمين', type: 'مخبز', total: 4.25, status: 'تم التسليم', time: 'أمس' },
];

export const activities = [
  { icon: '✓', title: 'تم تسجيل دفعة 50 د.أ', meta: 'يزن محمود · عمارة الياسمين', time: 'منذ 12 دقيقة', tone: 'green' },
  { icon: '+', title: 'انضم حارس جديد', meta: 'خالد الرواشدة · بانتظار الموافقة', time: 'منذ 38 دقيقة', tone: 'orange' },
  { icon: '↻', title: 'تم تعديل بيانات ساكن', meta: 'ليث أبو رمان · شقة 102', time: 'منذ ساعتين', tone: 'blue' },
  { icon: '!', title: 'تم تسجيل تصليح بقيمة 35 د.أ', meta: 'برج النخيل · باب المدخل', time: 'أمس', tone: 'red' },
];

export const monthly = [420, 510, 475, 620, 690, 740, 810, 765, 890, 950, 1080, 1160];
