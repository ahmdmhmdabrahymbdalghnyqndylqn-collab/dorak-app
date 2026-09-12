import React, { useMemo, useState } from 'react';
import {
  Alert,
  I18nManager,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { activities, initialBuildings, initialGuards, initialResidents, monthly, orders } from './src/data';
import { colors, shadow } from './src/theme';

I18nManager.allowRTL(true);

const money = (value) => `${Number(value).toLocaleString('ar-JO')} د.أ`;

const navItems = [
  ['overview', '⌂', 'نظرة عامة'],
  ['guards', '♙', 'الحراس'],
  ['buildings', '▥', 'العمارات'],
  ['residents', '♧', 'السكان'],
  ['orders', '▤', 'الطلبات'],
  ['expenses', '◫', 'المصاريف'],
  ['settings', '⚙', 'الإعدادات'],
];

function Brand({ compact = false }) {
  return (
    <View style={[styles.brand, compact && { marginBottom: 0 }]}>
      <View style={styles.logoMark}>
        <View style={styles.logoRoof} />
        <Text style={styles.logoLetter}>د</Text>
        <View style={styles.logoCheck}><Text style={styles.logoCheckText}>✓</Text></View>
      </View>
      {!compact && (
        <View>
          <Text style={styles.brandName}>دَوْرَك</Text>
          <Text style={styles.brandSub}>لوحة المالك</Text>
        </View>
      )}
    </View>
  );
}

function Badge({ label }) {
  const map = {
    'نشط': ['green', 'greenSoft'], 'مدفوع': ['green', 'greenSoft'], 'تم التسليم': ['green', 'greenSoft'],
    'جزئي': ['orange', 'orangeSoft'], 'بانتظار الموافقة': ['orange', 'orangeSoft'], 'جارٍ الشراء': ['orange', 'orangeSoft'],
    'متأخر': ['red', 'redSoft'], 'موقوف': ['red', 'redSoft'], 'جديد': ['blue', 'primarySoft'],
  };
  const pair = map[label] || ['muted', 'canvas'];
  return <View style={[styles.badge, { backgroundColor: colors[pair[1]] }]}><Text style={[styles.badgeText, { color: colors[pair[0]] }]}>{label}</Text></View>;
}

function StatCard({ icon, label, value, note, tone = 'primary' }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: colors[`${tone}Soft`] || colors.primarySoft }]}><Text style={{ color: colors[tone] || colors.primary, fontSize: 20 }}>{icon}</Text></View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={[styles.statNote, { color: note?.startsWith('+') ? colors.green : colors.muted }]}>{note}</Text>
    </View>
  );
}

function DonutChart() {
  const size = 170; const stroke = 20; const radius = (size - stroke) / 2; const c = 2 * Math.PI * radius;
  const data = [{ pct: .68, color: colors.green }, { pct: .20, color: colors.orange }, { pct: .12, color: colors.red }];
  let offset = 0;
  return (
    <View style={styles.donutWrap}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size/2} cy={size/2} r={radius} stroke={colors.line} strokeWidth={stroke} fill="none" />
        {data.map((d, i) => { const start = offset; offset += d.pct; return <Circle key={i} cx={size/2} cy={size/2} r={radius} stroke={d.color} strokeWidth={stroke} fill="none" strokeDasharray={`${d.pct*c} ${c}`} strokeDashoffset={-start*c} strokeLinecap="round" />; })}
      </Svg>
      <View style={styles.donutCenter}><Text style={styles.donutNumber}>68%</Text><Text style={styles.donutLabel}>نشطون</Text></View>
    </View>
  );
}

function LineBars() {
  const max = Math.max(...monthly);
  return (
    <View style={styles.barChart}>
      {monthly.map((v, i) => <View key={i} style={styles.barSlot}><View style={[styles.bar, { height: 34 + (v/max)*105, backgroundColor: i === 11 ? colors.primary : '#C9DEE3' }]} /><Text style={styles.axisText}>{i+1}</Text></View>)}
    </View>
  );
}

function Card({ title, action, children, style }) {
  return <View style={[styles.card, style]}><View style={styles.cardHeader}><Text style={styles.cardTitle}>{title}</Text>{action}</View>{children}</View>;
}

