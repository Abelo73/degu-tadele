import { useState, useEffect, useRef } from 'react'
import emailjs from '@emailjs/browser'
import {
  Scale, Gavel, FileText, Users, BookOpen, Shield,
  Phone, Mail, MapPin, Award, Menu, X, ArrowRight,
  ChevronLeft, ChevronRight, CheckCircle, Star
} from 'lucide-react'
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

/* ─── Color constants ────────────────────────────────────────────── */
const C = {
  navy: '#0A192F',
  navyMid: '#112240',
  navyLight: '#1D3461',
  gold: '#C9A227',
  goldLight: '#E8C458',
  goldPale: 'rgba(201,162,39,0.10)',
  cream: '#F5F0E8',
  dim: 'rgba(245,240,232,0.55)',
  border: 'rgba(201,162,39,0.20)',
}

const translations = {
  en: {
    nav: { about: 'About', practice: 'Practice Areas', experience: 'Experience', education: 'Education', faq: 'FAQ', book: 'Book Consultation' },
    hero: { badge: 'Counselor at Law · Ethiopia', title: 'Legal Excellence,', subtitle: 'Ethiopian Roots', desc: 'Dedicated legal representation rooted in justice, guided by ethics, and committed to the people of Wolaita and beyond.', book: 'Book Consultation', view: 'View Experience', scroll: 'Scroll', connect: 'Connect with Degu' },
    stats: { handled: 'Cases Handled', exp: 'Years Experience', orgs: 'Organizations', satisfaction: 'Client Satisfaction' },
    about: { label: 'About', title1: 'A Lawyer Built', title2: 'on Purpose', bio1: 'Degu Tadele is a licensed Ethiopian attorney based in Wolaita, SNNPR, with a Bachelor of Laws from Wolaita Sodo University where he graduated with a CGPA of 3.64. His legal career spans public prosecution, private practice, and institutional legal coordination.', bio2: 'Known for his analytical precision and commitment to justice, Degu brings a bilingual advantage in Amharic, Wolaita, and English — enabling him to serve a diverse clientele across SNNPR and beyond.', badge: 'LLB / Qualified Lawyer', strengths: ['Ethical', 'Hardworking', 'Team Player', 'Responsible', 'Analytical', 'Bilingual'] },
    practice: { label: 'Expertise', title1: 'Areas of', title2: 'Practice' },
    career: { label: 'Career', title1: 'Work', title2: 'Experience' },
    academic: { label: 'Academic', title1: 'Education &', title2: 'Qualifications', metrics: ['Cumulative GPA', 'National Exit Exam Average', 'Externship Score'], research: "Research: 'The Legal Environment Governing Forensic Evidence in Ethiopia — Comparative Analysis'" },
    testimonials: { label: 'Client Voices', title1: 'What Clients', title2: 'Say' },
    questions: { label: 'Questions', title1: 'Frequently Asked', title2: 'Questions' },
    booking: { label: 'Engagement', title1: 'Book a', title2: 'Consultation', desc: 'Schedule a private session to discuss your case. I provide clear, ethical, and strategic legal advice tailored to your needs.', form: { name: 'Full Name', email: 'Email Address', phone: 'Phone Number', service: 'Select Legal Matter', message: 'Brief Case Description', submit: 'Send Booking Request', sending: 'Sending...', success: 'Request Sent Successfully!', successSub: 'I will contact you within 24 hours to confirm your appointment.' }, contact: { phone: 'Phone', email: 'Email', office: 'Office', hours: 'Hours' }, infoDesc: 'Reach out directly for urgent matters or visit the SWA Area Office in Wolaita Zone.', location: 'Wolaita Zone, SNNPR', references: 'Legal References', refDesc: 'Licensed to practice in all Ethiopian federal and regional courts.' },
    footer: { copyright: '© 2024 Degu Tadele · LLB · Counselor at Law · Wolaita, Ethiopia' }
  },
  am: {
    nav: { about: 'ስለ እኔ', practice: 'የሥራ መስኮች', experience: 'የሥራ ልምድ', education: 'ትምህርት', faq: 'ጥያቄዎች', book: 'ቀጠሮ ይያዙ' },
    hero: { badge: 'የህግ አማካሪ · ኢትዮጵያ', title: 'የህግ የበላይነት፣', subtitle: 'ሀገር በቀል እውቀት', desc: 'በፍትህ ላይ የተመሰረተ፣ በስነ-ምግባር የሚመራ እና ለወላይታና ለአከባቢው ህዝብ የቆመ የህግ አገልግሎት።', book: 'ቀጠሮ ይያዙ', view: 'ልምድ ይመልከቱ', scroll: 'ዝቅ ይበሉ', connect: 'ከደጉ ጋር ይገናኙ' },
    stats: { handled: 'የተከናወኑ ጉዳዮች', exp: 'የሥራ ልምድ (ዓመት)', orgs: 'ተቋማት', satisfaction: 'የደንበኞች እርካታ' },
    about: { label: 'ስለ እኔ', title1: 'ለፍትህ የቆመ', title2: 'ጠበቃ', bio1: 'ደጉ ታደለ በወላይታ ዞን የሚገኝ ፍቃድ ያለው ጠበቃ ሲሆን ከወላይታ ሶዶ ዩኒቨርሲቲ በህግ (LLB) በ 3.64 ውጤት የተመረቀ ነው። በሙያው በዐቃቤ ህግነት፣ በግል ጠበቃነት እና በተለያዩ ተቋማት የህግ አስተባባሪነት ሰርቷል።', bio2: 'ደጉ በአማርኛ፣ በወላይታ እና በእንግሊዝኛ ቋንቋዎች አገልግሎት የሚሰጥ ሲሆን፤ ለደንበኞቹ ታማኝ እና ትጉህ የህግ ባለሙያ ነው።', badge: 'የህግ ባለሙያ', strengths: ['ታማኝ', 'ትጉህ', 'በቡድን የሚሰራ', 'ሀላፊነት የሚሰማው', 'ተንታኝ', 'ሁለት ቋንቋ ተናጋሪ'] },
    practice: { label: 'ሙያዊ ብቃት', title1: 'የሥራ', title2: 'መስኮች' },
    career: { label: 'ሙያ', title1: 'የሥራ', title2: 'ልምድ' },
    academic: { label: 'ትምህርት', title1: 'ትምህርትና', title2: 'ማስረጃዎች', metrics: ['አጠቃላይ ውጤት', 'የመውጫ ፈተና አማካይ', 'ተግባር ልምምድ ውጤት'], research: "ጥናት: 'በኢትዮጵያ የወንጀል ምርመራ የፎረንሲክ ማስረጃ ህጋዊ ሁኔታ'" },
    testimonials: { label: 'የደንበኞች ምስክርነት', title1: 'ደንበኞች', title2: 'የሚሉት' },
    questions: { label: 'ጥያቄዎች', title1: 'ተደጋጋሚ', title2: 'ጥያቄዎች' },
    booking: { label: 'መገናኛ', title1: 'ቀጠሮ', title2: 'ይያዙ', desc: 'ጉዳይዎን በግል ለመወያየት ቀጠሮ ይያዙ። ለፍላጎትዎ የሚስማማ ግልጽ፣ ስነ-ምግባር ያለው እና ስልታዊ የህግ ምክር እሰጣለሁ።', form: { name: 'ሙሉ ስም', email: 'ኢሜይል', phone: 'ስልክ ቁጥር', service: 'የጉዳዩ አይነት', message: 'ስለ ጉዳዩ አጭር መግለጫ', submit: 'ቀጠሮ ያስይዙ', sending: 'በመላክ ላይ...', success: 'መልእክቱ በተሳካ ሁኔታ ተልኳል!', successSub: 'ቀጠሮዎን ለማረጋገጥ በ 24 ሰዓት ውስጥ አነጋግርዎታለሁ።' }, contactInfo: 'መገኛ አድራሻ', infoDesc: 'ለአስቸኳይ ጉዳዮች በቀጥታ ይደውሉ ወይም በወላይታ ዞን የሚገኘውን ቢሮአችንን ይጎብኙ።', location: 'ወላይታ ዞን፣ ደቡብ ክልል', references: 'ህጋዊ መረጃ', refDesc: 'በሁሉም የፌደራል እና የክልል ፍርድ ቤቶች ለመከራከር ፍቃድ ያለው።' },
    footer: { copyright: '© 2024 Degu Tadele · LLB · Counselor at Law · Wolaita, Ethiopia' },
    practiceAreas: [
      { name: 'Criminal Law', desc: 'Defense and prosecution in criminal matters from bail applications through to trial proceedings in Ethiopian courts.' },
      { name: 'Civil Litigation', desc: 'Resolving civil disputes through negotiation, mediation, and court proceedings with a focus on client outcomes.' },
      { name: 'Contract Drafting', desc: 'Drafting and reviewing commercial contracts, memoranda of understanding, and binding legal agreements.' },
      { name: 'Legal Consultation', desc: 'Strategic legal advice tailored for individuals and businesses navigating the Ethiopian legal landscape.' },
      { name: 'Legal Research', desc: 'Deep analysis of statutes, case law, and forensic evidence supporting litigation and advisory work.' },
      { name: 'Public Prosecution', desc: 'Experienced in state prosecution, representing the public interest in Wolaita Zone courts.' }
    ],
    experiences: [
      { period: 'Current', org: 'Vision Fund MFI – SWA Area Office', role: 'Legal Coordinator', duration: '1 Year', desc: 'Oversee legal compliance, contract review, and regulatory matters for the microfinance institution.' },
      { period: '2023', org: 'Mesfin Tafesse & Associates Law Office', role: 'Junior Associate', duration: '3 Months', desc: 'Assisted senior attorneys with case preparation, research, and client representation.' },
      { period: '2021 – 2023', org: 'Wolaita Zone Tebela City Administration – Public Prosecutor Office', role: 'Public Prosecutor', duration: '1 Year 8 Months', desc: 'Prosecuted criminal cases on behalf of the state at Wolaita Zone courts, from investigation to sentencing.' },
      { period: '2020 – 2021', org: 'Mulugeta Belay & Associates Law Office', role: 'Junior Associate', duration: '5 Months', desc: 'Supported senior partners in civil litigation, contract drafting, and legal consultation services.' }
    ],
    education: [
      { year: '2019', degree: 'LLB — Bachelor of Laws', school: 'Wolaita Sodo University', detail: 'CGPA 3.64 · National Exit Exam Avg. 66 · Externship Score 94' },
      { year: '2006', degree: '12th Grade – High School', school: 'Bele Secondary School', detail: 'Completed secondary education with distinction.' },
      { year: '2002', degree: 'Grade 8 – Elementary', school: 'Hembecho Catholic Church School', detail: 'Primary education completed successfully.' }
    ],
    faqs: [
      { q: 'What types of cases do you handle?', a: 'I handle criminal defense and prosecution, civil litigation, contract drafting and review, legal consultation for individuals and businesses, legal research, and public prosecution matters.' },
      { q: 'How do I book an initial consultation?', a: 'Use the booking form on this page. After submission, I will confirm your appointment within 24 hours via phone or email.' },
      { q: 'Do you serve clients outside Wolaita Zone?', a: 'Yes. I provide legal services across SNNPR and can offer remote advisory services for clients in other regions of Ethiopia.' },
      { q: 'What is your fee structure?', a: 'Fees vary by case type and complexity. The initial consultation helps determine a transparent fee arrangement tailored to your situation.' },
      { q: 'What languages do you work in?', a: 'I work professionally in Amharic, Wolaita, and English — ensuring clear communication for all clients.' }
    ]
  },
  am: {
    nav: { about: 'ስለ እኔ', practice: 'የሥራ መስኮች', experience: 'የሥራ ልምድ', education: 'ትምህርት', faq: 'ጥያቄዎች', book: 'ቀጠሮ ይያዙ' },
    hero: { badge: 'የህግ አማካሪ · ኢትዮጵያ', title: 'የህግ የበላይነት፣', subtitle: 'ሀገር በቀል እውቀት', desc: 'በፍትህ ላይ የተመሰረተ፣ በስነ-ምግባር የሚመራ እና ለወላይታና ለአከባቢው ህዝብ የቆመ የህግ አገልግሎት።', book: 'ቀጠሮ ይያዙ', view: 'ልምድ ይመልከቱ', scroll: 'ዝቅ ይበሉ', connect: 'ከደጉ ጋር ይገናኙ' },
    stats: { handled: 'የተከናወኑ ጉዳዮች', exp: 'የሥራ ልምድ', orgs: 'ተቋማት', satisfaction: 'የደንበኞች እርካታ' },
    about: { label: 'ስለ እኔ', title1: 'ለፍትህ የቆመ', title2: 'ጠበቃ', bio1: 'ደጉ ታደለ በወላይታ ዞን የሚገኝ ፍቃድ ያለው ጠበቃ ሲሆን ከወላይታ ሶዶ ዩኒቨርሲቲ በህግ (LLB) በ 3.64 ውጤት የተመረቀ ነው። በሙያው በዐቃቤ ህግነት፣ በግል ጠበቃነት እና በተለያዩ ተቋማት የህግ አስተባባሪነት ሰርቷል።', bio2: 'ደጉ በአማርኛ፣ በወላይታ እና በእንግሊዝኛ ቋንቋዎች አገልግሎት የሚሰጥ ሲሆን፤ ለደንበኞቹ ታማኝ እና ትጉህ የህግ ባለሙያ ነው።', badge: 'የህግ ባለሙያ', strengths: ['ታማኝ', 'ትጉህ', 'በቡድን የሚሰራ', 'ሀላፊነት የሚሰማው', 'ተንታኝ', 'ሁለት ቋንቋ ተናጋሪ'] },
    practice: { label: 'ሙያዊ ብቃት', title1: 'የሥራ', title2: 'መስኮች' },
    career: { label: 'ሙያ', title1: 'የሥራ', title2: 'ልምድ' },
    academic: { label: 'ትምህርት', title1: 'ትምህርትና', title2: 'ማስረጃዎች', metrics: ['አጠቃላይ ውጤት', 'የመውጫ ፈተና አማካይ', 'ተግባር ልምምድ ውጤት'], research: "ጥናት: 'በኢትዮጵያ የወንጀል ምርመራ የፎረንሲክ ማስረጃ ህጋዊ ሁኔታ'" },
    testimonials: { label: 'የደንበኞች ምስክርነት', title1: 'ደንበኞች', title2: 'የሚሉት' },
    questions: { label: 'ጥያቄዎች', title1: 'ተደጋጋሚ', title2: 'ጥያቄዎች' },
    booking: { label: 'መገናኛ', title1: 'ቀጠሮ', title2: 'ይያዙ', desc: 'ጉዳይዎን በግል ለመወያየት ቀጠሮ ይያዙ። ለፍላጎትዎ የሚስማማ ግልጽ፣ ስነ-ምግባር ያለው እና ስልታዊ የህግ ምክር እሰጣለሁ።', form: { name: 'ሙሉ ስም', email: 'ኢሜይል', phone: 'ስልክ ቁጥር', service: 'የጉዳዩ አይነት', message: 'ስለ ጉዳዩ አጭር መግለጫ', submit: 'ቀጠሮ ያስይዙ', sending: 'በመላክ ላይ...', success: 'መልእክቱ በተሳካ ሁኔታ ተልኳል!', successSub: 'ቀጠሮዎን ለማረጋገጥ በ 24 ሰዓት ውስጥ አነጋግርዎታለሁ።' }, contact: { phone: 'ስልክ', email: 'ኢሜይል', office: 'ቢሮ', hours: 'የሥራ ሰዓት' }, infoDesc: 'ለአስቸኳይ ጉዳዮች በቀጥታ ይደውሉ ወይም በወላይታ ዞን የሚገኘውን ቢሮአችንን ይጎብኙ።', location: 'ወላይታ ዞን፣ ደቡብ ክልል', references: 'ህጋዊ መረጃ', refDesc: 'በሁሉም የፌደራል እና የክልል ፍርድ ቤቶች ለመከራከር ፍቃድ ያለው።' },
    footer: { copyright: '© 2024 ደጉ ታደለ · የህግ ባለሙያና አማካሪ · ወላይታ፣ ኢትዮጵያ' },
    practiceAreas: [
      { name: 'የወንጀል ህግ', desc: 'በኢትዮጵያ ፍርድ ቤቶች ከዋስትና ጥያቄ ጀምሮ እስከ ዋናው ክርክር ድረስ በወንጀል ጉዳዮች ላይ መከላከልና መከራከር።' },
      { name: 'የፍትሐ ብሔር ክርክር', desc: 'የፍትሐ ብሔር አለመግባባቶችን በድርድር፣ በሽምግልና እና በፍርድ ቤት ክርክር በደንበኞች ውጤት ላይ ትኩረት በማድረግ መፍታት።' },
      { name: 'ውል ማዘጋጀት', desc: 'የንግድ ውሎችን፣ የመግባቢያ ሰነዶችን እና ህጋዊ አስገዳጅ ስምምነቶችን ማዘጋጀት እና መመርመር።' },
      { name: 'የህግ ምክር', desc: 'የኢትዮጵያን የህግ ሁኔታ ለሚረዱ ግለሰቦች እና ንግዶች የተዘጋጀ ስልታዊ የህግ ምክር።' },
      { name: 'የህግ ምርምር', desc: 'ለክርክር እና ለምክር ስራ የሚረዱ ህጎችን፣ የፍርድ ቤት ውሳኔዎችን እና የፎረንሲክ ማስረጃዎችን በጥልቀት መተንተን።' },
      { name: 'ዐቃቤ ህግ', desc: 'በወላይታ ዞን ፍርድ ቤቶች የህዝብን ጥቅም በመወከል በዐቃቤ ህግነት የመስራት ልምድ።' }
    ],
    experiences: [
      { period: 'አሁን', org: 'ቪዥን ፈንድ – የSWA አካባቢ ቢሮ', role: 'የህግ አስተባባሪ', duration: '1 ዓመት', desc: 'የተቋሙን የህግ ተገዢነት፣ የውል ክለሳ እና የቁጥጥር ጉዳዮችን መከታተል ።' },
      { period: '2015 ዓ.ም', org: 'መስፍን ታፈሰ እና ተባባሪዎች የህግ ቢሮ', role: 'ረዳት ጠበቃ', duration: '3 ወር', desc: 'ጉዳዮችን በማዘጋጀት፣ ምርምር በማድረግ እና ደንበኞችን በመወከል ከፍተኛ ጠበቃዎችን መርዳት።' },
      { period: '2013 – 2015 ዓ.ም', org: 'የወላይታ ዞን ጠበላ ከተማ አስተዳደር – የዐቃቤ ህግ ቢሮ', role: 'ዐቃቤ ህግ', duration: '1 ዓመት ከ 8 ወር', desc: 'በወላይታ ዞን ፍርድ ቤቶች በመንግስት ስም የወንጀል ጉዳዮችን ከመመርመር ጀምሮ እስከ ፍርድ ድረስ መከራከር።' },
      { period: '2012 – 2013 ዓ.ም', org: 'ሙሉጌታ በላይ እና ተባባሪዎች የህግ ቢሮ', role: 'ረዳት ጠበቃ', duration: '5 ወር', desc: 'በፍትሐ ብሔር ክርክር፣ በውል ዝግጅት እና በህግ ምክር አገልግሎት ውስጥ ከፍተኛ አጋሮችን መርዳት።' }
    ],
    education: [
      { year: '2011 ዓ.ም', degree: 'LLB — የህግ ባችለር ድግሪ', school: 'ወላይታ ሶዶ ዩኒቨርሲቲ', detail: 'አጠቃላይ ውጤት 3.64 · የመውጫ ፈተና አማካይ 66 · የተግባር ልምምድ ውጤት 94' },
      { year: '2006 ዓ.ም', degree: '12ኛ ክፍል', school: 'በሌ ሁለተኛ ደረጃ ትምህርት ቤት', detail: 'ሁለተኛ ደረጃ ትምህርትን በከፍተኛ ውጤት ያጠናቀቀ።' },
      { year: '1998 ዓ.ም', degree: '8ኛ ክፍል', school: 'ሀንበቾ የካቶሊክ ቤተክርስቲያን ትምህርት ቤት', detail: 'የመጀመሪያ ደረጃ ትምህርትን በተሳካ ሁኔታ ያጠናቀቀ።' }
    ],
    faqs: [
      { q: 'ምን አይነት ጉዳዮችን ይይዛሉ?', a: 'የወንጀል መከላከል እና ክስ፣ የፍትሐ ብሔር ክርክር፣ የውል ዝግጅት እና ክለሳ፣ ለግለሰቦች እና ለንግድ ድርጅቶች የህግ ምክር፣ የህግ ምርምር እና የዐቃቤ ህግ ጉዳዮችን እይዛለሁ።' },
      { q: 'የመጀመሪያውን ቀጠሮ እንዴት መያዝ እችላለሁ?', a: 'በዚህ ድረ-ገጽ ላይ ያለውን የቀጠሮ ማስያዣ ቅጽ ይጠቀሙ። ካስገቡ በኋላ በ24 ሰዓት ውስጥ በስልክ ወይም በኢሜይል ቀጠሮውን አረጋግጣለሁ።' },
      { q: 'ከወላይታ ዞን ውጭ ያሉ ደንበኞችን ያገለግላሉ?', a: 'አዎ። በደቡብ ክልል በሙሉ የህግ አገልግሎት የምሰጥ ሲሆን፤ ለሌሎች የኢትዮጵያ አካባቢዎች ደግሞ የርቀት የህግ ምክር አገልግሎት እሰጣለሁ።' },
      { q: 'የአገልግሎት ክፍያዎ እንዴት ነው?', a: 'ክፍያ እንደ ጉዳዩ አይነት እና ውስብስብነት ይለያያል። የመጀመሪያው ቀጠሮ ለጉዳይዎ የሚስማማ ግልጽ የክፍያ ስምምነት ለመወሰን ይረዳል።' },
      { q: 'በምን ቋንቋዎች አገልግሎት ይሰጣሉ?', a: 'በአማርኛ፣ በወላይታ እና በእንግሊዝኛ ቋንቋዎች በሙያዊ ብቃት እሰራለሁ።' }
    ]
  }
}

