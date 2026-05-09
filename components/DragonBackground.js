export default function DragonBackground() {
  return (
    <>
      <style>{`
        @keyframes dragonBreathe {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.032); }
        }
        @keyframes eyePulse {
          0%, 100% { opacity: 0.45; }
          50%       { opacity: 1; }
        }
        @keyframes emberRise {
          0%   { opacity: 0.85; transform: translate(0, 0) scale(1); }
          100% { opacity: 0;    transform: translate(-18px, -90px) scale(0.15); }
        }
        @keyframes wingDrift {
          0%, 100% { transform: rotate(0deg); }
          50%       { transform: rotate(-1.5deg); }
        }
        .dragon-breathe {
          transform-origin: 1272px 455px;
          animation: dragonBreathe 4.2s ease-in-out infinite;
        }
        .dragon-eye-pulse {
          transform-origin: 1052px 212px;
          animation: eyePulse 4.2s ease-in-out infinite;
        }
        .dragon-wing {
          transform-origin: 1138px 295px;
          animation: wingDrift 6s ease-in-out infinite;
        }
        .ember-a { animation: emberRise 2.6s ease-out infinite; }
        .ember-b { animation: emberRise 2.6s ease-out 0.95s infinite; }
        .ember-c { animation: emberRise 2.6s ease-out 1.85s infinite; }
      `}
      </style>

      <svg
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <filter id="dgGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="dgSoftGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="eyeGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00ffbb" stopOpacity="1" />
            <stop offset="65%" stopColor="#00d4ff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bodyAmbient" cx="82%" cy="48%" r="38%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient purple glow around dragon body */}
        <rect x="0" y="0" width="1440" height="900" fill="url(#bodyAmbient)" />

        {/* ── WING ───────────────────────────────────────────────────────── */}
        <g className="dragon-wing">
          <path
            d="M 1138,295
               C 1178,218 1235,148 1318,82
               C 1375,36 1435,18 1440,42
               C 1418,62 1388,82 1372,115
               C 1432,52 1448,96 1440,140
               C 1412,118 1378,130 1355,162
               C 1412,102 1428,148 1416,195
               C 1386,172 1350,182 1325,218
               C 1368,162 1365,210 1350,258
               C 1318,236 1278,242 1248,268
               C 1198,246 1162,262 1138,295
               Z"
            fill="rgba(88,38,175,0.17)"
            stroke="rgba(192,132,252,0.2)"
            strokeWidth="1.5"
          />
          {/* Membrane vein lines */}
          <line x1="1138" y1="295" x2="1355" y2="68" stroke="rgba(192,132,252,0.11)" strokeWidth="1" />
          <line x1="1150" y1="284" x2="1390" y2="132" stroke="rgba(192,132,252,0.08)" strokeWidth="1" />
          <line x1="1158" y1="276" x2="1398" y2="198" stroke="rgba(192,132,252,0.06)" strokeWidth="1" />
          <line x1="1148" y1="282" x2="1332" y2="228" stroke="rgba(192,132,252,0.06)" strokeWidth="1" />
        </g>

        {/* ── TORSO (breathing group) ────────────────────────────────────── */}
        <g className="dragon-breathe">
          {/* Outer body */}
          <path
            d="M 1152,368
               C 1198,338 1302,328 1362,354
               C 1418,378 1432,432 1422,484
               C 1412,532 1365,568 1302,574
               C 1238,580 1168,558 1144,518
               C 1118,478 1124,432 1145,400
               C 1150,388 1150,378 1152,368 Z"
            fill="rgba(72,34,152,0.26)"
            stroke="rgba(192,132,252,0.4)"
            strokeWidth="2.5"
            filter="url(#dgGlow)"
          />
          {/* Belly highlight */}
          <path
            d="M 1212,382
               C 1250,362 1312,362 1348,382
               C 1378,400 1382,436 1366,464
               C 1348,492 1304,504 1264,500
               C 1222,496 1192,476 1186,452
               C 1178,428 1192,398 1212,382 Z"
            fill="rgba(0,212,255,0.04)"
            stroke="rgba(0,212,255,0.09)"
            strokeWidth="1"
          />
          {/* Scale arcs */}
          <g opacity="0.17" stroke="rgba(192,132,252,0.9)" strokeWidth="1.3" fill="none">
            <path d="M 1198,408 C 1210,397 1230,397 1242,408" />
            <path d="M 1220,428 C 1232,417 1252,417 1264,428" />
            <path d="M 1242,408 C 1254,397 1274,397 1286,408" />
            <path d="M 1264,428 C 1276,417 1296,417 1308,428" />
            <path d="M 1286,408 C 1298,397 1318,397 1330,408" />
            <path d="M 1308,428 C 1320,417 1340,417 1352,428" />
            <path d="M 1209,448 C 1221,437 1241,437 1253,448" />
            <path d="M 1253,448 C 1265,437 1285,437 1297,448" />
            <path d="M 1297,448 C 1309,437 1329,437 1341,448" />
            <path d="M 1231,468 C 1243,457 1263,457 1275,468" />
            <path d="M 1275,468 C 1287,457 1307,457 1319,468" />
          </g>
        </g>

        {/* ── NECK ────────────────────────────────────────────────────────── */}
        <path
          d="M 1146,374
             C 1118,338 1098,300 1107,264
             C 1112,246 1122,232 1132,222"
          fill="none"
          stroke="rgba(192,132,252,0.38)"
          strokeWidth="42"
          strokeLinecap="round"
        />
        {/* Neck throat highlight */}
        <path
          d="M 1146,374
             C 1118,338 1098,300 1107,264
             C 1112,246 1122,232 1132,222"
          fill="none"
          stroke="rgba(0,212,255,0.07)"
          strokeWidth="22"
          strokeLinecap="round"
        />
        {/* Neck dorsal spines */}
        <g stroke="rgba(192,132,252,0.28)" strokeWidth="3" strokeLinecap="round" fill="none">
          <line x1="1128" y1="372" x2="1115" y2="354" />
          <line x1="1120" y1="350" x2="1107" y2="332" />
          <line x1="1112" y1="328" x2="1100" y2="310" />
          <line x1="1107" y1="306" x2="1096" y2="288" />
        </g>

        {/* ── HEAD ─────────────────────────────────────────────────────────── */}
        {/* Upper skull */}
        <path
          d="M 1132,222
             C 1114,208 1094,193 1078,182
             C 1058,170 1036,167 1020,176
             C 1004,185 998,200 1003,218
             C 1008,238 1024,250 1042,257
             C 1055,262 1072,262 1085,257
             L 1100,270
             L 1118,262
             C 1132,256 1142,243 1142,230 Z"
          fill="rgba(78,36,158,0.4)"
          stroke="rgba(192,132,252,0.5)"
          strokeWidth="2"
          filter="url(#dgGlow)"
        />
        {/* Lower jaw */}
        <path
          d="M 1003,218
             C 995,232 993,250 1003,264
             C 1013,277 1029,282 1044,276
             L 1100,282
             L 1118,273
             C 1129,267 1135,254 1130,240"
          fill="rgba(62,28,128,0.36)"
          stroke="rgba(192,132,252,0.32)"
          strokeWidth="1.5"
        />
        {/* Teeth */}
        <g stroke="rgba(255,255,255,0.3)" strokeWidth="2.2" strokeLinecap="round">
          <line x1="1017" y1="276" x2="1015" y2="288" />
          <line x1="1029" y1="280" x2="1027" y2="292" />
          <line x1="1041" y1="281" x2="1040" y2="293" />
          <line x1="1053" y1="281" x2="1053" y2="293" />
        </g>
        {/* Horn 1 */}
        <path
          d="M 1063,178 L 1048,130 L 1070,170"
          fill="rgba(128,68,208,0.52)"
          stroke="rgba(192,132,252,0.58)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Horn 2 */}
        <path
          d="M 1088,174 L 1080,124 L 1096,166"
          fill="rgba(128,68,208,0.52)"
          stroke="rgba(192,132,252,0.58)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Ridge nub */}
        <path
          d="M 1043,188 L 1036,167 L 1048,183"
          fill="rgba(128,68,208,0.36)"
          stroke="rgba(192,132,252,0.42)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* ── EYE ──────────────────────────────────────────────────────────── */}
        {/* Outer ambient glow */}
        <circle
          cx="1052"
          cy="212"
          r="30"
          fill="url(#eyeGrad)"
          className="dragon-eye-pulse"
          filter="url(#dgSoftGlow)"
        />
        {/* Iris */}
        <circle
          cx="1052"
          cy="212"
          r="11"
          fill="rgba(0,255,180,0.18)"
          stroke="rgba(0,255,180,0.68)"
          strokeWidth="1.5"
          filter="url(#dgGlow)"
        />
        {/* Slit pupil */}
        <ellipse cx="1052" cy="212" rx="4" ry="7.5" fill="rgba(0,12,20,0.95)" />
        {/* Catchlight */}
        <circle cx="1055" cy="208" r="2.5" fill="rgba(0,255,205,0.95)" />

        {/* ── BREATH EMBERS ─────────────────────────────────────────────────── */}
        <circle className="ember-a" cx="990" cy="262" r="4.5" fill="rgba(0,212,255,0.58)" filter="url(#dgSoftGlow)" />
        <circle className="ember-b" cx="974" cy="272" r="3" fill="rgba(0,255,180,0.52)" filter="url(#dgGlow)" />
        <circle className="ember-c" cx="1002" cy="252" r="3.5" fill="rgba(120,210,255,0.62)" filter="url(#dgGlow)" />

        {/* ── TAIL ─────────────────────────────────────────────────────────── */}
        {/* Tail body — thick */}
        <path
          d="M 1192,568
             C 1128,634 1018,682 876,720
             C 738,758 588,778 438,800
             C 298,820 158,842 48,870"
          fill="none"
          stroke="rgba(192,132,252,0.3)"
          strokeWidth="34"
          strokeLinecap="round"
        />
        {/* Tail inner tone */}
        <path
          d="M 1192,568
             C 1128,634 1018,682 876,720
             C 738,758 588,778 438,800
             C 298,820 158,842 48,870"
          fill="none"
          stroke="rgba(78,38,158,0.18)"
          strokeWidth="22"
          strokeLinecap="round"
        />
        {/* Tail tip coil */}
        <path
          d="M 48,870 C 8,880 -12,858 14,838 C 40,818 80,826 82,850 C 84,866 66,878 50,872"
          fill="none"
          stroke="rgba(192,132,252,0.22)"
          strokeWidth="15"
          strokeLinecap="round"
        />
        {/* Tail dorsal fins */}
        <g stroke="rgba(192,132,252,0.26)" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <line x1="1148" y1="607" x2="1135" y2="581" />
          <line x1="1076" y1="645" x2="1063" y2="619" />
          <line x1="998" y1="676" x2="985" y2="650" />
          <line x1="908" y1="707" x2="896" y2="681" />
          <line x1="808" y1="730" x2="798" y2="704" />
          <line x1="698" y1="750" x2="690" y2="724" />
          <line x1="578" y1="767" x2="574" y2="741" />
        </g>

        {/* ── FRONT LEG ────────────────────────────────────────────────────── */}
        <path
          d="M 1162,558 C 1145,604 1126,644 1115,672"
          fill="none"
          stroke="rgba(192,132,252,0.3)"
          strokeWidth="19"
          strokeLinecap="round"
        />
        <g stroke="rgba(192,132,252,0.36)" strokeWidth="3.5" strokeLinecap="round" fill="none">
          <line x1="1115" y1="672" x2="1101" y2="693" />
          <line x1="1115" y1="672" x2="1113" y2="696" />
          <line x1="1115" y1="672" x2="1124" y2="694" />
          <line x1="1115" y1="672" x2="1132" y2="689" />
        </g>

        {/* ── BACK LEG ──────────────────────────────────────────────────────── */}
        <path
          d="M 1328,560 C 1342,605 1350,645 1346,674"
          fill="none"
          stroke="rgba(192,132,252,0.27)"
          strokeWidth="17"
          strokeLinecap="round"
        />
        <g stroke="rgba(192,132,252,0.32)" strokeWidth="3.5" strokeLinecap="round" fill="none">
          <line x1="1346" y1="674" x2="1332" y2="693" />
          <line x1="1346" y1="674" x2="1342" y2="697" />
          <line x1="1346" y1="674" x2="1354" y2="696" />
          <line x1="1346" y1="674" x2="1362" y2="690" />
        </g>
      </svg>
    </>
  );
}