function Overview({ setPage, guards, buildings, residents }) {
  const collected = buildings.reduce((s, b) => s + b.collected, 0);
  return (
    <>
      <View style={styles.hero}>
        <View><Text style={styles.heroEyebrow}>الجمعة، 12 سبتمبر 2026</Text><Text style={styles.heroTitle}>أهلًا بك في دَوْرَك 👋</Text><Text style={styles.heroText}>هذه نظرة شاملة على نشاط التطبيق لهذا الشهر.</Text></View>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => setPage('guards')}><Text style={styles.primaryBtnText}>+ إضافة حارس</Text></TouchableOpacity>
      </View>
      <View style={styles.statsGrid}>
        <StatCard icon="♙" label="الحراس المسجلون" value={guards.length} note="+12% هذا الشهر" />
        <StatCard icon="▥" label="العمارات" value={buildings.length} note={`${buildings.reduce((s,b)=>s+b.units,0)} شقة`} tone="blue" />
        <StatCard icon="♧" label="السكان" value={residents.length + 158} note="+9 سكان جدد" tone="green" />
        <StatCard icon="د.أ" label="تحصيل الشهر" value={money(collected)} note="87% من المطلوب" tone="orange" />
      </View>
      <View style={styles.twoCols}>
        <Card title="نمو التحصيل الشهري" action={<Text style={styles.headerAction}>2026⌄</Text>} style={styles.flexWide}>
          <Text style={styles.bigMetric}>{money(1160)}</Text><Text style={styles.metricHint}>+14.8% مقارنة بالشهر السابق</Text><LineBars />
        </Card>
        <Card title="حالة حسابات الحراس" style={styles.flexNarrow}>
          <View style={styles.donutSection}><DonutChart /><View style={{ gap: 12 }}><Legend color={colors.green} label="نشط" value="68%"/><Legend color={colors.orange} label="بانتظار الموافقة" value="20%"/><Legend color={colors.red} label="موقوف" value="12%"/></View></View>
        </Card>
      </View>
      <View style={styles.twoCols}>
        <Card title="آخر النشاطات" action={<TouchableOpacity onPress={() => setPage('residents')}><Text style={styles.headerAction}>عرض الكل</Text></TouchableOpacity>} style={styles.flexWide}>
          {activities.map((a, i) => <View key={i} style={[styles.activityRow, i === activities.length-1 && { borderBottomWidth: 0 }]}><View style={[styles.activityIcon,{backgroundColor:colors[`${a.tone}Soft`] || colors.primarySoft}]}><Text style={{color:colors[a.tone]}}>{a.icon}</Text></View><View style={{flex:1}}><Text style={styles.rowTitle}>{a.title}</Text><Text style={styles.rowMeta}>{a.meta}</Text></View><Text style={styles.rowTime}>{a.time}</Text></View>)}
        </Card>
        <Card title="تنبيهات تحتاج انتباهك" style={styles.flexNarrow}>
          <AlertRow tone="orange" title="حارس ينتظر الموافقة" text="خالد الرواشدة سجل اليوم" />
          <AlertRow tone="red" title="4 حسابات غير نشطة" text="لم تسجل دخولًا منذ أكثر من أسبوع" />
          <AlertRow tone="blue" title="نسخة احتياطية مكتملة" text="آخر نسخة: اليوم 3:10 ص" last />
        </Card>
      </View>
    </>
  );
}

function Legend({ color, label, value }) { return <View style={styles.legend}><View style={[styles.dot,{backgroundColor:color}]} /><Text style={styles.legendLabel}>{label}</Text><Text style={styles.legendValue}>{value}</Text></View>; }
function AlertRow({ tone, title, text, last }) { return <View style={[styles.alertRow,last&&{borderBottomWidth:0}]}><View style={[styles.alertLine,{backgroundColor:colors[tone]}]} /><View><Text style={styles.rowTitle}>{title}</Text><Text style={styles.rowMeta}>{text}</Text></View></View>; }

function Toolbar({ search, setSearch, button, onButton }) {
  return <View style={styles.toolbar}><View style={styles.searchBox}><Text style={styles.searchIcon}>⌕</Text><TextInput value={search} onChangeText={setSearch} placeholder="بحث..." placeholderTextColor={colors.muted} style={styles.searchInput} textAlign="right" /></View>{button && <TouchableOpacity style={styles.primaryBtn} onPress={onButton}><Text style={styles.primaryBtnText}>+ {button}</Text></TouchableOpacity>}</View>;
}

function TableHeader({ cells }) { return <View style={styles.tableHeader}>{cells.map((x,i)=><Text key={i} style={[styles.th,{flex:x[1]}]}>{x[0]}</Text>)}</View>; }