/* ─── Data ───────────────────────────────────────────────────────── */
const practiceAreas = [
  {
    icon: <Gavel size={26} />, name: 'Criminal Law',
    desc: 'Defense and prosecution in criminal matters from bail applications through to trial proceedings in Ethiopian courts.'
  },
  {
    icon: <Scale size={26} />, name: 'Civil Litigation',
    desc: 'Resolving civil disputes through negotiation, mediation, and court proceedings with a focus on client outcomes.'
  },
  {
    icon: <FileText size={26} />, name: 'Contract Drafting',
    desc: 'Drafting and reviewing commercial contracts, memoranda of understanding, and binding legal agreements.'
  },
  {
    icon: <Users size={26} />, name: 'Legal Consultation',
    desc: 'Strategic legal advice tailored for individuals and businesses navigating the Ethiopian legal landscape.'
  },
  {
    icon: <BookOpen size={26} />, name: 'Legal Research',
    desc: 'Deep analysis of statutes, case law, and forensic evidence supporting litigation and advisory work.'
  },
  {
    icon: <Shield size={26} />, name: 'Public Prosecution',
    desc: 'Experienced in state prosecution, representing the public interest in Wolaita Zone courts.'
  },
]

const experiences = [
  {
    period: 'Current', org: 'Vision Fund MFI – SWA Area Office',
    role: 'Legal Coordinator', duration: '1 Year', desc: 'Oversee legal compliance, contract review, and regulatory matters for the microfinance institution.'
  },
  {
    period: '2023', org: 'Mesfin Tafesse & Associates Law Office',
    role: 'Junior Associate', duration: '3 Months', desc: 'Assisted senior attorneys with case preparation, research, and client representation.'
  },
  {
    period: '2021 – 2023', org: 'Wolaita Zone Tebela City Administration – Public Prosecutor Office',
    role: 'Public Prosecutor', duration: '1 Year 8 Months', desc: 'Prosecuted criminal cases on behalf of the state at Wolaita Zone courts, from investigation to sentencing.'
  },
  {
    period: '2020 – 2021', org: 'Mulugeta Belay & Associates Law Office',
    role: 'Junior Associate', duration: '5 Months', desc: 'Supported senior partners in civil litigation, contract drafting, and legal consultation services.'
  },
]

