const fs = require('fs');

// 1. src/App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace("import { useState } from 'react'", "");
fs.writeFileSync('src/App.tsx', app);

// 2. src/components/Dashboard.tsx
let dash = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
dash = dash.replace("import React, { useEffect, useState } from 'react';", "import { useEffect, useState } from 'react';");
dash = dash.replace(/enum Status \{[\s\S]*?\}/, "const Status = { OPEN: 'OPEN', IN_PROGRESS: 'IN_PROGRESS', CLOSED: 'CLOSED' } as const;\ntype Status = typeof Status[keyof typeof Status];");
dash = dash.replace("const currentDate = new Date();", "");
fs.writeFileSync('src/components/Dashboard.tsx', dash);

// 3. src/components/DynamicSearch.tsx
let search = fs.readFileSync('src/components/DynamicSearch.tsx', 'utf8');
search = search.replace("import { MdOutlineDone } from 'react-icons/md';\n", "");
search = search.replace("import { GoDot } from 'react-icons/go';\n", "");
search = search.replace("import { IoIosSearch } from 'react-icons/io';\n", "");
search = search.replace(/enum Status \{[\s\S]*?\}/, "const Status = { OPEN: 'OPEN', IN_PROGRESS: 'IN_PROGRESS', CLOSED: 'CLOSED' } as const;\ntype Status = typeof Status[keyof typeof Status];");
search = search.replace("const [isSearchBarEmpty, setIsSearchBarEmpty] = useState(true);", "");
search = search.replace("if (input) setIsSearchBarEmpty(false);\n        else setIsSearchBarEmpty(true);", "");
search = search.replace("const dynamicSearchRef = useRef<HTMLLabelElement>(null);", "");
search = search.replace(/const differences = events\.map\(\(event\) =>[\s\S]*?\);/, "");
fs.writeFileSync('src/components/DynamicSearch.tsx', search);

// 4. src/components/SideBar.tsx
let side = fs.readFileSync('src/components/SideBar.tsx', 'utf8');
side = side.replace("import Link from 'next/link';", "import { Link, useLocation } from 'react-router-dom';");
side = side.replace("import React, { useState } from 'react';", "import { useState } from 'react';");
side = side.replace("import { usePathname } from 'next/navigation';\n", "");
side = side.replace("import { useSession } from 'next-auth/react';\n", "");
side = side.replace("import { FaFacebook, FaInstagramSquare } from 'react-icons/fa';\n", "");
side = side.replace("import { MdKeyboardDoubleArrowRight } from 'react-icons/md';\n", "");
side = side.replace("const currentPath = usePathname();", "const location = useLocation();\n    const currentPath = location.pathname;");
side = side.replace("const { status, data: session } = useSession();\n", "");
side = side.replaceAll("href=", "to=");
fs.writeFileSync('src/components/SideBar.tsx', side);

// 5. src/pages/index.tsx
if (fs.existsSync('src/pages/index.tsx')) {
  let idx = fs.readFileSync('src/pages/index.tsx', 'utf8');
  idx = idx.replace("import Link from 'next/link';", "import { Link } from 'react-router-dom';");
  idx = idx.replace("import { useSession } from 'next-auth/react';\n", "");
  idx = idx.replace("const { status, data: session } = useSession();", "");
  idx = idx.replaceAll("href=", "to=");
  fs.writeFileSync('src/pages/index.tsx', idx);
}

console.log('done');