function GuardsPage({ guards, setGuards }) {
  const [q,setQ]=useState(''); const list=guards.filter(g=>`${g.name} ${g.phone} ${g.status}`.includes(q));
  const toggle=(id)=>setGuards(guards.map(g=>g.id===id?{...g,status:g.status==='موقوف'?'نشط':'موقوف'}:g));
  return <Page title="إدارة الحراس" sub="راجع الحسابات والصلاحيات ونشاط كل حارس."><Toolbar search={q} setSearch={setQ} button="إضافة حارس" onButton={()=>Alert.alert('إضافة حارس','سيتم إرسال دعوة آمنة للحارس الجديد.')} /><Card title={`كل الحراس (${list.length})`}><ScrollView horizontal showsHorizontalScrollIndicator={false}><View style={{minWidth:850}}><TableHeader cells={[["الحارس",2],["الهاتف",1.4],["العمارات",1],["آخر ظهور",1.4],["الحالة",1.5],["الإجراء",1]]}/>{list.map(g=><View style={styles.tr} key={g.id}><View style={[styles.personCell,{flex:2}]}><View style={styles.avatar}><Text style={styles.avatarText}>{g.name[0]}</Text></View><Text style={styles.rowTitle}>{g.name}</Text></View><Text style={[styles.td,{flex:1.4}]}>{g.phone}</Text><Text style={[styles.td,{flex:1}]}>{g.buildings}</Text><Text style={[styles.td,{flex:1.4}]}>{g.lastSeen}</Text><View style={[styles.tdView,{flex:1.5}]}><Badge label={g.status}/></View><TouchableOpacity style={[styles.smallBtn,{flex:1}]} onPress={()=>toggle(g.id)}><Text style={styles.smallBtnText}>{g.status==='موقوف'?'تفعيل':'إدارة'}</Text></TouchableOpacity></View>)}</View></ScrollView></Card></Page>;
}

function BuildingsPage({ buildings }) {
  const [q,setQ]=useState(''); const list=buildings.filter(b=>`${b.name} ${b.area} ${b.guard}`.includes(q));
  return <Page title="العمارات" sub="كل عمارة مستقلة بسكانها وتحصيلاتها ومصاريفها."><Toolbar search={q} setSearch={setQ} button="إضافة عمارة" onButton={()=>Alert.alert('إضافة عمارة','نموذج العمارة جاهز للإضافة.')} /><View style={styles.buildingGrid}>{list.map(b=><View key={b.id} style={styles.buildingCard}><View style={styles.buildingTop}><View style={styles.buildingIcon}><Text style={{fontSize:23,color:colors.primary}}>▥</Text></View><TouchableOpacity><Text style={styles.more}>•••</Text></TouchableOpacity></View><Text style={styles.buildingName}>{b.name}</Text><Text style={styles.rowMeta}>{b.area}</Text><View style={styles.buildingDetails}><Mini label="الشقق" value={b.units}/><Mini label="السكان" value={b.residents}/><Mini label="المتأخر" value={money(b.due)}/></View><View style={styles.progressTrack}><View style={[styles.progressFill,{width:`${Math.max(12,100-b.due/(b.collected+b.due)*100)}%`}]} /></View><View style={styles.buildingFooter}><Text style={styles.rowMeta}>الحارس: {b.guard}</Text><Text style={styles.balance}>{money(b.balance)}</Text></View></View>)}</View></Page>;
}
function Mini({label,value}){return <View><Text style={styles.miniLabel}>{label}</Text><Text style={styles.miniValue}>{value}</Text></View>}