const education = [
  {
    year: '2019', degree: 'LLB — Bachelor of Laws',
    school: 'Wolaita Sodo University',
    detail: 'CGPA 3.64 · National Exit Exam Avg. 66 · Externship Score 94'
  },
  {
    year: '2006', degree: '12th Grade – High School',
    school: 'Bele Secondary School',
    detail: 'Completed secondary education with distinction.'
  },
  {
    year: '2002', degree: 'Grade 8 – Elementary',
    school: 'Hembecho Catholic Church School',
    detail: 'Primary education completed successfully.'
  },
]

const testimonials = [
  {
    text: 'Degu handled my land dispute case with exceptional professionalism and transparency. I felt informed at every stage and the outcome exceeded my expectations.',
    name: 'Abebe Wolde', role: 'Business Owner, Wolaita Sodo'
  },
  {
    text: 'His knowledge of Ethiopian criminal law and dedication to my defense was remarkable. I highly recommend Degu Tadele for anyone facing serious legal challenges.',
    name: 'Tigist Bekele', role: 'Private Client'
  },
  {
    text: 'The contract that Degu drafted for our partnership was thorough and well-explained. He made a complex legal process straightforward and stress-free.',
    name: 'Menelik Assefa', role: 'Entrepreneur, SNNPR'
  },
  {
    text: 'Degu provided clear and practical legal advice for our organization. His ethical standards and analytical mindset are second to none in the region.',
    name: 'Yohannes Tadesse', role: 'NGO Director'
  },
]

