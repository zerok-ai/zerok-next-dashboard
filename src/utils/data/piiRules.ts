export const DEFAULT_RULES = [
  {
    name: " AuMedicareRecognizer ",
    supported_entities: ["AU_MEDICARE"],
    patterns: [
      {
        name: "Australian Medicare Number (Medium)",
        score: 0.1,
        regex: "\b[2-6]\\d{3}\\s\\d{5}\\s\\d\b",
      },
      {
        name: "Australian Medicare Number (Low)",
        score: 0.01,
        regex: "\b[2-6]\\d{9}\b",
      },
    ],
  },
  {
    name: " CreditCardRecognizer ",
    supported_entities: ["CREDIT_CARD"],
    patterns: [
      {
        name: "All Credit Cards (weak)",
        score: 0.3,
        regex:
          "\b((4\\d{3})|(5[0-5]\\d{2})|(6\\d{3})|(1\\d{3})|(3\\d{3}))[- ]?(\\d{3,4})[- ]?(\\d{3,4})[- ]?(\\d{3,5})\b",
      },
    ],
  },
  {
    name: " CryptoRecognizer ",
    supported_entities: ["CRYPTO"],
    patterns: [
      {
        name: "Crypto (Medium)",
        score: 0.5,
        regex: "\b[13][a-km-zA-HJ-NP-Z1-9]{26,33}\b",
      },
    ],
  },
  {
    name: " DateRecognizer ",
    supported_entities: ["DATE_TIME"],
    patterns: [
      {
        name: "mm/dd/yyyy or mm/dd/yy",
        score: 0.6,
        regex:
          "\b(([1-9]|0[1-9]|1[0-2])/([1-9]|0[1-9]|[1-2][0-9]|3[0-1])/(\\d{4}|\\d{2}))\b",
      },
      {
        name: "dd/mm/yyyy or dd/mm/yy",
        score: 0.6,
        regex:
          "\b(([1-9]|0[1-9]|[1-2][0-9]|3[0-1])/([1-9]|0[1-9]|1[0-2])/(\\d{4}|\\d{2}))\b",
      },
      {
        name: "yyyy/mm/dd",
        score: 0.6,
        regex:
          "\b(\\d{4}/([1-9]|0[1-9]|1[0-2])/([1-9]|0[1-9]|[1-2][0-9]|3[0-1]))\b",
      },
      {
        name: "mm-dd-yyyy",
        score: 0.6,
        regex:
          "\b(([1-9]|0[1-9]|1[0-2])-([1-9]|0[1-9]|[1-2][0-9]|3[0-1])-\\d{4})\b",
      },
      {
        name: "dd-mm-yyyy",
        score: 0.6,
        regex:
          "\b(([1-9]|0[1-9]|[1-2][0-9]|3[0-1])-([1-9]|0[1-9]|1[0-2])-\\d{4})\b",
      },
      {
        name: "yyyy-mm-dd",
        score: 0.6,
        regex:
          "\b(\\d{4}-([1-9]|0[1-9]|1[0-2])-([1-9]|0[1-9]|[1-2][0-9]|3[0-1]))\b",
      },
      {
        name: "dd.mm.yyyy or dd.mm.yy",
        score: 0.6,
        regex:
          "\b(([1-9]|0[1-9]|[1-2][0-9]|3[0-1])\\.([1-9]|0[1-9]|1[0-2])\\.(\\d{4}|\\d{2}))\b",
      },
      {
        name: "dd-MMM-yyyy or dd-MMM-yy",
        score: 0.6,
        regex:
          "\b(([1-9]|0[1-9]|[1-2][0-9]|3[0-1])-(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)-(\\d{4}|\\d{2}))\b",
      },
      {
        name: "MMM-yyyy or MMM-yy",
        score: 0.6,
        regex:
          "\b((JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)-(\\d{4}|\\d{2}))\b",
      },
      {
        name: "dd-MMM or dd-MMM",
        score: 0.6,
        regex:
          "\b(([1-9]|0[1-9]|[1-2][0-9]|3[0-1])-(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))\b",
      },
      {
        name: "mm/yyyy or m/yyyy",
        score: 0.2,
        regex: "\b(([1-9]|0[1-9]|1[0-2])/\\d{4})\b",
      },
      {
        name: "mm/yy or m/yy",
        score: 0.1,
        regex: "\b(([1-9]|0[1-9]|1[0-2])/\\d{2})\b",
      },
    ],
  },
  {
    name: " EmailRecognizer ",
    supported_entities: ["EMAIL_ADDRESS"],
    patterns: [
      {
        name: "Email (Medium)",
        score: 0.5,
        regex:
          '\\b((([!#$%&"*+\\-/=?^_`{|}~\\w])|([!#$%&"*+\\-/=?^_`{|}~\\w][!#$%&"*+\\-/=?^_`{|}~\\.\\w]{0,}[!#$%&"*+\\-/=?^_`{|}~\\w]))[@]\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*)\\b',
      },
    ],
  },
  {
    name: " IbanRecognizer ",
    supported_entities: ["IBAN_CODE"],
    patterns: [
      {
        name: "IBAN Generic",
        score: 0.5,
        regex:
          "\b([A-Z]{2}[ \\-]?[0-9]{2})(?=(?:[ \\-]?[A-Z0-9]){9,30})((?:[ \\-]?[A-Z0-9]{3,5}){2})([ \\-]?[A-Z0-9]{3,5})?([ \\-]?[A-Z0-9]{3,5})?([ \\-]?[A-Z0-9]{3,5})?([ \\-]?[A-Z0-9]{3,5})?([ \\-]?[A-Z0-9]{3,5})?([ \\-]?[A-Z0-9]{1,3})?\b",
      },
    ],
  },
  {
    name: " UrlRecognizer ",
    supported_entities: ["URL"],
    patterns: [
      {
        name: "Standard Url",
        score: 0.6,
        regex:
          "(?i)(?:https?://)((www\\d{0,3}[.])?[a-z0-9.\\-]+[.](?:(?:com)|(?:edu)|(?:gov)|(?:int)|(?:mil)|(?:net)|(?:onl)|(?:org)|(?:pro)|(?:red)|(?:tel)|(?:uno)|(?:xxx)|(?:ac)|(?:ad)|(?:ae)|(?:af)|(?:ag)|(?:ai)|(?:al)|(?:am)|(?:an)|(?:ao)|(?:aq)|(?:ar)|(?:as)|(?:at)|(?:au)|(?:aw)|(?:ax)|(?:az)|(?:ba)|(?:bb)|(?:bd)|(?:be)|(?:bf)|(?:bg)|(?:bh)|(?:bi)|(?:bj)|(?:bm)|(?:bn)|(?:bo)|(?:br)|(?:bs)|(?:bt)|(?:bv)|(?:bw)|(?:by)|(?:bz)|(?:ca)|(?:cc)|(?:cd)|(?:cf)|(?:cg)|(?:ch)|(?:ci)|(?:ck)|(?:cl)|(?:cm)|(?:cn)|(?:co)|(?:cr)|(?:cu)|(?:cv)|(?:cw)|(?:cx)|(?:cy)|(?:cz)|(?:de)|(?:dj)|(?:dk)|(?:dm)|(?:do)|(?:dz)|(?:ec)|(?:ee)|(?:eg)|(?:er)|(?:es)|(?:et)|(?:eu)|(?:fi)|(?:fj)|(?:fk)|(?:fm)|(?:fo)|(?:fr)|(?:ga)|(?:gb)|(?:gd)|(?:ge)|(?:gf)|(?:gg)|(?:gh)|(?:gi)|(?:gl)|(?:gm)|(?:gn)|(?:gp)|(?:gq)|(?:gr)|(?:gs)|(?:gt)|(?:gu)|(?:gw)|(?:gy)|(?:hk)|(?:hm)|(?:hn)|(?:hr)|(?:ht)|(?:hu)|(?:id)|(?:ie)|(?:il)|(?:im)|(?:in)|(?:io)|(?:iq)|(?:ir)|(?:is)|(?:it)|(?:je)|(?:jm)|(?:jo)|(?:jp)|(?:ke)|(?:kg)|(?:kh)|(?:ki)|(?:km)|(?:kn)|(?:kp)|(?:kr)|(?:kw)|(?:ky)|(?:kz)|(?:la)|(?:lb)|(?:lc)|(?:li)|(?:lk)|(?:lr)|(?:ls)|(?:lt)|(?:lu)|(?:lv)|(?:ly)|(?:ma)|(?:mc)|(?:md)|(?:me)|(?:mg)|(?:mh)|(?:mk)|(?:ml)|(?:mm)|(?:mn)|(?:mo)|(?:mp)|(?:mq)|(?:mr)|(?:ms)|(?:mt)|(?:mu)|(?:mv)|(?:mw)|(?:mx)|(?:my)|(?:mz)|(?:na)|(?:nc)|(?:ne)|(?:nf)|(?:ng)|(?:ni)|(?:nl)|(?:no)|(?:np)|(?:nr)|(?:nu)|(?:nz)|(?:om)|(?:pa)|(?:pe)|(?:pf)|(?:pg)|(?:ph)|(?:pk)|(?:pl)|(?:pm)|(?:pn)|(?:pr)|(?:ps)|(?:pt)|(?:pw)|(?:py)|(?:qa)|(?:re)|(?:ro)|(?:rs)|(?:ru)|(?:rw)|(?:sa)|(?:sb)|(?:sc)|(?:sd)|(?:se)|(?:sg)|(?:sh)|(?:si)|(?:sj)|(?:sk)|(?:sl)|(?:sm)|(?:sn)|(?:so)|(?:sr)|(?:st)|(?:su)|(?:sv)|(?:sx)|(?:sy)|(?:sz)|(?:tc)|(?:td)|(?:tf)|(?:tg)|(?:th)|(?:tj)|(?:tk)|(?:tl)|(?:tm)|(?:tn)|(?:to)|(?:tp)|(?:tr)|(?:tt)|(?:tv)|(?:tw)|(?:tz)|(?:ua)|(?:ug)|(?:uk)|(?:us)|(?:uy)|(?:uz)|(?:va)|(?:vc)|(?:ve)|(?:vg)|(?:vi)|(?:vn)|(?:vu)|(?:wf)|(?:ws)|(?:ye)|(?:yt)|(?:za)|(?:zm)|(?:zw))(?:/[^\\s()<>]+|/)?)",
      },
      {
        name: "Non schema URL",
        score: 0.5,
        regex:
          "(?i)((www\\d{0,3}[.])?[a-z0-9.\\-]+[.](?:(?:com)|(?:edu)|(?:gov)|(?:int)|(?:mil)|(?:net)|(?:onl)|(?:org)|(?:pro)|(?:red)|(?:tel)|(?:uno)|(?:xxx)|(?:ac)|(?:ad)|(?:ae)|(?:af)|(?:ag)|(?:ai)|(?:al)|(?:am)|(?:an)|(?:ao)|(?:aq)|(?:ar)|(?:as)|(?:at)|(?:au)|(?:aw)|(?:ax)|(?:az)|(?:ba)|(?:bb)|(?:bd)|(?:be)|(?:bf)|(?:bg)|(?:bh)|(?:bi)|(?:bj)|(?:bm)|(?:bn)|(?:bo)|(?:br)|(?:bs)|(?:bt)|(?:bv)|(?:bw)|(?:by)|(?:bz)|(?:ca)|(?:cc)|(?:cd)|(?:cf)|(?:cg)|(?:ch)|(?:ci)|(?:ck)|(?:cl)|(?:cm)|(?:cn)|(?:co)|(?:cr)|(?:cu)|(?:cv)|(?:cw)|(?:cx)|(?:cy)|(?:cz)|(?:de)|(?:dj)|(?:dk)|(?:dm)|(?:do)|(?:dz)|(?:ec)|(?:ee)|(?:eg)|(?:er)|(?:es)|(?:et)|(?:eu)|(?:fi)|(?:fj)|(?:fk)|(?:fm)|(?:fo)|(?:fr)|(?:ga)|(?:gb)|(?:gd)|(?:ge)|(?:gf)|(?:gg)|(?:gh)|(?:gi)|(?:gl)|(?:gm)|(?:gn)|(?:gp)|(?:gq)|(?:gr)|(?:gs)|(?:gt)|(?:gu)|(?:gw)|(?:gy)|(?:hk)|(?:hm)|(?:hn)|(?:hr)|(?:ht)|(?:hu)|(?:id)|(?:ie)|(?:il)|(?:im)|(?:in)|(?:io)|(?:iq)|(?:ir)|(?:is)|(?:it)|(?:je)|(?:jm)|(?:jo)|(?:jp)|(?:ke)|(?:kg)|(?:kh)|(?:ki)|(?:km)|(?:kn)|(?:kp)|(?:kr)|(?:kw)|(?:ky)|(?:kz)|(?:la)|(?:lb)|(?:lc)|(?:li)|(?:lk)|(?:lr)|(?:ls)|(?:lt)|(?:lu)|(?:lv)|(?:ly)|(?:ma)|(?:mc)|(?:md)|(?:me)|(?:mg)|(?:mh)|(?:mk)|(?:ml)|(?:mm)|(?:mn)|(?:mo)|(?:mp)|(?:mq)|(?:mr)|(?:ms)|(?:mt)|(?:mu)|(?:mv)|(?:mw)|(?:mx)|(?:my)|(?:mz)|(?:na)|(?:nc)|(?:ne)|(?:nf)|(?:ng)|(?:ni)|(?:nl)|(?:no)|(?:np)|(?:nr)|(?:nu)|(?:nz)|(?:om)|(?:pa)|(?:pe)|(?:pf)|(?:pg)|(?:ph)|(?:pk)|(?:pl)|(?:pm)|(?:pn)|(?:pr)|(?:ps)|(?:pt)|(?:pw)|(?:py)|(?:qa)|(?:re)|(?:ro)|(?:rs)|(?:ru)|(?:rw)|(?:sa)|(?:sb)|(?:sc)|(?:sd)|(?:se)|(?:sg)|(?:sh)|(?:si)|(?:sj)|(?:sk)|(?:sl)|(?:sm)|(?:sn)|(?:so)|(?:sr)|(?:st)|(?:su)|(?:sv)|(?:sx)|(?:sy)|(?:sz)|(?:tc)|(?:td)|(?:tf)|(?:tg)|(?:th)|(?:tj)|(?:tk)|(?:tl)|(?:tm)|(?:tn)|(?:to)|(?:tp)|(?:tr)|(?:tt)|(?:tv)|(?:tw)|(?:tz)|(?:ua)|(?:ug)|(?:uk)|(?:us)|(?:uy)|(?:uz)|(?:va)|(?:vc)|(?:ve)|(?:vg)|(?:vi)|(?:vn)|(?:vu)|(?:wf)|(?:ws)|(?:ye)|(?:yt)|(?:za)|(?:zm)|(?:zw))(?:/[^\\s()<>]+|/)?)",
      },
    ],
  },
  {
    name: " PatternRecognizer ",
    supported_entities: ["TITLE"],
    patterns: [
      {
        name: "deny_list",
        score: 1,
        regex: "(?:^|(?<=\\W))(Mr\\.|Mrs\\.|Miss)(?:(?=\\W)|$)",
      },
    ],
  },
  {
    name: " IpRecognizer ",
    supported_entities: ["IP_ADDRESS"],
    patterns: [
      {
        name: "IPv4",
        score: 0.6,
        regex:
          "\b(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b",
      },
      {
        name: "IPv6",
        score: 0.6,
        regex:
          "\b(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\b",
      },
      {
        name: "IPv6",
        score: 0.1,
        regex: "::",
      },
    ],
  },
  {
    name: " MedicalLicenseRecognizer ",
    supported_entities: ["MEDICAL_LICENSE"],
    patterns: [
      {
        name: "USA DEA Certificate Number (weak)",
        score: 0.4,
        regex:
          "[abcdefghjklmprstuxABCDEFGHJKLMPRSTUX]{1}[a-zA-Z]{1}\\d{7}|[abcdefghjklmprstuxABCDEFGHJKLMPRSTUX]{1}9\\d{7}",
      },
    ],
  },
  {
    name: " SpacyRecognizer ",
    supported_entities: ["DATE_TIME", "NRP", "LOCATION", "PERSON"],
    patterns: [],
  },
  {
    name: " UsBankRecognizer ",
    supported_entities: ["US_BANK_NUMBER"],
    patterns: [
      {
        name: "Bank Account (weak)",
        score: 0.05,
        regex: "\b[0-9]{8,17}\b",
      },
    ],
  },
  {
    name: " PhoneRecognizer ",
    supported_entities: ["PHONE_NUMBER"],
    patterns: [],
  },
  {
    name: " UsLicenseRecognizer ",
    supported_entities: ["US_DRIVER_LICENSE"],
    patterns: [
      {
        name: "Driver License - WA (weak)",
        score: 0.3,
        regex:
          "\b((?=.*\\d)([A-Z][A-Z0-9*]{11})|(?=.*\\*)([A-Z][A-Z0-9*]{11}))\b",
      },
      {
        name: "Driver License - Alphanumeric (weak)",
        score: 0.3,
        regex:
          "\b([A-Z][0-9]{3,6}|[A-Z][0-9]{5,9}|[A-Z][0-9]{6,8}|[A-Z][0-9]{4,8}|[A-Z][0-9]{9,11}|[A-Z]{1,2}[0-9]{5,6}|H[0-9]{8}|V[0-9]{6}|X[0-9]{8}|A-Z]{2}[0-9]{2,5}|[A-Z]{2}[0-9]{3,7}|[0-9]{2}[A-Z]{3}[0-9]{5,6}|[A-Z][0-9]{13,14}|[A-Z][0-9]{18}|[A-Z][0-9]{6}R|[A-Z][0-9]{9}|[A-Z][0-9]{1,12}|[0-9]{9}[A-Z]|[A-Z]{2}[0-9]{6}[A-Z]|[0-9]{8}[A-Z]{2}|[0-9]{3}[A-Z]{2}[0-9]{4}|[A-Z][0-9][A-Z][0-9][A-Z]|[0-9]{7,8}[A-Z])\b",
      },
      {
        name: "Driver License - Digits (very weak)",
        score: 0.01,
        regex: "\b([0-9]{6,14}|[0-9]{16})\b",
      },
    ],
  },
  {
    name: " UsItinRecognizer ",
    supported_entities: ["US_ITIN"],
    patterns: [
      {
        name: "Itin (very weak)",
        score: 0.05,
        regex:
          "\b9\\d{2}[- ](5\\d|6[0-5]|7\\d|8[0-8]|9([0-2]|[4-9]))\\d{4}\b|\b9\\d{2}(5\\d|6[0-5]|7\\d|8[0-8]|9([0-2]|[4-9]))[- ]\\d{4}\b",
      },
      {
        name: "Itin (weak)",
        score: 0.3,
        regex: "\b9\\d{2}(5\\d|6[0-5]|7\\d|8[0-8]|9([0-2]|[4-9]))\\d{4}\b",
      },
      {
        name: "Itin (medium)",
        score: 0.5,
        regex:
          "\b9\\d{2}[- ](5\\d|6[0-5]|7\\d|8[0-8]|9([0-2]|[4-9]))[- ]\\d{4}\b",
      },
    ],
  },
  {
    name: " UsPassportRecognizer ",
    supported_entities: ["US_PASSPORT"],
    patterns: [
      {
        name: "Passport (very weak)",
        score: 0.05,
        regex: "(\b[0-9]{9}\b)",
      },
      {
        name: "Passport Next Generation (very weak)",
        score: 0.1,
        regex: "(\b[A-Z][0-9]{8}\b)",
      },
    ],
  },
  {
    name: " UsSsnRecognizer ",
    supported_entities: ["US_SSN"],
    patterns: [
      {
        name: "SSN1 (very weak)",
        score: 0.05,
        regex: "\b([0-9]{5})-([0-9]{4})\b",
      },
      {
        name: "SSN2 (very weak)",
        score: 0.05,
        regex: "\b([0-9]{3})-([0-9]{6})\b",
      },
      {
        name: "SSN3 (very weak)",
        score: 0.05,
        regex: "\b(([0-9]{3})-([0-9]{2})-([0-9]{4}))\b",
      },
      {
        name: "SSN4 (very weak)",
        score: 0.05,
        regex: "\b[0-9]{9}\b",
      },
      {
        name: "SSN5 (medium)",
        score: 0.5,
        regex: "\b([0-9]{3})[- .]([0-9]{2})[- .]([0-9]{4})\b",
      },
    ],
  },
  {
    name: " AuTfnRecognizer ",
    supported_entities: ["AU_TFN"],
    patterns: [
      {
        name: "TFN (Medium)",
        score: 0.1,
        regex: "\b\\d{3}\\s\\d{3}\\s\\d{3}\b",
      },
      {
        name: "TFN (Low)",
        score: 0.01,
        regex: "\b\\d{9}\b",
      },
    ],
  },
  {
    name: " NhsRecognizer ",
    supported_entities: ["UK_NHS"],
    patterns: [
      {
        name: "NHS (medium)",
        score: 0.5,
        regex: "\b([0-9]{3})[- ]?([0-9]{3})[- ]?([0-9]{4})\b",
      },
    ],
  },
  {
    name: " SgFinRecognizer ",
    supported_entities: ["SG_NRIC_FIN"],
    patterns: [
      {
        name: "Nric (weak)",
        score: 0.3,
        regex: "(?i)(\b[A-Z][0-9]{7}[A-Z]\b)",
      },
      {
        name: "Nric (medium)",
        score: 0.5,
        regex: "(?i)(\b[STFG][0-9]{7}[A-Z]\b)",
      },
    ],
  },
  {
    name: " AuAbnRecognizer ",
    supported_entities: ["AU_ABN"],
    patterns: [
      {
        name: "ABN (Medium)",
        score: 0.1,
        regex: "\b\\d{2}\\s\\d{3}\\s\\d{3}\\s\\d{3}\b",
      },
      {
        name: "ABN (Low)",
        score: 0.01,
        regex: "\b\\d{11}\b",
      },
    ],
  },
  {
    name: " AuAcnRecognizer ",
    supported_entities: ["AU_ACN"],
    patterns: [
      {
        name: "ACN (Medium)",
        score: 0.1,
        regex: "\b\\d{3}\\s\\d{3}\\s\\d{3}\b",
      },
      {
        name: "ACN (Low)",
        score: 0.01,
        regex: "\b\\d{9}\b",
      },
    ],
  },
];