function ResidentsPage({ residents, setResidents }) {
  const [q,setQ]=useState(''); const [selected,setSelected]=useState(null);
  const list=residents.filter(r=>`${r.name} ${r.owner} ${r.building} ${r.unit}`.includes(q));
  return <Page title="السكان" sub="عدّل البيانات أو استبدل ساكنًا مع الاحتفاظ بالسجل السابق."><Toolbar search={q} setSearch={setQ} button="إضافة ساكن" onButton={()=>setSelected({id:`r${Date.now()}`,name:'',owner:'نفسه',phone:'',building:'عمارة الياسمين',unit:'',monthly:50,paid:0,car:'لا',status:'متأخر'})}/><Card title={`دليل السكان (${list.length})`}><ScrollView horizontal><View style={{minWidth:980}}><TableHeader cells={[["الساكن",1.8],["العمارة / الشقة",1.8],["المالك",1.5],["الهاتف",1.3],["الاشتراك",1],["الدفع",1],["الحالة",1],["",.7]]}/>{list.map(r=><View style={styles.tr} key={r.id}><View style={[styles.personCell,{flex:1.8}]}><View style={styles.avatar}><Text style={styles.avatarText}>{r.name[0]}</Text></View><Text style={styles.rowTitle}>{r.name}</Text></View><View style={[styles.tdView,{flex:1.8}]}><Text style={styles.rowTitle}>{r.building}</Text><Text style={styles.rowMeta}>شقة {r.unit}</Text></View><Text style={[styles.td,{flex:1.5}]}>{r.owner}</Text><Text style={[styles.td,{flex:1.3}]}>{r.phone}</Text><Text style={[styles.td,{flex:1}]}>{money(r.monthly)}</Text><Text style={[styles.td,{flex:1}]}>{money(r.paid)}</Text><View style={[styles.tdView,{flex:1}]}><Badge label={r.status}/></View><TouchableOpacity onPress={()=>setSelected(r)} style={[styles.editBtn,{flex:.7}]}><Text style={styles.editBtnText}>تعديل</Text></TouchableOpacity></View>)}</View></ScrollView></Card><ResidentModal resident={selected} onClose={()=>setSelected(null)} onSave={(r)=>{setResidents(prev=>prev.some(x=>x.id===r.id)?prev.map(x=>x.id===r.id?r:x):[r,...prev]);setSelected(null);}} /></Page>;
}

function ResidentModal({ resident, onClose, onSave }) {
  const [draft,setDraft]=useState(resident);
  React.useEffect(()=>setDraft(resident),[resident]); if(!draft)return null;
  const field=(key,label)=><View style={styles.field}><Text style={styles.fieldLabel}>{label}</Text><TextInput value={String(draft[key]??'')} onChangeText={v=>setDraft({...draft,[key]:v})} style={styles.fieldInput} textAlign="right" /></View>;
  return <Modal visible transparent animationType="fade"><View style={styles.modalShade}><View style={styles.modalCard}><View style={styles.cardHeader}><Text style={styles.cardTitle}>تعديل بيانات الساكن</Text><TouchableOpacity onPress={onClose}><Text style={styles.close}>×</Text></TouchableOpacity></View>{field('name','اسم الساكن')}{field('owner','اسم المالك')}{field('phone','رقم الهاتف (اختياري)')}<View style={styles.fieldRow}>{field('building','العمارة')}{field('unit','رقم الشقة')}</View><View style={styles.modalActions}><TouchableOpacity style={styles.secondaryBtn} onPress={onClose}><Text style={styles.secondaryBtnText}>إلغاء</Text></TouchableOpacity><TouchableOpacity style={styles.primaryBtn} onPress={()=>{if(!draft.name.trim())return Alert.alert('تنبيه','اكتب اسم الساكن');onSave(draft);}}><Text style={styles.primaryBtnText}>حفظ التعديل</Text></TouchableOpacity></View><TouchableOpacity onPress={()=>Alert.alert('استبدال الساكن','سيُؤرشف الساكن الحالي وتبقى دفعاته وطلباته محفوظة.')}><Text style={styles.archiveLink}>استبدال الساكن مع حفظ السجل السابق</Text></TouchableOpacity></View></View></Modal>;
}

function OrdersPage(){const [q,setQ]=useState('');const list=orders.filter(o=>`${o.resident} ${o.building} ${o.type}`.includes(q));return <Page title="طلبات المشتريات" sub="سوبرماركت، خضار وفواكه ومخبز — منفصلة عن صيانة العمارات."><Toolbar search={q} setSearch={setQ}/><View style={styles.statsGrid}><StatCard icon="▤" label="طلبات اليوم" value="18" note="5 طلبات جديدة"/><StatCard icon="⌁" label="جارٍ الشراء" value="7" note="لدى 3 حراس" tone="orange"/><StatCard icon="✓" label="تم التسليم" value="46" note="هذا الأسبوع" tone="green"/><StatCard icon="د.أ" label="قيمة الطلبات" value="624 د.أ" note="هذا الشهر" tone="blue"/></View><Card title="أحدث الطلبات"><TableHeader cells={[["الطلب",1],["الساكن",1.5],["العمارة",1.6],["القسم",1.3],["الإجمالي",1],["الحالة",1.3]]}/>{list.map(o=><View style={styles.tr} key={o.id}><Text style={[styles.td,{flex:1,color:colors.primary,fontWeight:'800'}]}>{o.id}</Text><Text style={[styles.td,{flex:1.5}]}>{o.resident}</Text><Text style={[styles.td,{flex:1.6}]}>{o.building}</Text><Text style={[styles.td,{flex:1.3}]}>{o.type}</Text><Text style={[styles.td,{flex:1}]}>{money(o.total)}</Text><View style={[styles.tdView,{flex:1.3}]}><Badge label={o.status}/></View></View>)}</Card></Page>}