const faqs = [
  {
    q: 'What types of cases do you handle?',
    a: 'I handle criminal defense and prosecution, civil litigation, contract drafting and review, legal consultation for individuals and businesses, legal research, and public prosecution matters.'
  },
  {
    q: 'How do I book an initial consultation?',
    a: 'Use the booking form on this page. After submission, I will confirm your appointment within 24 hours via phone or email.'
  },
  {
    q: 'Do you serve clients outside Wolaita Zone?',
    a: 'Yes. I provide legal services across SNNPR and can offer remote advisory services for clients in other regions of Ethiopia.'
  },
  {
    q: 'What is your fee structure?',
    a: 'Fees vary by case type and complexity. The initial consultation helps determine a transparent fee arrangement tailored to your situation.'
  },
  {
    q: 'What languages do you work in?',
    a: 'I work professionally in Amharic, Wolaita, and English — ensuring clear communication for all clients.'
  },
]

const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM']

/* ─── Helper components ──────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
      <span style={{ display: 'block', width: 40, height: 2, background: C.gold, borderRadius: 2 }} />
      <span style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.75rem',
        fontWeight: 500,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: C.gold,
      }}>{children}</span>
    </div>
  )
}

/* ─── Social Media Icons (Custom SVGs for consistent branding) ────── */
const SocialIcons = {
  Facebook: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
  ),
  Telegram: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
  ),
  Instagram: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
  ),
  WhatsApp: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.6 8.38 8.38 0 0 1 3.8.9L21 3z" /></svg>
  ),
  TikTok: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
  )
}