function ExpensesPage(){return <Page title="المصاريف والتصليحات" sub="مصاريف كل عمارة مستقلة: صيانة مصعد، تصليحات، أو مصروف آخر."><View style={styles.statsGrid}><StatCard icon="↧" label="إجمالي المصاريف" value="455 د.أ" note="سبتمبر 2026" tone="red"/><StatCard icon="↻" label="صيانة المصاعد" value="210 د.أ" note="46% من المصاريف" tone="orange"/><StatCard icon="⌂" label="التصليحات" value="185 د.أ" note="8 عمليات" tone="blue"/><StatCard icon="◫" label="مصروف آخر" value="60 د.أ" note="3 عمليات" tone="green"/></View><Card title="توزيع مصاريف العمارات">{initialBuildings.map((b,i)=><View style={styles.expenseRow} key={b.id}><View style={{flex:1}}><Text style={styles.rowTitle}>{b.name}</Text><Text style={styles.rowMeta}>{i%2?'صيانة مصعد':'تصليحات'}</Text></View><View style={styles.expenseTrack}><View style={[styles.expenseFill,{width:`${35+i*14}%`}]} /></View><Text style={styles.expenseValue}>{money(65+i*30)}</Text></View>)}</Card></Page>}

function SettingsPage(){return <Page title="إعدادات المالك" sub="التحكم بصلاحيات النظام، النسخ الاحتياطي والإشعارات.">{[['الموافقة على الحسابات الجديدة','لا يدخل الحارس قبل موافقتك'],['النسخ الاحتياطي التلقائي','يوميًا الساعة 3:00 صباحًا'],['سجل التعديلات','يحفظ كل تعديل وحذف وأرشفة'],['إشعارات النظام','تنبيهات التسجيل والتوقف والأخطاء']].map((x,i)=><View style={styles.settingRow} key={i}><View style={styles.settingIcon}><Text style={{color:colors.primary}}>⚙</Text></View><View style={{flex:1}}><Text style={styles.rowTitle}>{x[0]}</Text><Text style={styles.rowMeta}>{x[1]}</Text></View><View style={styles.switchOn}><View style={styles.switchKnob}/></View></View>)}</Page>}

function Page({title,sub,children}){return <View><View style={styles.pageTitleRow}><View><Text style={styles.pageTitle}>{title}</Text><Text style={styles.pageSub}>{sub}</Text></View></View>{children}</View>}

export default function App() {
  const { width } = useWindowDimensions(); const desktop = width >= 900;
  const [page,setPage]=useState('overview'); const [guards,setGuards]=useState(initialGuards); const [buildings]=useState(initialBuildings); const [residents,setResidents]=useState(initialResidents);
  const body = useMemo(()=>({overview:<Overview setPage={setPage} guards={guards} buildings={buildings} residents={residents}/>,guards:<GuardsPage guards={guards} setGuards={setGuards}/>,buildings:<BuildingsPage buildings={buildings}/>,residents:<ResidentsPage residents={residents} setResidents={setResidents}/>,orders:<OrdersPage/>,expenses:<ExpensesPage/>,settings:<SettingsPage/>}[page]),[page,guards,buildings,residents]);
  return <SafeAreaView style={styles.safe}><StatusBar barStyle="dark-content" backgroundColor={colors.white}/><View style={styles.shell}>{desktop&&<View style={styles.sidebar}><Brand/><Text style={styles.navCaption}>القائمة الرئيسية</Text>{navItems.map(n=><Pressable key={n[0]} onPress={()=>setPage(n[0])} style={[styles.navItem,page===n[0]&&styles.navActive]}><Text style={[styles.navIcon,page===n[0]&&styles.navActiveText]}>{n[1]}</Text><Text style={[styles.navText,page===n[0]&&styles.navActiveText]}>{n[2]}</Text>{n[0]==='guards'&&<View style={styles.navCount}><Text style={styles.navCountText}>1</Text></View>}</Pressable>)}<View style={styles.ownerCard}><View style={styles.ownerAvatar}><Text style={styles.ownerAvatarText}>م</Text></View><View style={{flex:1}}><Text style={styles.ownerName}>مالك دَوْرَك</Text><Text style={styles.ownerRole}>المالك الرئيسي</Text></View></View></View>}<View style={styles.main}>{!desktop&&<View style={styles.mobileTop}><Brand compact/><Text style={styles.mobileTitle}>دَوْرَك</Text><TouchableOpacity><Text style={{fontSize:24}}>☰</Text></TouchableOpacity></View>}<ScrollView contentContainerStyle={[styles.content,!desktop&&{padding:16,paddingBottom:95}]} showsVerticalScrollIndicator={false}>{body}</ScrollView>{!desktop&&<View style={styles.bottomNav}>{navItems.slice(0,5).map(n=><TouchableOpacity key={n[0]} onPress={()=>setPage(n[0])} style={styles.bottomItem}><Text style={[styles.bottomIcon,page===n[0]&&{color:colors.primary}]}>{n[1]}</Text><Text style={[styles.bottomText,page===n[0]&&{color:colors.primary,fontWeight:'800'}]}>{n[2]}</Text></TouchableOpacity>)}</View>}</View></View></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:colors.white},shell:{flex:1,flexDirection:'row'},sidebar:{width:250,backgroundColor:colors.white,borderRightWidth:1,borderRightColor:colors.line,padding:22},main:{flex:1,backgroundColor:colors.canvas},content:{padding:30,maxWidth:1450,width:'100%',alignSelf:'center'},
  brand:{flexDirection:'row',alignItems:'center',gap:11,marginBottom:34},logoMark:{width:48,height:48,borderRadius:15,backgroundColor:colors.primary,alignItems:'center',justifyContent:'center',overflow:'hidden'},logoRoof:{position:'absolute',top:9,width:23,height:3,borderRadius:2,backgroundColor:'#B7D7DE'},logoLetter:{fontSize:27,fontWeight:'900',color:colors.white,marginTop:4},logoCheck:{position:'absolute',right:3,bottom:3,width:16,height:16,borderRadius:8,backgroundColor:colors.green,alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:colors.white},logoCheckText:{color:colors.white,fontSize:9,fontWeight:'900'},brandName:{fontSize:22,fontWeight:'900',color:colors.primary,writingDirection:'rtl'},brandSub:{fontSize:11,color:colors.muted,marginTop:1,writingDirection:'rtl'},
  navCaption:{fontSize:11,color:colors.muted,marginBottom:10,textAlign:'right'},navItem:{height:48,borderRadius:13,flexDirection:'row-reverse',alignItems:'center',paddingHorizontal:14,gap:12,marginBottom:5},navActive:{backgroundColor:colors.primary},navIcon:{fontSize:19,color:colors.muted,width:24,textAlign:'center'},navText:{fontSize:14,fontWeight:'700',color:colors.text,flex:1,textAlign:'right'},navActiveText:{color:colors.white},navCount:{backgroundColor:colors.orange,width:21,height:21,borderRadius:11,alignItems:'center',justifyContent:'center'},navCountText:{color:colors.white,fontSize:11,fontWeight:'900'},ownerCard:{marginTop:'auto',paddingTop:18,borderTopWidth:1,borderTopColor:colors.line,flexDirection:'row-reverse',alignItems:'center',gap:10},ownerAvatar:{width:39,height:39,borderRadius:13,backgroundColor:colors.primarySoft,alignItems:'center',justifyContent:'center'},ownerAvatarText:{color:colors.primary,fontWeight:'900'},ownerName:{fontSize:13,fontWeight:'800',textAlign:'right',color:colors.text},ownerRole:{fontSize:11,color:colors.muted,textAlign:'right',marginTop:2},
  mobileTop:{height:66,backgroundColor:colors.white,borderBottomWidth:1,borderBottomColor:colors.line,paddingHorizontal:16,flexDirection:'row-reverse',alignItems:'center',justifyContent:'space-between'},mobileTitle:{fontSize:20,fontWeight:'900',color:colors.primary},bottomNav:{position:'absolute',bottom:0,left:0,right:0,height:72,backgroundColor:colors.white,borderTopWidth:1,borderTopColor:colors.line,flexDirection:'row-reverse',alignItems:'center',justifyContent:'space-around'},bottomItem:{alignItems:'center',minWidth:60},bottomIcon:{fontSize:20,color:colors.muted},bottomText:{fontSize:10,color:colors.muted,marginTop:3},
  hero:{flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center',marginBottom:24,gap:16},heroEyebrow:{fontSize:12,color:colors.muted,textAlign:'right',marginBottom:5},heroTitle:{fontSize:26,fontWeight:'900',color:colors.text,textAlign:'right'},heroText:{fontSize:13,color:colors.muted,textAlign:'right',marginTop:5},primaryBtn:{backgroundColor:colors.primary,minHeight:44,borderRadius:12,paddingHorizontal:18,alignItems:'center',justifyContent:'center'},primaryBtnText:{color:colors.white,fontWeight:'800',fontSize:13},
  statsGrid:{flexDirection:'row-reverse',flexWrap:'wrap',gap:14,marginBottom:16},statCard:{flexGrow:1,flexBasis:190,minWidth:175,backgroundColor:colors.white,borderRadius:18,padding:18,...shadow},statIcon:{width:42,height:42,borderRadius:13,alignItems:'center',justifyContent:'center',marginBottom:14},statLabel:{fontSize:12,color:colors.muted,textAlign:'right'},statValue:{fontSize:24,fontWeight:'900',color:colors.text,textAlign:'right',marginTop:5},statNote:{fontSize:11,textAlign:'right',marginTop:7},
  card:{backgroundColor:colors.white,borderRadius:18,padding:20,marginBottom:16,...shadow},cardHeader:{flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center',marginBottom:17},cardTitle:{fontSize:16,fontWeight:'900',color:colors.text,textAlign:'right'},headerAction:{fontSize:12,color:colors.primary,fontWeight:'800'},twoCols:{flexDirection:'row-reverse',flexWrap:'wrap',gap:16},flexWide:{flex:1.6,minWidth:310},flexNarrow:{flex:1,minWidth:280},bigMetric:{fontSize:21,fontWeight:'900',color:colors.text,textAlign:'right'},metricHint:{fontSize:11,color:colors.green,textAlign:'right',marginTop:3},barChart:{height:170,flexDirection:'row',alignItems:'flex-end',gap:8,marginTop:15,paddingTop:10},barSlot:{flex:1,alignItems:'center',justifyContent:'flex-end'},bar:{width:'72%',maxWidth:22,borderRadius:6},axisText:{fontSize:9,color:colors.muted,marginTop:6},donutSection:{flexDirection:'row',alignItems:'center',justifyContent:'space-around',flexWrap:'wrap',gap:12},donutWrap:{width:170,height:170,alignItems:'center',justifyContent:'center'},donutCenter:{position:'absolute',alignItems:'center'},donutNumber:{fontSize:24,fontWeight:'900',color:colors.text},donutLabel:{fontSize:11,color:colors.muted},legend:{flexDirection:'row-reverse',alignItems:'center',gap:7,minWidth:130},dot:{width:8,height:8,borderRadius:4},legendLabel:{fontSize:11,color:colors.muted,flex:1,textAlign:'right'},legendValue:{fontSize:11,fontWeight:'900',color:colors.text},
  activityRow:{flexDirection:'row-reverse',alignItems:'center',gap:11,paddingVertical:12,borderBottomWidth:1,borderBottomColor:colors.line},activityIcon:{width:34,height:34,borderRadius:11,alignItems:'center',justifyContent:'center'},rowTitle:{fontSize:12.5,fontWeight:'800',color:colors.text,textAlign:'right'},rowMeta:{fontSize:10.5,color:colors.muted,textAlign:'right',marginTop:3},rowTime:{fontSize:10,color:colors.muted},alertRow:{minHeight:65,borderBottomWidth:1,borderBottomColor:colors.line,flexDirection:'row-reverse',alignItems:'center',gap:12},alertLine:{width:4,height:37,borderRadius:3},
  pageTitleRow:{flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center',marginBottom:22},pageTitle:{fontSize:25,fontWeight:'900',color:colors.text,textAlign:'right'},pageSub:{fontSize:12.5,color:colors.muted,textAlign:'right',marginTop:6},toolbar:{flexDirection:'row-reverse',alignItems:'center',gap:12,marginBottom:16},searchBox:{height:44,flex:1,maxWidth:470,backgroundColor:colors.white,borderWidth:1,borderColor:colors.line,borderRadius:12,flexDirection:'row-reverse',alignItems:'center',paddingHorizontal:13},searchIcon:{fontSize:21,color:colors.muted},searchInput:{flex:1,fontSize:13,color:colors.text,paddingHorizontal:8},
  tableHeader:{minHeight:42,backgroundColor:colors.canvas,borderRadius:11,flexDirection:'row-reverse',alignItems:'center',paddingHorizontal:12},th:{fontSize:11,color:colors.muted,fontWeight:'800',textAlign:'right',paddingHorizontal:5},tr:{minHeight:64,flexDirection:'row-reverse',alignItems:'center',borderBottomWidth:1,borderBottomColor:colors.line,paddingHorizontal:12},td:{fontSize:11.5,color:colors.text,textAlign:'right',paddingHorizontal:5},tdView:{paddingHorizontal:5},personCell:{flexDirection:'row-reverse',alignItems:'center',gap:9,paddingHorizontal:5},avatar:{width:34,height:34,borderRadius:11,backgroundColor:colors.primarySoft,alignItems:'center',justifyContent:'center'},avatarText:{color:colors.primary,fontWeight:'900'},smallBtn:{height:32,borderRadius:9,borderWidth:1,borderColor:colors.line,alignItems:'center',justifyContent:'center'},smallBtnText:{color:colors.primary,fontSize:11,fontWeight:'800'},editBtn:{height:32,alignItems:'center',justifyContent:'center'},editBtnText:{color:colors.primary,fontWeight:'900',fontSize:11},badge:{alignSelf:'flex-end',borderRadius:20,paddingHorizontal:10,paddingVertical:6},badgeText:{fontSize:10,fontWeight:'900'},
  buildingGrid:{flexDirection:'row-reverse',flexWrap:'wrap',gap:15},buildingCard:{backgroundColor:colors.white,borderRadius:18,padding:18,flexGrow:1,flexBasis:275,maxWidth:430,...shadow},buildingTop:{flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center'},buildingIcon:{width:44,height:44,borderRadius:14,backgroundColor:colors.primarySoft,alignItems:'center',justifyContent:'center'},more:{letterSpacing:2,color:colors.muted,fontWeight:'900'},buildingName:{fontSize:17,fontWeight:'900',color:colors.text,textAlign:'right',marginTop:15},buildingDetails:{flexDirection:'row-reverse',justifyContent:'space-between',marginTop:18},miniLabel:{fontSize:10,color:colors.muted,textAlign:'right'},miniValue:{fontSize:13,fontWeight:'900',color:colors.text,textAlign:'right',marginTop:3},progressTrack:{height:7,backgroundColor:colors.line,borderRadius:5,marginTop:17,overflow:'hidden'},progressFill:{height:'100%',backgroundColor:colors.green,borderRadius:5},buildingFooter:{flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center',marginTop:13},balance:{fontSize:12,fontWeight:'900',color:colors.primary},
  modalShade:{flex:1,backgroundColor:'rgba(4,24,30,.48)',alignItems:'center',justifyContent:'center',padding:18},modalCard:{width:'100%',maxWidth:520,backgroundColor:colors.white,borderRadius:22,padding:22},close:{fontSize:28,color:colors.muted},field:{flex:1,marginBottom:13},fieldLabel:{fontSize:11,color:colors.muted,textAlign:'right',marginBottom:6},fieldInput:{height:44,borderWidth:1,borderColor:colors.line,borderRadius:11,paddingHorizontal:12,color:colors.text,backgroundColor:colors.canvas},fieldRow:{flexDirection:'row-reverse',gap:10},modalActions:{flexDirection:'row',gap:10,marginTop:7},secondaryBtn:{minHeight:44,borderRadius:12,paddingHorizontal:18,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:colors.line},secondaryBtnText:{fontSize:13,fontWeight:'800',color:colors.text},archiveLink:{fontSize:11.5,fontWeight:'800',color:colors.orange,textAlign:'center',marginTop:18},
  expenseRow:{minHeight:72,flexDirection:'row-reverse',alignItems:'center',gap:18,borderBottomWidth:1,borderBottomColor:colors.line},expenseTrack:{width:'34%',height:8,borderRadius:5,backgroundColor:colors.line,overflow:'hidden'},expenseFill:{height:'100%',borderRadius:5,backgroundColor:colors.primary},expenseValue:{minWidth:70,fontSize:12.5,fontWeight:'900',color:colors.text,textAlign:'left'},
  settingRow:{backgroundColor:colors.white,minHeight:78,borderRadius:16,padding:17,marginBottom:12,flexDirection:'row-reverse',alignItems:'center',gap:13,...shadow},settingIcon:{width:40,height:40,borderRadius:12,backgroundColor:colors.primarySoft,alignItems:'center',justifyContent:'center'},switchOn:{width:45,height:25,borderRadius:14,backgroundColor:colors.primary,padding:3,justifyContent:'center'},switchKnob:{width:19,height:19,borderRadius:10,backgroundColor:colors.white,alignSelf:'flex-start'}
});