function SocialLinks({ className = "", size = 20 }) {
  const socials = [
    { icon: <SocialIcons.Facebook size={size} />, href: "https://web.facebook.com/degu.tadele", label: "Facebook" },
    { icon: <SocialIcons.Telegram size={size} />, href: "https://t.me/degulaw21", label: "Telegram" },
    { icon: <SocialIcons.Instagram size={size} />, href: "https://instagram.com", label: "Instagram" },
    { icon: <SocialIcons.WhatsApp size={size} />, href: "https://wa.me/251926601379", label: "WhatsApp" },
    { icon: <SocialIcons.TikTok size={size} />, href: "https://tiktok.com", label: "TikTok" },
  ]

  return (
    <div className={className} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
      {socials.map((s, i) => (
        <a key={i} href={s.href} className="social-icon" aria-label={s.label} target="_blank" rel="noopener noreferrer">
          {s.icon}
        </a>
      ))}
    </div>
  )
}

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        let start = 0
        const duration = 1500
        const step = Math.ceil(target / (duration / 16))
        const timer = setInterval(() => {
          start += step
          if (start >= target) { setCount(target); clearInterval(timer) }
          else setCount(start)
        }, 16)
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])
  return <span ref={ref}>{count}{suffix}</span>
}

function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.1 })
    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function DeguTadeleLaw() {
  const [lang, setLang] = useState('en')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSlot, setActiveSlot] = useState(null)
  const [testiIdx, setTestiIdx] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' })

  const t = translations[lang]

  useReveal()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setForm({ name: '', email: '', phone: '', service: '', message: '' })
        setActiveSlot(null)
      }, 5000)
    } catch (error) {
      console.error("Email failed:", error)
      alert("Failed to send request. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const navLinks = [
    { label: t.nav.about, href: '#about' },
    { label: t.nav.practice, href: '#practice-areas' },
    { label: t.nav.experience, href: '#experience' },
    { label: t.nav.education, href: '#education' },
    { label: t.nav.faq, href: '#faq' },
  ]

  const pAreas = t.practiceAreas || practiceAreas
  const exps = t.experiences || experiences
  const eds = t.education || education
  const fqs = t.faqs || faqs

  const academicMetrics = [
    { value: '3.64', label: t.academic.metrics[0] },
    { value: '66', label: t.academic.metrics[1] },
    { value: '94', label: t.academic.metrics[2] },
  ]

  const s = {
    nav: {
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(10,25,47,0.85)',
      backdropFilter: 'blur(18px)',
      borderBottom: `1px solid ${C.border}`,
      padding: '0 2.5rem',
      height: 68,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    },
    logo: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 700,
      fontSize: '1.2rem',
      textDecoration: 'none',
      display: 'flex', gap: 6,
    },
    navLink: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: '0.78rem',
      fontWeight: 400,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: C.dim,
      textDecoration: 'none',
      transition: 'color 0.2s',
      padding: '4px 0',
      borderBottom: '1px solid transparent',
    },
    bookBtn: {
      fontFamily: "'DM Sans', sans-serif",
      fontSize: '0.78rem',
      fontWeight: 500,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      padding: '8px 20px',
      border: `1px solid ${C.gold}`,
      color: C.gold,
      background: 'transparent',
      borderRadius: 4,
      cursor: 'pointer',
      transition: 'background 0.3s, color 0.3s',
    },
    section: (bg) => ({
      background: bg || C.navy,
      padding: '6rem 2.5rem',
    }),
    sectionInner: {
      maxWidth: 1100,
      margin: '0 auto',
    },
    h2: {
      fontFamily: "'Playfair Display', serif",
      fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
      fontWeight: 700,
      color: C.cream,
      marginBottom: '1rem',
      lineHeight: 1.25,
    },
  }

  return (
    <div style={{ minHeight: '100vh', background: C.navy }}>

      {/* ─── NAV ─── */}
      <nav style={s.nav}>
        <a href="#home" style={s.logo}>
          <span style={{ color: C.gold }}>Degu</span>
          <span style={{ color: C.cream, fontWeight: 300 }}> Tadele</span>
        </a>

        {/* Desktop Nav */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {navLinks.map(l => (
            <a key={l.href} href={l.href} style={s.navLink}
              onMouseEnter={e => { e.target.style.color = C.gold }}
              onMouseLeave={e => { e.target.style.color = C.dim }}>
              {l.label}
            </a>
          ))}

          {/* Language Toggle */}
          <div style={{ display: 'flex', gap: 8, borderLeft: `1px solid ${C.border}`, paddingLeft: '1.5rem', marginRight: '1rem' }}>
            <button
              onClick={() => setLang('en')}
              style={{ background: 'none', border: 'none', color: lang === 'en' ? C.gold : C.dim, fontSize: '0.75rem', fontWeight: lang === 'en' ? 700 : 400, cursor: 'pointer' }}>
              EN
            </button>
            <span style={{ color: C.border, fontSize: '0.75rem' }}>/</span>
            <button
              onClick={() => setLang('am')}
              style={{ background: 'none', border: 'none', color: lang === 'am' ? C.gold : C.dim, fontSize: '0.75rem', fontWeight: lang === 'am' ? 700 : 400, cursor: 'pointer' }}>
              አማ
            </button>
          </div>

          <button style={s.bookBtn}
            onMouseEnter={e => { e.target.style.background = C.gold; e.target.style.color = C.navy }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = C.gold }}
            onClick={() => document.querySelector('#booking').scrollIntoView({ behavior: 'smooth' })}>
            {t.nav.book}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" style={{ display: 'none', background: 'none', border: 'none', color: C.gold, cursor: 'pointer', padding: 4 }}
          onClick={() => setMobileOpen(o => !o)}>
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: 'rgba(10,25,47,0.97)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2.5rem',
        }}>
          {navLinks.map(l => (
            <a key={l.href} href={l.href}
              style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: C.cream, textDecoration: 'none' }}
              onClick={() => setMobileOpen(false)}>
              {l.label}
            </a>
          ))}
          <div style={{ display: 'flex', gap: 16 }}>
            <button onClick={() => setLang('en')} style={{ color: lang === 'en' ? C.gold : C.dim, background: 'none', border: 'none', fontSize: '1.2rem', fontWeight: 700 }}>EN</button>
            <button onClick={() => setLang('am')} style={{ color: lang === 'am' ? C.gold : C.dim, background: 'none', border: 'none', fontSize: '1.2rem', fontWeight: 700 }}>አማርኛ</button>
          </div>
          <a href="#booking"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: C.gold, textDecoration: 'none' }}
            onClick={() => setMobileOpen(false)}>
            {t.nav.book}
          </a>
        </div>
      )}

      {/* ─── HERO ─── */}
      <section id="home" className="hero-grid-bg" style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center',
        padding: '0 2.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', gap: '4rem', paddingTop: 80 }}>
          {/* Text content */}
          <div style={{ flex: 1 }}>
            {/* Badge */}
            <div className="animate-fadeUp delay-100" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
              border: `1px solid ${C.border}`, borderRadius: 4,
              padding: '6px 14px', marginBottom: '2rem',
            }}>
              <span style={{ display: 'block', width: 20, height: 1, background: C.gold }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold }}>
                {t.hero.badge}
              </span>
            </div>

            {/* H1 */}
            <h1 className="animate-text-reveal delay-200" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              color: C.cream,
              marginBottom: '1.25rem',
            }}>
              {t.hero.title}<br />
              <em style={{ color: C.gold, fontStyle: 'italic' }}>{t.hero.subtitle}</em>
            </h1>

            {/* Sub */}
            <p className="animate-fadeUp delay-300" style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.15rem', fontWeight: 300,
              color: C.dim, maxWidth: 520, lineHeight: 1.7,
              marginBottom: '2rem',
            }}>
              {t.hero.desc}
            </p>

            {/* Divider */}
            <div className="animate-fadeUp delay-400" style={{ width: 60, height: 2, background: C.gold, marginBottom: '2.5rem', borderRadius: 2 }} />

            {/* CTAs */}
            <div className="animate-fadeUp delay-500" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="#booking" className="glow-hover" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: C.gold, color: C.navy,
                fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                padding: '14px 28px', borderRadius: 4, textDecoration: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = C.goldLight; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.transform = 'translateY(0)' }}>
                {t.hero.book} <ArrowRight size={16} />
              </a>
              <a href="#experience" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                border: `1px solid ${C.gold}`, color: C.gold,
                background: 'transparent',
                fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
                fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                padding: '14px 28px', borderRadius: 4, textDecoration: 'none',
                transition: 'background 0.3s, color 0.3s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = C.goldPale }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                {t.hero.view} <ArrowRight size={16} />
              </a>
            </div>

            {/* Social Links Hero */}
            <div className="animate-fadeUp delay-600" style={{ marginTop: '3rem' }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', color: C.dim, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>{t.hero.connect}</div>
              <SocialLinks />
            </div>
          </div>

          {/* Decorative Ring */}
          <div className="hero-deco-ring animate-fadeIn delay-400 animate-floating" style={{
            flexShrink: 0, width: 300, height: 300,
            position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Outer ring */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: `1px solid ${C.border}`,
            }} />
            {/* Dashed spinning ring */}
            <div className="animate-spin-slow" style={{
              position: 'absolute', inset: 20, borderRadius: '50%',
              border: `1px dashed rgba(201,162,39,0.35)`,
            }} />
            {/* Center content */}
            <div style={{
              background: C.navyLight, borderRadius: '50%',
              width: 200, height: 200,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${C.border}`,
            }}>
              <Scale size={32} color={C.gold} />
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.9rem', fontWeight: 700, color: C.cream, marginTop: 8,
              }}>3+</div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.7rem', color: C.dim, letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>{t.stats.exp}</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        }}>
          <div style={{
            width: 1, height: 60, background: `linear-gradient(to bottom, ${C.gold}, transparent)`,
            animation: 'scrollLine 2.5s ease-in-out infinite',
          }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.dim }}>{t.hero.scroll}</span>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <div style={{ background: C.navyMid, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div className="stats-grid" style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          padding: '0',
        }}>
          {[
            { value: 50, suffix: '+', label: t.stats.handled },
            { value: 3, suffix: '+', label: t.stats.exp },
            { value: 4, suffix: '', label: t.stats.orgs },
            { value: 95, suffix: '%', label: t.stats.satisfaction },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '2.5rem 1.5rem', textAlign: 'center',
              borderRight: i < 3 ? `1px solid ${C.border}` : 'none',
              transition: 'background 0.3s',
              cursor: 'default',
            }}
              onMouseEnter={e => e.currentTarget.style.background = C.goldPale}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2rem, 3vw, 2.8rem)',
                fontWeight: 700, color: C.gold, lineHeight: 1,
              }}>
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                color: C.dim, marginTop: 6,
              }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── ABOUT ─── */}
      <section id="about" style={s.section(C.navy)}>
        <div className="about-grid" style={{
          ...s.sectionInner,
          display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '4rem', alignItems: 'start',
        }}>
          {/* Photo frame */}
          <div className="reveal-left" style={{ position: 'relative' }}>
            <div style={{
              width: '100%', aspectRatio: '3/4',
              background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyLight} 100%)`,
              border: `1px solid ${C.border}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              color: C.dim, gap: 12, position: 'relative', overflow: 'hidden',
            }}>
              {/* Decorative frame inset */}
              <div style={{
                position: 'absolute', inset: 12,
                border: `1px solid ${C.border}`,
                borderRadius: 2, pointerEvents: 'none',
              }} />
              <Scale size={48} color={C.gold} />
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', color: C.dim }}>Degu Tadele</span>
            </div>
            {/* Gold badge */}
            <div style={{
              position: 'absolute', bottom: -16, right: -16,
              background: C.gold, color: C.navy,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
              fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '10px 16px', borderRadius: 2,
            }}>{t.about.badge}</div>
          </div>

          {/* Biography */}
          <div className="reveal-right">
            <SectionLabel>{t.about.label}</SectionLabel>
            <h2 style={s.h2}>{t.about.title1}<br /><em style={{ color: C.gold }}>{t.about.title2}</em></h2>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.08rem', fontWeight: 300, color: C.dim,
              lineHeight: 1.85, marginBottom: '1.25rem',
            }}>
              {t.about.bio1}
            </p>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.08rem', fontWeight: 300, color: C.dim,
              lineHeight: 1.85, marginBottom: '2rem',
            }}>
              {t.about.bio2}
            </p>

            {/* Contact grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { icon: <Phone size={16} />, text: '0926 601 379' },
                { icon: <Mail size={16} />, text: 'chuloyemeaza27@gmail.com' },
                { icon: <MapPin size={16} />, text: 'Wolaita Zone, SNNPR' },
                { icon: <Award size={16} />, text: 'LLB · Wolaita Sodo University' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ color: C.gold, marginTop: 2, flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: C.dim }}>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Strengths */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {t.about.strengths.map(tag => (
                <span key={tag} style={{
                  border: `1px solid ${C.border}`,
                  color: C.gold, background: C.goldPale,
                  borderRadius: 4,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.72rem', fontWeight: 500,
                  letterSpacing: '0.08em',
                  padding: '5px 14px',
                }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRACTICE AREAS ─── */}
      <section id="practice-areas" style={s.section(C.navyMid)}>
        <div style={s.sectionInner}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <SectionLabel>{t.practice.label}</SectionLabel>
            <h2 style={s.h2}>{t.practice.title1} <em style={{ color: C.gold }}>{t.practice.title2}</em></h2>
          </div>
          <div className="practice-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {pAreas.map((area, i) => (
              <div key={i} className="practice-card reveal" style={{
                background: '#0c1f3a',
                border: `1px solid ${C.border}`,
                borderRadius: 6, padding: '2rem 1.75rem',
              }}>
                <span style={{ color: C.gold, display: 'block', marginBottom: '1rem' }}>{/* Fallback icon if not in translation */}
                  {practiceAreas[i]?.icon || <Gavel size={26} />}
                </span>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.15rem', fontWeight: 700, color: C.cream,
                  marginBottom: '0.75rem',
                }}>{area.name}</h3>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1rem', color: C.dim, lineHeight: 1.75,
                }}>{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EXPERIENCE ─── */}
      <section id="experience" style={s.section(C.navy)}>
        <div style={s.sectionInner}>
          <div style={{ marginBottom: '3.5rem' }}>
            <SectionLabel>{t.career.label}</SectionLabel>
            <h2 style={s.h2}>{t.career.title1} <em style={{ color: C.gold }}>{t.career.title2}</em></h2>
          </div>
          <div style={{ position: 'relative', paddingLeft: 56 }}>
            <div className="timeline-line" />
            {exps.map((exp, i) => (
              <div key={i} className="reveal" style={{
                position: 'relative', marginBottom: i < exps.length - 1 ? '2.5rem' : 0,
                paddingBottom: i < exps.length - 1 ? '2.5rem' : 0,
                borderBottom: i < exps.length - 1 ? `1px solid ${C.border}` : 'none',
              }}>
                {/* Timeline dot */}
                <div style={{
                  position: 'absolute', left: -44, top: 4,
                  width: 16, height: 16, borderRadius: '50%',
                  border: `2px solid ${C.gold}`, background: C.navy,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.gold }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div>
                    <div style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem',
                      color: C.gold, letterSpacing: '0.12em', textTransform: 'uppercase',
                      marginBottom: 4,
                    }}>{exp.period}</div>
                    <h3 style={{
                      fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 700,
                      color: C.cream, marginBottom: 2,
                    }}>{exp.role}</h3>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', color: C.dim }}>{exp.org}</div>
                  </div>
                  <span style={{
                    border: `1px solid ${C.border}`, borderRadius: 4,
                    fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem',
                    color: C.gold, padding: '4px 12px', flexShrink: 0,
                  }}>{exp.duration}</span>
                </div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: C.dim, lineHeight: 1.7 }}>{exp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EDUCATION ─── */}
      <section id="education" style={s.section(C.navyMid)}>
        <div style={s.sectionInner}>
          <div style={{ marginBottom: '3.5rem' }}>
            <SectionLabel>{t.academic.label}</SectionLabel>
            <h2 style={s.h2}>{t.academic.title1} <em style={{ color: C.gold }}>{t.academic.title2}</em></h2>
          </div>
          <div className="education-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {eds.map((ed, i) => (
              <Card key={i} className="reveal" style={{
                background: '#0c1f3a', border: `1px solid ${C.border}`,
                borderRadius: 6, transition: 'transform 0.3s',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <CardContent style={{ padding: '1.75rem' }}>
                  <div style={{
                    fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 700,
                    color: C.goldPale.replace('0.10', '0.18'), lineHeight: 1,
                    position: 'absolute', top: '1rem', right: '1.5rem',
                    color: 'rgba(201,162,39,0.18)',
                  }}>{ed.year}</div>
                  <span style={{
                    display: 'inline-block', background: C.goldPale,
                    border: `1px solid ${C.border}`, color: C.gold,
                    fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', letterSpacing: '0.1em',
                    textTransform: 'uppercase', padding: '4px 10px', borderRadius: 3, marginBottom: '1rem',
                  }}>{ed.year}</span>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.05rem', fontWeight: 700, color: C.cream, marginBottom: '0.5rem' }}>
                    {ed.degree}
                  </h3>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: C.dim, marginBottom: '0.5rem' }}>{ed.school}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.9rem', color: C.gold, fontStyle: 'italic' }}>{ed.detail}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div style={{ background: C.navy, border: `1px solid ${C.border}`, borderRadius: 6, padding: '2.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '1.5rem' }}>
              {academicMetrics.map((m, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 700, color: C.gold }}>{m.value}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: C.dim, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{m.label}</div>
                </div>
              ))}
            </div>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '0.98rem', color: C.dim, lineHeight: 1.75, textAlign: 'center',
              borderTop: `1px solid ${C.border}`, paddingTop: '1.25rem',
              fontStyle: 'italic',
            }}>
              {t.academic.research}
            </p>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="testimonials" style={s.section(C.navy)}>
        <div style={s.sectionInner}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <SectionLabel>{t.testimonials.label}</SectionLabel>
              <h2 style={s.h2}>{t.testimonials.title1} <em style={{ color: C.gold }}>{t.testimonials.title2}</em></h2>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[{ icon: <ChevronLeft size={18} />, action: () => setTestiIdx(i => Math.max(0, i - 1)) },
              { icon: <ChevronRight size={18} />, action: () => setTestiIdx(i => Math.min(testimonials.length - 2, i + 1)) }].map((btn, i) => (
                <button key={i} onClick={btn.action} style={{
                  width: 44, height: 44, borderRadius: '50%',
                  border: `1px solid ${C.border}`, background: 'transparent',
                  color: C.gold, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.background = C.goldPale }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = 'transparent' }}>
                  {btn.icon}
                </button>
              ))}
            </div>
          </div>

          <div style={{ overflow: 'hidden' }}>
            <div style={{
              display: 'flex', gap: '1.5rem',
              transform: `translateX(calc(-${testiIdx * 51}%))`,
              transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
            }}>
              {testimonials.map((t, i) => (
                <div key={i} style={{
                  minWidth: 'calc(50% - 0.75rem)',
                  background: C.navyMid, border: `1px solid ${C.border}`,
                  borderRadius: 6, padding: '2.25rem 2rem',
                  position: 'relative', flexShrink: 0,
                  transition: 'transform 0.3s',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{
                    position: 'absolute', top: 16, right: 20,
                    fontFamily: "'Playfair Display', serif", fontSize: '6rem',
                    color: C.gold, opacity: 0.1, lineHeight: 1, userSelect: 'none',
                  }}>"</div>
                  {/* Stars */}
                  <div style={{ display: 'flex', gap: 3, marginBottom: '1.25rem' }}>
                    {[...Array(5)].map((_, si) => (
                      <Star key={si} size={14} fill={C.gold} color={C.gold} />
                    ))}
                  </div>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.08rem', color: C.dim, lineHeight: 1.8,
                    fontStyle: 'italic', marginBottom: '1.5rem',
                  }}>"{t.text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: C.navyLight, border: `1px solid ${C.gold}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'Playfair Display', serif", fontWeight: 700, color: C.gold, fontSize: '1rem',
                    }}>{t.name[0]}</div>
                    <div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: '0.9rem', color: C.cream }}>{t.name}</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: C.dim }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" style={s.section(C.navyMid)}>
        <div style={{ ...s.sectionInner, maxWidth: 750 }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <SectionLabel>{t.questions.label}</SectionLabel>
            <h2 style={s.h2}>{t.questions.title1} <em style={{ color: C.gold }}>{t.questions.title2}</em></h2>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} style={{
                border: `1px solid ${C.border}`, borderRadius: 6,
                background: '#0c1f3a', overflow: 'hidden',
                marginBottom: 12,
              }}>
                <AccordionTrigger style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1rem', fontWeight: 600,
                  color: C.cream, padding: '1.25rem 1.5rem',
                  textAlign: 'left',
                }}>
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1rem', color: C.dim, lineHeight: 1.8,
                  padding: '0 1.5rem 1.25rem',
                }}>
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ─── BOOKING & CONTACT ─── */}
      <section id="booking" style={s.section(C.navy)}>
        <div style={s.sectionInner}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'start' }}>
            {/* Contact info */}
            <div className="reveal-left">
              <SectionLabel>{t.booking.label}</SectionLabel>
              <h2 style={s.h2}>{t.booking.title1} <em style={{ color: C.gold }}>{t.booking.title2}</em></h2>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.1rem', color: C.dim, lineHeight: 1.8, marginBottom: '2.5rem',
              }}>
                {t.booking.desc}
              </p>
              {[
                { icon: <Phone size={18} />, title: t.booking.contact.phone, lines: ['0926 601 379', '0969 824 533'] },
                { icon: <Mail size={18} />, title: t.booking.contact.email, lines: ['chuloyemeaza27@gmail.com'] },
                { icon: <MapPin size={18} />, title: t.booking.contact.office, lines: ['Wolaita Zone, SNNPR, Ethiopia'] },
                { icon: <Award size={18} />, title: t.booking.contact.hours, lines: ['Monday – Saturday', '9:00 AM – 5:00 PM'] },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '1rem',
                  marginBottom: '1.75rem', paddingBottom: '1.75rem',
                  borderBottom: i < 3 ? `1px solid ${C.border}` : 'none',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 6,
                    background: C.goldPale, border: `1px solid ${C.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: C.gold, flexShrink: 0,
                  }}>{item.icon}</div>
                  <div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.gold, marginBottom: 4 }}>{item.title}</div>
                    {item.lines.map((l, li) => (
                      <div key={li} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', color: C.dim, lineHeight: 1.6 }}>{l}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Booking form */}
            <div className="reveal-right" style={{
              background: C.navyMid, border: `1px solid ${C.border}`,
              borderRadius: 8, padding: '2.5rem',
            }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                  <div style={{ width: 64, height: 64, background: C.goldPale, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: `1px solid ${C.gold}` }}>
                    <CheckCircle size={32} color={C.gold} />
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: C.cream, marginBottom: '0.5rem' }}>{t.booking.form.success}</h3>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.05rem', color: C.dim }}>{t.booking.form.successSub}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gap: 6 }}>
                      <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: C.gold, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t.booking.form.name}</label>
                      <Input placeholder="Abebe Bikila" required value={form.name} onChange={handleChange('name')}
                        style={{ background: '#0c1f3a', border: `1px solid ${C.border}`, color: C.cream, borderRadius: 4 }} />
                    </div>
                    <div style={{ display: 'grid', gap: 6 }}>
                      <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: C.gold, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t.booking.form.email}</label>
                      <Input type="email" placeholder="abebe@example.com" required value={form.email} onChange={handleChange('email')}
                        style={{ background: '#0c1f3a', border: `1px solid ${C.border}`, color: C.cream, borderRadius: 4 }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gap: 6 }}>
                      <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: C.gold, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t.booking.form.phone}</label>
                      <Input placeholder="09XX XXX XXX" required value={form.phone} onChange={handleChange('phone')}
                        style={{ background: '#0c1f3a', border: `1px solid ${C.border}`, color: C.cream, borderRadius: 4 }} />
                    </div>
                    <div style={{ display: 'grid', gap: 6 }}>
                      <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: C.gold, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t.booking.form.service}</label>
                      <Select required value={form.service} onValueChange={v => setForm(f => ({ ...f, service: v }))}>
                        <SelectTrigger style={{ background: '#0c1f3a', border: `1px solid ${C.border}`, color: C.cream, borderRadius: 4 }}>
                          <SelectValue placeholder={t.booking.form.service} />
                        </SelectTrigger>
                        <SelectContent style={{ background: C.navyMid, border: `1px solid ${C.border}`, color: C.cream }}>
                          {practiceAreas.map(a => <SelectItem key={a.name} value={a.name}>{a.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: 6 }}>
                    <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: C.gold, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t.booking.form.message}</label>
                    <Textarea placeholder="..." className="min-h-[120px]" required value={form.message} onChange={handleChange('message')}
                      style={{ background: '#0c1f3a', border: `1px solid ${C.border}`, color: C.cream, borderRadius: 4, resize: 'vertical' }} />
                  </div>

                  <button type="submit" disabled={loading} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    background: loading ? C.navyMid : C.gold, color: loading ? C.dim : C.navy,
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                    fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                    padding: '14px 28px', borderRadius: 4, border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s', marginTop: 4,
                  }}
                    onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = C.goldLight; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px rgba(201,162,39,0.3)` } }}
                    onMouseLeave={e => { if (!loading) { e.currentTarget.style.background = C.gold; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' } }}>
                    {loading ? t.booking.form.sending : t.booking.form.submit} <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        background: '#070f1d',
        borderTop: `1px solid ${C.border}`,
        padding: '2.5rem',
      }}>
        <div className="footer-inner" style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <a href="#home" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none', display: 'flex', gap: 5 }}>
            <span style={{ color: C.gold }}>Degu</span>
            <span style={{ color: C.cream, fontWeight: 300 }}>Tadele</span>
          </a>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: C.dim }}>
            © 2024 Degu Tadele · LLB · Counselor at Law · Wolaita, Ethiopia
          </p>
          <SocialLinks size={18} />
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {navLinks.map(l => (
              <a key={l.href} href={l.href} style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: C.dim, textDecoration: 'none', transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.target.style.color = C.gold}
                onMouseLeave={e => e.target.style.color = C.dim}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  )
}
